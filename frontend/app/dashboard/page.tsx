"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HistoryCard } from "@/components/HistoryCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Binary, 
  Sliders, 
  ArrowRight,
  Activity
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: stats, isError: isStatsError } = useQuery({
    queryKey: ["stats"],
    queryFn: api.fetchStats,
    refetchInterval: 5000, // Poll every 5s for dashboard updates
    retry: 2,
  });

  const { data: decisions, isLoading: isDecisionsLoading, isError: isDecisionsError } = useQuery({
    queryKey: ["decisions"],
    queryFn: api.fetchDecisions,
    retry: 2,
  });

  const hasApiError = isStatsError || isDecisionsError;

  const recentDecisions = useMemo(() => decisions || [], [decisions]);

  // Compute Statistics
  const totalAnalyses = stats?.totalAnalyses ?? recentDecisions.length;
  const totalSimulations = stats?.totalSimulations ?? 0;
  const averageStability = stats?.averageStability ?? 0;

  const [historySearch, setHistorySearch] = useState("");

  // Chart Data: Decision History Trend
  const historyData = recentDecisions.slice(0, 10).reverse().map((d, index) => ({
    name: `D${index + 1}`,
    score: d.stabilityScore,
    title: d.title.length > 20 ? d.title.substring(0, 18) + "..." : d.title
  }));

  // Chart Data: Live Affected Area Distribution — aggregated from real decisions
  const areaData = useMemo(() => {
    if (!recentDecisions.length) return [];
    const areaMap: Record<string, { total: number; count: number }> = {};
    for (const decision of recentDecisions) {
      for (const area of decision.affectedAreas) {
        if (!areaMap[area.name]) areaMap[area.name] = { total: 0, count: 0 };
        areaMap[area.name].total += area.score;
        areaMap[area.name].count += 1;
      }
    }
    return Object.entries(areaMap)
      .map(([name, { total, count }]) => ({
        name: name.length > 12 ? name.substring(0, 10) + "..." : name,
        score: Math.round(total / count),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // top 6 areas
  }, [recentDecisions]);

  // Filtered history for search
  const filteredDecisions = useMemo(() => {
    if (!historySearch.trim()) return recentDecisions;
    return recentDecisions.filter(d =>
      d.title.toLowerCase().includes(historySearch.toLowerCase())
    );
  }, [recentDecisions, historySearch]);



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1 pb-4 select-none">
        <h1 className="text-2xl font-bold text-text tracking-tight">Welcome Back</h1>
        <p className="text-sm text-secondary leading-relaxed">
          Here is a summary of today&apos;s decision intelligence activity. You have completed {totalAnalyses} deterministic analyses.
        </p>
      </div>

      {/* Backend Connection Error */}
      {hasApiError && (
        <div className="p-4 rounded-lg border border-danger/30 bg-danger/5 space-y-1 animate-fade-in">
          <p className="text-sm font-semibold text-danger">Unable to connect to backend</p>
          <p className="text-xs text-danger/80">
            Make sure the FastAPI backend is running on port 8000. Run <code className="bg-danger/10 px-1.5 py-0.5 rounded text-[11px] font-mono">start_impactq.bat</code> or start the backend manually.
          </p>
        </div>
      )}

      {/* Quick Start Buttons */}
      <Card className="bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.01)] border-border">
        <CardHeader className="py-4 border-b border-border bg-background/10 select-none">
          <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/analyze" className="focus-visible:outline-none block">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-surface hover:border-secondary transition-all group cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-accent/10 text-accent">
                  <Binary size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text">Analyze Decision</h4>
                  <p className="text-xs text-secondary">Evaluate constraints and impacts</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/simulate" className="focus-visible:outline-none block">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-surface hover:border-secondary transition-all group cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-accent/10 text-accent">
                  <Sliders size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text">Run Simulation</h4>
                  <p className="text-xs text-secondary">Compare modified decisions</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">Average Stability</span>
              <span className="text-2xl font-bold font-mono text-accent">{averageStability}%</span>
            </div>
            <div className="p-3 bg-accent/5 rounded-lg text-accent">
              <Activity size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">Total Analyses</span>
              <span className="text-2xl font-bold font-mono text-text">{totalAnalyses}</span>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
              <Binary size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">Total Simulations</span>
              <span className="text-2xl font-bold font-mono text-text">{totalSimulations}</span>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
              <Sliders size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Double Column Trend Charts */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
          {/* Decision History Trend */}
          <Card>
            <CardHeader className="py-4 border-b border-border bg-background/10">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Decision History Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="opacity-55" />
                  <XAxis dataKey="name" stroke="var(--secondary)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--secondary)" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                    labelFormatter={(label) => `Decision: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Stability" 
                    stroke="var(--accent)" 
                    strokeWidth={2} 
                    dot={{ fill: "var(--accent)", strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Affected Area Distribution */}
          <Card>
            <CardHeader className="py-4 border-b border-border bg-background/10">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Affected Area Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="opacity-55" />
                  <XAxis dataKey="name" stroke="var(--secondary)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--secondary)" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  />
                  <Bar dataKey="score" name="Avg Stability" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={30}>
                    {areaData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score >= 80 ? "var(--success)" : entry.score >= 60 ? "var(--accent)" : "var(--danger)"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {isDecisionsLoading ? (
        <Card className="p-6">
          <div className="space-y-3">
            <div className="h-4 bg-border/50 rounded w-1/4 animate-pulse" />
            <div className="h-24 bg-border/20 rounded animate-pulse" />
          </div>
        </Card>
      ) : (
        <>
          {/* History Search */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search decision history..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-2 text-xs text-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
            {historySearch && (
              <button
                onClick={() => setHistorySearch("")}
                className="text-xs text-secondary hover:text-text transition-colors select-none"
              >
                Clear
              </button>
            )}
          </div>
          <HistoryCard decisions={filteredDecisions} />
        </>
      )}
    </div>
  );
}
