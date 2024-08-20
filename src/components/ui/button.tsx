import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import cn from "@/libs/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-x-slate-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-x-prim hover:bg-x-prim-light",
        secondary:
          "bg-x-prim-light/10 hover:bg-x-prim-light/25 text-x-prim dark:bg-x-slate-0 dark:hover:bg-x-slate-0",
        destructive:
          "bg-x-destructive hover:bg-x-destructive-light",
      },
      size: {
        lg: "w-[255px] h-[48px] px-4 py-2 h3",
        default: "w-[255px] h-[40px] px-4 py-2 text-[13px] font-[700] line-[23px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    console.log({cn})
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
