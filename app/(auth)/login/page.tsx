"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error & { errors?: Record<string, string[]> }).errors?.email?.[0] ?? (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white flex flex-col lg:flex-row">
      {/* Bloc image / visuel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-amber-600/10 to-transparent">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-orange-500/20 blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-amber-500/15 blur-[120px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <p className="text-orange-400/90 text-sm font-medium uppercase tracking-widest mb-4">
            Portfolio as a Service
          </p>
          <h2 className="text-2xl xl:text-3xl font-bold text-white/95 max-w-sm mb-4">
            Reprenez là où vous en étiez. Votre portfolio vous attend.
          </h2>
          <p className="text-white/60 max-w-sm text-lg">
            Gérez votre contenu, changez de template et publiez en un clic.
          </p>
          <div className="mt-12 flex items-center gap-3 text-white/50 text-sm">
            <span className="flex h-10 w-10 rounded-full bg-white/10 items-center justify-center text-orange-400">✓</span>
            <span>Dashboard simple et rapide</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-white/50 text-sm">
            <span className="flex h-10 w-10 rounded-full bg-white/10 items-center justify-center text-orange-400">✓</span>
            <span>Prévisualisation avant publication</span>
          </div>
        </div>
      </div>

      {/* Bande visuelle mobile */}
      <div className="lg:hidden h-32 flex items-center justify-center px-6 bg-gradient-to-br from-orange-500/15 to-amber-600/10 border-b border-white/10">
        <p className="text-white/80 text-center text-sm font-medium max-w-xs">
          Reprenez là où vous en étiez. Votre portfolio vous attend.
        </p>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-8 bg-white p-10 rounded-lg" aria-label="Portfolio as a Service">
            <Image src="/assets/logo-pas-without-fond.png" alt="PAS" width={171} height={80} className="h-20 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Connexion</h1>
          <p className="text-white/60 mb-6">Accédez à votre dashboard portfolio.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="email" className="block text-sm text-white/70 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-white/70 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 text-[var(--color-bg)] py-2.5 rounded-lg font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <p className="mt-6 text-white/60 text-sm text-center">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-orange-400 hover:underline">
              Créer mon portfolio
            </Link>
          </p>
          <p className="mt-2 text-center">
            <Link href="/" className="text-white/50 text-sm hover:text-white/70">
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
