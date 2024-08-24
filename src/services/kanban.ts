import { addItem, getItems } from "./idb";
import { BOARDS_STORE } from "@/libs/constants";
import { Board } from "@/libs/types";

async function getBoards() {
  return getItems(BOARDS_STORE);
}

async function addBoard(board: Board) {
  return addItem(BOARDS_STORE, board);
}

export { getBoards, addBoard };
