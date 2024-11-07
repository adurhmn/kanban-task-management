// import imgLogoDark from "@/assets/logo-dark.svg";
// import imgLogoLight from "@/assets/logo-light.svg";

import { useBoardStore, useColumnStore } from "@/store";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useAddTaskModal } from "../modals/add-task-modal";
import IconLogo from "@/assets/icons/logo";
import { Button } from "@/components/core";
import BoardActions from "./board-actions";

export default function HeaderDesktop() {
  const { setShowAddTaskModal, AddTaskModal } = useAddTaskModal();
  const { activeBoard, boards } = useBoardStore();
  const { columns } = useColumnStore();
  const board = useMemo(
    () => boards?.find((b) => b.id === activeBoard),
    [activeBoard, boards]
  );

  return (
    <div className="flex items-center h-[80px] bg-cust-slate-0">
      <div className="w-[300px] h-full flex items-center justify-center border-cust-slate-200 border-b border-r flex-shrink-0">
        <IconLogo pathClassName="fill-cust-slate-1000" />
      </div>
      <div className="border-b border-cust-slate-200 flex items-center flex-grow h-full py-4 px-7">
        <h1 className="h1 mr-auto text-cust-slate-1000">{board?.name}</h1>
        <Button
          onClick={() => setShowAddTaskModal(true)}
          disabled={!columns?.[activeBoard]?.length}
        >
          <Plus className="mr-2" />
          <p>Add new task</p>
        </Button>
        <BoardActions />
      </div>
      <AddTaskModal />
    </div>
  );
}
