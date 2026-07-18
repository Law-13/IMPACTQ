"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Binary, 
  Sliders, 
  Settings,
  CornerDownLeft,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

const commandItems = [
  { name: "Go to Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
  { name: "Go to Analyze Decision", href: "/analyze", icon: Binary, shortcut: "G A" },
  { name: "Go to Simulation", href: "/simulate", icon: Sliders, shortcut: "G S" },
  { name: "Go to Settings", href: "/settings", icon: Settings, shortcut: "G P" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K to toggle
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (!isOpen) return;

      // Close on escape
      if (e.key === "Escape") {
        setIsOpen(false);
      }

      // Arrow down
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commandItems.length);
      }

      // Arrow up
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commandItems.length) % commandItems.length);
      }

      // Enter to trigger
      if (e.key === "Enter") {
        e.preventDefault();
        const activeItem = commandItems[selectedIndex];
        if (activeItem) {
          router.push(activeItem.href);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, router]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Disable scrolling when command palette is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div 
        ref={menuRef}
        className="w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search header (placeholder style) */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Type a command..."
            className="flex-1 bg-transparent border-0 outline-none text-sm text-text placeholder:text-secondary focus:ring-0 focus:outline-none"
            disabled
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center h-5 select-none rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-secondary">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="p-2 max-h-80 overflow-y-auto">
          <div className="px-2 py-1 text-[10px] font-semibold text-secondary uppercase tracking-wider">
            Navigation
          </div>
          <div className="space-y-0.5 mt-1">
            {commandItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors select-none",
                    isSelected 
                      ? "bg-accent/10 text-accent font-medium" 
                      : "text-text hover:bg-background/80"
                  )}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isSelected ? "text-accent" : "text-secondary"} />
                    <span>{item.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <span className="flex items-center gap-0.5 text-[10px] text-accent/70 font-mono">
                        <span>Select</span>
                        <CornerDownLeft size={10} />
                      </span>
                    )}
                    <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-background text-secondary">
                      {item.shortcut}
                    </kbd>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-border bg-background/30 flex items-center justify-between text-[11px] text-secondary">
          <span className="flex items-center gap-1">
            Use <kbd className="px-1 border rounded font-mono">↑</kbd> <kbd className="px-1 border rounded font-mono">↓</kbd> to navigate
          </span>
          <span>
            Press <kbd className="px-1 border rounded font-mono">Enter</kbd> to select
          </span>
        </div>
      </div>
    </div>
  );
}
