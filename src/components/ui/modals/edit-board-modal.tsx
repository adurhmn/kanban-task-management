import { editBoardAction } from "@/actions/kanban/boards";
import IconCross from "@/assets/icons/cross";
import {
  Button,
  DialogHeader,
  DialogTitle,
  Input,
  Modal,
} from "@/components/core";
import { MODAL_CLOSE_ANIM_TIME } from "@/libs/constants";
import { IModalProps } from "@/libs/types";
import getRandId from "@/libs/utils/getRandId";
import { useBoardStore, useColumnStore } from "@/store";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const M = ({
  showModal,
  setShowModal,
  onClose,
}: Omit<IModalProps, "children">) => {
  const { boards: allBoards, activeBoard } = useBoardStore();
  const board = allBoards?.find((b) => b.id === activeBoard);
  const { columns: allColumns } = useColumnStore();
  const oldCols = allColumns![activeBoard] || [];
  const [cols, setCols] = useState(oldCols.map(({ id }) => id));

  const {
    register,
    unregister,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string; [key: string]: string }>({
    defaultValues: {
      name: board!.name,
      ...oldCols.reduce((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {} as any),
    },
  });


  const handleCreate = (formData: any) =>
    editBoardAction({ board: board!, oldColumns: oldCols, formData }).then(
      () => {
        setShowModal(false);
      }
    );

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Edit Board</DialogTitle>
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
            {...register("name", { required: "Board name requied" })}
            errMsg={errors["name"]?.message as string}
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

export default function EditBoardModal(props: Omit<IModalProps, "children">) {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (props.showModal) setMount(true);
    else setTimeout(() => setMount(false), MODAL_CLOSE_ANIM_TIME);
  }, [props.showModal]);

  return mount ? <M {...props} /> : null;
}
