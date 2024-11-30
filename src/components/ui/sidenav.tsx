import IconBoard from "@/assets/icons/board";
import { ChevronLeft, Loader, Plus } from "lucide-react";
import cn from "@/libs/utils/cn";
import IconLightTheme from "@/assets/icons/light-theme";
import IconDarkTheme from "@/assets/icons/dark-theme";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
} from "@hello-pangea/dnd";
import { DROPPABLE_TYPE } from "@/libs/constants/dnd";
import { useBoardStore } from "@/store";
import { setActiveBoardAction } from "@/actions/kanban/boards";
import AddBoardModal from "./modals/add-board-modal";
import { useState } from "react";
import { isDarkMode, toggleDarkMode } from "@/actions/app";
import { LOCAL_KEYS } from "@/libs/constants";

function ThemeToggle() {
  const [_isDarkMode, setIsDarkMode] = useState(isDarkMode());

  const toggle = () => {
    setIsDarkMode((prev) => !prev);
    toggleDarkMode();
  };

  return (
    <div className="w-max rounded-md px-5 py-3 bg-cust-slate-100 flex gap-3 items-center justify-center">
      <IconLightTheme className="fill-cust-slate-300" />
      <div
        className={cn(
          "h-[30px] w-[60px] rounded-full relative transition-colors",
          _isDarkMode ? "bg-cust-prim" : "bg-cust-slate-300"
        )}
        onClick={toggle}
      >
        {/* <div
          className={cn(
            "transition-all bg-cust-prim h-full rounded-full",
            _isDarkMode ? "w-full" : "w-0"
          )}
        /> */}
        <span
          className={cn(
            "transition-all absolute h-[80%] aspect-square bg-white rounded-full top-[10%]",
            _isDarkMode ? "left-[30px]" : "left-[3px]"
          )}
        />
      </div>
      <IconDarkTheme className="fill-cust-slate-300" />
    </div>
  );
}

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
          className={cn(
            "h3 transition-colors whitespace-nowrap overflow-hidden text-ellipsis w-[180px] text-left",
            {
              "text-cust-slate-300": !isActive,
              "text-white": isActive,
            }
          )}
        >
          {name}
        </p>
      </button>
    </li>
  );
};

export default function SideNav() {
  const { boards, activeBoard } = useBoardStore();
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem(LOCAL_KEYS.IS_SIDENAV_OPEN) === "1" ||
      localStorage.getItem(LOCAL_KEYS.IS_SIDENAV_OPEN) === null
      ? true
      : false
  );
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);

  return (
    <div
      className="min-w-[300px] border-cust-slate-200 bg-cust-slate-0 border-r relative flex flex-col transition-[margin-left]"
      style={{ marginLeft: isOpen ? 0 : -300 }}
    >
      <h4 className="h4 text-md my-6 text-cust-slate-300 px-6">
        {`ALL BOARDS (${boards ? boards.length : "?"})`}
      </h4>
      <div className="h-[700px] max-h-[700px] flex flex-col">
        {boards === null ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loader className="text-cust-prim-light animate-spin" />
          </div>
        ) : (
          <>
            <Droppable
              droppableId="sidenav-boards"
              type={DROPPABLE_TYPE.BOARDS}
            >
              {(provided) => (
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
            <div
              className={cn(
                "w-full min-w-[200px] py-4 px-6 flex items-center gap-3 cursor-pointer hover:bg-cust-slate-100 mt-4"
              )}
              onClick={() => setShowAddBoardModal(true)}
            >
              <Plus className="text-cust-prim" size={16} />
              <p className={"h3 whitespace-nowrap text-cust-prim"}>
                Create New Board
              </p>
            </div>
          </>
        )}
      </div>
      <div className="mt-auto mb-6 flex items-center justify-center">
        <ThemeToggle />
      </div>
      <AddBoardModal
        showModal={showAddBoardModal}
        setShowModal={setShowAddBoardModal}
      />
      <button
        className="rounded-r-full p-2 bg-cust-slate-0 absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border border-l-0 border-cust-slate-200"
        onClick={() =>
          setIsOpen((prev) => {
            localStorage.setItem(
              LOCAL_KEYS.IS_SIDENAV_OPEN,
              String(Number(!prev))
            );
            return !prev;
          })
        }
      >
        <ChevronLeft
          className="transition-[rotate] ease-out text-cust-prim"
          style={{ rotate: isOpen ? "0deg" : "180deg" }}
        />
      </button>
    </div>
  );
}
