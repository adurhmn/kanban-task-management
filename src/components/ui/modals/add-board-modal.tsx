import { addBoardAction } from "@/actions/kanban/boards";
import IconCross from "@/assets/icons/cross";
import {
  Button,
  DialogHeader,
  DialogTitle,
  Input,
  Modal,
} from "@/components/core";
import { IModalProps } from "@/libs/types";
import getRandId from "@/libs/utils/getRandId";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AddBoardModal = ({
  showModal,
  setShowModal,
  onClose,
}: Omit<IModalProps, "children">) => {
  const {
    register,
    unregister,
    formState: { errors },
    handleSubmit,
    reset: resetForm,
  } = useForm();

  const [cols, setCols] = useState([`col-${getRandId()}`]);

  const reset = useCallback(() => {
    setCols([`col-${getRandId()}`]);
    resetForm();
  }, []);

  const handleCreate = useCallback(({ boardName, ...colNames }: any) => {
    addBoardAction(boardName, Object.values(colNames)).then(() => {
      reset();
      setShowModal(false);
    });
  }, []);

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Add New Board</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(handleCreate)}
        className="flex flex-col gap-5"
      >
        <div>
          <h4 className="p2 text-cust-slate-300 mb-2">Board Name</h4>
          <Input
            autoFocus
            placeholder="e.g: Web Design"
            {...register("boardName", { required: "Board name requied" })}
            errMsg={errors["boardName"]?.message as string}
          />
        </div>
        <div>
          <h4 className="p2 text-cust-slate-300 mb-2">{`Board Columns (${cols.length})`}</h4>
          <div className="flex flex-col gap-3">
            {cols.map((id) => (
              <div className="flex gap-3 items-center" key={id}>
                <Input
                  placeholder="e.g: Pending / Current / Completed"
                  {...register(id, { required: "Column name requied" })}
                  errMsg={errors[id]?.message as string}
                />
                <button
                  disabled={cols.length === 1}
                  className="mx-2 disabled:opacity-50"
                  onClick={() =>
                    setCols((prev) => {
                      unregister(id);
                      return prev.filter((_id) => _id !== id);
                    })
                  }
                >
                  <IconCross className="hover:fill-red-500" />
                </button>
              </div>
            ))}
            <Button
              variant={"secondary"}
              type="button"
              className="w-full flex gap-2 items-center"
              onClick={() => setCols((prev) => [...prev, `col-${getRandId()}`])}
            >
              <Plus className="text-cust-prim" size={16} />
              <p className={"p1 whitespace-nowrap text-cust-prim"}>
                Add New Column
              </p>
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          <p className="p1">Add New Board</p>
        </Button>
      </form>
    </Modal>
  );
};

const useAddBoardModal = () => {
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);

  const AddBoardModalCallback = useCallback(() => {
    return (
      <AddBoardModal
        showModal={showAddBoardModal}
        setShowModal={setShowAddBoardModal}
      />
    );
  }, [showAddBoardModal]);

  return useMemo(
    () => ({
      setShowAddBoardModal,
      AddBoardModal: AddBoardModalCallback,
    }),
    [AddBoardModalCallback]
  );
};

export { AddBoardModal, useAddBoardModal };