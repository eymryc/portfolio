"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import RevealSection from "@/components/ui/RevealSection";
import { apiFetch } from "@/lib/api";
import type { TemplateMeta } from "@/types/portfolio";

const PREVIEW_SCROLL_DURATION = 4500;
const PREVIEW_SCROLL_MAX = 700;
const PREVIEW_RESET_DURATION = 600;

function TemplatePreviewCard({
  t,
  user,
}: {
  t: TemplateMeta;
  user: { hasPortfolio: boolean } | null;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const startScrollRef = useRef(0);
  const startTimeRef = useRef(0);

  const scrollIframeTo = (y: number) => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (win) win.scrollTo(0, y);
    } catch {
      // cross-origin or not loaded
    }
  };

  const stopAnimation = () => {
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const animateScroll = (targetY: number, durationMs: number, onEnd?: () => void) => {
    stopAnimation();
    const startY = startScrollRef.current;
    const startTime = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = 1 - (1 - t) * (1 - t);
      const y = Math.round(startY + (targetY - startY) * eased);
      scrollIframeTo(y);
      startScrollRef.current = y;
      if (t < 1) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
        onEnd?.();
      }
    };
    rafIdRef.current = requestAnimationFrame(tick);
  };

  const handleMouseEnter = () => {
    try {
      const win = iframeRef.current?.contentWindow;
      const doc = iframeRef.current?.contentDocument;
      if (!win || !doc) return;
      startScrollRef.current = win.scrollY;
      const maxScroll = Math.max(0, (doc.documentElement?.scrollHeight ?? 0) - (doc.documentElement?.clientHeight ?? 0));
      const target = Math.min(PREVIEW_SCROLL_MAX, maxScroll);
      if (target > 0) animateScroll(target, PREVIEW_SCROLL_DURATION);
    } catch {
      // ignore
    }
  };

  const handleMouseLeave = () => {
    startScrollRef.current = iframeRef.current?.contentWindow?.scrollY ?? 0;
    animateScroll(0, PREVIEW_RESET_DURATION, stopAnimation);
  };

  useEffect(() => () => stopAnimation(), []);

  return (
    <div
      className="card-lift group relative rounded-2xl border border-theme bg-black/[0.02] overflow-hidden hover:border-orange-500/25 hover:bg-orange-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[4/3] min-h-[240px] bg-theme/5 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`/templates/${t.id}`}
          title={`Aperçu du template ${t.name}`}
          className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-[0.35] origin-top-left"
          style={{ width: "285.71%", height: "285.71%" }}
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 text-theme">{t.name}</h3>
        {t.description && (
          <p className="text-theme-muted text-sm mb-4 line-clamp-2">{t.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/templates/${t.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-muted hover:text-theme text-sm font-medium transition"
          >
            Voir l’aperçu complet
          </Link>
          {!user && (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium hover:underline"
            >
              Choisir ce template
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Création en quelques minutes",
    description: "Inscription, choix du template, remplissage des sections : votre portfolio en ligne sans coder.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Templates professionnels",
    description: "Designs modernes et responsives, pensés pour mettre en valeur votre parcours et vos projets.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: "Publication en un clic",
    description: "Publiez ou dépubliez quand vous voulez. Lien public instantané, partageable partout.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    title: "Votre URL personnalisée",
    description: "Votre portfolio à votre nom : votreslug.com ou domaine personnalisé (optionnel).",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9a9 9 0 009 9m-9-9a9 9 0 009-9m9 9h.01" />
      </svg>
    ),
  },
];

const STEPS = [
  { num: "01", title: "Inscrivez-vous", text: "Créez votre compte en quelques secondes, sans engagement." },
  { num: "02", title: "Choisissez votre design", text: "Sélectionnez un template et personnalisez votre URL (ex. jean-dupont)." },
  { num: "03", title: "Remplissez et publiez", text: "Ajoutez profil, expériences, projets. Publiez quand vous êtes prêt." },
];

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    apiFetch<TemplateMeta[]>("/templates?designed=1", { skipAuth: true })
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => setTemplates([]));
  }, []);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(typeof window !== "undefined" && window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-orange-500/50 border-t-orange-400 rounded-full animate-spin" />
          <span className="text-orange-400/90 font-medium">Chargement…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-theme font-[var(--font-sans)] overflow-x-hidden">
      {/* ─── Header ───────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200 bg-white ${
          headerScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/assets/logo-pas-without-fond.png"
              alt="Portfolio as a Service"
              width={171}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="flex items-center gap-4 flex-wrap">
            <Link href="#accueil" className="text-sm text-gray-600 hover:text-gray-900 transition hidden sm:inline">
              Accueil
            </Link>
            <Link href="#apropos" className="text-sm text-gray-600 hover:text-gray-900 transition hidden sm:inline">
              À propos
            </Link>
            <Link href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition hidden sm:inline">
              Contact
            </Link>
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  href={user.hasPortfolio ? "/dashboard" : "/onboarding"}
                  className="text-sm font-medium text-orange-500 hover:text-orange-600 transition"
                >
                  {user.hasPortfolio ? "Mon portfolio" : "Créer mon portfolio"}
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-400 hover:to-orange-500 transition shadow-lg shadow-orange-500/25">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-400 hover:to-orange-500 transition shadow-lg shadow-orange-500/25"
                >
                  Créer mon portfolio
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ─── Hero (moderne) ──────────────────────────────────── */}
      <section id="accueil" className="relative min-h-screen flex items-center pt-24 pb-20 hero-grid overflow-hidden scroll-mt-0">
        {/* Fond : orbes + gradient radial */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(234,88,12,0.08),transparent_50%)]" />
          <div className="absolute top-1/4 -left-32 w-[480px] h-[480px] rounded-full bg-orange-500/15 blur-[140px] animate-[hero-glow_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 -right-24 w-[380px] h-[380px] rounded-full bg-amber-500/12 blur-[120px] animate-[hero-glow_10s_ease-in-out_infinite]" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-orange-400/8 blur-[100px] animate-[hero-float_12s_ease-in-out_infinite]" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          {/* Colonne gauche : texte */}
          <div className="flex-1 text-left min-w-0">
            <div className="fade-up inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <span className="text-sm font-medium text-orange-500">Gratuit · Sans engagement</span>
            </div>

            <h1 className="fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-theme mb-6" style={{ animationDelay: "0.05s" }}>
              <span className="block">Créez votre</span>
              <span className="gradient-text block mt-1">portfolio pro</span>
              <span className="block mt-1">sans coder</span>
            </h1>
            <p className="fade-up text-lg sm:text-xl text-theme-muted max-w-xl mb-4 leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Inscription, template, personnalisation. Publiez un site qui vous représente en quelques minutes.
            </p>
            <p className="fade-up text-sm text-theme-muted/80 mb-10" style={{ animationDelay: "0.15s" }}>
              Développeurs · Designers · Créatifs · Tous profils
            </p>

            {!user && (
              <div className="fade-up flex flex-col sm:flex-row items-start gap-3 sm:gap-4" style={{ animationDelay: "0.2s" }}>
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Commencer gratuitement
                  <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link
                  href="#templates"
                  className="inline-flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl font-medium text-black border border-theme hover:border-orange-500/40 hover:bg-orange-500/5 transition-colors"
                >
                  Voir les templates
                </Link>
              </div>
            )}

            <div className="fade-up mt-16 flex flex-col items-start gap-2 text-theme-muted/60" style={{ animationDelay: "0.4s" }}>
              <span className="text-xs font-medium uppercase tracking-widest">Découvrir</span>
              <a href="#apropos" className="flex flex-col items-center gap-1 text-theme-muted/60 hover:text-orange-500 transition-colors" aria-label="Aller à la section À propos">
                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </a>
            </div>
          </div>

          {/* Colonne droite : bloc image */}
          <div className="fade-up flex-shrink-0 lg:w-[45%] xl:w-[42%] flex justify-center lg:justify-end" style={{ animationDelay: "0.15s" }}>
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-theme bg-black/5 shadow-2xl shadow-black/20">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                {/* Illustration type aperçu portfolio / dashboard */}
                <div className="w-full h-full rounded-xl border border-theme bg-[var(--color-bg)] overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-theme">
                    <span className="w-3 h-3 rounded-full bg-orange-500/60" />
                    <span className="w-3 h-3 rounded-full bg-orange-500/30" />
                    <span className="w-3 h-3 rounded-full bg-orange-500/20" />
                    <span className="ml-2 text-xs text-theme-muted truncate flex-1">portfolio / votre-slug</span>
                  </div>
                  <div className="flex-1 flex gap-2 p-3">
                    <div className="w-1/4 rounded-lg bg-orange-500/10 border border-orange-500/20" />
                    <div className="flex-1 rounded-lg bg-black/5 border border-theme p-3 space-y-2">
                      <div className="h-2 w-3/4 rounded bg-theme-muted/20" />
                      <div className="h-2 w-full rounded bg-theme-muted/10" />
                      <div className="h-2 w-5/6 rounded bg-theme-muted/10" />
                      <div className="mt-4 flex gap-2">
                        <div className="h-8 flex-1 rounded bg-orange-500/20" />
                        <div className="h-8 w-16 rounded bg-theme-muted/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features (À propos) ───────────────────────────── */}
      <section id="apropos" className="relative py-28 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="mb-20">
              <p className="text-sm font-medium text-orange-500 uppercase tracking-widest mb-3">
                La plateforme
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-theme mb-5 max-w-2xl">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-theme-muted text-lg max-w-xl leading-relaxed">
                Une plateforme qui s&apos;adapte à tous les profils : numérique, design, création, communication, mode, enseignement.
              </p>
            </div>
          </RevealSection>

          <RevealSection stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="card-lift group relative p-6 md:p-7 rounded-2xl border border-theme bg-black/[0.02] hover:border-orange-500/25 hover:bg-orange-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-orange-400 bg-orange-500/10 mb-5 group-hover:bg-orange-500/20 group-hover:text-orange-300 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-theme">{feature.title}</h3>
                <p className="text-theme-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────── */}
      <section className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="mb-20">
              <p className="text-sm font-medium text-orange-500 uppercase tracking-widest mb-3">
                En 3 étapes
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-theme mb-5 max-w-2xl">
                Comment ça marche
              </h2>
              <p className="text-theme-muted text-lg max-w-xl leading-relaxed">
                Trois étapes pour un portfolio en ligne, sans prise de tête.
              </p>
            </div>
          </RevealSection>

          <RevealSection className="relative">
            {/* Ligne horizontale du stepper (desktop) */}
            <div
              className="hidden md:block absolute top-8 left-1/2 h-0.5 -translate-x-1/2 w-2/3 max-w-xl border-t-2 border-dashed border-orange-500/30"
              aria-hidden
            />
            <div className="relative flex flex-col md:flex-row md:items-stretch gap-0 md:gap-4">
              {STEPS.map((step, index) => (
                <div
                  key={step.num}
                  className="relative flex flex-col md:flex-1 md:items-center text-center pb-10 md:pb-0"
                >
                  {/* Tiret de liaison (mobile) entre les cercles */}
                  {index > 0 && (
                    <div
                      className="md:hidden absolute left-1/2 top-0 w-0.5 h-10 -mt-10 -translate-x-1/2 border-l-2 border-dashed border-orange-500/30"
                      aria-hidden
                    />
                  )}
                  {/* Cercle numéroté */}
                  <div className="relative z-10 flex justify-center md:mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-2 border-orange-500/40 flex items-center justify-center text-xl font-bold gradient-text shadow-lg shadow-orange-500/10 transition-all duration-300 hover:from-orange-500/30 hover:to-amber-600/30 hover:border-orange-500/60">
                      {step.num}
                    </div>
                  </div>
                  {/* Contenu de l’étape */}
                  <div className="card-lift group relative flex-1 p-20 md:p-20 rounded-2xl border border-theme bg-black/[0.02] hover:border-orange-500/25 hover:bg-orange-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 mt-4 md:mt-0">
                    <h3 className="font-semibold text-lg mb-2 text-theme uppercase">{step.title}</h3>
                    <p className="text-theme-muted text-sm leading-relaxed text-justify">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Pour tous les profils ───────────────────────────── */}
      <section className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="mb-20">
              <p className="text-sm font-medium text-orange-500 uppercase tracking-widest mb-3">
                Secteurs
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-theme mb-5 max-w-2xl">
                Un portfolio pour chaque métier
              </h2>
              <p className="text-theme-muted text-lg max-w-xl leading-relaxed">
                Profil, réalisations, expérience, formation et contact : une structure qui s&apos;adapte à votre secteur.
              </p>
            </div>
          </RevealSection>

          <RevealSection stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                label: "Numérique & design",
                sub: "Dev, UX/UI, graphistes, web designers",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
              },
              {
                label: "Créatifs & artistes",
                sub: "Photo, vidéo, illustration, arts",
                image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop",
              },
              {
                label: "Architecture",
                sub: "Architectes, décorateurs d'intérieur",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
              },
              {
                label: "Com & marketing",
                sub: "Rédacteurs, marketing digital, influenceurs",
                image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop",
              },
              {
                label: "Mode & modèle",
                sub: "Créateurs de mode, mannequins",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
              },
              {
                label: "Enseignement",
                sub: "Formateurs, étudiants, projets académiques",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
              },
            ].map(({ label, sub, image }) => (
              <div
                key={label}
                className="card-lift group rounded-2xl border border-theme bg-black/[0.02] overflow-hidden hover:border-orange-500/25 hover:bg-orange-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 text-center"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-theme/10">
                  <img
                    src={image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <p className="font-semibold text-theme">{label}</p>
                  <p className="mt-2 text-theme-muted text-sm leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* ─── Templates ───────────────────────────────────────── */}
      <section id="templates" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="mb-20">
              <p className="text-sm font-medium text-orange-500 uppercase tracking-widest mb-3">
                Designs
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-theme mb-5 max-w-2xl">
                Templates disponibles
              </h2>
            <p className="text-theme-muted text-lg max-w-xl leading-relaxed">
              Choisissez un design qui vous ressemble. Chaque template est responsive et prêt à l’emploi.
            </p>
            </div>
          </RevealSection>
          <RevealSection stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {templates.length === 0 ? (
              <div className="col-span-full py-16 px-6 rounded-2xl border border-dashed border-theme bg-black/[0.02] text-center">
                <p className="text-theme-muted mb-2">Aucun template pour le moment.</p>
                <p className="text-theme-muted text-sm opacity-80">Configurez les templates côté API (resources/templates/).</p>
              </div>
            ) : (
              templates.map((t) => (
                <TemplatePreviewCard key={t.id} t={t} user={user} />
              ))
            )}
          </RevealSection>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      {!user && (
        <section className="relative py-24 px-6">
          <RevealSection className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-600/10 p-12 md:p-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-theme">
                Prêt à vous lancer ?
              </h2>
              <p className="text-theme-muted mb-8">
                Créez votre portfolio en quelques minutes. Gratuit, sans engagement.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-orange-400 hover:bg-orange-300 transition shadow-lg shadow-orange-500/25"
              >
                Créer mon portfolio
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealSection>
        </section>
      )}

      {/* ─── Footer (Contact) ───────────────────────────────── */}
      <footer id="contact" className="py-16 px-6 scroll-mt-20 border-t border-theme">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
            {/* Logo + description */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/assets/logo-pas.png"
                  alt="Portfolio as a Service"
                  width={130}
                  height={36}
                  className="h-7 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="text-theme-muted text-sm leading-relaxed max-w-xs">
                Créez et publiez votre portfolio professionnel en quelques minutes. Sans coder.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-theme-muted mb-4">Navigation</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="#accueil" className="text-theme-muted hover:text-theme transition">Accueil</Link></li>
                <li><Link href="#apropos" className="text-theme-muted hover:text-theme transition">À propos</Link></li>
                <li><Link href="#templates" className="text-theme-muted hover:text-theme transition">Templates</Link></li>
                <li><Link href="#contact" className="text-theme-muted hover:text-theme transition">Contact</Link></li>
              </ul>
            </div>

            {/* Compte */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-theme-muted mb-4">Compte</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/login" className="text-theme-muted hover:text-theme transition">Connexion</Link></li>
                <li><Link href="/register" className="text-theme-muted hover:text-orange-400 transition">Créer un portfolio</Link></li>
              </ul>
            </div>

            {/* Légal / Infos */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-theme-muted mb-4">Informations</p>
              <ul className="space-y-2.5 text-sm text-theme-muted">
                <li><span>Portfolio as a Service</span></li>
                <li><span>Plateforme de création de portfolios en ligne</span></li>
                <li className="pt-2">
                  <Link href="/login" className="text-orange-400 hover:text-orange-300 transition text-sm font-medium">
                    Accéder au dashboard →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          </RevealSection>

          {/* Barre bas de footer */}
          <div className="pt-8 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-theme-muted">
            <p>© {new Date().getFullYear()} Portfolio as a Service. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-theme transition">Connexion</Link>
              <Link href="/register" className="hover:text-orange-400 transition">S&apos;inscrire</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
