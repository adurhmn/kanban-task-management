import * as KanbanService from "@/services/kanban";
import { useBoardStore, useColumnStore } from "@/store";
import { useEffect, useRef } from "react";

const useColumnSync = () => {
  const { activeBoard, boards } = useBoardStore();
  const {
    columns,
    addColumns: addColumnsToStore,
    setColumnsLoaded,
  } = useColumnStore();
  const lastHandledBoard = useRef(""); // handles strict mode

  useEffect(() => {
    if (
      boards &&
      activeBoard &&
      (!columns || !columns[activeBoard]) &&
      lastHandledBoard.current !== activeBoard
    ) {
      setColumnsLoaded(false);
      lastHandledBoard.current = activeBoard;
      KanbanService.getColumns(activeBoard)
        .then((cols) => {
          addColumnsToStore(
            cols ? cols.sort((a, b) => a.index - b.index) : [],
            activeBoard
          );
        })
        .finally(() => {
          setColumnsLoaded(true);
        });
    }
  }, [boards, activeBoard, columns, addColumnsToStore]);
};

export { useColumnSync };
