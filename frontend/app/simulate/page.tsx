"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SimulationComparison, SimulationPreset } from "@/components/SimulationComparison";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { mockScenarios } from "@/lib/mockData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, SimulationResult } from "@/lib/api";
import { Zap, AlertCircle } from "lucide-react";

const staticPresets: SimulationPreset[] = [
  {
    id: "pricing",
    name: "Subscription pricing: 10% vs 20% Increase",
    originalTitle: "Increase subscription pricing by 10%",
    modifiedTitle: "Increase subscription pricing by 20%",
    originalScore: 78,
    modifiedScore: 56,
    originalCompass: mockScenarios[0].decisionCompass,
    modifiedCompass: {
      recommendation: "Decline - High Churn Risk",
      whyThisMatters: "While a 20% price adjustment doubles immediate unit margin, client sentiment analysis suggests a major backlash. SMB tier churn is projected to hit 12%, violating key customer success constraints.",
      potentialRisks: "Massive customer migration to competitors, negative social sentiment, and heavy customer service queue overload.",
      suggestedAction: "Revert pricing plans back to the 10% cap. Grandfather existing enterprise accounts and run selective value add addon modules instead.",
      expectedStability: 56,
      confidence: 88
    },
    originalConstraints: mockScenarios[0].constraints,
    modifiedConstraints: [
      { text: "Do not exceed a 15% pricing increase to avoid major client backlash (Hard Limit)", type: "hard", status: "violated" },
      { text: "Must maintain a churn rate under 5% during transition (Soft Target)", type: "soft", status: "violated" },
      { text: "Keep legal compliance in line with localization policies in all regions (Hard Limit)", type: "hard", status: "satisfied" }
    ],
    originalImpacts: mockScenarios[0].positiveImpacts,
    modifiedImpacts: [
      { text: "Estimated 15-18% boost in average recurring revenue per user (ARPU) if retained", type: "positive", intensity: "high" },
      { text: "Slightly shorter timelines to achieve operational cash flow targets", type: "positive", intensity: "medium" }
    ],
    originalAreas: mockScenarios[0].affectedAreas,
    modifiedAreas: [
      { name: "Finance", weight: 30, score: 70, trend: "down" },
      { name: "Customer Success", weight: 25, score: 32, trend: "down" },
      { name: "Sales & Marketing", weight: 25, score: 50, trend: "down" },
      { name: "Product & Engineering", weight: 20, score: 85, trend: "stable" }
    ]
  },
  {
    id: "hiring",
    name: "Hiring: Staggered vs Aggressive Cohorts",
    originalTitle: "Hire additional developers (Cohort Onboarding)",
    modifiedTitle: "Hire additional developers (All At Once Onboarding)",
    originalScore: 82,
    modifiedScore: 64,
    originalCompass: mockScenarios[2].decisionCompass,
    modifiedCompass: {
      recommendation: "Proceed with Pre-onboarding Assets",
      whyThisMatters: "Hiring all 15 engineers in Month 1 severely impacts platform throughput. Senior developers will spend 40% of their schedules mentoring, triggering technical debt backlogs and warning limits.",
      potentialRisks: "Slowing down feature delivery for two consecutive cycles and increased communication friction inside key channels.",
      suggestedAction: "Establish automated engineering onboarding setups and run pre-training bootcamps before full contract signoffs.",
      expectedStability: 64,
      confidence: 80
    },
    originalConstraints: mockScenarios[2].constraints,
    modifiedConstraints: [
      { text: "Annualized salary expenditure must stay within $2.2M (Hard Limit)", type: "hard", status: "satisfied" },
      { text: "Onboarding overhead must not reduce existing team output by >15% in Month 1 (Soft Target)", type: "soft", status: "violated" },
      { text: "Must maintain 80%+ retention of current engineering staff (Hard Limit)", type: "hard", status: "satisfied" }
    ],
    originalImpacts: mockScenarios[2].positiveImpacts,
    modifiedImpacts: [
      { text: "Simultaneous ramp up of all engineering teams after onboarding completes", type: "positive", intensity: "high" },
      { text: "Ability to quickly spin up three major secondary features in parallel", type: "positive", intensity: "medium" }
    ],
    originalAreas: mockScenarios[2].affectedAreas,
    modifiedAreas: [
      { name: "Product & Engineering", weight: 40, score: 62, trend: "down" },
      { name: "Finance", weight: 30, score: 72, trend: "stable" },
      { name: "Human Resources", weight: 20, score: 55, trend: "down" },
      { name: "Operations", weight: 10, score: 80, trend: "stable" }
    ]
  }
];

function buildPresetFromSimResult(result: SimulationResult): SimulationPreset {
  const o = result.originalDecision;
  const m = result.modifiedDecision;
  return {
    id: `live-${Date.now()}`,
    name: `Live Simulation: ${o.title} vs ${m.title}`,
    originalTitle: o.title,
    modifiedTitle: m.title,
    originalScore: o.stabilityScore,
    modifiedScore: m.stabilityScore,
    originalCompass: o.decisionCompass,
    modifiedCompass: {
      recommendation: m.decisionCompass.recommendation,
      whyThisMatters: m.decisionCompass.whyThisMatters,
      potentialRisks: m.decisionCompass.potentialRisks,
      suggestedAction: m.decisionCompass.suggestedAction,
      expectedStability: m.decisionCompass.expectedStability,
      confidence: m.decisionCompass.confidence,
    },
    originalConstraints: o.constraints,
    modifiedConstraints: m.constraints as unknown as import("@/lib/mockData").Constraint[],
    originalImpacts: [...o.positiveImpacts, ...o.negativeImpacts],
    modifiedImpacts: m.positiveImpacts.concat(m.negativeImpacts) as unknown as import("@/lib/mockData").Impact[],
    originalAreas: o.affectedAreas,
    modifiedAreas: m.affectedAreas as unknown as import("@/lib/mockData").AffectedArea[],
  };
}

export default function SimulationPage() {
  const [activePreset, setActivePreset] = useState<SimulationPreset | null>(null);
  
  // DB-based custom comparison
  const [selectedOriginalId, setSelectedOriginalId] = useState("");
  const [selectedModifiedId, setSelectedModifiedId] = useState("");

  // Live What-If Simulation state
  const [liveOriginalId, setLiveOriginalId] = useState("");
  const [modifiedTitle, setModifiedTitle] = useState("");
  const [modifiedDescription, setModifiedDescription] = useState("");

  const { data: decisions } = useQuery({
    queryKey: ["decisions"],
    queryFn: api.fetchDecisions,
  });

  const uniqueDecisions = decisions
    ? Array.from(new Map(decisions.map(d => [d.title, d])).values())
    : [];

  // DB-based comparison handler
  const handleDbCompare = () => {
    if (!decisions) return;
    const original = decisions.find(d => d.id === selectedOriginalId);
    const modified = decisions.find(d => d.id === selectedModifiedId);
    if (!original || !modified) return;
    setActivePreset({
      id: `${original.id}-${modified.id}`,
      name: `Custom Simulation: ${original.title} vs ${modified.title}`,
      originalTitle: original.title,
      modifiedTitle: modified.title,
      originalScore: original.stabilityScore,
      modifiedScore: modified.stabilityScore,
      originalCompass: original.decisionCompass,
      modifiedCompass: modified.decisionCompass,
      originalConstraints: original.constraints,
      modifiedConstraints: modified.constraints,
      originalImpacts: [...original.positiveImpacts, ...original.negativeImpacts],
      modifiedImpacts: [...modified.positiveImpacts, ...modified.negativeImpacts],
      originalAreas: original.affectedAreas,
      modifiedAreas: modified.affectedAreas,
    });
  };

  // Live What-If mutation
  const simulateMutation = useMutation({
    mutationFn: () => api.runSimulation(liveOriginalId, modifiedTitle, modifiedDescription),
    onSuccess: (result) => {
      setActivePreset(buildPresetFromSimResult(result));
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Simulation Comparison"
        description="Run live What-If simulations or compare saved decisions side-by-side using deterministic models."
        actions={
          <div className="flex gap-2 flex-wrap">
            {staticPresets.map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset?.id === preset.id ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActivePreset(preset)}
                className="select-none"
              >
                {preset.name.split(":")[0]}
              </Button>
            ))}
          </div>
        }
      />

      {/* Sprint 4: Live What-If Simulation */}
      {uniqueDecisions.length >= 1 && (
        <Card>
          <CardHeader className="py-3 border-b border-border bg-background/5 select-none">
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-accent" />
              <CardTitle className="text-xs uppercase tracking-wider text-accent font-bold">
                Live What-If Simulation
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <p className="text-xs text-secondary leading-relaxed">
              Select an analyzed decision as the baseline, then describe a modified scenario. Gemini will analyze the alternative and score it — no data is saved.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-secondary uppercase">Baseline Decision</label>
                <select
                  value={liveOriginalId}
                  onChange={(e) => setLiveOriginalId(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">Select baseline...</option>
                  {uniqueDecisions.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-secondary uppercase">Modified Decision Title</label>
                <input
                  type="text"
                  value={modifiedTitle}
                  onChange={(e) => setModifiedTitle(e.target.value)}
                  placeholder="e.g. Hire 20 engineers instead of 5"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-secondary uppercase">Modified Scenario Description</label>
              <textarea
                value={modifiedDescription}
                onChange={(e) => setModifiedDescription(e.target.value)}
                placeholder="Describe the modified scenario in detail..."
                rows={2}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
            </div>
            {simulateMutation.isError && (
              <div className="flex items-center gap-2 text-xs text-danger p-2 rounded border border-danger/20 bg-danger/5">
                <AlertCircle size={13} />
                <span>{(simulateMutation.error as Error).message}</span>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                disabled={!liveOriginalId || !modifiedTitle.trim() || !modifiedDescription.trim() || simulateMutation.isPending}
                onClick={() => simulateMutation.mutate()}
                className="select-none"
              >
                {simulateMutation.isPending ? "Analyzing..." : "Run Live What-If"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DB-based Custom Comparison */}
      {uniqueDecisions.length >= 2 && (
        <Card>
          <CardHeader className="py-3 border-b border-border bg-background/5 select-none">
            <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">
              Compare Two Saved Decisions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-secondary uppercase">Original Strategy</label>
              <select
                value={selectedOriginalId}
                onChange={(e) => setSelectedOriginalId(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Select original...</option>
                {uniqueDecisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-secondary uppercase">Modified Proposal</label>
              <select
                value={selectedModifiedId}
                onChange={(e) => setSelectedModifiedId(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Select modified...</option>
                {uniqueDecisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={!selectedOriginalId || !selectedModifiedId || selectedOriginalId === selectedModifiedId}
              onClick={handleDbCompare}
              className="w-full sm:w-auto h-[38px] select-none"
            >
              Compare Delta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Preset Banner */}
      {activePreset && (
        <div className="p-4 bg-surface border border-border rounded-lg flex items-center justify-between select-none">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Active Simulation</span>
          <span className="text-xs text-text font-bold">{activePreset.name}</span>
        </div>
      )}

      {/* Loading state during live simulation */}
      {simulateMutation.isPending && <LoadingSkeleton />}

      {/* Results or empty state */}
      {!simulateMutation.isPending && (
        activePreset ? (
          <SimulationComparison activePreset={activePreset} />
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed select-none">
            <span className="text-xs uppercase tracking-wider font-bold text-secondary mb-2 block">
              No Simulation Selected
            </span>
            <p className="text-xs text-secondary max-w-[320px] leading-relaxed">
              Select a preset scenario from the header, run a live What-If simulation above, or compare two saved decisions from the database.
            </p>
          </Card>
        )
      )}
    </div>
  );
}
