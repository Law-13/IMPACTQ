"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Landing page (/) is public. All other subpages use the sidebar layout.
  const isPublicPage = pathname === "/";

  if (isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar isPublic={true} />
        <main className="flex-1 animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-text">
      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} isPublic={false} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 animate-in fade-in duration-300">
          <div className="max-w-5xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

