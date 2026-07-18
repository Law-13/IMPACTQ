import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer",
          // Variants
          variant === "primary" && "bg-accent text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm",
          variant === "secondary" && "bg-surface border border-border text-text hover:bg-background active:bg-border",
          variant === "danger" && "bg-danger text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
          variant === "outline" && "border border-border text-text hover:bg-background",
          variant === "ghost" && "text-secondary hover:text-text hover:bg-background/50",
          // Sizes
          size === "sm" && "text-xs px-3 py-1.5 h-8 gap-1.5",
          size === "md" && "text-sm px-4 py-2 h-10 gap-2",
          size === "lg" && "text-base px-6 py-3 h-12 gap-2.5",
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
