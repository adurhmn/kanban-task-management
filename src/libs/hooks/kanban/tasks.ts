import * as KanbanService from "@/services/kanban";
import { useTaskStore } from "@/store";
import { useEffect, useRef } from "react";

const useTasksSync = (colId: string) => {
  const { tasks, addTasks: addTasksToStore } = useTaskStore();
  const lastHandledColumn = useRef(""); // handles strict mode

  useEffect(() => {
    if (colId && !tasks?.[colId] && lastHandledColumn.current !== colId) {
      lastHandledColumn.current = colId;
      KanbanService.getTasks(colId).then((tasks) => {
        addTasksToStore(
          tasks ? tasks.sort((a, b) => a.index - b.index) : [],
          colId
        );
      });
    }
  }, [colId, tasks?.[colId]]);
};

export { useTasksSync };
