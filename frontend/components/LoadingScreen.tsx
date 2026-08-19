"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    // Prevent scrolling while loading is active
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const duration = 1200; // 1.2s loading duration
    const intervalTime = 15; // 15ms update interval
    const step = (100 / duration) * intervalTime;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          // Transition state
          setTimeout(() => {
            setFadeOut(true);
            // Wait for fadeout animation (500ms) to unmount
            setTimeout(() => {
              setVisible(false);
              document.body.style.overflow = '';
              document.body.style.position = '';
              document.body.style.touchAction = '';
            }, 500);
          }, 150);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background select-none transition-all duration-500 ease-out-expo ${
        fadeOut ? "opacity-0 scale-98 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(circle at center, var(--surface) 0%, var(--background) 100%)"
      }}
    >
      {/* Brand & Loading Container */}
      <div className="flex flex-col items-center space-y-6 max-w-[280px] w-full text-center">
        {/* Pulsing Logo */}
        <div className="relative w-14 h-14 animate-pulse-gentle">
          <Image
            src={isDark ? "/impactq_dark.jpg" : "/impactq_light.jpg"}
            alt="ImpactQ Logo"
            fill
            className="object-contain rounded-md"
            priority
          />
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1">
          <h1 className="font-sans font-bold text-xl text-text tracking-tight">
            ImpactQ
          </h1>
          <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.25em] pl-[0.25em] opacity-75">
            Decision Intelligence
          </p>
        </div>

        {/* Animated Progress Bar & Percentage */}
        <div className="w-48 space-y-2 pt-2">
          {/* Track */}
          <div className="h-[2px] w-full bg-border rounded-full overflow-hidden">
            {/* Fill */}
            <div
              className="h-full bg-accent transition-all duration-75 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Percentage Counter */}
          <div className="flex justify-between items-center text-[9px] font-mono text-secondary px-0.5">
            <span className="uppercase tracking-wider font-semibold opacity-60">Initializing</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Decorative details */}
      <div className="absolute bottom-8 text-[9px] font-mono text-secondary/40 tracking-wider">
        DET-MODEL v1.4.0 // READY
      </div>
    </div>
  );
}
