import { Task as ITask } from "@/libs/types";
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
  return (
    <div
      className="w-full rounded-lg shadow-md p-4 bg-white mb-5"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <h3 className="h3">{task.title}</h3>
      <p className="p">{task.desc}</p>
    </div>
  );
};

export default Task;
