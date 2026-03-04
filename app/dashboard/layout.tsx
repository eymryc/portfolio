"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardProvider, useDashboard, SECTIONS } from "@/contexts/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const SECTION_LABELS: Record<string, string> = {
  profile: "Profil",
  skills: "Compétences",
  experiences: "Expériences",
  projects: "Projets",
  education: "Formation",
  testimonials: "Témoignages",
  services: "Services / Tarifs",
  contact: "Contact",
};

const iconClass = "w-4 h-4 shrink-0";

const Icons = {
  overview: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  profile: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  apercu: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  skills: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  experiences: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  projects: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  education: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  testimonials: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  services: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7a2 2 0 010-2.828l7-7A1.994 1.994 0 0112 3h-5a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
  ),
  contact: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  design: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343L12.657 5.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  tools: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  home: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};

function completionBadge(content: Record<string, unknown> | undefined): number {
  if (!content) return 0;
  const profile = content.profile as Record<string, unknown> | undefined;
  const skills = content.skills as Record<string, unknown> | undefined;
  const experiences = (content.experiences ?? []) as unknown[];
  const projects = (content.projects ?? []) as unknown[];
  const education = (content.education ?? []) as unknown[];
  const contact = content.contact as Record<string, unknown> | undefined;
  let score = 0;
  const max = 10;
  if (String(profile?.name ?? "").trim()) score += 1;
  if (String(profile?.title ?? "").trim()) score += 1;
  if (String(profile?.bio ?? "").trim()) score += 1;
  if (String(profile?.photo ?? "").trim()) score += 1;
  if (skills && Object.keys(skills).length > 0) score += 1;
  if (experiences.length > 0) score += 1;
  if (projects.length > 0) score += 1;
  if (education.length > 0) score += 1;
  if (String(contact?.email ?? "").trim()) score += 1;
  const links = profile?.links as Record<string, string> | undefined;
  if (links?.linkedin || links?.github || links?.website) score += 1;
  return Math.min(100, Math.round((score / max) * 100));
}

function NavLink({
  href,
  isActive,
  icon,
  children,
  badge,
}: { href: string; isActive: boolean; icon?: React.ReactNode; children: React.ReactNode; badge?: string | number }) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-2.5 pl-3 pr-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2 dashboard-btn-press ${
        isActive
          ? "bg-orange-500/20 text-orange-400 border-orange-400 font-medium shadow-[inset_0_0_0_1px_rgba(249,115,22,0.15)]"
          : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="flex-1 min-w-0 truncate">{children}</span>
      {badge != null && badge !== "" && (
        <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-white/70 tabular-nums">
          {badge}
        </span>
      )}
    </Link>
  );
}

function DashboardSidebar() {
  const pathname = usePathname();
  const { portfolio, loading, error } = useDashboard();
  const isOverview = pathname === "/dashboard";
  const isProfil = pathname === "/dashboard/profil";
  const isApercu = pathname === "/dashboard/apercu";
  const isDesign = pathname === "/dashboard/design";
  const isOutils = pathname === "/dashboard/outils";
  const sectionSlug = pathname.startsWith("/dashboard/sections/") ? pathname.split("/").pop() ?? "" : "";

  const completion = portfolio?.content ? completionBadge(portfolio.content as unknown as Record<string, unknown>) : 0;

  if (loading) {
    return (
      <aside className="w-60 shrink-0 border-r border-white/10 bg-white/[0.02] flex flex-col">
        <div className="p-5">
          <div className="h-8 rounded bg-white/10 animate-pulse" />
          <div className="mt-3 h-4 w-3/4 rounded bg-white/10 animate-pulse" />
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {SECTIONS.slice(0, 4).map((i) => (
            <div key={i} className="h-9 rounded bg-white/10 animate-pulse" />
          ))}
        </nav>
      </aside>
    );
  }
  if (error) {
    return (
      <aside className="w-60 shrink-0 border-r border-white/10 p-5">
        <p className="text-red-400 text-sm rounded-lg bg-red-400/10 border border-red-400/30 px-3 py-2">{error}</p>
      </aside>
    );
  }

  return (
    <aside className="w-60 shrink-0 border-r border-white/10 bg-white/[0.02] flex flex-col">
      <nav className="flex-1 p-3 space-y-0.5 pt-5" aria-label="Sections du portfolio">
        <NavLink href="/dashboard" isActive={isOverview} icon={Icons.overview} badge={portfolio ? `${completion}%` : undefined}>
          Vue d&apos;ensemble
        </NavLink>

        <p className="pt-4 pb-1.5 px-3 text-[10px] uppercase tracking-wider text-white/40 font-medium">Contenu</p>
        <NavLink href="/dashboard/profil" isActive={isProfil} icon={Icons.profile}>
          {SECTION_LABELS.profile}
        </NavLink>
        <NavLink href="/dashboard/apercu" isActive={isApercu} icon={Icons.apercu}>
          Aperçu
        </NavLink>
        {SECTIONS.filter((s) => s !== "profile").map((s) => (
          <NavLink
            key={s}
            href={`/dashboard/sections/${s}`}
            isActive={sectionSlug === s}
            icon={Icons[s as keyof typeof Icons] ?? Icons.skills}
          >
            {SECTION_LABELS[s] ?? s}
          </NavLink>
        ))}

        <p className="pt-4 pb-1.5 px-3 text-[10px] uppercase tracking-wider text-white/40 font-medium">Visibilité</p>
        <NavLink href="/dashboard/design" isActive={isDesign} icon={Icons.design}>
          Design
        </NavLink>
        <NavLink href="/dashboard/outils" isActive={isOutils} icon={Icons.tools}>
          Outils
        </NavLink>
      </nav>
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
        >
          {Icons.home}
          Retour à l&apos;accueil
        </Link>
      </div>
    </aside>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1 min-h-0">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 animate-dashboard-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardProvider>
  );
}
