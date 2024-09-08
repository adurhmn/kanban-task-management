interface Board {
  id: string;
  name: string;
  index: number;
}

interface Column {
  id: string;
  name: string;
  boardId: string;
  index: number;
  color?: string;
}

enum TaskStatus {
  HOLD = "hold",
  ON_PROGRESS = "on-progress",
  COMPLETED = "completed",
}

interface Task {
  id: string;
  title: string;
  desc: string;
  status: TaskStatus;
  columnId: string;
  index: number;
  subtask: {
    complete: number;
    incomplete: number;
  };
}

interface Subtask {
  id: string;
  desc: string;
  taskId: string;
  index: number;
  isComplete: boolean;
}

export type { Board, Column, Task, Subtask };
export { TaskStatus };
