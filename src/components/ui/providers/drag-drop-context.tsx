import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import { useBoardStore } from "@/store";
import {
  DragDropContext as DragDropContextRaw,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { ReactNode, useCallback } from "react";
import * as KanbanService from "@/services/kanban";

const DragDropContext = ({ children }: { children: ReactNode }) => {
  const { boards, setBoards } = useBoardStore();

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
      }
    },
    [boards, setBoards]
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
