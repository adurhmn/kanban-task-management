import imgLogoLight from "@/assets/logo-light.svg";
import imgLogoDark from "@/assets/logo-dark.svg";
import { Button } from "@/components/core";
import { Plus } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center h-[80px]">
      <div className="w-[300px] h-full flex items-center justify-center border-cust-slate-200 border-b">
        <img src={imgLogoDark} />
      </div>
      <div className="border-l border-b border-cust-slate-200 flex items-center flex-grow h-full py-4 px-7">
        <h1 className="h1 mr-auto">Platform Launch</h1>
        <div>
          <Button>
            <Plus className="mr-2"/>
            <p>Add new task</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
