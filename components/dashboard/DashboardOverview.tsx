"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDashboard } from "@/contexts/DashboardContext";
import { apiFetch } from "@/lib/api";
import DashboardProgress from "@/components/dashboard/DashboardProgress";
import Spinner from "@/components/ui/Spinner";
import type { PortfolioContent } from "@/types/portfolio";

interface Stats {
  viewsTotal: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
}

interface FeedbackItem {
  id: number;
  rating: number;
  message: string | null;
  createdAt: string;
}

function completionScore(content: PortfolioContent | undefined): number {
  if (!content) return 0;
  const { profile, skills, experiences = [], projects = [], education = [], contact } = content;
  let score = 0;
  const max = 10;
  if (typeof profile?.name === "string" && profile.name.trim()) score += 1;
  if (typeof profile?.title === "string" && profile.title.trim()) score += 1;
  if (typeof profile?.bio === "string" && profile.bio.trim()) score += 1;
  if (typeof profile?.photo === "string" && profile.photo.trim()) score += 1;
  if (skills && Object.keys(skills).length > 0) score += 1;
  if (experiences.length > 0) score += 1;
  if (projects.length > 0) score += 1;
  if (education.length > 0) score += 1;
  if (typeof contact?.email === "string" && contact.email.trim()) score += 1;
  const links = profile?.links;
  if (links?.linkedin || links?.github || links?.website) score += 1;
  return Math.min(100, Math.round((score / max) * 100));
}

export default function DashboardOverview() {
  const { portfolio, loading, getPreviewUrl, updateVisibility } = useDashboard();
  const [stats, setStats] = useState<Stats | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const slug = portfolio?.slug ?? "";
  const isPublic = portfolio?.isPublic ?? false;
  const publicUrl = slug ? `${baseUrl}/p/${slug}` : "";
  const qrImageUrl = publicUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`
    : "";

  useEffect(() => {
    if (!portfolio) return;
    Promise.all([
      apiFetch<Stats>("/me/portfolio/stats").catch(() => null),
      apiFetch<{ feedbacks: FeedbackItem[] }>("/me/portfolio/feedbacks").then((r) => r.feedbacks).catch(() => []),
    ]).then(([s, f]) => {
      setStats(s ?? null);
      setFeedbacks(Array.isArray(f) ? f : []);
    }).finally(() => setOverviewLoading(false));
  }, [portfolio?.id]);

  const score = completionScore(portfolio?.content);
  const lastFeedback = feedbacks[feedbacks.length - 1];

  async function handlePreview() {
    setPreviewLoading(true);
    try {
      const url = await getPreviewUrl();
      window.open(url, "_blank");
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handlePublish() {
    if (!portfolio) return;
    setVisibilityLoading(true);
    try {
      await updateVisibility(!portfolio.isPublic);
    } finally {
      setVisibilityLoading(false);
    }
  }

  function copyLink() {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
      {/* En-tête + score */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-dashboard-card dashboard-card-hover">
        <h1 className="text-2xl font-bold text-white mb-1">Vue d&apos;ensemble</h1>
        <p className="text-white/60 text-sm mb-6">
          Bienvenue sur votre espace. Complétez votre profil et consultez les statistiques.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="shrink-0 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xl font-bold text-orange-400 tabular-nums">{score}%</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80">Score de complétion</p>
              <div className="mt-1.5 w-32">
                <DashboardProgress />
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/profil"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 transition-colors"
          >
            Compléter mon profil
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/dashboard/apercu"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-colors"
          >
            Voir l&apos;aperçu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats + dernier avis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-dashboard-card dashboard-card-hover">
          <h2 className="text-lg font-semibold text-white mb-4">Statistiques de vues</h2>
          {overviewLoading ? (
            <div className="flex items-center gap-2 text-white/50">
              <Spinner size="sm" /> Chargement…
            </div>
          ) : stats ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-xl font-bold text-orange-400 tabular-nums">{stats.viewsTotal}</p>
                <p className="text-xs text-white/50 mt-0.5">Total</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-xl font-bold text-white/80 tabular-nums">{stats.viewsLast7Days}</p>
                <p className="text-xs text-white/50 mt-0.5">7 jours</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-xl font-bold text-white/80 tabular-nums">{stats.viewsLast30Days}</p>
                <p className="text-xs text-white/50 mt-0.5">30 jours</p>
              </div>
            </div>
          ) : (
            <p className="text-white/50 text-sm">Publiez votre portfolio pour voir les vues.</p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-dashboard-card dashboard-card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Dernier avis</h2>
            {feedbacks.length > 0 && (
              <Link
                href="/dashboard/outils"
                className="text-xs text-orange-400 hover:text-orange-300"
              >
                Voir tous ({feedbacks.length})
              </Link>
            )}
          </div>
          {overviewLoading ? (
            <div className="flex items-center gap-2 text-white/50">
              <Spinner size="sm" /> Chargement…
            </div>
          ) : lastFeedback ? (
            <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm">
              <span className="text-orange-400">{"★".repeat(lastFeedback.rating)}{"☆".repeat(5 - lastFeedback.rating)}</span>
              {lastFeedback.message && <p className="mt-1 text-white/80 line-clamp-2">{lastFeedback.message}</p>}
              <p className="text-white/40 text-xs mt-1">{new Date(lastFeedback.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
          ) : (
            <p className="text-white/50 text-sm">Aucun avis pour l&apos;instant. Partagez le lien « Donner mon avis » sur votre portfolio.</p>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-dashboard-card dashboard-card-hover">
        <h2 className="text-lg font-semibold text-white mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 disabled:opacity-50 transition-colors"
          >
            {previewLoading ? <Spinner size="sm" /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
            Voir mon portfolio
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={visibilityLoading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors ${
              isPublic
                ? "bg-white/10 text-white/80 hover:bg-white/15 border border-white/20"
                : "bg-orange-500 text-[var(--color-bg)] hover:bg-orange-400"
            }`}
          >
            {visibilityLoading ? <Spinner size="sm" /> : isPublic ? "Dépublier" : "Publier"}
          </button>
          {isPublic && publicUrl && (
            <>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 border border-white/20 transition-colors"
              >
                {copied ? "Copié !" : "Copier le lien"}
              </button>
              {qrImageUrl && (
                <a
                  href={qrImageUrl}
                  download={`qr-${slug || "portfolio"}.png`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 border border-white/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger le QR code
                </a>
              )}
              <Link
                href="/dashboard/outils"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 border border-white/20 transition-colors"
              >
                Voir les derniers avis
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Aperçu live (iframe si public) */}
      {isPublic && publicUrl && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-dashboard-card dashboard-card-hover">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Aperçu</h2>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              Ouvrir en plein écran →
            </a>
          </div>
          <div className="relative h-[360px] bg-white/5">
            <iframe
              src={publicUrl}
              title="Aperçu du portfolio"
              className="absolute inset-0 w-full h-full border-0 rounded-b-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
