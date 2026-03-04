"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import SectionProfile from "@/components/dashboard/SectionProfile";
import DashboardPageCard from "@/components/dashboard/DashboardPageCard";
import DashboardChecklist from "@/components/dashboard/DashboardChecklist";

export default function DashboardProfilPage() {
  const { portfolio, loading } = useDashboard();

  if (loading || !portfolio) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 shadow-dashboard-card">
        <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-6" />
        <div className="space-y-3">
          <div className="h-10 rounded bg-white/10 animate-pulse" />
          <div className="h-10 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardChecklist />
      <DashboardPageCard title="Profil">
        <SectionProfile />
      </DashboardPageCard>
    </div>
  );
}
