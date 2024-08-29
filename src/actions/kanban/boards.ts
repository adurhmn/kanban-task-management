import { createBoard, createColumn } from "@/libs/utils/kanban";
import { useBoardStore, useColumnStore } from "@/store";
import * as KanbanService from "@/services/kanban";
import { LOCAL_KEYS } from "@/libs/constants";

export const addBoard = (name: string, columnNames?: string[]) => {
  const {
    boards,
    addBoard: addBoardToStore,
    removeBoard: removeBoardFromStore,
  } = useBoardStore.getState();
  const { addColumns: addColumnsToStore, removeColumn: removeColumnFromStore } =
    useColumnStore.getState();
  const lastIndex = boards ? boards.length - 1 : -1;

  const board = createBoard(name, lastIndex);
  addBoardToStore(board); // optimistic updation
  KanbanService.addBoard(board)
    .then(() => {
      columnNames?.forEach((name, index) => {
        const column = createColumn({ name, boardId: board.id, index });
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
};

export const setActiveBoard = (id: string) => {
  useBoardStore.getState().setActiveBoard(id);
  localStorage.setItem(LOCAL_KEYS.ACTIVE_BOARD, id);
};
