import { createSubtask, createTask } from "@/libs/utils/kanban";
import { useSubtaskStore, useTaskStore } from "@/store";
import * as KanbanService from "@/services/kanban";
import { Subtask, Task, TaskStatus } from "@/libs/types";
import {
  deleteSubtaskAction,
  deleteSubtasksAction,
  putSubtasksAction,
} from "./subtasks";

export const addTaskAction = async ({
  title,
  desc,
  subtasks,
  colId,
}: {
  title: string;
  desc: string;
  subtasks?: string[];
  colId: string;
}) => {
  const {
    tasks,
    addTasks: addTasksToStore,
    deleteTask: deleteTaskFromStore,
  } = useTaskStore.getState();
  const {
    addSubtasks: addSubtasksToStore,
    deleteSubtask: deleteSubtaskFromStore,
  } = useSubtaskStore.getState();
  const lastIndex = (tasks?.[colId]?.length || 0) - 1;

  const task = createTask({
    title,
    desc,
    columnId: colId,
    index: lastIndex + 1,
    subtask: { complete: 0, incomplete: subtasks?.length || 0 },
  });

  addTasksToStore([task], colId); // optimistic updation
  return await KanbanService.addTask(task)
    .then(async () => {
      if (subtasks) {
        for (let i = 0; i < subtasks.length; i++) {
          const subtask = createSubtask({
            desc: subtasks[i],
            taskId: task.id,
            index: i,
          });
          addSubtasksToStore([subtask], task.id);
          await KanbanService.addSubtask(subtask).catch((err) => {
            console.log(err);
            deleteSubtaskFromStore(subtask.id, task.id);
            alert("Subtask creation Failed");
          });
        }
      }

      return "Task creation success";
    })
    .catch((err) => {
      console.log(err);
      deleteTaskFromStore(task.id, colId);
      alert("Task Creation Failed");
    });
};

// colId & id should not change
// colId can only be changed through dnd where index is recalculated
export const putTaskAction = async (updatedTask: Task) => {
  const { tasks: allOldTasks, setTasks } = useTaskStore.getState();
  const oldTasks = allOldTasks?.[updatedTask.columnId];

  if (oldTasks) {
    // optimistic updation
    setTasks(
      oldTasks.map((st) => (st.id === updatedTask.id ? updatedTask : st)),
      updatedTask.columnId
    );
    return await KanbanService.putTask(updatedTask)
      .then(() => "putTaskAction success")
      .catch((err) => {
        console.log({ err });
        alert("Subtask update failed");
        setTasks(oldTasks, updatedTask.columnId);
      });
  }
};

// Partial<Task> can be received if merging is handled in idb put service
export const putTasksAction = async (updatedTasks: Task[], colId: string) => {
  // updatedTasks -> can have items to update as well as new items
  //                 -> doesn't necessarily need to contain all old items, only the updated + new ones
  //                 -> so, we need to merge new with old data
  const { tasks: allTasks, setTasks } = useTaskStore.getState();
  let oldTasks = allTasks?.[colId];
  const oldTasksClone = oldTasks?.slice();

  if (oldTasks) {
    // merging the updated & newones with old ones, then updating it to store
    const oldTasksMap = oldTasks.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Task });
    const updatedTasksMap = updatedTasks.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Task });
    oldTasks = oldTasks.map((t) => updatedTasksMap[t.id] || t); // updation
    for (const t of updatedTasks) {
      if (!oldTasksMap[t.id]) {
        oldTasks.push(t); // adding new ones
      }
    }
    oldTasks = oldTasks?.sort((a, b) => a.index - b.index);

    // optimistic updation
    setTasks(oldTasks, colId);
    return await KanbanService.putTasks(updatedTasks)
      .then(() => "putTasksAction success")
      .catch((err) => {
        console.log({ err });
        alert("Task update failed");
        setTasks(oldTasksClone!, colId);
      });
  }
};

export const editTaskAction = async ({
  task,
  oldSubtasks,
  formData: { title, desc, status, ...subtasks },
}: {
  task: Task;
  oldSubtasks: Subtask[];
  formData: {
    title: string;
    desc: string;
    status: TaskStatus;
    [subtaskId: string]: string;
  };
}) => {
  for (const ost of oldSubtasks) {
    if (subtasks[ost.id] === undefined) {
      // delete subtask
      await deleteSubtaskAction(ost.id, task.id, task.columnId);
    }
  }

  const oldSubtasksMap = oldSubtasks.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {} as { [key: string]: Subtask });

  const subtasksToPut = Object.entries(subtasks).map(([id, value], ind) => {
    if (id.startsWith("subtask-")) {
      return createSubtask({
        taskId: task.id,
        desc: value as string,
        index: ind, // insertion order is preserved in js object, so this will work
      });
    } else {
      // update subtask (desc)
      return {
        id,
        desc: value as string,
        index: ind, // insertion order is preserved in js object, so this will work
        taskId: task.id,
        isComplete: oldSubtasksMap[id].isComplete,
      };
    }
  });

  await putTaskAction({ ...task, title, desc, status }); // order should not changes
  await putSubtasksAction(subtasksToPut, task.id, task.columnId); // order should not changes
  return "editTaskAction success";
};

export const deleteTaskAction = async (taskId: string, colId: string) => {
  const { deleteTask, addTasks, tasks: allTasks } = useTaskStore.getState();
  const tasks = allTasks![colId];

  // optimistic updation
  const removedTask = deleteTask(taskId, colId);
  if (removedTask) {
    return await KanbanService.deleteTask(taskId)
      .then(async () => {
        await deleteSubtasksAction(taskId);
        // update task indexes
        const tasksToUpdate: Task[] = [];
        for (const task of tasks) {
          if (task.index > removedTask.index) {
            tasksToUpdate.push({ ...task, index: task.index - 1 });
          }
        }
        await putTasksAction(tasksToUpdate, colId);
        return "deleteTaskAction success";
      })
      .catch((err) => {
        console.log({ err });
        alert("Subtask delete failed");
        addTasks([removedTask], colId);
      });
  }
};

export const deleteTasksAction = async (colId: string) => {
  const { setTasks, tasks } = useTaskStore.getState();
  const copy = tasks?.[colId];

  if (copy) {
    // optimistic updation
    setTasks([], colId);

    return await KanbanService.deleteTasks(colId)
      .then(async () => {
        for (const task of copy) {
          await deleteSubtasksAction(task.id);
        }
        return "deleteTasksAction success";
      })
      .catch((err) => {
        console.log({ err });
        alert("Task delete failed");
        console.log({ copy });
        setTasks(copy, colId);
      });
  }
};
