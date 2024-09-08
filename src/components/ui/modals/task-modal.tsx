import { useTaskStore } from "@/store";
import {
  Button,
  Input,
  Modal,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { EllipsisVertical, Plus } from "lucide-react";
import { useSubtasks, useSubtasksSync } from "@/libs/hooks/kanban/subtasks";
import Subtask from "@/components/ui/subtask";
import { putSubtasks } from "@/actions/kanban/subtasks";
import { Controller, useForm } from "react-hook-form";
import getRandId from "@/libs/utils/getRandId";
import IconCross from "@/assets/icons/cross";
import { Subtask as ISubtask, Task, TaskStatus } from "@/libs/types";
import cn from "@/libs/utils/cn";
import { deleteTask, editTask } from "@/actions/kanban/tasks";

const TaskActions = ({
  onDelete,
  activateEditMode,
}: {
  onDelete: () => void;
  activateEditMode: () => void;
}) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <EllipsisVertical className="cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="w-32 p-0 border-none">
          <div className="grid bg-white rounded-md">
            <button
              className="text-center p-4 py-2 w-full hover:bg-slate-100 transition-colors rounded-md p1"
              onClick={activateEditMode}
            >
              Edit Task
            </button>
            <button
              className="text-center p-4 py-2 w-full hover:bg-red-100 transition-colors rounded-md p1 text-cust-destructive"
              onClick={onDelete}
            >
              Delete Task
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

enum ModalModes {
  VIEW,
  EDIT,
  DELETE,
}

const ViewTaskContent = ({
  task,
  subtasks,
  activateEditMode,
  onDelete,
}: {
  task: Task;
  subtasks: ISubtask[];
  activateEditMode: () => void;
  onDelete: () => void;
}) => {
  return task ? (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2 mt-2">
        <h2 className="h2 w-[80%]">{task.title}</h2>
        <TaskActions activateEditMode={activateEditMode} onDelete={onDelete} />
      </div>
      <p className="p1 text-cust-slate-300">{task.desc}</p>
      <div className="flex flex-col gap-3">
        {subtasks.map((st) => (
          <Subtask
            key={st.id}
            checked={st.isComplete}
            onCheckedChange={(checked) => {
              putSubtasks([{ ...st, isComplete: checked }], task.id);
            }}
            task={st.desc}
          />
        ))}
      </div>
    </div>
  ) : null;
};

const EditTaskContent = ({
  task,
  subtasks: oldSubtasks,
  activateViewMode,
}: {
  task: Task;
  subtasks: ISubtask[];
  activateViewMode: () => void;
}) => {
  const {
    register,
    unregister,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<{ title: string; desc: string; [key: string]: string }>({
    defaultValues: {
      title: task.title,
      desc: task.desc,
      status: task.status,
      ...oldSubtasks.reduce((acc, st) => {
        acc[st.id] = st.desc;
        return acc;
      }, {} as { [id: string]: string }),
    },
  });

  const [subtasks, setSubtasks] = useState<string[]>(
    !oldSubtasks.length
      ? [`subtask-${getRandId()}`]
      : oldSubtasks.map((st) => st.id)
  );

  const handleUpdate = useCallback((formData: any) => {
    editTask({ task, oldSubtasks, formData });
    activateViewMode();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mt-2">
        <h2 className="h2 w-[80%]">Edit Task</h2>
      </div>
      <form
        onSubmit={handleSubmit(handleUpdate)}
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
                  autoFocus={idx === subtasks.length - 1}
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
          <h4 className="p2 text-cust-slate-300 mb-2">Status</h4>
          <Controller
            rules={{ required: "Status Requied" }}
            control={control}
            name="status"
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
                    <SelectItem value={TaskStatus.HOLD} key={TaskStatus.HOLD}>
                      Hold
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.ON_PROGRESS}
                      key={TaskStatus.ON_PROGRESS}
                    >
                      On Progress
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.COMPLETED}
                      key={TaskStatus.COMPLETED}
                    >
                      Completed
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant={"secondary"}
            type="button"
            className="w-full flex-shrink flex gap-2 items-center"
            onClick={activateViewMode}
          >
            <p className={"p1 whitespace-nowrap text-cust-prim"}>Cancel</p>
          </Button>
          <Button type="submit" className="w-full flex-shrink">
            <p className="p1">Save Changes</p>
          </Button>
        </div>
      </form>
    </div>
  );
};

const DeleteTaskContent = ({
  task,
  activateViewMode,
  onDelete,
}: {
  task: Task;
  activateViewMode: () => void;
  onDelete: () => void;
}) => {
  const handleDelete = () => {
    deleteTask(task.id, task.columnId);
    onDelete();
  };

  return task ? (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2 mt-2">
        <h2 className="h2 w-[80%] text-cust-destructive">{task.title}</h2>
      </div>
      <p className="p1 text-cust-slate-300">
        Are you sure you want to delete this task and its subtasks? This action
        cannot be reversed.
      </p>
      <div className="flex gap-3">
        <Button
          variant={"secondary"}
          type="button"
          className="w-full flex-shrink flex gap-2 items-center"
          onClick={activateViewMode}
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
  ) : null;
};

// uncontrolled
const TaskModal = () => {
  const [showModal, setShowModal] = useState(false);
  const { activeTask, setActiveTask, tasks } = useTaskStore();
  const [mode, setMode] = useState<ModalModes>(ModalModes.VIEW);

  const task = useMemo(
    () =>
      tasks && activeTask
        ? tasks[activeTask.colId].find(({ id }) => id === activeTask.taskId)
        : undefined,
    [tasks, activeTask]
);

  useSubtasksSync(task?.id || "");
  const subtasks = useSubtasks(task?.id || "");

  // this is not for closing modal,  but to handle sideeffects on modal close
  const onClose = () => {
    // maintaining open state independently to fix data disappear issue while closing modal
    setTimeout(() => {
      setActiveTask(null);
      setMode(ModalModes.VIEW);
    }, 300);
  };

  useEffect(() => {
    if (activeTask) setShowModal(true);
  }, [activeTask, setShowModal]);

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} onClose={onClose}>
      {mode === ModalModes.VIEW && task && (
        <ViewTaskContent
          task={task}
          subtasks={subtasks}
          activateEditMode={() => setMode(ModalModes.EDIT)}
          onDelete={() => setMode(ModalModes.DELETE)}
        />
      )}
      {mode === ModalModes.EDIT && task && (
        <EditTaskContent
          task={task}
          subtasks={subtasks}
          activateViewMode={() => setMode(ModalModes.VIEW)}
        />
      )}
      {mode === ModalModes.DELETE && task && (
        <DeleteTaskContent
          task={task}
          activateViewMode={() => setMode(ModalModes.VIEW)}
          onDelete={() => {
            setShowModal(false);
            onClose();
          }}
        />
      )}
    </Modal>
  );
};

export { TaskModal };
