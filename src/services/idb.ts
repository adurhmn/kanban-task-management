import { Column } from "@/libs/types";
import { useIDBStore } from "@/store";

async function getItemByPK(storeKey: string, recordKey: string) {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  const tx = db.transaction(storeKey, "readonly");
  const store = tx.objectStore(storeKey);
  const req = store.get(recordKey);
  new Promise((resolve, reject) => {
    req.onsuccess = () => {
      resolve(req.result);
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}

async function getItemsByIndex(
  storeKey: string,
  indexName: string,
  indexQuery: string
): Promise<Array<any> | null> {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  const tx = db.transaction(storeKey, "readonly");
  const store = tx.objectStore(storeKey);
  const index = store.index(indexName);
  const cursor = index.openCursor(IDBKeyRange.only(indexQuery));
  const results: Column[] = [];
  return new Promise((resolve, reject) => {
    cursor.onsuccess = (event) => {
      const cursor = (
        event.target as IDBRequest<IDBCursorWithValue | undefined>
      ).result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve([...results]);
      }
    };
    cursor.onerror = () => {
      reject(cursor.error);
    };
  });
}

async function addItemToStore(storeKey: string, recordData: any) {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  const tx = db.transaction(storeKey, "readwrite");
  const store = tx.objectStore(storeKey);
  const req = store.add(recordData); // key will be inferred from data.
  new Promise((resolve, reject) => {
    req.onsuccess = () => {
      resolve(req.result);
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}

async function putItemsToStore(storeKey: string, recordData: any[]) {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  // TODO: get old props and merge them with new before putting, this does not happen internally in indexeddb
  const tx = db.transaction(storeKey, "readwrite");
  const store = tx.objectStore(storeKey);
  return Promise.all(
    recordData.map((data) => {
      const req = store.put(data);
      return new Promise((resolve, reject) => {
        req.onsuccess = () => {
          resolve(req.result);
        };
        req.onerror = () => {
          reject(req.error);
        };
      });
    })
  );
}

async function getItemsByStore(storeKey: string): Promise<Array<any> | null> {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  const tx = db.transaction(storeKey, "readonly");
  const store = tx.objectStore(storeKey);
  const req = store.getAll();
  return new Promise((resolve, reject) => {
    req.onsuccess = () => {
      resolve(req.result);
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}

async function deleteItemFromStore(storeKey: string, pkValue: string) {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  const tx = db.transaction(storeKey, "readwrite");
  const store = tx.objectStore(storeKey);
  const req = store.delete(pkValue);
  new Promise((resolve, reject) => {
    req.onsuccess = () => {
      resolve(req.result);
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}

async function deleteItemsByIndex(
  storeKey: string,
  indexName: string,
  indexQuery: string
): Promise<boolean | null> {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  const tx = db.transaction(storeKey, "readwrite");
  const store = tx.objectStore(storeKey);
  const index = store.index(indexName);
  const cursor = index.openCursor(IDBKeyRange.only(indexQuery));
  return new Promise((resolve, reject) => {
    cursor.onsuccess = (event) => {
      const cursor = (
        event.target as IDBRequest<IDBCursorWithValue | undefined>
      ).result;
      if (cursor) {
        const req = cursor.delete();
        req.onsuccess = () => {
          cursor.continue();
        };
        req.onerror = () => {
          reject(req.error);
        };
      } else {
        resolve(true);
      }
    };
    cursor.onerror = () => {
      reject(cursor.error);
    };
  });
}

export {
  addItemToStore,
  getItemByPK,
  getItemsByStore,
  getItemsByIndex,
  putItemsToStore,
  deleteItemFromStore,
  deleteItemsByIndex,
};
