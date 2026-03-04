"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDashboard } from "@/contexts/DashboardContext";
import { apiFetch } from "@/lib/api";
import DashboardPageCard from "@/components/dashboard/DashboardPageCard";
import SectionSeo from "@/components/dashboard/SectionSeo";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { TemplateMeta } from "@/types/portfolio";

export default function DesignPage() {
  const { portfolio, loading, updateTemplate } = useDashboard();
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<TemplateMeta[]>("/templates?designed=1", { skipAuth: true })
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, []);

  async function handleSelect(templateId: string) {
    if (!portfolio || portfolio.templateId === templateId) return;
    setError("");
    setSuccess("");
    setSavingId(templateId);
    try {
      await updateTemplate(templateId, null);
      setSuccess("Design mis à jour.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingId(null);
    }
  }

  if (loading || !portfolio) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8">
        <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-6" />
        <div className="space-y-3">
          <div className="h-10 rounded bg-white/10 animate-pulse" />
          <div className="h-10 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <DashboardPageCard title="Design du portfolio">
      <p className="text-white/60 text-sm mb-6">
        Choisissez le modèle d’affichage de votre page publique. Le contenu reste inchangé.
      </p>
      {success && <Alert type="success" message={success} onDismiss={() => setSuccess("")} autoDismissMs={4000} />}
      {error && <Alert type="error" message={error} onDismiss={() => setError("")} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((t) => {
          const isCurrent = portfolio.templateId === t.id;
          const saving = savingId === t.id;
          return (
            <div
              key={t.id}
              className={`rounded-xl border p-4 transition-all ${
                isCurrent
                  ? "border-orange-500/50 bg-orange-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <h3 className="font-semibold text-white">{t.name}</h3>
              {t.description && <p className="text-white/60 text-sm mt-1">{t.description}</p>}
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/templates/${t.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-400 hover:underline"
                >
                  Aperçu
                </Link>
                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleSelect(t.id)}
                    disabled={!!savingId}
                    className="ml-auto px-3 py-1.5 rounded-lg bg-orange-500 text-[var(--color-bg)] text-sm font-medium hover:bg-orange-400 disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Application…</> : "Choisir"}
                  </button>
                )}
                {isCurrent && (
                  <span className="ml-auto text-xs text-orange-400 font-medium">Actuel</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {templates.length === 0 && (
        <p className="text-white/50 text-sm">Aucun template disponible.</p>
      )}

      <div className="mt-10 pt-8 border-t border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">SEO (référencement)</h2>
        <SectionSeo />
      </div>
    </DashboardPageCard>
  );
}
