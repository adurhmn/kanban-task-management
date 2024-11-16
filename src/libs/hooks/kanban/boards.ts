import * as KanbanService from "@/services/kanban";
import { useBoardStore, useIDBStore } from "@/store";
import { useEffect } from "react";

const useBoardSync = () => {
  const { setBoards, setBoardsLoaded } = useBoardStore();
  const { db } = useIDBStore();

  useEffect(() => {
    if (db) {
      KanbanService.getBoards()
        .then((boards) => {
          if (boards) {
            setBoards(boards.sort((a, b) => a.index - b.index));
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Boards Fetch Failed");
        })
        .finally(() => {
          setBoardsLoaded(true);
        });
    }
  }, [db]);
};

export { useBoardSync };
