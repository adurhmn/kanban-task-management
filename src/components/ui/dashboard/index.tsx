import { Button } from "../../core";
import { Loader, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useBoardStore, useColumnStore } from "@/store";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import Column from "./column";
import { TaskModal } from "../modals";
import { useEditBoardModal } from "../modals/edit-board-modal";

const NoBoardsContent = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-cust-slate-100">
      <div className="flex flex-col gap-6 items-center w-max">
        <h2 className="h2 text-cust-slate-300">Add boards to get started</h2>
      </div>
    </div>
  );
};

const NoColsContent = ({ handleAddCol }: { handleAddCol: () => void }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-cust-slate-100">
      <div className="flex flex-col gap-6 items-center w-max">
        <h2 className="h2 text-cust-slate-300">
          The board is empty. Create a new column to get started
        </h2>
        <Button onClick={handleAddCol}>
          <Plus className="mr-2" />
          <p>Add new column</p>
        </Button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { activeBoard } = useBoardStore();
  const { columns: allColumns } = useColumnStore();

  const { setShowEditBoardModal, EditBoardModal } = useEditBoardModal();

  const ContentCallback = useCallback(() => {
    const columns = allColumns?.[activeBoard];

    if (!activeBoard) return <NoBoardsContent />;
    if (!columns)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      );
    if (columns.length === 0)
      return <NoColsContent handleAddCol={() => setShowEditBoardModal(true)} />;
    return (
      <div className="w-full h-full flex-shrink bg-cust-slate-100 overflow-auto flex">
        <Droppable
          droppableId="columns"
          type={DROPPABLE_TYPE.COLUMNS}
          direction="horizontal"
        >
          {(provided) => (
            <div
              className="flex min-w-max h-full p-8 pl-0 sm:pl-8"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((c) => (
                <Draggable draggableId={c.id} index={c.index} key={c.id}>
                  {(provided, snapshot) => (
                    <Column
                      column={c}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="py-8 pr-8">
          <button
            className="min-w-[300px] h-full bg-cust-prim-light/10 flex items-center justify-center rounded-lg"
            onClick={() => setShowEditBoardModal(true)}
          >
            <p className="h1 text-cust-slate-300 text-center">+ New Column</p>
          </button>
        </div>
      </div>
    );
  }, [activeBoard, allColumns, setShowEditBoardModal]);

  return (
    <>
      <ContentCallback />
      <EditBoardModal />
      <TaskModal />
    </>
  );
}
