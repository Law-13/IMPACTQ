"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

interface NavbarProps {
  onMenuClick?: () => void;
  isPublic?: boolean;
}

export function Navbar({ onMenuClick, isPublic = false }: NavbarProps) {
  const pathname = usePathname();

  // Get Breadcrumb from path
  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/analyze") return "Analyze Decision";
    if (pathname === "/simulate") return "Simulation";
    if (pathname === "/settings") return "Settings";
    return "";
  };

  if (isPublic) {
    return (
      <header className="sticky top-0 z-40 w-full bg-surface/60 backdrop-blur-xl border-b border-border/50 shadow-sm shadow-black/[0.02] transition-colors">
        <div className="max-w-5xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link href="/" className="focus-visible:outline-none">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-secondary hover:text-text transition-colors">
              Features
            </a>
            <a href="#workflow" className="text-sm font-medium text-secondary hover:text-text transition-colors">
              How it Works
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/analyze" className="focus-visible:outline-none">
              <Button size="sm" variant="primary">
                Analyze Decision
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-surface/60 backdrop-blur-xl border-b border-border/50 shadow-sm shadow-black/[0.02] flex items-center justify-between px-6 transition-colors">
      {/* Left side: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-md text-secondary hover:text-text hover:bg-background lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-secondary select-none">ImpactQ</span>
          <span className="text-border select-none">/</span>
          <span className="text-text font-semibold">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Right side: Status indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-success/20 bg-success/5 text-xs text-success font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>Active Session</span>
        </div>
      </div>
    </header>
  );
}

