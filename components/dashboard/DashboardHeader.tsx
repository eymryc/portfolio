"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDashboard } from "@/contexts/DashboardContext";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/ui/Spinner";
import DashboardProgress from "@/components/dashboard/DashboardProgress";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const { portfolio, loading, getPreviewUrl, updateVisibility } = useDashboard();
  const [previewLoading, setPreviewLoading] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);

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

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const slug = portfolio?.slug ?? "";
  const isPublic = portfolio?.isPublic ?? false;

  return (
    <header className="shrink-0 border-b border-white/10 bg-white/[0.04] backdrop-blur-sm">
      <div className="px-6 py-4">
        {/* Ligne 1 : Logo + identité + actions */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5 min-w-0">
            <Link href="/" className="shrink-0" aria-label="Portfolio as a Service - Accueil">
              <Image
                src="/assets/logo-pas.png"
                alt="PAS"
                width={100}
                height={28}
                className="h-7 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="min-w-0 border-l border-white/10 pl-5">
              <h1 className="text-lg font-bold text-white truncate">Mon portfolio</h1>
              <div className="flex flex-wrap items-center gap-2 gap-y-0.5 mt-0.5">
                <p className="text-sm text-white/60 truncate flex items-center gap-2 flex-wrap">
                  {user?.name && <span>{user.name}</span>}
                  {user?.name && slug && <span className="text-white/40">·</span>}
                  {!loading && portfolio && (
                    <>
                      <span className="text-orange-400/90">/{slug}</span>
                      {typeof portfolio.viewsCount === "number" && (
                        <span className="text-white/40 text-xs">
                          · {portfolio.viewsCount} vue{portfolio.viewsCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </>
                  )}
                </p>
                {!loading && portfolio && (
                  <span
                    className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPublic
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                        : "bg-white/10 text-white/70 border border-white/20"
                    }`}
                  >
                    {isPublic ? "Publié" : "Brouillon"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewLoading || loading}
            className="dashboard-btn-press inline-flex items-center gap-2 px-3 py-2 border border-orange-500/50 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/10 disabled:opacity-50 transition-colors"
          >
            {previewLoading ? (
              <><Spinner size="sm" className="border-t-orange-900" /> Génération…</>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Prévisualiser
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={visibilityLoading || loading}
            className={`dashboard-btn-press inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-transform ${
              isPublic
                ? "bg-white/10 text-white/80 hover:bg-white/15 border border-white/20"
                : "bg-orange-500 text-[var(--color-bg)] hover:bg-orange-400"
            }`}
          >
            {visibilityLoading ? (
              <><Spinner size="sm" className="border-t-orange-900" /> …</>
            ) : isPublic ? (
              "Dépublier"
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Publier
              </>
            )}
          </button>
          {isPublic && slug && (
            <>
              <a
                href={`${baseUrl}/p/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-orange-400 hover:bg-white/5 transition-colors"
                title={`${baseUrl}/p/${slug}`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Voir la page
              </a>
              <a
                href={`${baseUrl}/p/${slug}?print=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                title="Ouvrir pour imprimer ou enregistrer en PDF"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer / PDF
              </a>
            </>
          )}
          <span className="hidden sm:inline w-px h-6 bg-white/10 rounded-full" aria-hidden />
          <button
            type="button"
            onClick={() => logout()}
            className="dashboard-btn-press inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Se déconnecter"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
        </div>

        {/* Ligne 2 : Barre de complétion */}
        {!loading && portfolio && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40 shrink-0">Complétion</p>
              <div className="flex-1 min-w-0 max-w-md">
                <DashboardProgress />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
