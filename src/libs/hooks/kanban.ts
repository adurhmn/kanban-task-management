import { useBoardStore, useIDBStore } from "@/store";
import { useCallback, useEffect } from "react";
import * as KanbanService from "@/services/kanban";
import { createBoard } from "@/libs/utils/kanban";

// this is just a wrapper layer for joining things
const useBoards = () => {
  const { db } = useIDBStore();
  const {
    boards,
    addBoard: addBoardToStore,
    removeBoard: removeBoardFromStore,
    setBoards: setBoardsToStore,
  } = useBoardStore();

  useEffect(() => {
    if (db && !boards) {
      KanbanService.getBoards()
        .then((boards) => {
          if (boards) setBoardsToStore(boards);
        })
        .catch((err) => {
          console.log(err);
          alert("Boards Fetch Failed");
        });
    }
  }, [boards, db]);

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

  return { boards: boards, isLoading: boards === null, addBoard };
};

export { useBoards };

// component => useBoards => call service + update useBoardStore
