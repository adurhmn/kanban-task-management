import { useBoardStore, useIDBStore } from "@/store";
import { useCallback, useEffect } from "react";
import * as KanbanService from "@/services/kanban";
import { createBoard } from "@/libs/utils/kanban";
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


  const addBoard = useCallback(
    (name: string) => {
      const board = createBoard(name);
      addBoardToStore(board); // optimistic updation
      KanbanService.addBoard(board).catch((err) => {
        console.log(err);
        removeBoardFromStore(board.id);
        alert("Board Creation Failed");
      });
    },
    [addBoardToStore, removeBoardFromStore]
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
            setBoardsToStore(boards);
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

export { useBoards };

// component => useBoards => call service + update useBoardStore
