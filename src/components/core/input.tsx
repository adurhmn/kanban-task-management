import cn from "@/libs/utils/cn";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errMsg?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, errMsg, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          type={type}
          className={cn(
            "h-10 w-full rounded-md border bg-transparent px-3 py-2 p1 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black/25 dark:placeholder:text-white/25 text-cust-slate-1000 focus-visible:outline-none not-[&:focus]:focus-visible:ring-2 focus-visible:ring-cust-slate-300/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            errMsg ? "border-cust-destructive" : "border-cust-slate-300/25"
          )}
          ref={ref}
          {...props}
        />
        <p className="absolute top-1/2 -translate-y-1/2 right-3 text-cust-destructive p1">
          {errMsg}
        </p>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
