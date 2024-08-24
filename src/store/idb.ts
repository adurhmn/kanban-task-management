import { create } from "zustand";

interface IDBStore {
  db: IDBDatabase | null;
  setDB: (db: IDBDatabase) => void;
}

const useIDBStore = create<IDBStore>((set) => ({
  db: null,
  setDB: (db) => set({ db }),
}));

export { useIDBStore };
