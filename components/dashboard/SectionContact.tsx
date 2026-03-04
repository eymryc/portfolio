"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { ContactSection } from "@/types/portfolio";

export default function SectionContact() {
  const { portfolio, replaceSection } = useDashboard();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const contact: ContactSection = portfolio?.content?.contact ?? {};
  const [form, setForm] = useState({
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    messagePlaceholder: contact.messagePlaceholder ?? "",
  });

  useEffect(() => {
    setForm({
      email: contact.email ?? "",
      phone: contact.phone ?? "",
      messagePlaceholder: contact.messagePlaceholder ?? "",
    });
  }, [portfolio?.id, portfolio?.content?.contact]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await replaceSection("contact", form);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {success && (
        <Alert type="success" message={success} onDismiss={() => setSuccess("")} autoDismissMs={4000} />
      )}
      {error && (
        <Alert type="error" message={error} onDismiss={() => setError("")} />
      )}
      <div>
        <label htmlFor="email" className="block text-sm text-white/70 mb-1">Email de contact</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm text-white/70 mb-1">Téléphone</label>
        <input
          id="phone"
          type="text"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="placeholder" className="block text-sm text-white/70 mb-1">Placeholder du formulaire</label>
        <input
          id="placeholder"
          type="text"
          value={form.messagePlaceholder}
          onChange={(e) => setForm((f) => ({ ...f, messagePlaceholder: e.target.value }))}
          placeholder="Ex: Contactez-moi"
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
        />
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
