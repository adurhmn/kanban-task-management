import { Board } from "../types";
import getRandId from "./getRandId";

function createBoard(name: string): Board {
  return {
    id: getRandId(),
    name,
  };
}

export {createBoard}