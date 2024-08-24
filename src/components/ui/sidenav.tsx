import IconBoard from "@/assets/icons/board";
import { Plus } from "lucide-react";
import cn from "@/libs/utils/cn";
import IconLightTheme from "@/assets/icons/light-theme";
import IconDarkTheme from "@/assets/icons/dark-theme";

function ThemeToggle() {
  return (
    <div className="w-[100px] rounded-sm px-5 py-3 bg-cust-slate-100 flex gap-3 items-center justify-center">
      <IconLightTheme />
      <IconDarkTheme />
    </div>
  );
}

function CreateBtn() {
  return (
    <div
      className={cn(
        "w-full min-w-[200px] py-4 px-6 flex items-center gap-3 cursor-pointer hover:bg-cust-slate-100"
      )}
    >
      <Plus className="text-cust-prim" size={16} />
      <p className={"h3 whitespace-nowrap text-cust-prim"}>Create New Board</p>
    </div>
  );
}

function NavItem({ name, isActive }: { name: string; isActive?: boolean }) {
  return (
    <li className="w-full">
      <div
        className={cn(
          "min-w-[200px] w-[85%] py-4 px-6 flex items-center gap-3 rounded-tr-full rounded-br-full cursor-pointer hover:bg-cust-slate-100",
          { "bg-cust-prim hover:bg-cust-prim": isActive }
        )}
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
      </div>
    </li>
  );
}
export default function SideNav() {
  return (
    <div className="w-[300px] border-cust-slate-200 border-r">
      <h4 className="h4 text-md my-6 text-cust-slate-300 px-6">
        ALL BOARDS (3)
      </h4>
      <div className="h-[700px] max-h-[700px] flex flex-col">
        <ul className="list-none flex flex-col gap-2 overflow-y-auto">
          <NavItem name="Platform Launch" />
          <NavItem name="Marketing Plan" isActive={true} />
          <NavItem name="Roadmap" />
        </ul>
        <CreateBtn />
      </div>
      <div className="mt-auto flex items-center justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
