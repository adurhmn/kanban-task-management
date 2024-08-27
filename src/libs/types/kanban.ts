interface Board {
  id: string;
  name: string;
  index?: string;
}

interface Column {
  id: string;
  name: string;
  boardId: string;
  color?: string;
  index?: string;
}

export type { Board, Column };
