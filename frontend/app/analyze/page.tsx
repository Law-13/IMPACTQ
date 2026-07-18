"use client";

import { PageHeader } from "@/components/PageHeader";
import { DecisionInput } from "@/components/DecisionInput";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { StabilityGauge } from "@/components/StabilityGauge";
import { DecisionCompassCard } from "@/components/DecisionCompassCard";
import { ConstraintCard } from "@/components/ConstraintCard";
import { ImpactCard } from "@/components/ImpactCard";
import { AffectedAreaCard } from "@/components/AffectedAreaCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function AnalyzePage() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (decisionText: string) => {
      // Backend expects title (short name) and description. We split or pass it directly.
      const title = decisionText.length > 50 ? decisionText.substring(0, 47) + "..." : decisionText;
      return api.analyzeDecision(title, decisionText);
    },
    onSuccess: () => {
      // Invalidate dashboard caches so new data shows up instantly
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    }
  });

  const handleAnalyze = (decisionText: string) => {
    mutation.mutate(decisionText);
  };

  const status = mutation.isPending 
    ? "loading" 
    : mutation.isSuccess 
    ? "success" 
    : "idle";
    
  const activeScenario = mutation.data || null;



  return (
    <div className="space-y-6">
      {/* Page Title */}
      <PageHeader
        title="Analyze Decision"
        description="Run our deterministic intelligence engine on pricing adjustments, expansions, headcounts, or custom business decisions."
      />

      {/* Decision Input Controls */}
      <DecisionInput onSubmit={handleAnalyze} loading={status === "loading"} />

      {/* Execution Results */}
      {status === "idle" && <EmptyState />}
      {status === "loading" && <LoadingSkeleton />}
      
      {status === "success" && activeScenario && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          {/* Analysis Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-surface border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.01)] gap-4 select-none">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-accent uppercase tracking-wider block">
                Active Analysis Scenario
              </span>
              <h2 className="text-base font-bold text-text">
                {activeScenario.title}
              </h2>
            </div>
            <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-success/20 bg-success/5 text-xs text-success font-bold font-mono">
              <CheckCircle size={14} />
              <span>DETERMINISTIC EVALUATION COMPLETE</span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left section (Constraints, Impacts) */}
            <div className="lg:col-span-2 space-y-6">
              <ConstraintCard constraints={activeScenario.constraints} />

              {/* Impacts Double Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImpactCard type="positive" impacts={activeScenario.positiveImpacts} />
                <ImpactCard type="negative" impacts={activeScenario.negativeImpacts} />
              </div>
            </div>

            {/* Right section (Stability, Affected Areas) */}
            <div className="space-y-6">
              {/* Stability Gauge Card */}
              <Card className="flex flex-col items-center justify-center p-6 text-center select-none">
                <span className="text-xs uppercase tracking-wider font-bold text-secondary mb-6 block">
                  Overall Stability Score
                </span>
                <StabilityGauge score={activeScenario.stabilityScore} size={130} />
                <p className="text-[11px] text-secondary leading-relaxed max-w-[200px] mt-5">
                  Calculated deterministically by evaluating constraint weights and cascading risk scores.
                </p>
              </Card>

              <AffectedAreaCard areas={activeScenario.affectedAreas} />
            </div>
          </div>

          {/* Bottom section (Decision Compass Card) */}
          <DecisionCompassCard compass={activeScenario.decisionCompass} />
        </div>
      )}
    </div>
  );
}
