import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FolderDot, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { AffectedArea } from "@/lib/mockData";

export function AffectedAreaCard({ areas }: { areas: AffectedArea[] }) {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="text-success" size={14} />;
      case "down":
        return <ArrowDownRight className="text-danger" size={14} />;
      case "stable":
        return <Minus className="text-secondary" size={14} />;
    }
  };

  return (
    <Card>
      <CardHeader className="py-4 border-b border-border bg-background/10 select-none">
        <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
          <FolderDot size={14} className="text-accent" />
          <span>Affected Business Areas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {areas.map((area, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-text">
              <div className="flex items-center gap-1.5 select-none">
                {getTrendIcon(area.trend)}
                <span>{area.name}</span>
              </div>
              <span className="font-mono text-secondary">{area.score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-border/50 overflow-hidden relative">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  area.score >= 80 ? "bg-success" : 
                  area.score >= 60 ? "bg-accent" : "bg-danger"
                }`}
                style={{ width: `${area.score}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
