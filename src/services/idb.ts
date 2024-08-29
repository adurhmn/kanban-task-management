import { Column } from "@/libs/types";
import { useIDBStore } from "@/store";

async function getItemByPK(storeKey: string, recordKey: string) {
  const db = useIDBStore.getState().db;
  if (!db) return null;

  const tx = db.transaction(storeKey, "readonly");
  const store = tx.objectStore(storeKey);
  const req = store.get(recordKey);
  await new Promise((resolve, reject) => {
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
  return await new Promise((resolve, reject) => {
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
  await new Promise((resolve, reject) => {
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

export {
  addItemToStore,
  getItemByPK,
  getItemsByStore,
  getItemsByIndex,
  putItemsToStore,
};
