import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <div 
      className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-border select-none", className)}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-text tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-secondary leading-relaxed max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
