import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export function Logo({ className, width = 28, height = 28, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <Image
        src="/logo.png"
        alt="ImpactQ Logo"
        width={width}
        height={height}
        className="object-contain dark:invert"
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
