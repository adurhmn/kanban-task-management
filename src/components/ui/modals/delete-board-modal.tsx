import { Button, Modal } from "@/components/core";
import { Board } from "@/libs/types";
import React from "react";

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

export default DeleteBoardModal;
