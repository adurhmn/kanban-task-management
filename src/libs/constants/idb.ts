

const IDB_NAME = 'kanban'
const IDB_VERSION = 1
const BOARDS_STORE = "boards";
const COLUMNS_STORE = "columns";
const TASKS_STORE = "tasks";
const ALL_STORES = [BOARDS_STORE, COLUMNS_STORE, TASKS_STORE];
const INDEXES = {
  [COLUMNS_STORE]: {
    BOARD_ID: "boardId"
  }
}

export { IDB_NAME, IDB_VERSION, BOARDS_STORE, COLUMNS_STORE, TASKS_STORE, ALL_STORES, INDEXES };
