import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-semibold ring-offset-background transition-all duration-fast ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-accent-primary text-text-primary hover:bg-accent-secondary",
        destructive:
          "bg-status-error text-text-primary hover:bg-status-error/90",
        outline:
          "border border-bg-quaternary bg-bg-tertiary text-text-primary hover:bg-bg-quaternary hover:border-accent-primary",
        secondary:
          "bg-bg-tertiary text-text-primary hover:bg-bg-quaternary",
        ghost: "bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
        link: "text-tertiary-tertiary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-3 rounded-3",
        sm: "h-9 rounded-3 px-4",
        lg: "h-11 rounded-4 px-6 text-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
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
