import * as KanbanService from "@/services/kanban";
import { useSubtaskStore } from "@/store";
import { useEffect, useMemo, useRef } from "react";

const useSubtasksSync = (taskId: string) => {
  const { subtasks, addSubtasks: addSubtasksToStore } = useSubtaskStore();
  const lastHandledColumn = useRef(""); // handles strict mode

  useEffect(() => {
    if (taskId && !subtasks?.[taskId] && lastHandledColumn.current !== taskId) {
      lastHandledColumn.current = taskId;
      KanbanService.getSubtasks(taskId).then((subtasks) => {
        addSubtasksToStore(
          subtasks ? subtasks.sort((a, b) => a.index - b.index) : [],
          taskId
        );
      });
    }
  }, [taskId, subtasks?.[taskId]]);
};

const useSubtasks = (taskId: string) => {
  const { subtasks: allSubtasks } = useSubtaskStore();

  const subtasks = useMemo(() => {
    return allSubtasks?.[taskId] || [];
  }, [taskId, allSubtasks]);

  return subtasks;
};

export { useSubtasksSync, useSubtasks };
