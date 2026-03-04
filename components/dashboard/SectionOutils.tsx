"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { apiFetch, apiPost } from "@/lib/api";
import DashboardPageCard from "@/components/dashboard/DashboardPageCard";

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

export default function SectionOutils() {
  const { portfolio } = useDashboard();
  const [stats, setStats] = useState<Stats | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [featuredSent, setFeaturedSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const publicUrl = typeof window !== "undefined" && portfolio?.slug
    ? `${window.location.origin}/p/${portfolio.slug}`
    : "";
  const qrUrl = publicUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`
    : "";

  useEffect(() => {
    Promise.all([
      apiFetch<Stats>("/me/portfolio/stats").catch(() => null),
      apiFetch<{ feedbacks: FeedbackItem[] }>("/me/portfolio/feedbacks").then((r) => r.feedbacks).catch(() => []),
    ]).then(([s, f]) => {
      setStats(s ?? null);
      setFeedbacks(Array.isArray(f) ? f : []);
    }).finally(() => setLoading(false));
  }, []);

  const profile = portfolio?.content?.profile ?? {};
  const name = profile.name ?? "Portfolio";
  const title = profile.title ?? "";
  const completion = portfolio?.content
    ? (() => {
        const c = portfolio.content;
        let score = 0;
        let max = 0;
        if (c.profile) {
          max += 4;
          if (c.profile.name) score += 1;
          if (c.profile.photo) score += 1;
          if (c.profile.bio) score += 1;
          if (c.profile.title) score += 1;
        }
        if (c.experiences?.length) { max += 1; if (c.experiences.length > 0) score += 1; }
        if (c.projects?.length) { max += 1; if (c.projects.length > 0) score += 1; }
        if (c.contact?.email) { max += 1; score += 1; }
        return max ? Math.round((score / max) * 100) : 0;
      })()
    : 0;

  const emailSignatureHtml = publicUrl
    ? `<!-- Signature email -->\n<div style="font-family: sans-serif; font-size: 14px; color: #333;">\n  <strong>${name.replace(/</g, "&lt;")}</strong><br/>\n  ${title ? `${(title as string).replace(/</g, "&lt;")}<br/>\n  ` : ""}<a href="${publicUrl}" style="color: #ea580c;">Voir mon portfolio</a>\n</div>`
    : "";

  async function handleFeaturedRequest() {
    try {
      await apiPost("/me/portfolio/featured-request", {});
      setFeaturedSent(true);
    } catch {}
  }

  if (loading) {
    return (
      <DashboardPageCard title="Outils & visibilité">
        <p className="text-white/50">Chargement…</p>
      </DashboardPageCard>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageCard title="Qui a visité mon portfolio ?">
        {stats ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">{stats.viewsTotal}</p>
              <p className="text-xs text-white/50 mt-1">Total vues</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-2xl font-bold text-white/80">{stats.viewsLast7Days}</p>
              <p className="text-xs text-white/50 mt-1">7 derniers jours</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-2xl font-bold text-white/80">{stats.viewsLast30Days}</p>
              <p className="text-xs text-white/50 mt-1">30 derniers jours</p>
            </div>
          </div>
        ) : (
          <p className="text-white/50 text-sm">Publiez votre portfolio pour voir les statistiques.</p>
        )}
      </DashboardPageCard>

      <DashboardPageCard title="Avis reçus">
        {feedbacks.length === 0 ? (
          <p className="text-white/50 text-sm">Aucun avis pour l&apos;instant. Partagez le lien « Donner mon avis » sur votre portfolio.</p>
        ) : (
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {feedbacks.map((f) => (
              <li key={f.id} className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm">
                <span className="text-orange-400">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</span>
                {f.message && <p className="mt-1 text-white/80">{f.message}</p>}
                <p className="text-white/40 text-xs mt-1">{new Date(f.createdAt).toLocaleDateString("fr-FR")}</p>
              </li>
            ))}
          </ul>
        )}
      </DashboardPageCard>

      <DashboardPageCard title="Score de complétion">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${completion}%` }} />
          </div>
          <span className="text-lg font-semibold text-white/90">{completion}%</span>
        </div>
        <p className="text-white/50 text-xs mt-2">
          {completion < 100 ? "Complétez votre profil, expériences et projets pour améliorer votre visibilité." : "Votre portfolio est bien rempli."}
        </p>
      </DashboardPageCard>

      <DashboardPageCard title="QR code & PDF">
        {qrUrl ? (
          <div className="flex flex-wrap items-start gap-4">
            <div className="rounded-lg border border-white/20 overflow-hidden bg-white">
              <img src={qrUrl} alt="QR code" width={200} height={200} />
            </div>
            <div className="text-sm text-white/70">
              <p className="mb-2">Scannez le QR code pour ouvrir votre portfolio (carte de visite, CV imprimé).</p>
              <p>Pour une version PDF : ouvrez votre portfolio, puis utilisez « Imprimer » (Ctrl+P) et « Enregistrer au format PDF ».</p>
            </div>
          </div>
        ) : (
          <p className="text-white/50 text-sm">Publiez votre portfolio pour générer le QR code.</p>
        )}
      </DashboardPageCard>

      <DashboardPageCard title="Badge pour LinkedIn / GitHub">
        {publicUrl ? (
          <div className="space-y-3">
            <p className="text-white/70 text-sm">Copiez ce lien à afficher sur votre profil :</p>
            <code className="block rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-xs text-orange-300 break-all">
              {publicUrl}
            </code>
            <p className="text-white/50 text-xs">Ou ajoutez un lien « Voir mon portfolio » vers l&apos;URL ci-dessus.</p>
          </div>
        ) : (
          <p className="text-white/50 text-sm">Publiez votre portfolio pour obtenir le lien.</p>
        )}
      </DashboardPageCard>

      <DashboardPageCard title="Signature email">
        {emailSignatureHtml ? (
          <div className="space-y-2">
            <p className="text-white/70 text-sm">Copiez le code ci-dessous dans les paramètres de signature de votre messagerie (Gmail, Outlook, etc.) :</p>
            <textarea
              readOnly
              value={emailSignatureHtml}
              rows={6}
              className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 text-xs text-white/80 font-mono resize-y"
            />
          </div>
        ) : (
          <p className="text-white/50 text-sm">Renseignez votre profil pour générer la signature.</p>
        )}
      </DashboardPageCard>

      <DashboardPageCard title="Portfolio de la semaine">
        <p className="text-white/70 text-sm mb-3">Proposez votre portfolio pour être mis en avant sur la page d&apos;accueil.</p>
        <button
          type="button"
          onClick={handleFeaturedRequest}
          disabled={featuredSent}
          className="px-4 py-2 rounded-lg bg-orange-500 text-[var(--color-bg)] font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors"
        >
          {featuredSent ? "Candidature envoyée" : "Proposer mon portfolio"}
        </button>
      </DashboardPageCard>
    </div>
  );
}
