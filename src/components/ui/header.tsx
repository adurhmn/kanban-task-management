import { addTaskAction } from "@/actions/kanban/tasks";
import IconCross from "@/assets/icons/cross";
import imgLogoDark from "@/assets/logo-dark.svg";
import {
  Button,
  DialogHeader,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core";
import cn from "@/libs/utils/cn";
import getRandId from "@/libs/utils/getRandId";
import { useBoardStore, useColumnStore } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/core";
import { EllipsisVertical, Plus } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useEditBoardModal } from "./modals/edit-board-modal";
import { useDeleteBoardModal } from "./modals/delete-board-modal";

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
          <EllipsisVertical className="cursor-pointer ml-2" />
        </PopoverTrigger>
        <PopoverContent className="w-32 p-0 border-none">
          <div className="grid bg-white rounded-md">
            <button
              className="text-center p-4 py-2 w-full hover:bg-slate-100 transition-colors rounded-md p1"
              onClick={activateEditMode}
            >
              Edit Board
            </button>
            <button
              className="text-center p-4 py-2 w-full hover:bg-red-100 transition-colors rounded-md p1 text-cust-destructive"
              onClick={activateDeleteMode}
            >
              Delete Board
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

const AddTaskButton = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
      });
    },
    []
  );

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          if (!isOpen) setIsOpen(true);
        } else {
          if (isOpen) setIsOpen(false);
          setTimeout(reset, 200);
        }
      }}
    >
      <DialogTrigger disabled={!columns?.[activeBoard]?.length}>
        <Button disabled={!columns?.[activeBoard]?.length} asChild>
          <div>
            <Plus className="mr-2" />
            <p>Add new task</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
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
              {subtasks.map((id, idx) => (
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
                    <IconCross />
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
                    <SelectValue placeholder="Column" ref={ref} />
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
      </DialogContent>
    </Dialog>
  );
});

export default function Header() {
  const { setShowEditBoardModal, EditBoardModal } = useEditBoardModal();
  const { setShowDeleteBoardModal, DeleteBoardModal } = useDeleteBoardModal();
  const { activeBoard, boards } = useBoardStore();
  const board = useMemo(
    () => boards?.find((b) => b.id === activeBoard),
    [activeBoard, boards]
  );

  return (
    <div className="flex items-center h-[80px]">
      <div className="w-[300px] h-full flex items-center justify-center border-cust-slate-200 border-b border-r flex-shrink-0">
        <img src={imgLogoDark} />
      </div>
      <div className="border-b border-cust-slate-200 flex items-center flex-grow h-full py-4 px-7">
        <h1 className="h1 mr-auto">{board?.name}</h1>
        <AddTaskButton />
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
    </div>
  );
}
