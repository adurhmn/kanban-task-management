import { LOCAL_KEYS } from "@/libs/constants";
import { Board, Column } from "@/libs/types";
import { create } from "zustand";

interface BoardStore {
  boards: Board[] | null;
  activeBoard: string;
  addBoard: (board: Board) => void;
  removeBoard: (id: string) => void;
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (id: string) => void;
}

interface ColumnStore {
  columns: { [boardId: string]: Column[] } | null;
  addColumns: (column: Column[], boardId: string) => void;
  setColumns: (column: Column[], boardId: string) => void;
  removeColumn: (colId: string, boardId: string) => void;
}

const useBoardStore = create<BoardStore>((set) => ({
  boards: null,
  activeBoard: "",
  addBoard: (board) =>
    set(({ boards, activeBoard }) => ({
      boards: boards ? [...boards, board] : [board],
      activeBoard:
        activeBoard ||
        localStorage.getItem(LOCAL_KEYS.ACTIVE_BOARD) ||
        board.id ||
        "",
    })),
  removeBoard: (id) =>
    set((state) => ({
      boards: state.boards ? state.boards.filter((b) => b.id !== id) : null,
    })),
  setBoards: (boards) =>
    set(({ activeBoard }) => ({
      boards,
      activeBoard:
        activeBoard ||
        localStorage.getItem(LOCAL_KEYS.ACTIVE_BOARD) ||
        boards[0]?.id ||
        "",
    })),
  setActiveBoard: (id) => set({ activeBoard: id }),
}));

const useColumnStore = create<ColumnStore>((set) => ({
  columns: null,
  addColumns: (columns, boardId) => {
    set((state) => ({
      columns: {
        ...state.columns,
        [boardId]: state.columns?.[boardId]
          ? [...state.columns[boardId], ...columns]
          : [...columns],
      },
    }));
  },
  setColumns: (columns, boardId) => {
    set((state) => ({
      columns: {
        ...state.columns,
        [boardId]: columns,
      },
    }));
  },
  removeColumn: (colId, boardId) =>
    set((state) => ({
      columns: state.columns
        ? {
            ...state.columns,
            [boardId]: state.columns[boardId].filter((c) => c.id !== colId),
          }
        : null,
    })),
}));

export { useBoardStore, useColumnStore };
