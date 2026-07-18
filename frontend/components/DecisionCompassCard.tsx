import { DecisionCompass } from "@/lib/mockData";
import { Card, CardContent } from "./ui/card";
import { Compass, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

interface DecisionCompassCardProps {
  compass: DecisionCompass;
}

export function DecisionCompassCard({ compass }: DecisionCompassCardProps) {
  return (
    <Card className="border-accent/40 bg-accent/[0.01] dark:bg-accent/[0.02] shadow-[0_4px_20px_rgba(37,99,235,0.03)] border-l-4 border-l-accent overflow-hidden">
      <div className="px-6 py-4 border-b border-border/80 flex items-center gap-2.5 bg-accent/[0.02] select-none">
        <Compass className="text-accent" size={18} />
        <h3 className="font-bold text-sm tracking-wide text-text uppercase">
          Decision Compass
        </h3>
      </div>
      <CardContent className="p-6 space-y-6">
        {/* Recommendation Header */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
            Recommendation
          </span>
          <h4 className="text-lg font-bold text-accent leading-tight">
            {compass.recommendation}
          </h4>
        </div>

        <hr className="border-border/60" />

        {/* Compass main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Why This Matters */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Lightbulb size={13} className="text-accent" />
                <span>Why This Matters</span>
              </span>
              <p className="text-sm text-text leading-relaxed">
                {compass.whyThisMatters}
              </p>
            </div>

            {/* Suggested Action */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5 select-none">
                <TrendingUp size={13} className="text-success" />
                <span>Suggested Action</span>
              </span>
              <p className="text-sm text-text leading-relaxed">
                {compass.suggestedAction}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Potential Risks */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5 select-none">
                <AlertTriangle size={13} className="text-danger" />
                <span>Potential Risks</span>
              </span>
              <div className="p-3 bg-danger/[0.03] border border-danger/20 rounded-lg text-sm text-text leading-relaxed">
                {compass.potentialRisks}
              </div>
            </div>

            {/* Numeric Indicators (Stability & Confidence) */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-background border border-border rounded-lg space-y-1">
                <span className="text-[9px] font-semibold text-secondary uppercase tracking-wider block select-none">
                  Expected Stability
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-accent">
                    {compass.expectedStability}%
                  </span>
                  <span className="text-[10px] text-secondary">
                    / 100
                  </span>
                </div>
              </div>

              <div className="p-4 bg-background border border-border rounded-lg space-y-1">
                <span className="text-[9px] font-semibold text-secondary uppercase tracking-wider block select-none">
                  Confidence
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-success">
                    {compass.confidence}%
                  </span>
                  <span className="text-[10px] text-secondary">
                    rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
