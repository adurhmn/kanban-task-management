import { LOCAL_KEYS } from "@/libs/constants";
import { Board, Column, Subtask, Task } from "@/libs/types";
import { create } from "zustand";

// TODO: sort data on view, instead of on store
interface BoardStore {
  boardsLoaded: boolean;
  boards: Board[] | null;
  activeBoard: string;
  addBoard: (board: Board) => void;
  deleteBoard: (id: string) => Board | null;
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (id: string) => void;
  setBoardsLoaded: (isLoaded: boolean) => void;
}

interface ColumnStore {
  columnsLoaded: boolean;
  columns: { [boardId: string]: Column[] } | null;
  addColumns: (column: Column[], boardId: string) => void;
  setColumns: (column: Column[], boardId: string) => void;
  deleteColumn: (colId: string, boardId: string) => Column | null;
  setColumnsLoaded: (isLoaded: boolean) => void;
}

interface TaskStore {
  tasks: { [columnId: string]: Task[] } | null;
  activeTask: { colId: string; taskId: string } | null; // opens task view
  setActiveTask: (_: { colId: string; taskId: string } | null) => void;
  addTasks: (tasks: Task[], columnId: string) => void;
  setTasks: (tasks: Task[], columnId: string) => void;
  putTask: (task: Pick<Task, "id"> & Partial<Omit<Task, "id">>) => void;
  deleteTask: (taskId: string, colId: string) => Task | null;
}

interface SubtaskStore {
  subtasks: { [subtaskId: string]: Subtask[] } | null;
  addSubtasks: (subtasks: Subtask[], taskId: string) => void;
  setSubtasks: (subtasks: Subtask[], taskId: string) => void;
  deleteSubtask: (subtaskId: string, taskId: string) => Subtask | null;
}

const useBoardStore = create<BoardStore>((set, getStore) => ({
  boardsLoaded: false,
  boards: null,
  activeBoard: "",
  addBoard: (board) =>
    set(({ boards, activeBoard }) => ({
      boards: boards
        ? [...boards, board].sort((a, b) => a.index - b.index)
        : [board],
      activeBoard:
        activeBoard ||
        localStorage.getItem(LOCAL_KEYS.ACTIVE_BOARD) ||
        board.id ||
        "",
    })),
  deleteBoard: (boardId) => {
    const boardToRemove = getStore().boards?.find((b) => b.id === boardId);

    set((state) => ({
      boards: state.boards
        ? state.boards.filter((b) => b.id !== boardId)
        : null,
    }));

    return boardToRemove ? boardToRemove : null;
  },
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
  setBoardsLoaded: (isLoaded) => set({ boardsLoaded: isLoaded }),
}));

const useColumnStore = create<ColumnStore>((set, getStore) => ({
  columnsLoaded: true,
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
  deleteColumn: (colId, boardId) => {
    const colToRemove = getStore().columns?.[boardId]?.find(
      (c) => c.id === colId
    );

    set((state) => ({
      columns: state.columns
        ? {
            ...state.columns,
            [boardId]:
              state.columns[boardId]?.filter((c) => c.id !== colId) || [],
          }
        : null,
    }));

    return colToRemove ? colToRemove : null;
  },
  setColumnsLoaded: (isLoaded) => set({ columnsLoaded: isLoaded }),
}));

const useTaskStore = create<TaskStore>((set, getStore) => ({
  tasks: null,
  activeTask: null,
  setActiveTask: (_) => set({ activeTask: _ }),
  addTasks: (tasks, colId) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [colId]: state.tasks?.[colId]
          ? [...state.tasks[colId], ...tasks].sort((a, b) => a.index - b.index)
          : [...tasks].sort((a, b) => a.index - b.index),
      },
      // asdf: {
      //   ...asdf,
      //   ...tasks.reduce((acc, t) => {
      //     acc[t.id] = t;
      //     return acc;
      //   }, {}),
      // },
    }));
  },
  setTasks: (tasks, colId) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [colId]: tasks,
      },
    }));
  },
  putTask: (task) => {
    const { tasks } = getStore();
    const taskToUpdate = tasks?.[task.columnId || ""]?.find(
      (t) => t.id === task.id
    );

    if (taskToUpdate) {
      set((state) => ({
        tasks: state.tasks
          ? {
              ...state.tasks,
              [task.columnId!]: state.tasks[task.columnId!]?.map((t) =>
                t.id === task.id ? { ...t, ...task } : t
              ),
            }
          : null,
      }));
    }
    return taskToUpdate ? taskToUpdate : null;
  },
  deleteTask: (taskId, colId) => {
    const taskToRemove = getStore().tasks?.[colId]?.find(
      (t) => t.id === taskId
    );

    set((state) => ({
      tasks: state.tasks
        ? {
            ...state.tasks,
            [colId]: state.tasks[colId]?.filter((t) => t.id !== taskId) || [],
          }
        : null,
    }));

    return taskToRemove ? taskToRemove : null;
  },
}));

const useSubtaskStore = create<SubtaskStore>((set, getStore) => ({
  subtasks: null,
  addSubtasks: (subtasks, taskId) => {
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: state.subtasks?.[taskId]
          ? [...state.subtasks[taskId], ...subtasks].sort(
              (a, b) => a.index - b.index
            )
          : [...subtasks].sort((a, b) => a.index - b.index),
      },
    }));
  },
  setSubtasks: (subtasks, taskId) => {
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: subtasks,
      },
    }));
  },
  deleteSubtask: (subtaskId, taskId) => {
    const subtaskToRemove = getStore().subtasks?.[taskId]?.find(
      (st) => st.id === subtaskId
    );

    set((state) => ({
      subtasks: state.subtasks
        ? {
            ...state.subtasks,
            [taskId]:
              state.subtasks[taskId]?.filter((st) => st.id !== subtaskId) || [],
          }
        : null,
    }));

    return subtaskToRemove ? subtaskToRemove : null;
  },
}));

export { useBoardStore, useColumnStore, useTaskStore, useSubtaskStore };
