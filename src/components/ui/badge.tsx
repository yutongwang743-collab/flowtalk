import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-medium",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--ink)/0.06)] text-[hsl(var(--ink)/0.6)]",
        outline: "border border-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink)/0.5)]",
        accent: "bg-[hsl(var(--accent)/0.08)] text-[hsl(var(--accent))]",
        green: "bg-[hsl(85,30%,90%)] text-[hsl(85,20%,35%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
