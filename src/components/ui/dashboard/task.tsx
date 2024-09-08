import { Task as ITask } from "@/libs/types";
import { useTaskStore } from "@/store";
import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
const Task = ({
  task,
  provided,
  snapshot,
}: {
  task: ITask;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}) => {
  const { setActiveTask } = useTaskStore();

  return (
    <div
      className="w-full rounded-lg shadow-md p-4 bg-white mb-5"
      ref={provided.innerRef}
      onClick={() => {
        setActiveTask({ taskId: task.id, colId: task.columnId });
      }}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <h3 className="h3">{task.title}</h3>
      <p className="p">{task.desc}</p>
    </div>
  );
};

export default Task;
