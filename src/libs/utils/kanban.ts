import { Board, Column } from "../types";
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

export { createBoard, createColumn };
