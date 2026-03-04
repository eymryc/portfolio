"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import Spinner from "@/components/ui/Spinner";

/**
 * Page Aperçu : iframe du portfolio (preview URL) qui se met à jour
 * quand le portfolio est sauvegardé (portfolio dans le context change).
 */
export default function DashboardApercuPage() {
  const { portfolio, loading: dashboardLoading, getPreviewUrl } = useDashboard();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentSignature = portfolio?.content ? JSON.stringify(portfolio.content) : "";

  // Refaire un aperçu quand le portfolio change (ex. après sauvegarde ailleurs)
  useEffect(() => {
    if (dashboardLoading || !portfolio) {
      setLoading(dashboardLoading);
      return;
    }
    let cancelled = false;
    setError(null);
    setLoading(true);
    getPreviewUrl()
      .then((url) => {
        if (!cancelled) {
          setPreviewUrl(url);
          setIframeKey((k) => k + 1);
        }
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [portfolio?.id, contentSignature, getPreviewUrl, dashboardLoading, portfolio]);

  async function handleRefresh() {
    setError(null);
    setLoading(true);
    try {
      const url = await getPreviewUrl();
      setPreviewUrl(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (dashboardLoading || !portfolio) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 shadow-dashboard-card flex items-center justify-center min-h-[420px]">
        <Spinner className="text-orange-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Aperçu</h1>
          <p className="text-white/60 text-sm mt-0.5">
            Rendu actuel de votre portfolio. Il se met à jour après chaque sauvegarde.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Spinner size="sm" className="border-t-orange-400" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Rafraîchir l&apos;aperçu
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-dashboard-card dashboard-card-hover">
        <div className="relative bg-white/5 min-h-[480px] flex items-center justify-center">
          {loading && !previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="text-orange-400" />
            </div>
          ) : previewUrl ? (
            <iframe
              key={iframeKey}
              src={previewUrl}
              title="Aperçu du portfolio"
              className="w-full h-[70vh] min-h-[480px] border-0 rounded-b-xl"
            />
          ) : (
            <p className="text-white/50">Impossible de charger l&apos;aperçu.</p>
          )}
        </div>
      </div>
    </div>
  );
}
