import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/core";
import { EllipsisVertical } from "lucide-react";
import { useEditBoardModal } from "../modals/edit-board-modal";
import { useDeleteBoardModal } from "../modals/delete-board-modal";

export default function BoardActions () {
  const { setShowEditBoardModal, EditBoardModal } = useEditBoardModal();
  const { setShowDeleteBoardModal, DeleteBoardModal } = useDeleteBoardModal();

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
              onClick={() => setShowEditBoardModal(true)}
            >
              Edit Board
            </button>
            <button
              className="text-center p-4 py-2 w-full hover:bg-cust-slate-200 transition-colors rounded-md p1 "
              onClick={() => setShowDeleteBoardModal(true)}
            >
              <p className="p1 text-cust-destructive">Delete Board</p>
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <EditBoardModal />
      <DeleteBoardModal />
    </>
  );
};