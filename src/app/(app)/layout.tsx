"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { SideNav } from "@/components/layout/SideNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <DemoBanner />
        <div className="flex flex-1">
          <SideNav />
          <main className="flex flex-1 flex-col overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
