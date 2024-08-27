import { addItemToStore, getItemsByIndex, getItemsByStore } from "./idb";
import { BOARDS_STORE, COLUMNS_STORE, INDEXES } from "@/libs/constants";
import { Board, Column } from "@/libs/types";

async function getBoards(): Promise<Board[] | null> {
  return getItemsByStore(BOARDS_STORE);
}

async function addBoard(board: Board) {
  return addItemToStore(BOARDS_STORE, board);
}

async function getColumns(boardId: string): Promise<Column[] | null> {
  return getItemsByIndex(
    COLUMNS_STORE,
    INDEXES[COLUMNS_STORE].BOARD_ID,
    boardId
  );
}

async function addColumn(column: Column) {
  return addItemToStore(COLUMNS_STORE, column);
}

export { getBoards, addBoard, addColumn, getColumns };
