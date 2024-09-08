import { Checkbox } from "@/components/core";
import cn from "@/libs/utils/cn";

interface SubtaskProps {
  task: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function Subtask({ task, checked, onCheckedChange }: SubtaskProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-[4px] flex  items-center justify-start gap-4 h-10 min-w-[350px] max-w-[450px] bg-cust-slate-100 hover:bg-cust-prim/20 cursor-pointer"
      )}
      onClick={() => {
        onCheckedChange(!checked);
      }}
    >
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <p
        className={cn("p2 select-none", {
          "line-through opacity-50": checked,
        })}
      >
        {task}
      </p>
    </div>
  );
}
