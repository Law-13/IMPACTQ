"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Binary } from "lucide-react";

export function LoadingSkeleton() {
  const [dots, setDots] = useState("");

  // Simple loading text dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Loading Status Header */}
      <div className="flex items-center gap-3.5 p-5 bg-surface border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.01)] select-none">
        <div className="p-2.5 rounded-lg bg-accent/10 text-accent animate-pulse shrink-0">
          <Binary size={20} className="animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider">
            Analyzing Decision{dots}
          </h2>
          <p className="text-xs text-secondary">
            Resolving organizational constraints, scoring stability, and mapping cascading impacts.
          </p>
        </div>
      </div>

      {/* Main Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Constraints Card Skeleton */}
          <Card>
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-border animate-pulse" />
              <div className="w-32 h-4 bg-border rounded-md animate-pulse" />
            </div>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                  <div className="w-5 h-5 rounded bg-border animate-pulse mt-0.5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-border rounded-md animate-pulse" />
                    <div className="w-1/4 h-3 bg-border rounded-md animate-pulse" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Impacts Card Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Impacts */}
            <Card>
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-border animate-pulse" />
                <div className="w-24 h-4 bg-border rounded-md animate-pulse" />
              </div>
              <CardContent className="p-6 space-y-4">
                {[1, 2].map((idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg space-y-2">
                    <div className="w-full h-4 bg-border rounded-md animate-pulse" />
                    <div className="w-1/3 h-3 bg-border rounded-md animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Negative Impacts */}
            <Card>
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-border animate-pulse" />
                <div className="w-24 h-4 bg-border rounded-md animate-pulse" />
              </div>
              <CardContent className="p-6 space-y-4">
                {[1, 2].map((idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg space-y-2">
                    <div className="w-full h-4 bg-border rounded-md animate-pulse" />
                    <div className="w-1/3 h-3 bg-border rounded-md animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Stability Gauge Card Skeleton */}
          <Card className="flex flex-col items-center p-6 text-center">
            <div className="w-24 h-4 bg-border rounded-md animate-pulse mb-6" />
            <div className="w-28 h-28 rounded-full border-4 border-border/40 border-t-accent animate-spin mb-6" />
            <div className="w-3/4 h-3 bg-border rounded-md animate-pulse" />
          </Card>

          {/* Affected Areas Skeleton */}
          <Card>
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-border animate-pulse" />
              <div className="w-28 h-4 bg-border rounded-md animate-pulse" />
            </div>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="w-20 h-4 bg-border rounded-md animate-pulse" />
                    <div className="w-8 h-4 bg-border rounded-md animate-pulse" />
                  </div>
                  <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-border animate-pulse" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decision Compass Card Skeleton */}
      <Card className="border-border">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-border animate-pulse" />
          <div className="w-36 h-4 bg-border rounded-md animate-pulse" />
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="w-1/3 h-5 bg-border rounded-md animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-3">
              <div className="w-full h-4 bg-border rounded-md animate-pulse" />
              <div className="w-5/6 h-4 bg-border rounded-md animate-pulse" />
              <div className="w-full h-4 bg-border rounded-md animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-border rounded-md animate-pulse" />
              <div className="w-2/3 h-4 bg-border rounded-md animate-pulse" />
              <div className="w-full h-4 bg-border rounded-md animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
