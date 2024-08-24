import { Board } from "@/libs/types";
import { create } from "zustand";

interface BoardStore {
  boards: Board[] | null;
  addBoard: (board: Board) => void;
  removeBoard: (id: string) => void;
  setBoards: (boards: Board[]) => void;
}

const useBoardStore = create<BoardStore>((set) => ({
  boards: null,
  addBoard: (board) =>
    set((state) => ({
      boards: state.boards ? [...state.boards, board] : [board],
    })),
  removeBoard: (id) =>
    set((state) => ({
      boards: state.boards ? state.boards.filter((b) => b.id !== id) : null,
    })),
  setBoards: (boards) => set({ boards }),
}));

export { useBoardStore };
