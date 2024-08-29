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

export type { Board, Column };
