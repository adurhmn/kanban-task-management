import { Subtask } from "@/libs/types";
import * as KanbanService from "@/services/kanban";
import { useSubtaskStore, useTaskStore } from "@/store";

// Partial<Subtask> can be received if merging is handled in idb put service
export const putSubtasksAction = (
  updatedSubtasks: Subtask[],
  taskId: string,
  colId: string
) => {
  // updatedSubtasks -> can have items to update as well as new items
  //                 -> doesn't necessarily need to contain all old items, only the updated + new ones
  //                 -> so, we need to merge with oldSubtasks
  const { subtasks: allSubtasks, setSubtasks } = useSubtaskStore.getState();
  const putTask = useTaskStore.getState().putTask;
  const task = useTaskStore
    .getState()
    .tasks?.[colId]?.find((t) => t.id === taskId);
  let oldSubtasks = allSubtasks?.[taskId];
  const oldSubtasksClone = oldSubtasks?.slice();

  if (task && oldSubtasks) {
    // merging the updated & newones with old subtasks, then updating it to store
    const oldSubtasksMap = oldSubtasks.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Subtask });
    const updatedSubtasksMap = updatedSubtasks.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Subtask });
    oldSubtasks = oldSubtasks.map((st) => updatedSubtasksMap[st.id] || st); // updation
    for (const st of updatedSubtasks) {
      if (!oldSubtasksMap[st.id]) {
        oldSubtasks.push(st); // adding new ones
      }
    }
    oldSubtasks = oldSubtasks?.sort((a, b) => a.index - b.index);

    // optimistic updation
    setSubtasks(oldSubtasks, taskId);
    return KanbanService.putSubtasks(updatedSubtasks)
      .then(() => {
        const completedCount = oldSubtasks!.reduce(
          (acc, st) => acc + (st.isComplete ? 1 : 0),
          0
        );
        const incompleteCount = oldSubtasks!.length - completedCount;
        const updatedTask = {
          ...task,
          subtask: { complete: completedCount, incomplete: incompleteCount },
        };
        return KanbanService.putTask(updatedTask).then(() => {
          // non optimistic
          putTask(updatedTask);
        });
      })
      .catch((err) => {
        console.log({ err });
        alert("Subtask update failed");
        setSubtasks(oldSubtasksClone!, taskId);
      });
  }
};

export const deleteSubtaskAction = (
  subtaskId: string,
  taskId: string,
  colId: string
) => {
  const { deleteSubtask, addSubtasks } = useSubtaskStore.getState();
  const { putTask } = useTaskStore.getState();
  const task = useTaskStore
    .getState()
    .tasks?.[colId]?.find((t) => t.id === taskId);

  // optimistic updation
  const removedSubtask = deleteSubtask(subtaskId, taskId);
  if (task && removedSubtask) {
    return KanbanService.deleteSubtask(subtaskId)
      .then(() => {
        const updatedTask = {
          ...task,
          subtask: {
            complete:
              // if removed task is complete
              task.subtask.complete - (removedSubtask.isComplete ? 1 : 0),
            incomplete:
              // if removed task is incomplete
              task.subtask.incomplete - (!removedSubtask.isComplete ? 1 : 0),
          },
        };
        return KanbanService.putTask(updatedTask).then(() => {
          // not optimistic
          putTask(updatedTask);
        });
      })
      .catch((err) => {
        console.log({ err });
        alert("Subtask delete failed");
        addSubtasks([removedSubtask], taskId);
      });
  }
};

export const deleteSubtasksAction = async (taskId: string) => {
  const { setSubtasks, subtasks } = useSubtaskStore.getState();
  const copy = subtasks?.[taskId];

  if (copy) {
    // optimistic updation
    setSubtasks([], taskId);

    await KanbanService.deleteSubtasks(taskId)
      .then(() => {
        // task will be deleted, no need to update count
        return "Subtasks Deletion Success";
      })
      .catch((err) => {
        console.log({ err });
        alert("Subtask delete failed");
        console.log({ copy });
        setSubtasks(copy, taskId);
      });
  }
};
