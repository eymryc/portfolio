"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { PortfolioData, PortfolioContent, ProjectItem } from "@/types/portfolio";

// ─── Charte graphique Classic ─────────────────────────────────────────────────
// Identité : intemporel, éditorial, sobre. Fond navy, accent or/cuivré.
// Typo : serif pour les titres (autorité, lecture), sans pour le corps.
// Formes : coins modérés (8–12px), filets fins, pas de dégradés vifs.
// Chaque template a sa propre identité ; Classic = professionnel établi.
// ─── Design Tokens ───────────────────────────────────────────────────────────
const BG = "#0c1222";           // Navy profond
const BG_CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_ACCENT = "rgba(201, 162, 39, 0.4)";
const GOLD = "#C9A227";          // Or sobre (CTA, titres, actif)
const GOLD_SOFT = "rgba(201, 162, 39, 0.12)";
const GOLD_MUTED = "#a68b2e";
const TEXT = "#f1f5f9";
const TEXT_MUTED = "#94a3b8";
const TEXT_SUBTLE = "#64748b";
const RADIUS = 10;
const RADIUS_SM = 6;
// Dégradé discret or → cuivré (remplace l’orange-rouge)
const GRADIENT = "linear-gradient(135deg, #C9A227, #B8860B)";

const PAGES = [
  { id: "index", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "projects", label: "Projets" },
  { id: "contact", label: "Contact" },
] as const;

function ClassicShareRow({ slug, profileName }: { slug: string; profileName: string }) {
  const [fullUrl, setFullUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setFullUrl(window.location.origin + "/p/" + slug);
  }, [slug]);
  if (!fullUrl) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10 text-sm">
      <span style={{ color: TEXT_SUBTLE }}>Partager</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: GOLD }}>LinkedIn</a>
      <a href={`https://wa.me/?text=${encodeURIComponent("Portfolio " + fullUrl)}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: GOLD }}>WhatsApp</a>
      <Link href={`/p/${slug}/feedback`} className="hover:underline" style={{ color: GOLD }}>
        Donner mon avis à {profileName}
      </Link>
    </div>
  );
}

interface ClassicProps {
  data: PortfolioData;
  page?: string;
}

function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setTimeout(() => setVisible(true), delay);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const dirClass =
    direction === "up"
      ? "translate-y-8"
      : direction === "down"
        ? "-translate-y-8"
        : direction === "left"
          ? "translate-x-8"
          : "-translate-x-8";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${dirClass}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Classic({ data, page }: ClassicProps) {
  const pathname = usePathname();
  const basePath =
    pathname?.match(/^\/templates\/[^/]+/)?.[0] ??
    pathname?.match(/^\/preview\/[^/]+/)?.[0] ??
    (data.slug ? `/p/${data.slug}` : "/");
  const rawPage = page === undefined || page === "index" ? "index" : page;
  const isProjectDetail = rawPage.startsWith("project-");
  const projectSlug = isProjectDetail ? rawPage.replace(/^project-/, "") : null;
  const currentPage = isProjectDetail ? "project" : rawPage;

  // data.content est déjà fusionné avec les valeurs par défaut (PortfolioRenderer → mergeContentWithDefaults)
  const content: PortfolioContent = data.content ?? {};
  const profile = content.profile ?? {};
  const skills = content.skills ?? {};
  const experiences = content.experiences ?? [];
  const projects = content.projects ?? [];
  const education = content.education ?? [];
  const contact = content.contact ?? {};
  const contactEmail = contact.email ?? "";
  const hasLinks =
    profile.links?.linkedin || profile.links?.github || profile.links?.website || profile.links?.cv;

  const [typeText, setTypeText] = useState("");
  const phrases = [profile.title ?? "Développeur", "Full Stack", "Créatif", "Passionné"].filter(
    Boolean
  );
  const phraseRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    const tick = () => {
      const phrase = phrases[phraseRef.current];
      if (!deletingRef.current) {
        charRef.current++;
        setTypeText(phrase.slice(0, charRef.current));
        if (charRef.current === phrase.length) {
          deletingRef.current = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charRef.current--;
        setTypeText(phrase.slice(0, charRef.current));
        if (charRef.current === 0) {
          deletingRef.current = false;
          phraseRef.current = (phraseRef.current + 1) % phrases.length;
        }
      }
      setTimeout(tick, deletingRef.current ? 50 : 90);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, [phrases.length]);

  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const isScrolled = scrollY > 60;

  const initials =
    (profile.name ?? "P")
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

  const navLinks = PAGES.map(({ id, label }) => ({
    href: id === "index" ? basePath : `${basePath}/${id}`,
    label,
    active: currentPage === id || (id === "projects" && currentPage === "project"),
  }));

  const projectDetail: ProjectItem | null =
    projectSlug && projects.find((p) => p.id === projectSlug) ? projects.find((p) => p.id === projectSlug)! : null;

  return (
    <div className="classic-template min-h-screen text-white antialiased" style={{ background: BG }}>
      <style>{`
        .classic-template { scroll-behavior: smooth; }
        .classic-template .classic-heading { font-family: Georgia, "Times New Roman", serif; }
        .classic-template button:focus-visible,
        .classic-template a:focus-visible,
        .classic-template input:focus-visible,
        .classic-template textarea:focus-visible { outline: 2px solid #C9A227; outline-offset: 2px; }
      `}</style>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "backdrop-blur-xl border-b" : "bg-transparent"
        }`}
        style={{
          background: isScrolled ? "rgba(12,18,34,0.88)" : "transparent",
          borderColor: isScrolled ? BORDER : "transparent",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-black transition-all duration-300 group-hover:scale-105"
              style={{ background: GRADIENT, fontFamily: "var(--font-mono)" }}
            >
              {initials}
            </div>
            <span className="font-semibold text-sm hidden sm:block tracking-wide" style={{ color: TEXT }}>
              {profile.name ?? "Portfolio"}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  color: link.active ? GOLD : TEXT_MUTED,
                }}
              >
                {link.active && (
                  <span
                    className="absolute inset-0 rounded-lg"
                    style={{ background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href={`${basePath}/contact`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:opacity-90 text-black"
              style={{ background: GRADIENT }}
            >
              Me contacter
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              className="p-2"
              style={{ color: TEXT }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-6 flex flex-col gap-2 backdrop-blur-xl border-t" style={{ background: "rgba(12,18,34,0.95)", borderColor: BORDER }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-left font-medium transition-colors"
                style={{
                  color: link.active ? GOLD : TEXT_MUTED,
                  ...(link.active ? { background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` } : {}),
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-24">
        {/* ——— Index (Hero) ——— */}
        {currentPage === "index" && (
          <section className="relative min-h-screen flex items-center overflow-hidden">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-30"
              style={{ background: `radial-gradient(circle, ${GOLD_SOFT}, transparent 70%)` }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-25"
              style={{ background: "radial-gradient(circle, rgba(184,134,11,0.15), transparent 70%)" }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  {(profile.openToWork ?? true) && (
                    <ScrollReveal delay={0}>
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-10"
                        style={{ background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` }}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" style={{ boxShadow: "0 0 6px #34d399" }} />
                        <span className="text-sm font-medium" style={{ color: GOLD, fontFamily: "var(--font-mono)" }}>
                          {profile.openToWorkMessage?.trim() || "Disponible pour des projets"}
                        </span>
                      </div>
                    </ScrollReveal>
                  )}

                  <ScrollReveal delay={100}>
                    <h1
                      className="classic-heading mb-2"
                      style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 600, lineHeight: 1.1, color: TEXT }}
                    >
                      {(profile.name ?? "Portfolio").split(/\s+/)[0]}
                      <br />
                      <span className="bg-clip-text" style={{ background: GRADIENT }}>
                        {(profile.name ?? "Portfolio").split(/\s+/).slice(1).join(" ") || "Portfolio"}
                      </span>
                    </h1>
                  </ScrollReveal>

                  <ScrollReveal delay={200}>
                    <div className="mb-6 h-12 flex items-center">
                      <span className="text-2xl md:text-3xl font-light" style={{ color: TEXT_MUTED, fontFamily: "var(--font-mono)" }}>
                        {typeText}
                        <span className="animate-pulse" style={{ color: GOLD }}>|</span>
                      </span>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={300}>
                    <p className="text-lg leading-relaxed mb-10 text-justify" style={{ color: TEXT_MUTED }}>
                      {profile.bio ?? ""}
                    </p>
                  </ScrollReveal>

                  <ScrollReveal delay={400}>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={`${basePath}/projects`}
                        className="px-8 py-4 rounded-lg font-semibold text-black transition-all duration-300 hover:opacity-90"
                        style={{ background: GRADIENT }}
                      >
                        Voir mes projets →
                      </Link>
                      <Link
                        href={`${basePath}/contact`}
                        className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-white/10"
                        style={{ border: `1px solid ${BORDER_ACCENT}`, color: GOLD }}
                      >
                        Me contacter
                      </Link>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={500}>
                    <div className="flex flex-wrap gap-10 mt-20 pt-10" style={{ borderTop: `1px solid ${BORDER}` }}>
                      {[
                        { n: profile.yearsOfExperience != null ? `${profile.yearsOfExperience}+` : `${experiences.length}+`, label: "Ans d'expérience" },
                        { n: profile.projectsCount != null ? `${profile.projectsCount}+` : `${projects.length}+`, label: "Projets réalisés" },
                        ...(profile.hobbies && profile.hobbies.length > 0 ? [{ n: "•", label: profile.hobbies.slice(0, 2).join(", ") }] : []),
                        { n: "∞", label: "Passion & amélioration continue" },
                      ].filter((s) => s.label).map((s) => (
                        <div key={s.label} className="group">
                          <div className="classic-heading text-3xl font-bold group-hover:opacity-90 transition-opacity duration-300" style={{ color: GOLD }}>
                            {s.n}
                          </div>
                          <div className="text-sm mt-1" style={{ color: TEXT_SUBTLE }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>

                  {(hasLinks || (profile.cv ?? profile.links?.cv)) && (
                    <ScrollReveal delay={600}>
                      <div className="flex flex-wrap items-center gap-4 mt-10">
                        {(profile.cv ?? profile.links?.cv) && (
                          <a
                            href={profile.cv ?? profile.links?.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:opacity-90"
                            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                          >
                            Télécharger mon CV
                          </a>
                        )}
                        {hasLinks && (
                          <>
                            <span className="text-sm" style={{ color: TEXT_SUBTLE }}>Suivez-moi :</span>
                        {profile.links?.linkedin && (
                          <a
                            href={profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10"
                            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                            aria-label="LinkedIn"
                          >
                            <svg className="w-5 h-5 transition-colors" style={{ color: TEXT_MUTED }} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}
                        {profile.links?.github && (
                          <a
                            href={profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10"
                            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                            aria-label="GitHub"
                          >
                            <svg className="w-5 h-5 transition-colors hover:opacity-100" style={{ color: TEXT_MUTED }} fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                          </>
                        )}
                      </div>
                    </ScrollReveal>
                  )}
                </div>

                <ScrollReveal delay={200} direction="right">
                  <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: GRADIENT, opacity: 0.2, filter: "blur(40px)" }}
                      />
                      <div
                        className="relative w-full h-full rounded-full overflow-hidden border-4"
                        style={{ borderColor: BORDER_ACCENT }}
                      >
                        {profile.photo ? (
                          <img
                            src={profile.photo}
                            alt={profile.name ?? ""}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-6xl font-bold text-white/80"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                          >
                            {initials}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        )}

        {/* ——— About ——— */}
        {currentPage === "about" && (
          <div className="min-h-screen pt-8" style={{ background: BG }}>
            <section className="relative py-28 px-6 overflow-hidden">
              <div className="relative z-10 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="text-center lg:text-left">
                    <ScrollReveal>
                      <h1 className="classic-heading text-5xl md:text-6xl font-bold mb-6" style={{ color: TEXT }}>
                        À propos de <span className="bg-clip-text" style={{ background: GRADIENT }}>moi</span>
                      </h1>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                      <p className="text-xl max-w-2xl mx-auto lg:mx-0" style={{ color: TEXT_MUTED }}>
                        {profile.title ?? "Passionné par le développement et l'innovation"}
                      </p>
                    </ScrollReveal>
                    {profile.hobbies && profile.hobbies.length > 0 && (
                      <ScrollReveal delay={150}>
                        <p className="mt-4 text-sm" style={{ color: TEXT_SUBTLE }}>
                          Loisirs : {profile.hobbies.join(", ")}
                        </p>
                      </ScrollReveal>
                    )}
                  </div>
                  <ScrollReveal delay={200} direction="right">
                    <div className="relative flex justify-center">
                      <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden" style={{ border: `4px solid ${BORDER_ACCENT}`, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        {profile.photo ? (
                          <img src={profile.photo} alt={profile.name ?? ""} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl font-bold border-4" style={{ color: TEXT_MUTED, background: BG_CARD, borderColor: BORDER_ACCENT }}>
                            {initials}
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {Object.keys(skills).length > 0 && (
              <section className="py-24 px-6" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="max-w-5xl mx-auto">
                  <div className="mb-14 text-center">
                    <span className="font-mono text-xs uppercase tracking-widest" style={{ color: GOLD }}>Compétences</span>
                    <h2 className="classic-heading text-4xl md:text-5xl font-bold mt-2 mb-4" style={{ color: TEXT }}>Stack Technique</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(skills).map(([title, items], idx) =>
                      Array.isArray(items) ? (
                        <ScrollReveal key={title} delay={idx * 80}>
                          <div
                            className="rounded-xl p-6 transition-all duration-300 hover:border-opacity-100"
                            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                          >
                            <h3 className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: GOLD }}>{title}</h3>
                            <div className="flex flex-wrap gap-2">
                              {items.map((s) => (
                                <span
                                  key={s}
                                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </ScrollReveal>
                      ) : null
                    )}
                  </div>
                </div>
              </section>
            )}

            {(experiences.length > 0 || education.length > 0) && (
              <section className="py-24 px-6" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="max-w-5xl mx-auto">
                  <div className="mb-14 text-center">
                    <span className="font-mono text-xs uppercase tracking-widest" style={{ color: GOLD }}>Parcours</span>
                    <h2 className="classic-heading text-4xl md:text-5xl font-bold mt-2 mb-4" style={{ color: TEXT }}>Expérience & Formation</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                    {experiences.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-xl mb-8 flex items-center gap-3" style={{ color: TEXT }}>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` }}>💼</span>
                          Expériences
                        </h3>
                        {experiences.map((exp, idx) => (
                          <div key={exp.id} className="relative pl-8 mb-6">
                            <div
                              className="absolute left-0 top-2 w-3 h-3 rounded-full border-2"
                              style={{
                                background: exp.current ? GOLD : "#334155",
                                borderColor: exp.current ? GOLD : "#475569",
                              }}
                            />
                            <div className="absolute left-1.5 top-5 bottom-0 w-px" style={{ background: BORDER }} />
                            <div
                              className="rounded-xl p-6 transition-all duration-300"
                              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="font-bold text-lg" style={{ color: TEXT }}>{exp.role}</h3>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="font-semibold" style={{ color: GOLD }}>{exp.company}</span>
                                    {(exp as { location?: string }).location && (
                                      <>
                                        <span className="text-sm" style={{ color: TEXT_SUBTLE }}>·</span>
                                        <span className="text-sm" style={{ color: TEXT_MUTED }}>{(exp as { location?: string }).location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {exp.period && (
                                  <span
                                    className="px-3 py-1 rounded-lg text-xs font-mono"
                                    style={{
                                      background: exp.current ? GOLD_SOFT : "rgba(255,255,255,0.05)",
                                      color: exp.current ? GOLD : TEXT_MUTED,
                                      border: `1px solid ${exp.current ? BORDER_ACCENT : BORDER}`,
                                    }}
                                  >
                                    {exp.period}
                                  </span>
                                )}
                              </div>
                              {exp.description && (
                                <p className="text-sm leading-relaxed mt-2" style={{ color: TEXT_MUTED }}>{exp.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {education.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-xl mb-8 flex items-center gap-3" style={{ color: TEXT }}>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` }}>🎓</span>
                          Formations
                        </h3>
                        <div className="space-y-4">
                          {education.map((ed) => (
                            <div
                              key={ed.id}
                              className="p-5 rounded-xl transition-all duration-300"
                              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                            >
                              <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: GOLD }}>{ed.year}</div>
                              <div className="font-semibold" style={{ color: TEXT }}>{ed.degree}</div>
                              <div className="text-sm mt-1" style={{ color: TEXT_MUTED }}>{ed.school}{ed.location ? ` · ${ed.location}` : ""}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {experiences.length === 0 && education.length === 0 && Object.keys(skills).length === 0 && (
              <div className="py-24 px-6 text-center" style={{ color: TEXT_MUTED }}>
                Rien à afficher pour l&apos;instant.
              </div>
            )}
          </div>
        )}

        {/* ——— Projects list ——— */}
        {currentPage === "projects" && !projectDetail && (
          <div className="min-h-screen pt-8" style={{ background: BG }}>
            <section className="relative py-28 px-6 overflow-hidden">
              <div className="relative z-10 max-w-5xl mx-auto text-center">
                <h1 className="classic-heading text-5xl md:text-6xl font-bold mb-6" style={{ color: TEXT }}>
                  Mes <span className="bg-clip-text" style={{ background: GRADIENT }}>Projets</span>
                </h1>
                <p className="text-xl max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
                  Une sélection de réalisations et projets.
                </p>
              </div>
            </section>
            <section className="py-12 px-6">
              <div className="max-w-5xl mx-auto">
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj, i) => {
                      const href = `${basePath}/project-${proj.id}`;
                      const color = (proj as { color?: string }).color ?? GOLD;
                      return (
                        <ScrollReveal key={proj.id} delay={i * 50}>
                          <Link href={href} className="h-full block group">
                            <div
                              className="relative rounded-xl overflow-hidden p-0 h-full flex flex-col transition-all duration-300"
                              style={{
                                background: BG_CARD,
                                border: `1px solid ${BORDER}`,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = BORDER_ACCENT;
                                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = BORDER;
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {proj.image && (
                                <div className="relative w-full mb-4 h-44 overflow-hidden">
                                  <img src={proj.image} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex items-start gap-4 mb-4 px-6">
                                <div
                                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                                  style={{ background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` }}
                                >
                                  {(proj as { icon?: string }).icon ?? "📁"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  {(proj as { category?: string }).category && (
                                    <span className="text-xs font-mono uppercase tracking-widest mb-1 block" style={{ color: GOLD }}>
                                      {(proj as { category?: string }).category}
                                    </span>
                                  )}
                                  <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: TEXT }}>{proj.title}</h3>
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed mb-4 flex-grow line-clamp-3 px-6" style={{ color: TEXT_MUTED }}>
                                {proj.desc ?? ""}
                              </p>
                              {(proj.tags?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-2 mt-auto px-6 pb-4">
                                  {proj.tags!.slice(0, 4).map((t) => (
                                    <span
                                      key={t}
                                      className="px-2 py-1 rounded-lg text-xs font-mono"
                                      style={{ background: GOLD_SOFT, color: GOLD, border: `1px solid ${BORDER_ACCENT}` }}
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="mt-4 pt-4 px-6 pb-6" style={{ borderTop: `1px solid ${BORDER}` }}>
                                <span className="text-xs flex items-center gap-1" style={{ color: GOLD }}>
                                  Voir les détails →
                                </span>
                              </div>
                            </div>
                          </Link>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl py-16 text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                    <p style={{ color: TEXT_MUTED }}>Aucun projet pour l&apos;instant.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ——— Project detail ——— */}
        {currentPage === "project" && (
          <div className="min-h-screen pt-8" style={{ background: BG }}>
            {!projectDetail ? (
              <div className="max-w-5xl mx-auto px-6 py-32 text-center">
                <h1 className="classic-heading text-4xl font-bold mb-4" style={{ color: TEXT }}>Projet non trouvé</h1>
                <Link href={`${basePath}/projects`} className="hover:underline" style={{ color: GOLD }}>
                  Retour aux projets
                </Link>
              </div>
            ) : (
              <>
                <section className="relative py-24 px-6 overflow-hidden">
                  <div className="relative z-10 max-w-5xl mx-auto">
                    <Link
                      href={`${basePath}/projects`}
                      className="inline-flex items-center gap-2 mb-10 transition-colors"
                      style={{ color: TEXT_MUTED }}
                    >
                      ← Retour aux projets
                    </Link>
                    {projectDetail.image && (
                      <div className="relative w-full rounded-xl overflow-hidden mb-10 aspect-video" style={{ border: `1px solid ${BORDER}` }}>
                        <img src={projectDetail.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-5 mb-6">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                        style={{ background: GOLD_SOFT, border: `2px solid ${BORDER_ACCENT}` }}
                      >
                        {(projectDetail as { icon?: string }).icon ?? "📁"}
                      </div>
                      <div>
                        {(projectDetail as { category?: string }).category && (
                          <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: GOLD }}>
                            {(projectDetail as { category?: string }).category}
                          </span>
                        )}
                        <h1 className="classic-heading text-4xl md:text-5xl font-bold leading-tight" style={{ color: TEXT }}>{projectDetail.title}</h1>
                      </div>
                    </div>
                    <p className="text-xl mb-8 leading-relaxed" style={{ color: TEXT_MUTED }}>{projectDetail.desc}</p>
                    {(projectDetail.objective || projectDetail.role || projectDetail.result) && (
                      <div className="space-y-3 mb-8 p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                        {projectDetail.objective && <p style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT }}>Objectif :</strong> {projectDetail.objective}</p>}
                        {projectDetail.role && <p style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT }}>Rôle :</strong> {projectDetail.role}</p>}
                        {projectDetail.result && <p style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT }}>Résultat :</strong> {projectDetail.result}</p>}
                      </div>
                    )}
                    {projectDetail.tags && projectDetail.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {projectDetail.tags.map((t) => (
                          <span
                            key={t}
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{ background: GOLD_SOFT, color: GOLD, border: `1px solid ${BORDER_ACCENT}` }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {projectDetail.link && (
                      <a
                        href={projectDetail.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90"
                        style={{ background: GRADIENT }}
                      >
                        Voir le projet →
                      </a>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* ——— Contact ——— */}
        {currentPage === "contact" && (
          <div className="min-h-screen pt-8" style={{ background: BG }}>
            <section className="relative py-28 px-6 overflow-hidden">
              <div className="relative z-10 max-w-5xl mx-auto text-center">
                <h1 className="classic-heading text-5xl md:text-6xl font-bold mb-6" style={{ color: TEXT }}>
                  Travaillons <span className="bg-clip-text" style={{ background: GRADIENT }}>Ensemble</span>
                </h1>
                <p className="text-xl max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
                  Ouvert aux opportunités et aux projets innovants.
                </p>
              </div>
            </section>
            <section className="py-24 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    {contactEmail && (
                      <div
                        className="rounded-xl p-6 transition-all duration-300"
                        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style={{ background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` }}>📧</div>
                          <div>
                            <h3 className="font-semibold" style={{ color: TEXT }}>Email</h3>
                            <a href={`mailto:${contactEmail}`} className="text-sm hover:underline" style={{ color: GOLD }}>{contactEmail}</a>
                          </div>
                        </div>
                      </div>
                    )}
                    {contact.phone && (
                      <div
                        className="rounded-xl p-6 transition-all duration-300"
                        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style={{ background: GOLD_SOFT, border: `1px solid ${BORDER_ACCENT}` }}>📱</div>
                          <div>
                            <h3 className="font-semibold" style={{ color: TEXT }}>Téléphone</h3>
                            <a href={`tel:${contact.phone}`} className="text-sm hover:underline" style={{ color: GOLD }}>{contact.phone}</a>
                          </div>
                        </div>
                      </div>
                    )}
                    {hasLinks && (
                      <div
                        className="rounded-xl p-6"
                        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                      >
                        <h3 className="font-semibold mb-4" style={{ color: TEXT }}>Réseaux sociaux</h3>
                        <div className="flex flex-wrap gap-4">
                          {profile.links?.linkedin && (
                            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:opacity-90" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }}>
                              <span className="text-sm" style={{ color: TEXT_MUTED }}>LinkedIn</span>
                            </a>
                          )}
                          {profile.links?.github && (
                            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:opacity-90" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }}>
                              <span className="text-sm" style={{ color: TEXT_MUTED }}>GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="rounded-xl p-8"
                    style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                  >
                    <h2 className="classic-heading text-2xl font-bold mb-6" style={{ color: TEXT }}>Envoyez un message</h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? "";
                        const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "";
                        const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value ?? "";
                        const mailto = `mailto:${contactEmail || "contact@example.com"}?subject=Contact portfolio - ${encodeURIComponent(name)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                        window.location.href = mailto;
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: TEXT_MUTED }}>Nom</label>
                        <input type="text" id="name" name="name" required placeholder="Votre nom" className="w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }} />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: TEXT_MUTED }}>Email</label>
                        <input type="email" id="email" name="email" required placeholder="votre@email.com" className="w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }} />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: TEXT_MUTED }}>Message</label>
                        <textarea id="message" name="message" rows={5} required placeholder={contact.messagePlaceholder ?? "Votre message..."} className="w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227] resize-none transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }} />
                      </div>
                      <button type="submit" className="w-full px-6 py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90" style={{ background: GRADIENT }}>
                        Envoyer le message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t backdrop-blur-sm" style={{ borderTopWidth: 3, borderColor: GOLD, background: "rgba(12,18,34,0.6)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-black"
                style={{ background: GRADIENT, fontFamily: "var(--font-mono)" }}
              >
                {initials}
              </div>
              <span className="font-semibold text-sm" style={{ color: TEXT }}>{profile.name ?? "Portfolio"}</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href={basePath} className="text-sm transition-colors hover:opacity-100" style={{ color: TEXT_MUTED }}>Accueil</Link>
              <Link href={`${basePath}/about`} className="text-sm transition-colors hover:opacity-100" style={{ color: TEXT_MUTED }}>À propos</Link>
              <Link href={`${basePath}/projects`} className="text-sm transition-colors hover:opacity-100" style={{ color: TEXT_MUTED }}>Projets</Link>
              <Link href={`${basePath}/contact`} className="text-sm transition-colors hover:opacity-100" style={{ color: TEXT_MUTED }}>Contact</Link>
            </div>
          </div>
          {hasLinks && (
            <div className="flex items-center justify-center gap-4 mb-4">
              {profile.links?.linkedin && (
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:opacity-90" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }} aria-label="LinkedIn">
                  <svg className="w-5 h-5" style={{ color: TEXT_MUTED }} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              )}
              {profile.links?.github && (
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:opacity-90" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }} aria-label="GitHub">
                  <svg className="w-5 h-5" style={{ color: TEXT_MUTED }} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
              )}
            </div>
          )}
          <p className="text-sm" style={{ color: TEXT_SUBTLE, fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} {profile.name ?? "Portfolio"}
          </p>
          {basePath.startsWith("/p/") && data.slug && (
            <ClassicShareRow slug={data.slug} profileName={profile.name ?? "l'auteur"} />
          )}
        </div>
      </footer>
    </div>
  );
}
