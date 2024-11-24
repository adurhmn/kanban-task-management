// import imgLogoDark from "@/assets/logo-dark.svg";
// import imgLogoLight from "@/assets/logo-light.svg";

import { useBoardStore, useColumnStore } from "@/store";
import { ChevronDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import AddTaskModal from "../modals/add-task-modal";
import { Button } from "@/components/core";
import BoardActions from "./board-actions";
import TopNav from "../topnav";
import IconLogoMobile from "@/assets/icons/logo-mobile";
import cn from "@/libs/utils/cn";

export default function HeaderDesktop() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const { activeBoard, boards } = useBoardStore();
  const { columns } = useColumnStore();
  const board = useMemo(
    () => boards?.find((b) => b.id === activeBoard),
    [activeBoard, boards]
  );
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex items-center min-h-[80px] bg-cust-slate-0 relative border-b border-cust-slate-200">
      <IconLogoMobile className="ml-6" />
      <div className="flex items-center flex-grow h-full py-4 px-7">
        <button
          onClick={() => setIsNavOpen((prev) => !prev)}
          className="w-max flex items-center gap-1"
        >
          <h1
            className={cn(
              "h2 mr-auto text-cust-slate-1000 whitespace-nowrap overflow-hidden text-ellipsis",
              board?.name?.length && board?.name?.length >= 20 && "w-[200px]"
            )}
          >
            {board?.name || "~ No Boards ~"}
          </h1>
          <ChevronDown
            className="transition-[rotate] ease-out text-cust-slate-1000"
            style={{ rotate: isNavOpen ? "0deg" : "180deg" }}
          />
        </button>
        <Button
          onClick={() => setShowAddTaskModal(true)}
          disabled={!columns?.[activeBoard]?.length}
          className="w-auto ml-auto"
        >
          <Plus />
        </Button>
        <BoardActions />
      </div>
      <AddTaskModal
        showModal={showAddTaskModal}
        setShowModal={setShowAddTaskModal}
      />
      {isNavOpen && (
        <div className="absolute min-w-[100vw] min-h-screen left-0 bottom-0 translate-y-full flex justify-center z-10 p-6">
          <div
            className="w-full h-full bg-black/70 dark:bg-black/50 absolute left-0 top-0"
            onClick={() => setIsNavOpen(false)}
          />
          <TopNav />
        </div>
      )}
    </div>
  );
}
