"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Binary, 
  Sliders, 
  Settings as SettingsIcon,
  X
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analyze", href: "/analyze", icon: Binary },
    { name: "Simulation", href: "/simulate", icon: Sliders },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-surface border-r border-border transform lg:translate-x-0 transition-transform duration-300 ease-in-out lg:sticky lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Main Navigation"
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/dashboard" onClick={onClose} className="focus-visible:outline-none">
            <Logo />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-secondary hover:text-text hover:bg-background lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive 
                    ? "text-accent bg-accent/[0.04] dark:bg-accent/[0.08]" 
                    : "text-secondary hover:text-text hover:bg-background"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-accent rounded-r-md transition-all duration-300" />
                )}
                <Icon 
                  size={18} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-accent" : "text-secondary group-hover:text-text"
                  )} 
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Version info */}
        <div className="p-4 border-t border-border bg-background/20 text-center">
          <span className="text-[10px] tracking-wider text-secondary font-mono">
            IMPACTQ V1.0.0
          </span>
        </div>
      </aside>
    </>
  );
}
