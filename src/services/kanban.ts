import {
  addItemToStore,
  getItemsByIndex,
  getItemsByStore,
  putItemsToStore,
} from "./idb";
import {
  BOARDS_STORE,
  COLUMNS_STORE,
  INDEXES,
  SUBTASKS_STORE,
  TASKS_STORE,
} from "@/libs/constants";
import { Board, Column, Subtask, Task } from "@/libs/types";

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

async function addTask(task: Task) {
  return addItemToStore(TASKS_STORE, task);
}

async function getTasks(colId: string): Promise<Task[] | null> {
  return getItemsByIndex(TASKS_STORE, INDEXES[TASKS_STORE].COLUMN_ID, colId);
}

async function updateTasks(tasks: Task[]) {
  return putItemsToStore(TASKS_STORE, tasks);
}

async function addSubtask(subtask: Subtask) {
  return addItemToStore(SUBTASKS_STORE, subtask);
}

export {
  getBoards,
  addBoard,
  updateBoards,
  addColumn,
  getColumns,
  updateColumns,
  addTask,
  addSubtask,
  getTasks,
  updateTasks
};
