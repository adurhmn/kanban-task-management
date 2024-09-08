import { Button } from "../../core";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useBoardStore, useColumnStore } from "@/store";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import Column from "./column";
import { TaskModal } from "../modals";

export default function Dashboard() {
  const { activeBoard } = useBoardStore();
  const { columns: allColumns } = useColumnStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = allColumns?.[activeBoard] || [];

  return (
    <>
      <div className="w-full flex-shrink h-full bg-cust-slate-100 flex items-center justify-center">
        {!activeBoard ? (
          <div className="flex flex-col gap-6 items-center w-max">
            <h2 className="h2 text-cust-slate-300">
              Add boards to get started
            </h2>
          </div>
        ) : columns.length === 0 ? (
          <div className="flex flex-col gap-6 items-center w-max">
            <h2 className="h2 text-cust-slate-300">
              The board is empty. Create a new column to get started
            </h2>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2" />
              <p>Add new column</p>
            </Button>
          </div>
        ) : (
          <Droppable
            droppableId="columns"
            type={DROPPABLE_TYPE.COLUMNS}
            direction="horizontal"
          >
            {(provided) => (
              <div
                className="flex w-full h-full p-8 pl-0 overflow-auto"
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
        )}
        <TaskModal />
      </div>
    </>
  );
}
