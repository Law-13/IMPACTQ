import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DecisionScenario } from "@/lib/mockData";

export function HistoryCard({ decisions }: { decisions: DecisionScenario[] }) {
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-success bg-success/5 border-success/15";
    if (score >= 60) return "text-amber-500 bg-amber-500/5 border-amber-500/15";
    return "text-danger bg-danger/5 border-danger/15";
  };

  return (
    <Card>
      <CardHeader className="py-4 border-b border-border bg-background/10 select-none">
        <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Recent Decisions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/30 text-[10px] font-semibold text-secondary uppercase select-none">
                <th className="px-6 py-3">Decision</th>
                <th className="px-6 py-3">Stability Score</th>
                <th className="px-6 py-3">Recommendation</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {decisions.map((decision) => (
                <tr 
                  key={decision.id} 
                  className="border-b border-border/80 hover:bg-background/20 transition-colors text-xs text-text"
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="font-semibold block">{decision.title}</span>
                      <span className="text-[10px] text-secondary line-clamp-1 max-w-lg">{decision.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono font-bold select-none">
                      <span className={`px-2 py-0.5 rounded border ${getScoreColorClass(decision.stabilityScore)}`}>
                        {decision.stabilityScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-secondary">{decision.decisionCompass.recommendation}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href="/analyze">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 select-none">
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
