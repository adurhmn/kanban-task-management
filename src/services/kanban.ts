import {
  addItemToStore,
  deleteItemFromStore,
  deleteItemsByIndex,
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

export async function getBoards(): Promise<Board[] | null> {
  return getItemsByStore(BOARDS_STORE);
}

export async function addBoard(board: Board) {
  return addItemToStore(BOARDS_STORE, board);
}

export async function updateBoards(boards: Board[]) {
  return putItemsToStore(BOARDS_STORE, boards);
}

export async function getColumns(boardId: string): Promise<Column[] | null> {
  return getItemsByIndex(
    COLUMNS_STORE,
    INDEXES[COLUMNS_STORE].BOARD_ID,
    boardId
  );
}

export async function addColumn(column: Column) {
  return addItemToStore(COLUMNS_STORE, column);
}

export async function updateColumns(columns: Column[]) {
  return putItemsToStore(COLUMNS_STORE, columns);
}

export async function addTask(task: Task) {
  return addItemToStore(TASKS_STORE, task);
}

export async function putTask(task: Task) {
  return putItemsToStore(TASKS_STORE, [task]);
}

export async function getTasks(colId: string): Promise<Task[] | null> {
  return getItemsByIndex(TASKS_STORE, INDEXES[TASKS_STORE].COLUMN_ID, colId);
}

export async function updateTasks(tasks: Task[]) {
  return putItemsToStore(TASKS_STORE, tasks);
}

export async function addSubtask(subtask: Subtask) {
  return addItemToStore(SUBTASKS_STORE, subtask);
}

export async function getSubtasks(taskId: string): Promise<Subtask[] | null> {
  return getItemsByIndex(
    SUBTASKS_STORE,
    INDEXES[SUBTASKS_STORE].TASK_ID,
    taskId
  );
}

export async function putSubtasks(subtasks: Subtask[]) {
  return putItemsToStore(SUBTASKS_STORE, subtasks);
}

export async function deleteSubtask(subtaskId: string) {
  return deleteItemFromStore(SUBTASKS_STORE, subtaskId);
}

export async function deleteSubtasks(taskId: string) {
  return deleteItemsByIndex(
    SUBTASKS_STORE,
    INDEXES[SUBTASKS_STORE].TASK_ID,
    taskId
  );
}

export async function deleteTask(taskId: string) {
  return deleteItemFromStore(TASKS_STORE, taskId);
}

export async function putTasks(tasks: Task[]) {
  return putItemsToStore(TASKS_STORE, tasks);
}

export async function putColumns(cols: Column[]) {
  return putItemsToStore(COLUMNS_STORE, cols);
}

export async function putBoard(board: Board) {
  return putItemsToStore(BOARDS_STORE, [board]);
}

export async function deleteColumn(colId: string) {
  return deleteItemFromStore(COLUMNS_STORE, colId);
}

export async function deleteColumns(boardId: string) {
  return deleteItemsByIndex(
    COLUMNS_STORE,
    INDEXES[COLUMNS_STORE].BOARD_ID,
    boardId
  );
}

export async function deleteTasks(columnId: string) {
  return deleteItemsByIndex(
    TASKS_STORE,
    INDEXES[TASKS_STORE].COLUMN_ID,
    columnId
  );
}

export async function deleteBoard(boardId: string) {
  return deleteItemFromStore(BOARDS_STORE, boardId);
}