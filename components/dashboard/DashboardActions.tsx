"use client";

import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";

export default function DashboardActions() {
  const { portfolio, getPreviewUrl, updateVisibility } = useDashboard();
  const [previewLoading, setPreviewLoading] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

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
      const res = await updateVisibility(!portfolio.isPublic);
      setPublicUrl(res.publicUrl ?? null);
    } finally {
      setVisibilityLoading(false);
    }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const slug = portfolio?.slug ?? "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handlePreview}
        disabled={previewLoading}
        className="px-3 py-1.5 border border-orange-500/50 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/10 disabled:opacity-50 transition-colors"
      >
        {previewLoading ? "Génération…" : "Prévisualiser"}
      </button>
      <button
        type="button"
        onClick={handlePublish}
        disabled={visibilityLoading}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors ${
          portfolio?.isPublic
            ? "bg-white/10 text-white/80 hover:bg-white/15 border border-white/20"
            : "bg-orange-500 text-[var(--color-bg)] hover:bg-orange-400"
        }`}
      >
        {visibilityLoading ? "…" : portfolio?.isPublic ? "Dépublier" : "Publier"}
      </button>
      {(portfolio?.isPublic || publicUrl) && slug && (
        <a
          href={`${baseUrl}/p/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-orange-400 hover:bg-white/5 transition-colors truncate max-w-[200px]"
          title={`${baseUrl}/p/${slug}`}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Voir la page
        </a>
      )}
    </div>
  );
}
