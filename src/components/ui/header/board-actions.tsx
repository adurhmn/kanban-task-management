import { Popover, PopoverContent, PopoverTrigger } from "@/components/core";
import { EllipsisVertical } from "lucide-react";
import DeleteBoardModal from "../modals/delete-board-modal";
import { useBoardStore } from "@/store";
import cn from "@/libs/utils/cn";
import { useState } from "react";
import EditBoardModal from "../modals/edit-board-modal";
import { deleteBoardAction } from "@/actions/kanban/boards";

export default function BoardActions() {
  const { activeBoard, boards } = useBoardStore();
  const board = boards?.find((b) => b.id === activeBoard);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild={!!activeBoard} disabled={!activeBoard}>
          <EllipsisVertical
            className={cn(
              "cursor-pointer ml-2",
              activeBoard
                ? "text-cust-slate-1000"
                : "text-cust-slate-300 cursor-not-allowed"
            )}
          />
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
      <EditBoardModal
        showModal={showEditBoardModal}
        setShowModal={setShowEditBoardModal}
        boardId={activeBoard}
      />
      <DeleteBoardModal
        board={board}
        showModal={!!activeBoard && !!board && showDeleteBoardModal}
        setShowModal={setShowDeleteBoardModal}
        handleDelete={() => {
          setShowDeleteBoardModal(false);
          deleteBoardAction(activeBoard);
        }}
      />
    </>
  );
}
