"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function FeedbackPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch(`${getApiUrl()}/portfolios/${slug}`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.content?.profile?.name) setProfileName(data.content.profile.name);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!slug || rating < 1 || rating > 5) return;
    try {
      const res = await fetch(`${getApiUrl()}/portfolios/${slug}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ rating, message: message.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      setSubmitted(true);
    } catch {
      setError("Impossible d'enregistrer votre avis. Réessayez.");
    }
  }

  if (loading || !slug) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-white flex items-center justify-center">
        <p className="text-white/60">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href={`/p/${slug}`} className="text-sm text-white/60 hover:text-white mb-6 inline-block">
          ← Retour au portfolio
        </Link>
        {submitted ? (
          <div className="rounded-xl border border-white/20 bg-white/5 p-8 text-center">
            <p className="text-lg font-medium text-green-400">Merci pour votre avis !</p>
            <p className="text-white/60 mt-2 text-sm">Votre retour a bien été enregistré.</p>
            <Link href={`/p/${slug}`} className="mt-6 inline-block text-orange-400 hover:underline text-sm">
              Revenir au portfolio
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Donner mon avis</h1>
            <p className="text-white/60 mb-6">
              Vous consultez le portfolio de <strong className="text-white/90">{profileName || "cet auteur"}</strong>. Votre avis sera visible par le propriétaire.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div>
                <label className="block text-sm text-white/70 mb-2">Note (1 à 5 étoiles)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`w-10 h-10 rounded-lg border text-lg transition-colors ${
                        rating >= n
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-white/20 text-white/50 hover:border-white/40"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-white/70 mb-1">Message (optionnel)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Quelque chose à dire à l'auteur ?"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={rating < 1}
                className="w-full py-3 rounded-lg bg-orange-500 text-[var(--color-bg)] font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors"
              >
                Envoyer mon avis
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
