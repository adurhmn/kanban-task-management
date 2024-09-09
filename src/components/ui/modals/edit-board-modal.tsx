import { editBoardAction } from "@/actions/kanban/boards";
import IconCross from "@/assets/icons/cross";
import { Button, Input, Modal } from "@/components/core";
import { IModalProps } from "@/libs/types";
import getRandId from "@/libs/utils/getRandId";
import { useBoardStore, useColumnStore } from "@/store";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const EditBoardModal = ({
  boardId,
  showModal,
  setShowModal,
  onClose,
}: { boardId: string } & Omit<IModalProps, "children">) => {
  const { boards: allBoards } = useBoardStore();
  const board = allBoards?.find((b) => b.id === boardId);
  const { columns: allColumns } = useColumnStore();
  const oldCols = allColumns?.[boardId] || [];

  const {
    register,
    unregister,
    formState: { errors },
    handleSubmit,
    // reset: resetForm,
  } = useForm<{ name: string; [key: string]: string }>({
    defaultValues: {
      name: board?.name,
      ...oldCols.reduce((acc, st) => {
        acc[st.id] = st.name;
        return acc;
      }, {} as { [id: string]: string }),
    },
  });

  const [cols, setCols] = useState(
    oldCols.length ? oldCols.map((c) => c.id) : [`col-${getRandId()}`]
  );

  const handleCreate = useCallback((formData: any) => {
    console.log({ formData });
    editBoardAction({ board: board!, oldColumns: oldCols, formData });
    setShowModal(false);
  }, []);

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} onClose={onClose}>
      <form
        onSubmit={handleSubmit(handleCreate)}
        className="flex flex-col gap-5"
      >
        <div>
          <h4 className="p2 text-cust-slate-300 mb-2">Board Name</h4>
          <Input
            placeholder="e.g: Web Design"
            {...register("name", { required: "Board name requied" })}
            errMsg={errors["name"]?.message as string}
          />
        </div>
        <div>
          <h4 className="p2 text-cust-slate-300 mb-2">{`Board Columns (${cols.length})`}</h4>
          <div className="flex flex-col gap-3">
            {cols.map((id, idx) => (
              <div className="flex gap-3 items-center" key={id}>
                <Input
                  autoFocus={idx === cols.length - 1}
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
                  <IconCross />
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
        <div className="flex gap-3">
          <Button
            variant={"secondary"}
            type="button"
            className="w-full flex-shrink flex gap-2 items-center"
            onClick={() => setShowModal(false)}
          >
            <p className={"p1 whitespace-nowrap text-cust-prim"}>Cancel</p>
          </Button>
          <Button type="submit" className="w-full flex-shrink">
            <p className="p1">Save Changes</p>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const useEditBoardModal = () => {
  const { activeBoard } = useBoardStore();
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);

  const EditBoardModalCallback = useCallback(() => {
    return (
      <EditBoardModal
        boardId={activeBoard}
        showModal={!!activeBoard && showEditBoardModal}
        setShowModal={setShowEditBoardModal}
      />
    );
  }, [activeBoard, showEditBoardModal]);

  return useMemo(
    () => ({
      setShowEditBoardModal,
      EditBoardModal: EditBoardModalCallback,
    }),
    [EditBoardModalCallback]
  );
};

export { EditBoardModal, useEditBoardModal };
