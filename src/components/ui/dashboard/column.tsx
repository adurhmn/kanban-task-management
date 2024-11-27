import { Column as IColumn } from "@/libs/types";
import { useTasksSync } from "@/libs/hooks/kanban/tasks";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
} from "@hello-pangea/dnd";
import { useTaskStore } from "@/store";
import { useMemo } from "react";
import cn from "@/libs/utils/cn";
import { Grip } from "lucide-react";
import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import Task from "./task";

const Column = ({
  column,
  provided,
}: {
  column: IColumn;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}) => {
  useTasksSync(column.id);
  const { tasks: allTasks } = useTaskStore();
  const tasks = useMemo(() => {
    return allTasks?.[column.id] ? allTasks[column.id] : [];
  }, [allTasks, column]);

  return (
    <div
      className={cn(
        "w-[300px] p-[10px] flex flex-col ml-8 rounded-lg bg-cust-prim-light/10"
        // snapshot.isDragging && "bg-cust-slate-0"
      )}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="flex gap-3 items-center opacity-60 mb-8">
        {/* <span
          className={cn("size-[10px] rounded-full")}
          style={{ background: column.color || "transparent" }}
        /> */}
        <h4 className="h4 text-cust-slate-300 ml-2">{`${column.name} (${tasks.length})`}</h4>
        <div {...provided.dragHandleProps} className="ml-auto">
          <Grip className="size-8 text-cust-slate-300/60 hover:text-cust-slate-300 ml-auto" />
        </div>
      </div>
      <Droppable
        droppableId={column.id}
        type={DROPPABLE_TYPE.TASKS}
        key={column.id}
      >
        {(provided, snapshot) => (
          <div
            className={cn(
              "h-full rounded-md",
              snapshot.isDraggingOver && "bg-cust-prim-light/30"
            )}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length ? (
              tasks.map((t) => (
                <Draggable draggableId={t.id} index={t.index} key={t.id}>
                  {(provided, snapshot) => (
                    <Task task={t} provided={provided} snapshot={snapshot} />
                  )}
                </Draggable>
              ))
            ) : (
              <div className="mt-10 mx-auto">
                <p className="p2 text-center text-cust-slate-300">No Tasks</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
