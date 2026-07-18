import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Constraint } from "@/lib/mockData";

export function ConstraintCard({ constraints }: { constraints: Constraint[] }) {
  const getConstraintStyles = (status: "satisfied" | "violated" | "warning") => {
    switch (status) {
      case "satisfied":
        return { icon: ShieldCheck, text: "Satisfied", badgeVariant: "success" as const };
      case "violated":
        return { icon: AlertTriangle, text: "Violated", badgeVariant: "danger" as const };
      case "warning":
        return { icon: AlertTriangle, text: "Warning Bound", badgeVariant: "warning" as const };
    }
  };

  return (
    <Card>
      <CardHeader className="py-4 border-b border-border bg-background/10 select-none">
        <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-accent" />
          <span>Hidden Constraints & Policy Rules</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3.5">
        {constraints.map((c, idx) => {
          const styling = getConstraintStyles(c.status);
          const Icon = styling.icon;
          return (
            <div 
              key={idx} 
              className="flex items-start justify-between gap-4 p-3 border border-border rounded-lg bg-background/25 hover:border-secondary transition-all"
            >
              <div className="flex gap-3">
                <div className={`p-1.5 rounded-md mt-0.5 shrink-0 ${
                  c.status === "satisfied" ? "bg-success/10 text-success" : 
                  c.status === "violated" ? "bg-danger/10 text-danger" : "bg-yellow-500/10 text-yellow-600"
                }`}>
                  <Icon size={14} />
                </div>
                <p className="text-xs text-text font-medium leading-relaxed pt-0.5">
                  {c.text}
                </p>
              </div>
              <Badge variant={styling.badgeVariant} className="shrink-0 font-bold select-none">
                {styling.text}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
