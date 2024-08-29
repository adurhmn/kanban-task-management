import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import { useBoardStore, useColumnStore } from "@/store";
import {
  DragDropContext as DragDropContextRaw,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { ReactNode, useCallback } from "react";
import * as KanbanService from "@/services/kanban";

const DragDropContext = ({ children }: { children: ReactNode }) => {
  const { boards, setBoards, activeBoard } = useBoardStore();
  const { columns, setColumns } = useColumnStore();

  const onBeforeCapture = useCallback(() => {
    /*...*/
  }, []);
  const onBeforeDragStart = useCallback(() => {
    /*...*/
  }, []);
  const onDragStart = useCallback(() => {
    /*...*/
  }, []);
  const onDragUpdate = useCallback(() => {
    /*...*/
  }, []);
  const onDragEnd: OnDragEndResponder = useCallback(
    (event) => {
      // considering the values is sorted by .index
      // .index is for maintaining order in idb. idb sorts based on pk.
      // so after changing .index, sort before pushing to store.
      if (event.type === DROPPABLE_TYPE.BOARDS) {
        if (
          event.destination &&
          event.source.index !== event.destination.index &&
          boards
        ) {
          let newBoards = [...boards];
          if (event.source.index < event.destination.index) {
            // top to bottom
            for (
              let i = event.source.index + 1;
              i <= event.destination.index;
              i++
            ) {
              newBoards[i].index--;
            }
          } else {
            // bottom to top
            for (let i = event.destination.index; i < event.source.index; i++) {
              newBoards[i].index++;
            }
          }
          newBoards[event.source.index].index = event.destination.index;
          newBoards = newBoards.sort((a, b) => a.index - b.index); // sort is mandatory
          setBoards(newBoards);
          // TODO: only update changed boards, not all
          // solution: also maintain object based boards. check if index is changed between boards & newBoards using boardId & index
          KanbanService.updateBoards(newBoards).catch((err) => {
            console.log({ err });
            alert("Board index updation failed");
          });
        }
      } else if (event.type === DROPPABLE_TYPE.COLUMNS) {
        if (
          event.destination &&
          event.source.index !== event.destination.index &&
          columns &&
          columns[activeBoard]
        ) {
          let newCols = [...columns[activeBoard]];
          if (event.source.index < event.destination.index) {
            // left to right
            for (
              let i = event.source.index + 1;
              i <= event.destination.index;
              i++
            ) {
              newCols[i].index--;
            }
          } else {
            // right to left
            for (let i = event.destination.index; i < event.source.index; i++) {
              newCols[i].index++;
            }
          }
          newCols[event.source.index].index = event.destination.index;
          newCols = newCols.sort((a, b) => a.index - b.index); // sort is mandatory
          setColumns(newCols, activeBoard);
          // TODO: only update changed cols, not all
          // solution: also maintain object based cols. check if index is changed between cols & newCols using colId & index
          KanbanService.updateColumns(newCols).catch((err) => {
            console.log({ err });
            alert("Cols index updation failed");
          });
        }
      }
    },
    [boards, setBoards, activeBoard, columns, setColumns]
  );

  return (
    <DragDropContextRaw
      onBeforeCapture={onBeforeCapture}
      onBeforeDragStart={onBeforeDragStart}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      {children}
    </DragDropContextRaw>
  );
};

export default DragDropContext;
