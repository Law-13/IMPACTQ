"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings, Key, Server } from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check local storage or document class on mount
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings"
        description="Configure preferences and explore system information."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column (Theme & Metadata) */}
        <div className="md:col-span-2 space-y-6">
          {/* Theme Preferences */}
          <Card>
            <CardHeader className="py-4 border-b border-border bg-background/5 select-none">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">
                Theme Toggle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text">Interface Appearance</h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Switch between light and dark modes. Defaults to light.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="h-9 gap-1.5 select-none"
              >
                {theme === "light" ? (
                  <>
                    <Moon size={14} />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={14} className="text-amber-500" />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Placeholder for future API configuration */}
          <Card className="border-dashed">
            <CardHeader className="py-4 border-b border-border bg-background/5 select-none">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
                <Settings size={14} className="text-secondary" />
                <span>API Connections & Engines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-secondary leading-relaxed select-none">
                These settings are reserved for the FastAPI server and Gemini AI integration. They will become fully active in Sprint 2 and Sprint 3.
              </p>

              <div className="space-y-3 opacity-60 pointer-events-none select-none">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
                    FastAPI Endpoint
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-border bg-background rounded-md text-xs text-secondary font-mono">
                    <Server size={14} />
                    <span>http://localhost:8000/api/v1</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
                    Gemini Model
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-border bg-background rounded-md text-xs text-secondary font-mono">
                    <Key size={14} />
                    <span>gemini-1.5-pro-latest</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column (Metadata) */}
        <div>
          <Card>
            <CardHeader className="py-4 border-b border-border bg-background/5 select-none">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">
                About Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 select-none">
              <div className="space-y-1">
                <span className="text-[9px] font-semibold text-secondary uppercase tracking-wider block">
                  Application Version
                </span>
                <span className="text-xs font-bold text-text font-mono">
                  1.0.0-sprint1
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-semibold text-secondary uppercase tracking-wider block">
                  Engineering Spec
                </span>
                <span className="text-xs text-text leading-relaxed block">
                  Built as a high-fidelity frontend shell with mock scenarios and custom radial charts.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
