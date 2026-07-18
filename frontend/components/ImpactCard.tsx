import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Impact } from "@/lib/mockData";

interface ImpactCardProps {
  type: "positive" | "negative";
  impacts: Impact[];
}

export function ImpactCard({ type, impacts }: ImpactCardProps) {
  const isPositive = type === "positive";
  
  return (
    <Card className={isPositive ? "border-success/20" : "border-danger/20"}>
      <CardHeader className="py-4 border-b border-border bg-background/10 select-none">
        <CardTitle className={`text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? <PlusCircle size={14} /> : <MinusCircle size={14} />}
          <span>{isPositive ? "Positive Impacts" : "Negative Impacts"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3.5">
        {impacts.map((imp, idx) => (
          <div key={idx} className="p-3 border border-border rounded-lg bg-background/25 space-y-1.5">
            <p className="text-xs text-text leading-relaxed font-medium">
              {imp.text}
            </p>
            <div className="flex items-center gap-2 select-none">
              <span className="text-[10px] text-secondary font-medium">Intensity:</span>
              <span className={`text-[10px] font-bold uppercase ${
                imp.intensity === "high" ? (isPositive ? "text-success" : "text-danger") : 
                imp.intensity === "medium" ? (isPositive ? "text-accent" : "text-amber-500") : "text-secondary"
              }`}>
                {imp.intensity}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
