"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Compass, 
  ArrowRight,
  Workflow
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Constraint Analysis",
      description: "Detect hidden compliance, budgetary, and resource boundaries before they are violated.",
      icon: ShieldCheck
    },
    {
      title: "Impact Cascades",
      description: "Map both positive and negative consequences across finance, operations, and engineering teams.",
      icon: Workflow
    },
    {
      title: "Stability Scores",
      description: "Get a deterministic, mathematical score of your organizational health based on core inputs.",
      icon: Activity
    },
    {
      title: "Decision Compass",
      description: "Receive recommendations, reasoning, risk profiles, and action items in a unified dashboard.",
      icon: Compass
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/[0.03] text-xs text-accent font-medium select-none animate-fade-in">
            <Sparkles size={12} className="animate-pulse" />
            <span>Decision Intelligence Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text tracking-tight leading-[1.1] max-w-3xl mx-auto">
            See the impact of your decisions <span className="text-accent">before making them</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
            ImpactQ analyzes critical business decisions using structured reasoning, deterministic stability scoring, and simulation comparisons.
          </p>

          {/* Primary CTA */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/analyze" className="focus-visible:outline-none w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                <span>Analyze Decision</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/dashboard" className="focus-visible:outline-none w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <span>Go to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Small Product Preview */}
      <section className="px-6 py-6 border-y border-border bg-background/50">
        <div className="max-w-5xl mx-auto">
          {/* Simulated Interface Wrapper */}
          <div className="border border-border bg-surface rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Window control header */}
            <div className="h-10 border-b border-border flex items-center justify-between px-4 bg-background/30 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <span className="text-[10px] text-secondary font-mono tracking-wider">app.impactq.io</span>
              <div className="w-10" />
            </div>

            {/* Interface simulation snapshot */}
            <div className="p-6 md:p-8 space-y-6 bg-background/20 select-none">
              <div className="flex justify-between items-center pb-4 border-b border-border/80">
                <div className="space-y-1">
                  <div className="w-32 h-4 bg-text/80 rounded" />
                  <div className="w-48 h-3 bg-secondary/50 rounded" />
                </div>
                <div className="w-20 h-7 bg-success/20 rounded-full border border-success/30 flex items-center justify-center text-[10px] text-success font-bold font-mono">
                  82 STABILITY
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 border border-border bg-surface p-5 rounded-lg space-y-4">
                  <div className="w-24 h-3 bg-secondary/70 rounded" />
                  <div className="space-y-2.5">
                    <div className="w-full h-3 bg-border rounded" />
                    <div className="w-5/6 h-3 bg-border rounded" />
                    <div className="w-4/5 h-3 bg-border rounded" />
                  </div>
                </div>
                <div className="border border-accent/30 bg-accent/[0.02] p-5 rounded-lg space-y-4">
                  <div className="w-24 h-3 bg-accent/70 rounded" />
                  <div className="w-full h-3 bg-border rounded" />
                  <div className="w-5/6 h-3 bg-border rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-2 select-none">
            <h2 className="text-xs font-bold text-accent uppercase tracking-widest">Platform Core</h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-text">Complete decision visibility out of the box</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title} 
                  className="flex gap-4 p-5 rounded-xl border border-border bg-surface hover:border-secondary transition-all group duration-200"
                >
                  <div className="p-3 bg-background border border-border rounded-lg text-secondary group-hover:text-accent transition-colors shrink-0">
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-text">{feat.title}</h3>
                    <p className="text-xs text-secondary leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section id="workflow" className="py-16 px-6 border-t border-border bg-background/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2 select-none">
            <h2 className="text-xs font-bold text-accent uppercase tracking-widest">Process</h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-text">How ImpactQ Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative select-none">
            {[
              { step: "01", name: "Formulate Decision", desc: "Input your proposed business strategy or changes into the text interface." },
              { step: "02", name: "Execute Engine", desc: "Deterministic rules evaluate compliance boundaries, constraints, and teams." },
              { step: "03", name: "Simulate Strategy", desc: "Compare outcomes side-by-side to optimize scores prior to execution." }
            ].map((step, idx) => (
              <div key={idx} className="border border-border bg-surface p-6 rounded-lg space-y-3 relative overflow-hidden">
                <span className="text-6xl font-extrabold font-mono text-border/40 absolute -right-2 -bottom-2 select-none">
                  {step.step}
                </span>
                <h3 className="font-bold text-sm text-text">{step.name}</h3>
                <p className="text-xs text-secondary leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 border-t border-border bg-surface select-none">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text">ImpactQ</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Sprint 1 Frontend</span>
            <span>FastAPI & SQLite Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
