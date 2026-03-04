"use client";

import Link from "next/link";
import { useDashboard } from "@/contexts/DashboardContext";
import type { PortfolioContent } from "@/types/portfolio";

const ITEMS: { key: string; label: string; href: string; check: (c: PortfolioContent) => boolean }[] = [
  {
    key: "profile",
    label: "Compléter le profil (nom, titre, bio)",
    href: "/dashboard/profil",
    check: (c) => {
      const p = c.profile as Record<string, unknown> | undefined;
      return !!(p?.name && p?.title && p?.bio);
    },
  },
  {
    key: "photo",
    label: "Ajouter une photo de profil",
    href: "/dashboard/profil",
    check: (c) => !!(c.profile as Record<string, unknown> | undefined)?.photo,
  },
  {
    key: "skills",
    label: "Renseigner des compétences",
    href: "/dashboard/sections/skills",
    check: (c) => {
      const s = c.skills as Record<string, unknown> | undefined;
      return !!s && Object.keys(s).length > 0;
    },
  },
  {
    key: "experiences",
    label: "Ajouter au moins une expérience",
    href: "/dashboard/sections/experiences",
    check: (c) => ((c.experiences as unknown[])?.length ?? 0) > 0,
  },
  {
    key: "projects",
    label: "Ajouter au moins un projet",
    href: "/dashboard/sections/projects",
    check: (c) => ((c.projects as unknown[])?.length ?? 0) > 0,
  },
  {
    key: "education",
    label: "Ajouter une formation",
    href: "/dashboard/sections/education",
    check: (c) => ((c.education as unknown[])?.length ?? 0) > 0,
  },
  {
    key: "contact",
    label: "Renseigner l’email de contact",
    href: "/dashboard/sections/contact",
    check: (c) => !!(c.contact as Record<string, unknown> | undefined)?.email,
  },
];

export default function DashboardChecklist() {
  const { portfolio } = useDashboard();
  const content = portfolio?.content ?? {};
  const done = ITEMS.filter((i) => i.check(content)).length;
  const total = ITEMS.length;

  if (!portfolio) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-semibold text-white mb-1">Guide de complétion</h2>
      <p className="text-white/50 text-sm mb-4">
        {done}/{total} étapes
      </p>
      <ul className="space-y-2">
        {ITEMS.map((item) => {
          const ok = item.check(content);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 text-sm ${ok ? "text-white/50" : "text-white/80 hover:text-orange-400"}`}
              >
                <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${ok ? "bg-emerald-500/30 text-emerald-400" : "bg-white/10 text-white/50"}`}>
                  {ok ? "✓" : "·"}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
