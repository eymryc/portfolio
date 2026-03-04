"use client";

interface DashboardPageCardProps {
  title: string;
  /** Optional actions (e.g. Prévisualiser, Publier) shown top-right */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardPageCard({ title, actions, children }: DashboardPageCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden animate-dashboard-card dashboard-card-hover shadow-dashboard-card">
      <div className="px-6 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
