import { useBoardStore, useColumnStore, useIDBStore } from "@/store";
import { useCallback, useEffect } from "react";
import * as KanbanService from "@/services/kanban";
import { createBoard, createColumn } from "@/libs/utils/kanban";
import { LOCAL_KEYS } from "../constants";

// this is the abstract wrapper that can be directly used in components
// don't use store directly in components.
const useBoards = () => {
  const { db } = useIDBStore();
  const {
    boards,
    activeBoard,
    setActiveBoard: setActiveBoardToStore,
    addBoard: addBoardToStore,
    removeBoard: removeBoardFromStore,
    setBoards: setBoardsToStore,
  } = useBoardStore();
  const { addColumns: addColumnsToStore, removeColumn: removeColumnFromStore } =
    useColumnStore();

  const lastIndex = boards ? boards.length - 1 : -1;

  const addBoard = useCallback(
    (name: string, columnNames?: string[]) => {
      const board = createBoard(name, lastIndex + 1);
      addBoardToStore(board); // optimistic updation
      KanbanService.addBoard(board)
        .then(() => {
          columnNames?.forEach((name) => {
            const column = createColumn({ name, boardId: board.id });
            addColumnsToStore([column], board.id);
            KanbanService.addColumn(column).catch((err) => {
              console.log(err);
              removeColumnFromStore(column.id, board.id);
              alert("Column creation Failed");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          removeBoardFromStore(board.id);
          alert("Board Creation Failed");
        });
    },
    [addBoardToStore, removeBoardFromStore, lastIndex]
  );

  const setActiveBoard = useCallback(
    (id: string) => {
      setActiveBoardToStore(id);
      localStorage.setItem(LOCAL_KEYS.ACTIVE_BOARD, id);
    },
    [setActiveBoardToStore]
  );

  useEffect(() => {
    if (db && !boards) {
      KanbanService.getBoards()
        .then((boards) => {
          if (boards) {
            setBoardsToStore(boards.sort((a, b) => a.index - b.index));
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Boards Fetch Failed");
        });
    }
  }, [boards, db]);

  // handle active board
  useEffect(() => {
    if (boards && !activeBoard) {
      setActiveBoard(
        localStorage.getItem(LOCAL_KEYS.ACTIVE_BOARD) || boards[0]?.id || ""
      );
    }
  }, [boards, activeBoard, setActiveBoard]);

  return {
    boards,
    activeBoard,
    setActiveBoard,
    isLoading: boards === null,
    addBoard,
  };
};

// how are you gonna handle drag & drop of tasks?

// get board id and return columns
const useColumns = () => {
  const { isLoading: isBoardsLoading, activeBoard } = useBoards();
  const {
    columns,
    addColumns: addColumnsToStore,
    removeColumn: removeColumnFromStore,
  } = useColumnStore();

  useEffect(() => {
    if (
      !isBoardsLoading &&
      activeBoard &&
      (!columns || !columns[activeBoard])
    ) {
      KanbanService.getColumns(activeBoard).then((cols) => {
        if (cols) {
          addColumnsToStore(cols, activeBoard);
        }
      });
    }
  }, [isBoardsLoading, activeBoard]);

  return {
    columns: columns ? columns[activeBoard] : null,
    isLoading: columns === null || !columns[activeBoard],
  };
};

// get column id (+? board id) and return tasks
const useTasks = () => {};
export { useBoards, useColumns };

// component => useBoards => call service + update useBoardStore
