import IconBoard from "@/assets/icons/board";
import { Plus } from "lucide-react";
import cn from "@/libs/utils/cn";
import IconLightTheme from "@/assets/icons/light-theme";
import IconDarkTheme from "@/assets/icons/dark-theme";
import { useBoards } from "@/libs/hooks/kanban";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/components/core";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import getRandId from "@/libs/utils/getRandId";
import IconCross from "@/assets/icons/cross";

function ThemeToggle() {
  return (
    <div className="w-[100px] rounded-sm px-5 py-3 bg-cust-slate-100 flex gap-3 items-center justify-center">
      <IconLightTheme />
      <IconDarkTheme />
    </div>
  );
}

const CreateBtn = memo(() => {
  const {
    register,
    unregister,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [cols, setCols] = useState([`col-${getRandId()}`]);

  const handleCreate = (data: any) => {
    console.log({ data });
  };

  console.log({ errors });

  return (
    <Dialog>
      <DialogTrigger>
        <button
          className={cn(
            "w-full min-w-[200px] py-4 px-6 flex items-center gap-3 cursor-pointer hover:bg-cust-slate-100"
          )}
        >
          <Plus className="text-cust-prim" size={16} />
          <p className={"h3 whitespace-nowrap text-cust-prim"}>
            Create New Board
          </p>
        </button>
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
                    <IconCross />
                  </button>
                </div>
              ))}
              <Button
                variant={"secondary"}
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

function NavItem({
  name,
  onClick,
  isActive,
}: {
  name: string;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <li className="w-full">
      <button
        className={cn(
          "min-w-[200px] w-[85%] py-4 px-6 flex items-center gap-3 rounded-tr-full rounded-br-full cursor-pointer hover:bg-cust-slate-100",
          { "bg-cust-prim hover:bg-cust-prim": isActive }
        )}
        onClick={onClick}
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
}
export default function SideNav() {
  const { boards, activeBoard, setActiveBoard, isLoading, addBoard } =
    useBoards();

  return (
    <div className="w-[300px] border-cust-slate-200 border-r">
      <h4 className="h4 text-md my-6 text-cust-slate-300 px-6">
        {`ALL BOARDS (${boards ? boards.length : null})`}
      </h4>
      <div className="h-[700px] max-h-[700px] flex flex-col">
        {isLoading ? (
          "Boards Loading"
        ) : (
          <>
            <ul className="list-none flex flex-col gap-2 overflow-y-auto">
              {boards!.length === 0 && (
                <p className="p2 text-cust-slate-300 p-3 text-center">
                  No Boards Created
                </p>
              )}
              {boards!.map((b) => (
                <NavItem
                  name={b.name}
                  key={b.id}
                  isActive={activeBoard === b.id}
                  onClick={() => setActiveBoard(b.id)}
                />
              ))}
            </ul>
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
