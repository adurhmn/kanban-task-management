import { memo, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useBoardStore, useColumnStore } from "@/store";
import { addTaskAction } from "@/actions/kanban/tasks";
import getRandId from "@/libs/utils/getRandId";
import {
  Button,
  DialogHeader,
  DialogTitle,
  Input,
  Modal,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core";
import { Plus } from "lucide-react";
import cn from "@/libs/utils/cn";
import IconCross from "@/assets/icons/cross";
import { IModalProps } from "@/libs/types";

const AddTaskModal = memo(
  ({ showModal, setShowModal, onClose }: Omit<IModalProps, "children">) => {
    const { activeBoard } = useBoardStore();
    const { columns } = useColumnStore();

    const {
      register,
      unregister,
      formState: { errors },
      handleSubmit,
      reset: resetForm,
      control,
    } = useForm();

    const [subtasks, setSubtasks] = useState([`subtask-${getRandId()}`]);

    const reset = useCallback(() => {
      setSubtasks([`subtask-${getRandId()}`]);
      resetForm();
    }, []);

    const handleCreate = useCallback(
      ({ title, desc, colId, ...subtasks }: any) => {
        addTaskAction({
          title,
          desc,
          colId,
          subtasks: Object.values(subtasks),
        }).then(() => {
          reset();
          setShowModal(false);
        });
      },
      []
    );

    return (
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        onClose={onClose}
      >
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleCreate)}
          className="flex flex-col gap-5"
        >
          <div>
            <h4 className="p2 text-cust-slate-300 mb-2">Title</h4>
            <Input
              placeholder="e.g: Build Rocket"
              {...register("title", { required: "Title requied" })}
              errMsg={errors["title"]?.message as string}
            />
          </div>
          <div>
            <h4 className="p2 text-cust-slate-300 mb-2">Description</h4>
            <Input
              autoFocus
              placeholder="e.g: Build a rocket that can fly to other galaxies and make contact with aliens."
              {...register("desc", { required: "Description requied" })}
              errMsg={errors["desc"]?.message as string}
            />
          </div>
          <div>
            <h4 className="p2 text-cust-slate-300 mb-2">{`Sub Tasks (${subtasks.length})`}</h4>
            <div className="flex flex-col gap-3">
              {subtasks.map((id) => (
                <div className="flex gap-3 items-center" key={id}>
                  <Input
                    placeholder="e.g: Learn rocket science, call Elon Musk for help"
                    {...register(id, { required: "Requied" })}
                    errMsg={errors[id]?.message as string}
                  />
                  <button
                    className="mx-2 disabled:opacity-50"
                    onClick={() =>
                      setSubtasks((prev) => {
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
                onClick={() =>
                  setSubtasks((prev) => [...prev, `subtask-${getRandId()}`])
                }
              >
                <Plus className="text-cust-prim" size={16} />
                <p className={"p1 whitespace-nowrap text-cust-prim"}>
                  Add New Subtask
                </p>
              </Button>
            </div>
          </div>
          <div>
            <h4 className="p2 text-cust-slate-300 mb-2">Column</h4>
            <Controller
              rules={{ required: "Column Requied" }}
              control={control}
              name="colId"
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Select
                  value={value}
                  onValueChange={(v) => onChange({ target: { value: v } })}
                >
                  <SelectTrigger
                    onBlur={onBlur}
                    className={cn(
                      "w-full",
                      error?.message ? "border-red-500" : ""
                    )}
                  >
                    <SelectValue ref={ref} />
                  </SelectTrigger>
                  <p className="p1 text-red-500 ml-2">{error?.message}</p>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {columns?.[activeBoard].map((c) => (
                        <SelectItem value={c.id} key={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            <p className="p1">Create Task</p>
          </Button>
        </form>
      </Modal>
    );
  }
);

export default AddTaskModal;
