import { useIDBStore } from "@/store";

async function getItem(storeKey: string, recordKey: string) {
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

async function addItem(storeKey: string, recordData: any) {
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

async function getItems(storeKey: string): Promise<Array<any> | null> {
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

export {addItem, getItem, getItems};
