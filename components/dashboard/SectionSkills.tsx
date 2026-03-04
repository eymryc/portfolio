"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { SkillsSection } from "@/types/portfolio";

export default function SectionSkills() {
  const { portfolio, replaceSection } = useDashboard();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const skills: SkillsSection = portfolio?.content?.skills ?? {};
  const [categories, setCategories] = useState<{ name: string; items: string[] }[]>([]);

  useEffect(() => {
    const list = Object.entries(skills).map(([name, items]) => ({
      name,
      items: Array.isArray(items) ? [...items] : [],
    }));
    setCategories(list);
  }, [portfolio?.id, JSON.stringify(skills)]);

  function addCategory() {
    setCategories((c) => [...c, { name: "", items: [] }]);
  }

  function removeCategory(i: number) {
    setCategories((c) => c.filter((_, idx) => idx !== i));
  }

  function setCategoryName(i: number, name: string) {
    setCategories((c) => {
      const next = [...c];
      next[i] = { ...next[i], name };
      return next;
    });
  }

  function setCategoryItems(i: number, items: string[]) {
    setCategories((c) => {
      const next = [...c];
      next[i] = { ...next[i], items };
      return next;
    });
  }

  function addItem(catIndex: number) {
    setCategoryItems(catIndex, [...categories[catIndex].items, ""]);
  }

  function setItem(catIndex: number, itemIndex: number, value: string) {
    const next = [...categories[catIndex].items];
    next[itemIndex] = value;
    setCategoryItems(catIndex, next);
  }

  function removeItem(catIndex: number, itemIndex: number) {
    setCategoryItems(
      catIndex,
      categories[catIndex].items.filter((_, j) => j !== itemIndex)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const obj: SkillsSection = {};
      categories.forEach((cat) => {
        const name = cat.name.trim() || "Compétences";
        const items = cat.items.map((s) => s.trim()).filter(Boolean);
        if (items.length) obj[name] = items;
      });
      await replaceSection("skills", { ...obj });
      setSuccess("Compétences enregistrées.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Alert type="success" message={success} onDismiss={() => setSuccess("")} autoDismissMs={4000} />
      )}
      {error && (
        <Alert type="error" message={error} onDismiss={() => setError("")} />
      )}
      {categories.map((cat, i) => (
        <div key={i} className="border border-white/10 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={cat.name}
              onChange={(e) => setCategoryName(i, e.target.value)}
              placeholder="Ex: Frontend, Backend"
              className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={() => removeCategory(i)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Supprimer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((item, j) => (
              <span key={j} className="flex items-center gap-1 bg-white/10 rounded px-2 py-1 text-sm">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(i, j, e.target.value)}
                  className="w-24 bg-transparent border-none focus:ring-0 text-white p-0"
                />
                <button type="button" onClick={() => removeItem(i, j)} className="text-white/50 hover:text-white">
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => addItem(i)}
              className="text-orange-400 text-sm hover:underline"
            >
              + Ajouter
            </button>
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <button type="button" onClick={addCategory} className="text-orange-400 text-sm hover:underline">
          + Nouvelle catégorie
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-orange-500 text-[var(--color-bg)] rounded-lg font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors inline-flex items-center gap-2 min-w-[120px] justify-center"
        >
          {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
