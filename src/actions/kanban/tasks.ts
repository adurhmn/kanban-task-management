import { createSubtask, createTask } from "@/libs/utils/kanban";
import { useSubtaskStore, useTaskStore } from "@/store";
import * as KanbanService from "@/services/kanban";

export const addTask = ({
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
    removeTask: removeTaskFromStore,
  } = useTaskStore.getState();
  const {
    addSubtasks: addSubtasksToStore,
    removeSubtask: removeSubtaskFromStore,
  } = useSubtaskStore.getState();
  const lastIndex = (tasks?.[colId]?.length || 0) - 1;

  const task = createTask({ title, desc, colId, index: lastIndex + 1 });
  addTasksToStore([task], colId); // optimistic updation
  KanbanService.addTask(task)
    .then(() => {
      subtasks?.forEach((desc, index) => {
        const subtask = createSubtask({ desc, taskId: task.id, index });
        addSubtasksToStore([subtask], task.id);
        KanbanService.addSubtask(subtask).catch((err) => {
          console.log(err);
          removeSubtaskFromStore(subtask.id, task.id);
          alert("Subtask creation Failed");
        });
      });
    })
    .catch((err) => {
      console.log(err);
      removeTaskFromStore(task.id, colId);
      alert("Task Creation Failed");
    });
};
