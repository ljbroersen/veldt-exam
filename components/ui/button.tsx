import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center box-border whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "px-3 text-sm text-white bg-black hover:bg-stone-700 active:bg-stone-700",
        destructive:
          "text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        link: "text-sm font-medium text-primary underline-offset-4 hover:underline",
        headless: "",
        // TODO: rename the two variants below
        plainRed:
          "text-sm text-red-500 cursor-pointer hover:bg-gray-100 active:bg-gray-100",
        plainBlack:
          "text-sm text-black cursor-pointer hover:bg-white active:bg-white",
      },
      size: {
        default: "h-10 rounded-md px-4 py-2",
        xs: "h-4 h-5 rounded-xl",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded-md",
        headless: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
