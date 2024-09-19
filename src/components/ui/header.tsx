// import imgLogoDark from "@/assets/logo-dark.svg";
// import imgLogoLight from "@/assets/logo-light.svg";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/core";
import { useBoardStore, useColumnStore } from "@/store";
import { EllipsisVertical, Plus } from "lucide-react";
import { useMemo } from "react";
import { useEditBoardModal } from "./modals/edit-board-modal";
import { useDeleteBoardModal } from "./modals/delete-board-modal";
import { useAddTaskModal } from "./modals/add-task-modal";
import IconLogo from "@/assets/icons/logo";

const BoardActions = ({
  activateEditMode,
  activateDeleteMode,
}: {
  activateEditMode: () => void;
  activateDeleteMode: () => void;
}) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <EllipsisVertical className="cursor-pointer ml-2 text-cust-slate-1000" />
        </PopoverTrigger>
        <PopoverContent className="w-32 p-0 border-none">
          <div className="grid bg-cust-slate-100 rounded-md">
            <button
              className="text-center p-4 py-2 w-full hover:bg-cust-slate-200 transition-colors rounded-md p1 text-cust-slate-1000"
              onClick={activateEditMode}
            >
              Edit Board
            </button>
            <button
              className="text-center p-4 py-2 w-full hover:bg-cust-slate-200 transition-colors rounded-md p1 "
              onClick={activateDeleteMode}
            >
              <p className="p1 text-cust-destructive">Delete Board</p>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default function Header() {
  const { setShowEditBoardModal, EditBoardModal } = useEditBoardModal();
  const { setShowDeleteBoardModal, DeleteBoardModal } = useDeleteBoardModal();
  const { setShowAddTaskModal, AddTaskModal } = useAddTaskModal();
  const { activeBoard, boards } = useBoardStore();
  const { columns } = useColumnStore();
  const board = useMemo(
    () => boards?.find((b) => b.id === activeBoard),
    [activeBoard, boards]
  );

  return (
    <div className="flex items-center h-[80px] bg-cust-slate-0">
      <div className="w-[300px] h-full flex items-center justify-center border-cust-slate-200 border-b border-r flex-shrink-0">
        <IconLogo pathClassName="fill-cust-slate-1000" />
      </div>
      <div className="border-b border-cust-slate-200 flex items-center flex-grow h-full py-4 px-7">
        <h1 className="h1 mr-auto text-cust-slate-1000">{board?.name}</h1>
        <Button
          onClick={() => setShowAddTaskModal(true)}
          disabled={!columns?.[activeBoard]?.length}
        >
          <Plus className="mr-2" />
          <p>Add new task</p>
        </Button>
        <BoardActions
          activateEditMode={() => {
            setShowEditBoardModal(true);
          }}
          activateDeleteMode={() => {
            setShowDeleteBoardModal(true);
          }}
        />
      </div>
      <EditBoardModal />
      <DeleteBoardModal />
      <AddTaskModal />
    </div>
  );
}
