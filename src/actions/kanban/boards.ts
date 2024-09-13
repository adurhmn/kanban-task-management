import { createBoard, createColumn } from "@/libs/utils/kanban";
import { useBoardStore, useColumnStore } from "@/store";
import * as KanbanService from "@/services/kanban";
import { LOCAL_KEYS } from "@/libs/constants";
import { Board, Column } from "@/libs/types";
import {
  deleteColumnAction,
  deleteColumnsAction,
  putColumnsAction,
} from "./columns";

// each action must await till all updates + sideeffects completion
// then it should resolve with a success message
export const addBoard = (name: string, columnNames?: string[]) => {
  const {
    boards,
    addBoard: addBoardToStore,
    deleteBoard: deleteBoardFromStore,
  } = useBoardStore.getState();
  const { addColumns: addColumnsToStore, deleteColumn: deleteColumnFromStore } =
    useColumnStore.getState();
  const lastIndex = boards ? boards.length - 1 : -1;

  const board = createBoard(name, lastIndex + 1);
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
      deleteBoardFromStore(board.id);
      alert("Board Creation Failed");
    });
};

export const setActiveBoardAction = (id: string) => {
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

export const putBoardsAction = (updatedBoards: Board[]) => {
  let { boards: oldBoards, setBoards } = useBoardStore.getState();
  const oldBoardsClone = oldBoards?.slice();

  if (oldBoards) {
    // merging the updated & new ones with old ones, then updating it to store
    const oldBoardsMap = oldBoards.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Board });
    const updatedBoardsMap = updatedBoards.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Board });
    oldBoards = oldBoards.map((b) => updatedBoardsMap[b.id] || b); // updation
    for (const b of updatedBoards) {
      if (!oldBoardsMap[b.id]) {
        oldBoards.push(b); // adding new ones
      }
    }
    oldBoards = oldBoards?.sort((a, b) => a.index - b.index); // reordering indexes because of possible deletion

    // optimistic updation
    setBoards(oldBoards);
    return KanbanService.updateBoards(updatedBoards).catch((err) => {
      console.log({ err });
      alert("Board update failed");
      setBoards(oldBoardsClone!);
    });
  }
};

export const deleteBoardAction = async (boardId: string) => {
  const { deleteBoard, addBoard, boards } = useBoardStore.getState();

  // optimistic updation
  const removedBoard = deleteBoard(boardId);
  if (boards && removedBoard) {
    // setting next active board
    if (boards.length === 1) {
      setActiveBoardAction("");
    } else {
      let nextActiveBoard: Board | undefined;
      for (let i = 0; i < boards.length; i++) {
        const b = boards[i];
        if (b.id === boardId) {
          if (boards[i + 1]) {
            nextActiveBoard = boards[i + 1];
          }
          break;
        } else {
          nextActiveBoard = b;
        }
      }
      setActiveBoardAction(nextActiveBoard?.id || "");
    }

    await KanbanService.deleteBoard(boardId)
      .then(async () => {
        await deleteColumnsAction(boardId);

        // update board indexes
        const boardsToUpdate: Board[] = [];
        for (const board of boards) {
          if (board.index > removedBoard.index) {
            boardsToUpdate.push({ ...board, index: board.index - 1 });
          }
        }
        putBoardsAction(boardsToUpdate);
      })
      .catch((err) => {
        console.log({ err });
        alert("Subtask delete failed");
        addBoard(removedBoard);
      });
  }
};
