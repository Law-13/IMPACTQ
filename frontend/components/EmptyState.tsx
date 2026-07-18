import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed border-2 border-border/80 bg-surface/50 text-center py-12 select-none animate-in fade-in duration-300">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        {/* Subtle decorative icon wrapper */}
        <div className="p-4 bg-background border border-border rounded-full text-secondary">
          <HelpCircle size={28} className="text-secondary/70" />
        </div>
        
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider">
            No decision analyzed yet
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            Enter a business decision or click one of our standard presets above to trigger a deterministic stability analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
