import {
  addItemToStore,
  getItemsByIndex,
  getItemsByStore,
  putItemsToStore,
} from "./idb";
import { BOARDS_STORE, COLUMNS_STORE, INDEXES } from "@/libs/constants";
import { Board, Column } from "@/libs/types";

async function getBoards(): Promise<Board[] | null> {
  return getItemsByStore(BOARDS_STORE);
}

async function addBoard(board: Board) {
  return addItemToStore(BOARDS_STORE, board);
}

async function updateBoards(boards: Board[]) {
  return putItemsToStore(BOARDS_STORE, boards);
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

async function updateColumns(columns: Column[]) {
  return putItemsToStore(COLUMNS_STORE, columns);
}

export { getBoards, addBoard, updateBoards, addColumn, getColumns, updateColumns };
