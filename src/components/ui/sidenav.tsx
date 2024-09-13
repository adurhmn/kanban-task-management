import IconBoard from "@/assets/icons/board";
import { Plus } from "lucide-react";
import cn from "@/libs/utils/cn";
import IconLightTheme from "@/assets/icons/light-theme";
import IconDarkTheme from "@/assets/icons/dark-theme";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/components/core";
import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import getRandId from "@/libs/utils/getRandId";
import IconCross from "@/assets/icons/cross";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
} from "@hello-pangea/dnd";
import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import { useBoardStore } from "@/store";
import { addBoardAction, setActiveBoardAction } from "@/actions/kanban/boards";

function ThemeToggle() {
  return (
    <div className="w-[100px] rounded-sm px-5 py-3 bg-cust-slate-100 flex gap-3 items-center justify-center">
      <IconLightTheme />
      <IconDarkTheme />
    </div>
  );
}

const CreateBtn = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
    });
  }, []);

  return (
    <Dialog
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
      <DialogTrigger>
        <div
          className={cn(
            "w-full min-w-[200px] py-4 px-6 flex items-center gap-3 cursor-pointer hover:bg-cust-slate-100"
          )}
        >
          <Plus className="text-cust-prim" size={16} />
          <p className={"h3 whitespace-nowrap text-cust-prim"}>
            Create New Board
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
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
              {cols.map((id, idx) => (
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
                    <IconCross className="hover:fill-red-500"/>
                  </button>
                </div>
              ))}
              <Button
                variant={"secondary"}
                type="button"
                className="w-full flex gap-2 items-center"
                onClick={() =>
                  setCols((prev) => [...prev, `col-${getRandId()}`])
                }
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
      </DialogContent>
    </Dialog>
  );
});

const NavItem = ({
  name,
  onClick,
  isActive,
  provided,
  snapshot,
}: {
  name: string;
  onClick: () => void;
  isActive?: boolean;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}) => {
  return (
    <li
      ref={provided.innerRef}
      className="w-ful mt-2"
      {...provided.draggableProps}
    >
      <button
        className={cn(
          "min-w-[200px] w-[85%] py-4 px-6 flex items-center gap-3 rounded-tr-full rounded-br-full cursor-pointer hover:bg-cust-slate-100",
          { "bg-cust-prim hover:bg-cust-prim": isActive },
          { "bg-cust-slate-100": snapshot.isDragging }
        )}
        onClick={onClick}
        {...provided.dragHandleProps}
      >
        <IconBoard
          pathClassName={isActive ? "fill-white" : "fill-cust-slate-300"}
        />
        <p
          className={cn("h3 whitespace-nowrap transition-colors", {
            "text-cust-slate-300": !isActive,
            "text-white": isActive,
          })}
        >
          {name}
        </p>
      </button>
    </li>
  );
};

export default function SideNav() {
  const { boards, activeBoard } = useBoardStore();

  return (
    <div className="min-w-[300px] border-cust-slate-200 border-r">
      <h4 className="h4 text-md my-6 text-cust-slate-300 px-6">
        {`ALL BOARDS (${boards ? boards.length : "?"})`}
      </h4>
      <div className="h-[700px] max-h-[700px] flex flex-col">
        {boards === null ? (
          "Boards Loading"
        ) : (
          <>
            <Droppable
              droppableId="sidenav-boards"
              type={DROPPABLE_TYPE.BOARDS}
            >
              {(provided, snapshot) => (
                <ul
                  ref={provided.innerRef}
                  className={cn(
                    "list-none flex flex-col overflow-y-auto" // dont use gap because of dnd limitations, used margin on child
                    // snapshot.isDraggingOver && "bg-cust-prim/20"
                  )}
                  {...provided.droppableProps}
                >
                  {boards!.length === 0 && (
                    <p className="p2 text-cust-slate-300 p-3 text-center">
                      No Boards Created
                    </p>
                  )}
                  {boards!.map((b, idx) => (
                    <Draggable
                      key={b.id}
                      draggableId={b.id}
                      index={idx}
                      disableInteractiveElementBlocking
                    >
                      {(provided, snapshot) => (
                        <NavItem
                          name={b.name}
                          key={b.id}
                          isActive={activeBoard === b.id}
                          onClick={() => {
                            setActiveBoardAction(b.id);
                          }}
                          provided={provided}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            <CreateBtn />
          </>
        )}
      </div>
      <div className="mt-auto flex items-center justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
