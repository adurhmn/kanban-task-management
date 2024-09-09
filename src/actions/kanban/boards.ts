import { createBoard, createColumn } from "@/libs/utils/kanban";
import { useBoardStore, useColumnStore } from "@/store";
import * as KanbanService from "@/services/kanban";
import { LOCAL_KEYS } from "@/libs/constants";
import { Board, Column } from "@/libs/types";
import { deleteColumnAction, putColumnsAction } from "./columns";

export const addBoard = (name: string, columnNames?: string[]) => {
  const {
    boards,
    addBoard: addBoardToStore,
    removeBoard: removeBoardFromStore,
  } = useBoardStore.getState();
  const { addColumns: addColumnsToStore, deleteColumn: deleteColumnFromStore } =
    useColumnStore.getState();
  const lastIndex = boards ? boards.length - 1 : -1;

  const board = createBoard(name, lastIndex);
  addBoardToStore(board); // optimistic updation
  return KanbanService.addBoard(board)
    .then(() => {
      columnNames?.forEach((name, index) => {
        const column = createColumn({ name, boardId: board.id, index });
        addColumnsToStore([column], board.id);
        KanbanService.addColumn(column).catch((err) => {
          console.log(err);
          deleteColumnFromStore(column.id, board.id);
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

export const putBoardAction = (updatedBoard: Board) => {
  const { boards, setBoards } = useBoardStore.getState();

  if (boards) {
    // optimistic updation
    setBoards(boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b)));
    return KanbanService.putBoard(updatedBoard).catch((err) => {
      console.log({ err });
      alert("Subtask update failed");
      setBoards(boards);
    });
  }
};

export const editBoardAction = async ({
  board,
  oldColumns,
  formData: { name, ...cols },
}: {
  board: Board;
  oldColumns: Column[];
  formData: {
    name: string;
    [colId: string]: string;
  };
}) => {
  for (const c of oldColumns) {
    if (cols[c.id] === undefined) {
      // delete column
      await deleteColumnAction(c.id, board.id);
    }
  }

  const colsToPut = Object.entries(cols).map(([id, value], ind) => {
    if (id.startsWith("col-")) {
      return createColumn({
        boardId: board.id,
        name: value,
        index: ind, // insertion order is preserved in js object, so this will work
      });
    } else {
      // update col (name)
      return {
        id,
        boardId: board.id,
        name: value,
        index: ind, // insertion order is preserved in js object, so this will work
      };
    }
  });

  await putColumnsAction(colsToPut, board.id);
  await putBoardAction({ ...board, name });
};
