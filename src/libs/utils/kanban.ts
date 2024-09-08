import { Board, Column, Subtask, Task, TaskStatus } from "../types";
import getRandId from "./getRandId";

function createBoard(name: string, index: number): Board {
  return {
    id: getRandId(),
    name,
    index,
  };
}

function createColumn({
  name,
  boardId,
  color,
  index,
}: {
  name: string;
  boardId: string;
  index: number;
  color?: string;
}): Column {
  return {
    id: getRandId(),
    name,
    boardId,
    index,
    ...(color ? { color } : null),
  };
}

function createTask({
  title,
  desc,
  colId,
  index,
}: {
  title: string;
  desc: string;
  colId: string;
  index: number;
}): Task {
  return {
    id: getRandId(),
    title,
    desc,
    index,
    columnId: colId,
    status: TaskStatus.HOLD,
  };
}

function createSubtask({
  desc,
  taskId,
  index,
  isComplete = false,
}: {
  desc: string;
  taskId: string;
  index: number;
  isComplete?: boolean;
}): Subtask {
  return {
    id: getRandId(),
    desc,
    index,
    taskId,
    isComplete,
  };
}

export { createBoard, createColumn, createTask, createSubtask };
