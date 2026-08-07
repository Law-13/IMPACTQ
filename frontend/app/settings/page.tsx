"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

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
        description="Configure your preferences."
      />

      <div className="max-w-2xl space-y-6">
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
      </div>
    </div>
  );
}

