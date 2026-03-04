"use client";

import { useDashboard } from "@/contexts/DashboardContext";

/**
 * Calcule le pourcentage de complétion du portfolio (profil, sections remplies, etc.)
 * Pour démarquer le projet : incite l'utilisateur à compléter son portfolio.
 */
export default function DashboardProgress() {
  const { portfolio, loading } = useDashboard();

  if (loading || !portfolio) return null;

  const content = portfolio.content ?? {};
  const profile = content.profile ?? {};
  const skills = content.skills ?? {};
  const experiences = (content.experiences ?? []) as unknown[];
  const projects = (content.projects ?? []) as unknown[];
  const education = (content.education ?? []) as unknown[];
  const contact = content.contact ?? {};

  let score = 0;
  const max = 10;

  if (profile.name?.trim()) score += 1;
  if (profile.title?.trim()) score += 1;
  if (profile.bio?.trim()) score += 1;
  if (profile.photo?.trim()) score += 1;
  if (Object.keys(skills).length > 0) score += 1;
  if (experiences.length > 0) score += 1;
  if (projects.length > 0) score += 1;
  if (education.length > 0) score += 1;
  if (contact.email?.trim()) score += 1;
  if (profile.links?.linkedin || profile.links?.github || profile.links?.website) score += 1;

  const pct = Math.min(100, Math.round((score / max) * 100));

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex-1 min-w-0 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-white/60 shrink-0 tabular-nums">{pct}%</span>
    </div>
  );
}
