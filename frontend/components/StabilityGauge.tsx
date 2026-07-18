"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StabilityGaugeProps {
  score: number;
  size?: number;
  className?: string;
}

export function StabilityGauge({ score, size = 120, className }: StabilityGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth number animation count up
    setAnimatedScore(0);
    const duration = 600; // ms
    const startTime = performance.now();

    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      setAnimatedScore(Math.round(easeProgress * score));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  // SVG calculations
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine status color
  const getColorClass = (val: number) => {
    if (val >= 80) return "stroke-success text-success";
    if (val >= 60) return "stroke-amber-500 text-amber-500";
    return "stroke-danger text-danger";
  };

  const colorClass = getColorClass(score);

  return (
    <div className={cn("flex flex-col items-center justify-center select-none", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-40"
          />
          {/* Active track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-300 ease-out", colorClass.split(" ")[0])}
          />
        </svg>

        {/* Text overlays in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-extrabold tracking-tight font-mono", colorClass.split(" ")[1])}>
            {animatedScore}
          </span>
          <span className="text-[9px] text-secondary uppercase font-semibold tracking-wider mt-0.5">
            Stability
          </span>
        </div>
      </div>
    </div>
  );
}
