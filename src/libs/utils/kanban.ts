import { Board, Column } from "../types";
import getRandId from "./getRandId";

function createBoard(name: string): Board {
  return {
    id: getRandId(),
    name,
  };
}

function createColumn({name, boardId, color}: {name: string, boardId: string, color?: string}): Column {
  return {
    id: getRandId(),
    name,
    boardId
  };
}

export {createBoard, createColumn}