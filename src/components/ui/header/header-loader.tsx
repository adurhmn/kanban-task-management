import { Loader } from "lucide-react";

export default function HeaderLoader() {
  return (
    <div className="flex items-center justify-center min-h-[80px] bg-cust-slate-0 relative border-b border-cust-slate-200">
      <Loader className="animate-spin text-cust-prim-light" />
    </div>
  );
}
