import { Button, DialogHeader, Input } from "../core";
import { Grip, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import cn from "@/libs/utils/cn";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Column } from "@/libs/types";
import { useBoardStore, useColumnStore } from "@/store";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { DROPPABLE_TYPE } from "@/libs/constants/dnd";

// const AddNewColumnModal = ({
//   open,
//   onClose,
//   addColumn,
// }: {
//   open: boolean;
//   onClose: () => void;
//   addColumn: (data: { name: string; color?: string }) => void;
// }) => {
//   const {
//     register,
//     unregister,
//     formState: { errors },
//     handleSubmit,
//     reset: resetForm,
//   } = useForm();

//   const handleCreate = useCallback(({ name, color }: any) => {
//     addColumn({ name, color });
//     resetForm();
//     onClose();
//   }, []);

//   console.log({ errors });

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(state) => {
//         if (!state) {
//           resetForm();
//           onClose();
//         }
//       }}
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add New Column</DialogTitle>
//         </DialogHeader>
//         <form
//           onSubmit={handleSubmit(handleCreate)}
//           className="flex flex-col gap-5"
//         >
//           <div>
//             <h4 className="p2 text-cust-slate-300 mb-2">Board Name</h4>
//             <Input
//               disabled
//               placeholder="e.g: Web Design"
//               {...register("boardName", { required: "Board name requied" })}
//               errMsg={errors["boardName"]?.message as string}
//             />
//           </div>
//           <div>
//             <h4 className="p2 text-cust-slate-300 mb-2">{`Board Columns (${cols.length})`}</h4>
//             <div className="flex flex-col gap-3">
//               {cols.map((id, idx) => (
//                 <div className="flex gap-3 items-center" key={id}>
//                   <Input
//                     autoFocus={idx === cols.length - 1}
//                     placeholder="e.g: Pending / Current / Completed"
//                     {...register(id, { required: "Column name requied" })}
//                     errMsg={errors[id]?.message as string}
//                   />
//                   <button
//                     disabled={cols.length === 1}
//                     className="mx-2 disabled:opacity-50"
//                     onClick={() =>
//                       setCols((prev) => {
//                         unregister(id);
//                         return prev.filter((_id) => _id !== id);
//                       })
//                     }
//                   >
//                     <IconCross />
//                   </button>
//                 </div>
//               ))}
//               <Button
//                 variant={"secondary"}
//                 type="button"
//                 className="w-full flex gap-2 items-center"
//                 onClick={() =>
//                   setCols((prev) => [...prev, `col-${getRandId()}`])
//                 }
//               >
//                 <Plus className="text-cust-prim" size={16} />
//                 <p className={"p1 whitespace-nowrap text-cust-prim"}>
//                   Add New Column
//                 </p>
//               </Button>
//             </div>
//           </div>
//           <Button type="submit" className="w-full">
//             <p className="p1">Add New Board</p>
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

const ColumnBox = ({
  column,
  provided,
  snapshot,
}: {
  column: Column;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}) => {
  return (
    <div
      className={cn("min-w-[300px] p-[10px] flex flex-col ml-8 rounded-lg", snapshot.isDragging && "bg-blue-100")}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="flex gap-3 items-center opacity-60">
        <span
          className={cn("size-[10px] rounded-full")}
          style={{ background: column.color || "transparent" }}
        />
        <h4 className="h4 text-cust-slate-300">{column.name}</h4>
        <div {...provided.dragHandleProps}>
          <Grip className="size-8 text-cust-slate-300/60 hover:text-cust-slate-300 ml-auto" />
        </div>
      </div>
      <div>tasks</div>
    </div>
  );
};

export default function Dashboard() {
  const { activeBoard } = useBoardStore();
  const { columns: allColumns } = useColumnStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = allColumns?.[activeBoard] || [];

  return (
    <>
      <div className="w-full flex-shrink h-full bg-cust-slate-100 flex items-center justify-center">
        {columns.length === 0 ? (
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
                      <ColumnBox
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
      </div>
      {/* <AddNewColumnModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addColumn={addColumn}
      /> */}
    </>
  );
}
