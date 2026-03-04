"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, apiPost, apiExtractFromCv } from "@/lib/api";
import type { TemplateMeta } from "@/types/portfolio";

/** Génère un slug valide (minuscules, tirets) à partir d'un texte. */
function slugFromString(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "";
}

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [slug, setSlug] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [extractFromCvCheckbox, setExtractFromCvCheckbox] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const cvInputRef = React.useRef<HTMLInputElement>(null);
  const slugSuggestedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!loading && user?.hasPortfolio) {
      router.push("/dashboard");
      return;
    }
    apiFetch<TemplateMeta[]>("/templates?designed=1", { skipAuth: true })
      .then((list) => {
        setTemplates(list);
        if (list.length && !templateId) setTemplateId(list[0].id);
      })
      .catch(() => setTemplates([]));
  }, [user, loading, router, templateId]);

  // Suggestion initiale du slug à partir du nom (une seule fois)
  useEffect(() => {
    if (loading || !user || slugSuggestedRef.current) return;
    const suggested = slugFromString(user.name) || slugFromString(user.email.split("@")[0] || "");
    if (suggested) {
      setSlug(suggested);
      slugSuggestedRef.current = true;
    }
  }, [user, loading]);

  function suggestSlugFromName() {
    if (!user) return;
    const suggested = slugFromString(user.name) || slugFromString(user.email.split("@")[0] || "portfolio");
    setSlug(suggested || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const slugClean = slugFromString(slug);
    setSubmitting(true);
    try {
      await apiPost(
        "/me/portfolio",
        {
          template_id: templateId,
          template_version: null,
          ...(slugClean ? { slug: slugClean } : {}),
        }
      );
      if (cvFile && extractFromCvCheckbox && cvFile.type.includes("pdf")) {
        await apiExtractFromCv(cvFile, true);
      }
      window.location.href = "/dashboard";
      return;
    } catch (err) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const msg = e.errors ? Object.values(e.errors).flat().join(" ") : e.message;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || (!user && !loading)) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Créer mon portfolio</h1>
        <p className="text-white/60 mb-6">
          Choisissez un template et votre adresse personnalisée (ex: romaric-ouangni).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm text-white/70 mb-2">Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <label htmlFor="slug" className="block text-sm text-white/70">
                Votre URL : /p/<strong>votre-slug</strong>
              </label>
              <button
                type="button"
                onClick={suggestSlugFromName}
                className="text-orange-400 text-xs hover:underline whitespace-nowrap"
              >
                Générer depuis mon nom
              </button>
            </div>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="jean-dupont (ou laissez vide)"
              className="w-full bg-white/5 border border-white/20 rounded px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30"
            />
            <p className="text-white/50 text-xs mt-1">
              Optionnel. Minuscules, chiffres et tirets. Laissez vide pour une génération automatique.
            </p>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/5 p-4 space-y-3">
            <p className="text-sm font-medium text-white/90">Optionnel : importer votre CV</p>
            <input
              type="file"
              ref={cvInputRef}
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setCvFile(f ?? null);
                if (!f) setExtractFromCvCheckbox(false);
              }}
            />
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className="text-orange-400 text-sm hover:underline"
            >
              {cvFile ? cvFile.name : "Choisir un fichier PDF"}
            </button>
            {cvFile && (
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={extractFromCvCheckbox}
                  onChange={(e) => setExtractFromCvCheckbox(e.target.checked)}
                  className="rounded border-white/30 text-orange-500 focus:ring-orange-500"
                />
                <span>Extraire les données de mon CV pour remplir mon portfolio</span>
              </label>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 text-[var(--color-bg)] py-2 rounded font-medium hover:bg-orange-400 disabled:opacity-50"
          >
            {submitting ? (cvFile && extractFromCvCheckbox ? "Création et extraction du CV…" : "Création…") : "Créer mon portfolio"}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link href="/" className="text-white/50 text-sm hover:text-white/70">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
