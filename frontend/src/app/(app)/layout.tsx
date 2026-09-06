"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full">
      {!sidebarCollapsed && (
        <Sidebar
          isCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(true)}
        />
      )}
      <main className="flex-1 h-full overflow-hidden">
        {children}
      </main>
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-lg bg-sidebar-bg/80 backdrop-blur-xl border border-accent-primary/20 text-sidebar-icon hover:text-text-primary hover:border-accent-primary transition-colors duration-200 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
          aria-label="Open menu"
        >
          Menu
        </button>
      )}
    </div>
  );
}
