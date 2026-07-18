import { AlertTriangle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "An error occurred while processing the decision.", onRetry }: ErrorStateProps) {
  return (
    <Card className="border-danger/30 bg-danger/[0.01] dark:bg-danger/[0.02] shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-center py-10 select-none animate-in fade-in duration-300">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        {/* Error icon wrapper */}
        <div className="p-3 bg-danger/10 text-danger rounded-full">
          <AlertTriangle size={24} />
        </div>
        
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider">
            Analysis Failed
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            {message}
          </p>
        </div>

        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            <RotateCcw size={14} className="mr-1.5" />
            <span>Try Again</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
