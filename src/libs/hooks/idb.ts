import { useIDBStore } from "@/store";
import { useEffect } from "react";
import {
  BOARDS_STORE,
  COLUMNS_STORE,
  IDB_NAME,
  IDB_VERSION,
  INDEXES,
  SUBTASKS_STORE,
  TASKS_STORE,
} from "../constants";

function loadV1Schema(db: IDBDatabase) {
  const boardsStore = db.createObjectStore(BOARDS_STORE, { keyPath: "id" });
  const columnsStore = db.createObjectStore(COLUMNS_STORE, { keyPath: "id" });
  const tasksStore = db.createObjectStore(TASKS_STORE, { keyPath: "id" });
  const subtasksStore = db.createObjectStore(SUBTASKS_STORE, { keyPath: "id" });

  columnsStore.createIndex(INDEXES[COLUMNS_STORE].BOARD_ID, "boardId", {
    unique: false,
  });
  tasksStore.createIndex(INDEXES[TASKS_STORE].COLUMN_ID, "columnId", {
    unique: false,
  });
  subtasksStore.createIndex(INDEXES[SUBTASKS_STORE].TASK_ID, "taskId", {
    unique: false,
  });
}

const useConnectIDB = () => {
  const { setDB } = useIDBStore();

  useEffect(() => {
    const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);

    req.onerror = (event) => {
      console.log("onerror");
      console.log(event);
      window.alert("DB Open Error");
    };
    req.onupgradeneeded = (event) => {
      console.log("onupgradeneeded");
      loadV1Schema((event.target as IDBOpenDBRequest).result);
    };
    req.onsuccess = (event) => {
      console.log("onsuccess");
      setDB((event.target as IDBOpenDBRequest).result);
    };
  }, []);
};

export { useConnectIDB };
