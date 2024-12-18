import { Column } from "@/libs/types";
import { useColumnStore } from "@/store";
import * as KanbanService from "@/services/kanban";
import { deleteTasksAction } from "./tasks";

export const deleteColumnAction = async (colId: string, boardId: string) => {
  const {
    deleteColumn,
    addColumns,
    columns: allColumns,
  } = useColumnStore.getState();
  const cols = allColumns![boardId];

  // optimistic updation
  const removedColumn = deleteColumn(colId, boardId);
  if (removedColumn) {
    return await KanbanService.deleteColumn(colId)
      .then(async () => {
        await deleteTasksAction(colId);
        // update col indexes
        const colsToUpdate: Column[] = [];
        for (const col of cols) {
          if (col.index > removedColumn.index) {
            colsToUpdate.push({ ...col, index: col.index - 1 });
          }
        }
        await putColumnsAction(colsToUpdate, boardId);
        return "deleteColumnAction success";
      })
      .catch((err) => {
        console.log({ err });
        alert("Subtask delete failed");
        addColumns([removedColumn], boardId);
      });
  }
};

// Partial<Column> can be received if merging is handled in idb put service
export const putColumnsAction = async (
  updatedCols: Column[],
  boardId: string
) => {
  // updatedCols -> can have items to update as well as new items
  //                 -> doesn't necessarily need to contain all old items, only the updated + new ones
  //                 -> so, we need to merge with oldCols
  const { columns: allCols, setColumns } = useColumnStore.getState();
  let oldCols = allCols?.[boardId];
  const oldColsClone = oldCols?.slice();

  if (oldCols) {
    // merging the updated & newones with old subtasks, then updating it to store
    const oldColsMap = oldCols.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Column });
    const updatedColsMap = updatedCols.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [key: string]: Column });
    oldCols = oldCols.map((st) => updatedColsMap[st.id] || st); // updation
    for (const st of updatedCols) {
      if (!oldColsMap[st.id]) {
        oldCols.push(st); // adding new ones
      }
    }
    oldCols = oldCols?.sort((a, b) => a.index - b.index); // reordering indexes because of possible deletion

    // optimistic updation
    setColumns(oldCols, boardId);
    return await KanbanService.putColumns(updatedCols)
      .then(() => "putColumnsAction success")
      .catch((err) => {
        console.log({ err });
        alert("Column update failed");
        setColumns(oldColsClone!, boardId);
      });
  }
};

export const deleteColumnsAction = async (boardId: string) => {
  const { columns: allCols, setColumns } = useColumnStore.getState();
  const copy = allCols?.[boardId];

  if (copy) {
    //optimistic updation
    setColumns([], boardId);
    return await KanbanService.deleteColumns(boardId)
      .then(async () => {
        for (const col of copy) {
          await deleteTasksAction(col.id);
        }
        return "deleteColumnsAction Success";
      })
      .catch(() => {
        setColumns(copy, boardId);
      });
  }
};
