"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password, passwordConfirmation);
    } catch (err) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const msg = e.errors
        ? Object.values(e.errors).flat().join(" ")
        : e.message;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white flex flex-col lg:flex-row">
      {/* Bloc image / visuel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-amber-600/15 via-orange-500/10 to-transparent">
        <div className="absolute inset-0">
          <div className="absolute bottom-1/3 -left-24 w-72 h-72 rounded-full bg-amber-500/20 blur-[100px]" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-orange-500/15 blur-[110px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <p className="text-orange-400/90 text-sm font-medium uppercase tracking-widest mb-4">
            Créez votre portfolio
          </p>
          <h2 className="text-2xl xl:text-3xl font-bold text-white/95 max-w-sm mb-4">
            En quelques minutes, un site pro à votre image.
          </h2>
          <p className="text-white/60 max-w-sm text-lg">
            Choisissez un template, remplissez vos infos et publiez. Sans coder.
          </p>
          <div className="mt-12 flex items-center gap-3 text-white/50 text-sm">
            <span className="flex h-10 w-10 rounded-full bg-white/10 items-center justify-center text-orange-400">1</span>
            <span>Inscription</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-white/50 text-sm">
            <span className="flex h-10 w-10 rounded-full bg-white/10 items-center justify-center text-orange-400">2</span>
            <span>Template + slug</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-white/50 text-sm">
            <span className="flex h-10 w-10 rounded-full bg-white/10 items-center justify-center text-orange-400">3</span>
            <span>Remplir et publier</span>
          </div>
        </div>
      </div>

      {/* Bande visuelle mobile */}
      <div className="lg:hidden h-32 flex items-center justify-center px-6 bg-gradient-to-br from-amber-600/15 to-orange-500/10 border-b border-white/10">
        <p className="text-white/80 text-center text-sm font-medium max-w-xs">
          En quelques minutes, un site pro à votre image.
        </p>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-8 bg-white p-10 rounded-lg" aria-label="Portfolio as a Service">
            <Image src="/assets/logo-pas-without-fond.png" alt="PAS" width={171} height={80} className="h-20 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Créer mon portfolio</h1>
          <p className="text-white/60 mb-6">Inscription — vous choisirez votre template à l&apos;étape suivante.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="name" className="block text-sm text-white/70 mb-1">
                Nom
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
              />
            </div>
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
                minLength={8}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm text-white/70 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 text-[var(--color-bg)] py-2.5 rounded-lg font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Inscription…" : "S'inscrire"}
            </button>
          </form>
          <p className="mt-6 text-white/60 text-sm text-center">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-orange-400 hover:underline">
              Se connecter
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
