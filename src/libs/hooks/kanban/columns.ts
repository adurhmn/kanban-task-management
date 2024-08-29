import * as KanbanService from "@/services/kanban";
import { useBoardStore, useColumnStore } from "@/store";
import { useEffect, useRef } from "react";

const useColumnSync = () => {
  const { activeBoard, boards } = useBoardStore();
  const { columns, addColumns: addColumnsToStore } = useColumnStore();
  const lastHandledBoard = useRef("") // handles strict mode

  useEffect(() => {
    if (boards && activeBoard && (!columns || !columns[activeBoard]) && lastHandledBoard.current !== activeBoard) {
      lastHandledBoard.current = activeBoard
      KanbanService.getColumns(activeBoard).then((cols) => {
        if (cols) {
          addColumnsToStore(cols.sort((a, b) => a.index - b.index), activeBoard);
        }
      });
    }
  }, [boards, activeBoard, columns, addColumnsToStore]);
};

export { useColumnSync };
