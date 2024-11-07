import { deleteBoardAction } from "@/actions/kanban/boards";
import { Button, Modal } from "@/components/core";
import { Board } from "@/libs/types";
import { useBoardStore } from "@/store";
import React, { useState, useCallback, useMemo } from "react";

interface DeleteBoardModalProps {
  board?: Board;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleDelete: () => void;
}

const DeleteBoardModal: React.FC<DeleteBoardModalProps> = ({
  board,
  showModal,
  setShowModal,
  handleDelete,
}) => {
  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2 mt-2">
          <h2 className="h2 w-[80%] text-cust-destructive">
            Delete {board?.name}?
          </h2>
        </div>
        <p className="p1 text-cust-slate-300">
          Are you sure you want to delete this board and all of its tasks? This
          action cannot be reversed.
        </p>
        <div className="flex gap-3">
          <Button
            variant={"secondary"}
            type="button"
            className="w-full flex-shrink flex gap-2 items-center"
            onClick={() => setShowModal(false)}
          >
            <p className={"p1 whitespace-nowrap text-cust-prim"}>Cancel</p>
          </Button>
          <Button
            type="submit"
            className="w-full flex-shrink"
            variant={"destructive"}
            onClick={handleDelete}
          >
            <p className="p1">Delete</p>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const useDeleteBoardModal = () => {
  const { activeBoard, boards } = useBoardStore();
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);

  const DeleteBoardModalCallback = useCallback(() => {
    const board = boards?.find((b) => b.id === activeBoard);
    return (
      <DeleteBoardModal
        board={board}
        showModal={!!activeBoard && !!board && showDeleteBoardModal}
        setShowModal={setShowDeleteBoardModal}
        handleDelete={() => {
          setShowDeleteBoardModal(false);
          deleteBoardAction(activeBoard);
        }}
      />
    );
  }, [activeBoard, showDeleteBoardModal, boards]);

  return useMemo(
    () => ({
      setShowDeleteBoardModal,
      DeleteBoardModal: DeleteBoardModalCallback,
    }),
    [DeleteBoardModalCallback]
  );
};

export { DeleteBoardModal, useDeleteBoardModal };
