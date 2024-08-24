import { useIDBStore } from "@/store";
import { useEffect } from "react";
import { ALL_STORES, IDB_NAME, IDB_VERSION } from "../constants";

function loadV1Schema(db: IDBDatabase) {
  for (const store of ALL_STORES) {
    db.createObjectStore(store, { keyPath: "id" });
  }
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
