const IDB_NAME = "kanban";
const IDB_VERSION = 1;
const BOARDS_STORE = "boards";
const COLUMNS_STORE = "columns";
const TASKS_STORE = "tasks";
const SUBTASKS_STORE = "subtasks";
const ALL_STORES = [BOARDS_STORE, COLUMNS_STORE, TASKS_STORE];
const INDEXES = {
  [COLUMNS_STORE]: {
    BOARD_ID: "boardId",
  },
  [TASKS_STORE]: {
    COLUMN_ID: "columnId",
  },
  [SUBTASKS_STORE]: {
    TASK_ID: "taskId",
  },
};

export {
  IDB_NAME,
  IDB_VERSION,
  BOARDS_STORE,
  COLUMNS_STORE,
  TASKS_STORE,
  SUBTASKS_STORE,
  ALL_STORES,
  INDEXES,
};
