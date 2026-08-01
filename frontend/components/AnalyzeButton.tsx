import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface AnalyzeButtonProps {
  onClick?: () => void;
  disabled: boolean;
  loading: boolean;
}

export function AnalyzeButton({ onClick, disabled, loading }: AnalyzeButtonProps) {
  return (
    <Button 
      variant="primary" 
      disabled={disabled} 
      onClick={onClick}
      className="gap-2 select-none w-full sm:w-auto active:scale-95 transition-transform"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        <>
          <Zap size={16} />
          Analyze Decision
        </>
      )}
    </Button>
  );
}
