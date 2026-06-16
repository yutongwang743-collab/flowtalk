import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ink)/0.2)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--ink))] text-white hover:bg-[hsl(var(--ink)/0.85)] active:scale-[0.98]",
        outline:
          "border-2 border-[hsl(var(--ink)/0.12)] bg-white/60 text-[hsl(var(--ink))] hover:border-[hsl(var(--ink)/0.25)] hover:bg-white active:scale-[0.98]",
        ghost:
          "text-[hsl(var(--ink)/0.5)] hover:text-[hsl(var(--ink))] hover:bg-[hsl(var(--ink)/0.04)] active:scale-[0.98]",
        link: "text-[hsl(var(--ink)/0.6)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
