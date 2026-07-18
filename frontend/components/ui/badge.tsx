import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "danger" | "warning" | "accent" | "secondary";
}

export function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium select-none border",
        variant === "success" && "bg-success/5 text-success border-success/20",
        variant === "danger" && "bg-danger/5 text-danger border-danger/20",
        variant === "warning" && "bg-yellow-500/5 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
        variant === "accent" && "bg-accent/5 text-accent border-accent/20",
        variant === "secondary" && "bg-secondary/10 text-secondary border-secondary/20",
        className
      )}
      {...props}
    />
  );
}
