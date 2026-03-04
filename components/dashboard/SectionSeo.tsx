"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { SeoSection } from "@/types/portfolio";

export default function SectionSeo() {
  const { portfolio, replaceSection } = useDashboard();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const seo: SeoSection = portfolio?.content?.seo ?? {};
  const [form, setForm] = useState({ title: seo.title ?? "", description: seo.description ?? "" });

  useEffect(() => {
    setForm({ title: seo.title ?? "", description: seo.description ?? "" });
  }, [portfolio?.id, seo.title, seo.description]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await replaceSection("seo", { title: form.title || undefined, description: form.description || undefined });
      setSuccess("SEO enregistré.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && <Alert type="success" message={success} onDismiss={() => setSuccess("")} autoDismissMs={4000} />}
      {error && <Alert type="error" message={error} onDismiss={() => setError("")} />}
      <div>
        <label htmlFor="seo-title" className="block text-sm text-white/70 mb-1">Titre (meta, onglet du navigateur)</label>
        <input
          id="seo-title"
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Ex: Romaric Ouangni – Développeur Full Stack"
          maxLength={70}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
        />
        <p className="text-white/40 text-xs mt-1">{form.title.length}/70</p>
      </div>
      <div>
        <label htmlFor="seo-desc" className="block text-sm text-white/70 mb-1">Description (meta, moteurs de recherche)</label>
        <textarea
          id="seo-desc"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Courte description de votre profil pour Google."
          maxLength={160}
          rows={4}
          className="w-full min-h-[6rem] bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 resize-y transition-colors"
        />
        <p className="text-white/40 text-xs mt-1">{form.description.length}/160</p>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-orange-500 text-[var(--color-bg)] rounded-lg font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors inline-flex items-center gap-2 min-w-[120px] justify-center"
      >
        {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer"}
      </button>
    </form>
  );
}
