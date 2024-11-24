import { Button } from "../../core";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { useBoardStore, useColumnStore } from "@/store";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import Column from "./column";
import EditBoardModal from "../modals/edit-board-modal";
import TaskModal from "../modals/task-modal";
import styles from "./index.module.css";

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
  const { activeBoard, boardsLoaded } = useBoardStore();
  const { columns: allColumns, columnsLoaded } = useColumnStore();
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const columns = allColumns?.[activeBoard];

  if (!boardsLoaded || !columnsLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cust-slate-100">
        <Loader className="animate-spin text-cust-prim-light" />
      </div>
    );
  }
  if (!activeBoard) return <NoBoardsContent />;
  if (!columns || columns.length === 0)
    return <NoColsContent handleAddCol={() => setShowEditBoardModal(true)} />;

  return (
    <>
      <Droppable
        droppableId="columns"
        type={DROPPABLE_TYPE.COLUMNS}
        direction="horizontal"
      >
        {(provided) => (
          <div
            className={styles.columnsWrapper}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((c) => (
              <Draggable draggableId={c.id} index={c.index} key={c.id}>
                {(provided, snapshot) => (
                  <Column column={c} provided={provided} snapshot={snapshot} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <button
              className="w-[300px] h-full bg-cust-prim-light/10 flex items-center justify-center rounded-lg ml-8"
              onClick={() => setShowEditBoardModal(true)}
            >
              <p className="h1 text-cust-slate-300 text-center">+ New Column</p>
            </button>
          </div>
        )}
      </Droppable>

      <EditBoardModal
        showModal={showEditBoardModal}
        setShowModal={setShowEditBoardModal}
        boardId={activeBoard}
      />
      <TaskModal />
    </>
  );
}
