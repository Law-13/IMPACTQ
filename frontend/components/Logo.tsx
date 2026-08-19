"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  forceDark?: boolean;
}

export function Logo({ className, width = 28, height = 28, showText = true, forceDark = false }: LogoProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (forceDark) return;
    
    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));

    // Observe changes to the 'class' attribute of documentElement
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [forceDark]);

  const activeLogo = (forceDark || isDark) ? "/impactq_dark.jpg" : "/impactq_light.jpg";

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <Image
        src={activeLogo}
        alt="ImpactQ Logo"
        width={width}
        height={height}
        className="object-contain rounded-md"
        priority
      />
      {showText && (
        <span className="font-sans font-bold text-lg text-text tracking-tight">
          ImpactQ
        </span>
      )}
    </div>
  );
}

