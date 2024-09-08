import { Subtask } from "@/libs/types";
import * as KanbanService from "@/services/kanban";
import { useSubtaskStore } from "@/store";

// Partial<Subtask> can be received if merging is handled in idb put service
export const putSubtasks = (updatedSubtasks: Subtask[], taskId: string) => {
  // updatedSubtasks -> can have items to update as well as new items
  //                 -> doesn't necessarily need to contain all old items, only the updated + new ones
  //                 -> so, we need to merge with oldSubtasks
  const { subtasks: allSubtasks, setSubtasks } = useSubtaskStore.getState();
  let oldSubtasks = allSubtasks?.[taskId];
  const oldSubtasksClone = oldSubtasks?.slice();

  if (oldSubtasks) {
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
    KanbanService.putSubtasks(updatedSubtasks).catch((err) => {
      console.log({ err });
      alert("Subtask update failed");
      setSubtasks(oldSubtasksClone!, taskId);
    });
  }
};

export const deleteSubtask = (subtaskId: string, taskId: string) => {
  const { deleteSubtask, addSubtasks } = useSubtaskStore.getState();

  // optimistic updation
  const removedSubtask = deleteSubtask(subtaskId, taskId);
  if (removedSubtask) {
    KanbanService.deleteSubtask(subtaskId).catch((err) => {
      console.log({ err });
      alert("Subtask delete failed");
      addSubtasks([removedSubtask], taskId);
    });
  }
};

export const deleteSubtasks = (taskId: string) => {
  const { setSubtasks, subtasks } = useSubtaskStore.getState();
  const copy = subtasks?.[taskId]

  if (copy) {
    // optimistic updation
    setSubtasks([], taskId);
    
    KanbanService.deleteSubtasks(taskId).catch((err) => {
      console.log({ err });
      alert("Subtask delete failed");
      console.log({copy})
      setSubtasks(copy, taskId);
    });
  }
};
