"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { AnalyzeButton } from "./AnalyzeButton";
import { Sparkles } from "lucide-react";

interface DecisionInputProps {
  onSubmit: (decision: string) => void;
  loading: boolean;
}

export function DecisionInput({ onSubmit, loading }: DecisionInputProps) {
  const [decision, setDecision] = useState("");

  const presets = [
    { label: "Increase subscription pricing by 10%", value: "Increase subscription pricing by 10%" },
    { label: "Expand into a new country", value: "Expand into a new country" },
    { label: "Hire additional developers", value: "Hire additional developers" },
    { label: "Launch a new product", value: "Launch a new product" },
    { label: "Reduce operational costs", value: "Reduce operational costs" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || loading) return;
    onSubmit(decision.trim());
  };

  return (
    <Card className="border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label 
              htmlFor="decision-textarea" 
              className="text-xs font-semibold text-secondary uppercase tracking-wider block"
            >
              Describe the Decision
            </label>
            <textarea
              id="decision-textarea"
              rows={4}
              placeholder="e.g. Expand software sales into the European market by establishing local AWS hosting clusters and hiring a regional manager..."
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-4 text-sm text-text placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 transition-all resize-none leading-relaxed"
              disabled={loading}
              required
            />
          </div>

          {/* Preset templates */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-medium text-secondary flex items-center gap-1.5 select-none">
              <Sparkles size={13} className="text-accent" />
              <span>Or choose a standard preset scenario:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setDecision(preset.value)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-md border border-border bg-background hover:bg-surface hover:border-secondary text-text font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-2 border-t border-border/60">
            <AnalyzeButton 
              disabled={loading || !decision.trim()} 
              loading={loading}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
