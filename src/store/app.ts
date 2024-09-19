import { create } from "zustand";

interface AppStore {
  isDarkMode: boolean;
  setIsDarkMode: (y: boolean) => void;
}

const useAppStore = create<AppStore>((set) => ({
  isDarkMode: false,
  setIsDarkMode: (y) => set({ isDarkMode: y }),
}));

export { useAppStore };
