"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { PortfolioData, PortfolioContent, ProjectItem } from "@/types/portfolio";

// ─── Charte graphique Air ─────────────────────────────────────────────────────
// Identité : minimaliste, épuré, fond blanc, typo légère (300–500).
// Un seul accent (orange doux) pour CTAs, liens et états actifs.
// Chaque template a sa propre identité visuelle ; celle-ci reste sobre et lisible.
// ─── Design Tokens ───────────────────────────────────────────────────────────
const BG       = "#FFFFFF";
const TEXT     = "#1A1A1A";
const SUBTLE   = "#5C5C5C";
const FAINT    = "#E5E5E5";
const SURFACE  = "#F8F8F8";
const ACCENT   = "#EA580C";  // Orange identité (CTA, liens, actif)
const ACCENT_SOFT = "rgba(234, 88, 12, 0.08)";
const RADIUS   = 12;   // border-radius cohérent
const SHADOW   = "0 1px 3px rgba(0,0,0,0.06)";
const SHADOW_MD = "0 4px 12px rgba(0,0,0,0.08)";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AirProps {
  data: PortfolioData;
  page?: string;
}

// ─── Share bar (partage en un clic) ───────────────────────────────────────────
function ShareBar({ basePath, slug, profileName }: { basePath: string; slug?: string; profileName: string }) {
  const [fullUrl, setFullUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setFullUrl(window.location.origin + basePath);
  }, [basePath]);
  const text = `Découvrez le portfolio de ${profileName}`;
  if (!fullUrl) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur LinkedIn"
        style={{ fontSize: "0.75rem", color: SUBTLE, textDecoration: "underline" }}
      >
        LinkedIn
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text + " " + fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur WhatsApp"
        style={{ fontSize: "0.75rem", color: SUBTLE, textDecoration: "underline" }}
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(fullUrl);
        }}
        style={{ fontSize: "0.75rem", color: SUBTLE, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}
      >
        Copier le lien
      </button>
    </div>
  );
}

// ─── Fade In ─────────────────────────────────────────────────────────────────
function Fade({
  children,
  delay = 0,
  className = "",
  y = 16,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(() => setOn(true), delay); },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      style={{
        transition: `opacity 0.9s ease, transform 0.9s ease`,
        transitionDelay: `${delay}ms`,
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : `translateY(${y}px)`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

// ─── Rule ─────────────────────────────────────────────────────────────────────
function Rule({ className = "" }: { className?: string }) {
  return <hr style={{ border: "none", borderTop: `1px solid ${FAINT}` }} className={className} />;
}

// ─── Label (identité Air : petit trait accent à gauche) ────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: SUBTLE,
        fontWeight: 500,
      }}
    >
      <span style={{ width: 3, height: 3, borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
      {children}
    </span>
  );
}

// ─── Chip (identité Air : bordure discrète, teinte accent au survol via parent) ─
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 12px",
        borderRadius: 999,
        border: `1px solid ${FAINT}`,
        fontSize: "0.72rem",
        color: SUBTLE,
        letterSpacing: "0.04em",
        background: BG,
        transition: "border-color 0.2s, color 0.2s",
      }}
    >
      {children}
    </span>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function Air({ data, page }: AirProps) {
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
  const profile     = content.profile     ?? {};
  const skills      = content.skills      ?? {};
  const experiences = content.experiences ?? [];
  const projects    = content.projects    ?? [];
  const education   = content.education   ?? [];
  const contact     = content.contact     ?? {};
  const email       = contact.email ?? "";

  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const initials = (profile.name ?? "P")
    .split(/\s+/)
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "P";

  const NAV = [
    { id: "index",    label: "Home"    },
    { id: "about",    label: "About"   },
    { id: "projects", label: "Work"    },
    { id: "contact",  label: "Contact" },
  ];
  const navLinks = NAV.map(({ id, label }) => ({
    href: id === "index" ? basePath : `${basePath}/${id}`,
    label,
    active:
      currentPage === id ||
      (id === "projects" && currentPage === "project"),
  }));
  const projectDetail: ProjectItem | null =
    projectSlug
      ? (projects.find((p) => p.id === projectSlug) ?? null)
      : null;

  // shared page wrapper: largeur lisible, rythme vertical
  const page$ = {
    maxWidth: 780,
    margin: "0 auto",
    padding: "0 24px",
  };

  return (
    <div className="air-template" style={{ background: BG, color: TEXT, minHeight: "100vh", fontFamily: "var(--font-geist-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)" }}>

      {/* ── NAV ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${FAINT}` : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href={basePath} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `2px solid ${TEXT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: TEXT,
                flexShrink: 0,
              }}
            >
              {initials}
            </span>
            <span style={{ fontSize: "0.9rem", fontWeight: 500, color: TEXT, letterSpacing: "0.02em" }}>
              {profile.name ?? "Portfolio"}
            </span>
          </Link>

          {/* Desktop links (identité : actif = accent) */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.8rem",
                  fontWeight: link.active ? 600 : 400,
                  color: link.active ? ACCENT : SUBTLE,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  transition: "color 0.2s",
                  borderBottom: link.active ? `2px solid ${ACCENT}` : "2px solid transparent",
                  paddingBottom: 2,
                }}
                onMouseEnter={(e) => { if (!link.active) e.currentTarget.style.color = ACCENT; }}
                onMouseLeave={(e) => { if (!link.active) e.currentTarget.style.color = SUBTLE; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: TEXT, padding: 4 }}
            className="show-mobile"
            aria-label="Menu"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" />
                : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: BG, borderTop: `1px solid ${FAINT}`, padding: "12px 24px 20px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  fontSize: "0.9rem",
                  fontWeight: link.active ? 600 : 400,
                  color: link.active ? ACCENT : SUBTLE,
                  textDecoration: "none",
                  borderBottom: `1px solid ${FAINT}`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── GLOBAL CSS: typo, focus, responsive ── */}
      <style>{`
        .air-template { scroll-behavior: smooth; }
        .air-template * { box-sizing: border-box; }
        .air-template a { color: inherit; }
        .air-template img { display: block; max-width: 100%; height: auto; }
        .air-template button:focus-visible,
        .air-template a:focus-visible,
        .air-template input:focus-visible,
        .air-template textarea:focus-visible { outline: 2px solid #EA580C; outline-offset: 2px; }
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none; }
        .contact-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
        [data-air-card]:hover .air-arrow { transform: translateX(4px); stroke: #EA580C; }
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
          .air-stats-grid { grid-template-columns: 1fr; }
          .about-bio-grid { grid-template-columns: 1fr; justify-items: center; text-align: center; }
          .project-card-inner { flex-direction: column-reverse !important; }
          .project-card-img { width: 100% !important; min-height: 200px; }
        }
      `}</style>

      <main style={{ paddingTop: 64 }}>

        {/* ══════════════ INDEX ══════════════ */}
        {currentPage === "index" && (
          <>
            {/* ── Hero ── */}
            <section style={{ ...page$, paddingTop: 120, paddingBottom: 100 }}>
              {(profile.openToWork ?? true) && (
                <Fade delay={0}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "8px 16px", borderRadius: 999, background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    marginBottom: 48,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#22C55E",
                      boxShadow: "0 0 0 2px rgba(34,197,94,0.2)",
                      flexShrink: 0,
                    }} />
                    <Label>{profile.openToWorkMessage?.trim() || "Open to work"}</Label>
                  </div>
                </Fade>
              )}

              <Fade delay={60}>
                <h1 style={{
                  fontSize: "clamp(2.6rem, 6.5vw, 4.75rem)",
                  fontWeight: 200,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  color: TEXT,
                  marginBottom: 32,
                  maxWidth: "14ch",
                }}>
                  {profile.name ?? "Portfolio"}
                </h1>
              </Fade>

              <Fade delay={120}>
                <p style={{
                  fontSize: "1.125rem",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: SUBTLE,
                  maxWidth: 520,
                  marginBottom: 48,
                  textAlign: "justify",
                }}>
                  {profile.bio ?? ""}
                </p>
              </Fade>

              <Fade delay={180}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
                  <Link
                    href={`${basePath}/projects`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "12px 24px",
                      background: ACCENT, color: "#fff",
                      borderRadius: 999, fontSize: "0.82rem",
                      fontWeight: 500, textDecoration: "none",
                      letterSpacing: "0.01em",
                      transition: "opacity 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    View work
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href={`${basePath}/contact`}
                    style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "11px 24px",
                      border: `1.5px solid ${FAINT}`, color: SUBTLE,
                      borderRadius: 999, fontSize: "0.82rem",
                      fontWeight: 400, textDecoration: "none",
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = FAINT; e.currentTarget.style.color = SUBTLE; }}
                  >
                    Get in touch
                  </Link>
                </div>
              </Fade>

              {/* Social row */}
              {(profile.links?.linkedin || profile.links?.github || (profile.cv ?? profile.links?.cv)) && (
                <Fade delay={240}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <Label>Links</Label>
                    {profile.links?.linkedin && (
                      <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "0.78rem", color: SUBTLE, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = SUBTLE)}>
                        LinkedIn
                      </a>
                    )}
                    {profile.links?.github && (
                      <a href={profile.links.github} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "0.78rem", color: SUBTLE, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = SUBTLE)}>
                        GitHub
                      </a>
                    )}
                    {(profile.cv ?? profile.links?.cv) && (
                      <a href={profile.cv ?? profile.links?.cv} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "0.78rem", color: SUBTLE, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = SUBTLE)}>
                        Resume ↗
                      </a>
                    )}
                  </div>
                </Fade>
              )}
            </section>

            <Rule />

            {/* ── Stats (cartes légères) ── */}
            <section style={{ ...page$, padding: "56px 24px" }}>
              <Fade>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24,
                }}
                  className="air-stats-grid"
                >
                  {[
                    {
                      n: profile.yearsOfExperience != null
                        ? `${profile.yearsOfExperience}`
                        : String(experiences.length),
                      label: "Years exp.",
                    },
                    {
                      n: profile.projectsCount != null
                        ? `${profile.projectsCount}`
                        : String(projects.length),
                      label: "Projects",
                    },
                    {
                      n: Object.keys(skills).length > 0
                        ? String(Object.values(skills).flat().length)
                        : "—",
                      label: "Technologies",
                    },
                  ].map((s, i) => (
                    <div
                      key={s.label}
                      style={{
                        padding: "28px 24px",
                        background: SURFACE,
                        borderRadius: RADIUS,
                        border: `1px solid ${FAINT}`,
                        borderLeft: i === 0 ? `3px solid ${ACCENT}` : undefined,
                        transition: "box-shadow 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = SHADOW;
                        e.currentTarget.style.borderColor = FAINT;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = FAINT;
                      }}
                    >
                      <p style={{ fontSize: "2.25rem", fontWeight: 200, letterSpacing: "-0.04em", color: TEXT, lineHeight: 1 }}>
                        {s.n}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: SUBTLE, marginTop: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Fade>
            </section>

            <Rule />

            {/* ── Featured projects (cartes avec vignette) ── */}
            {projects.length > 0 && (
              <section style={{ ...page$, padding: "72px 24px" }}>
                <Fade>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
                    <Label>Selected work</Label>
                    <Link href={`${basePath}/projects`}
                      style={{ fontSize: "0.75rem", color: SUBTLE, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = SUBTLE)}>
                      All projects →
                    </Link>
                  </div>
                </Fade>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {projects.slice(0, 5).map((proj, i) => (
                    <Fade key={proj.id} delay={i * 50}>
                      <Link href={`${basePath}/project-${proj.id}`} style={{ textDecoration: "none" }}>
                        <div
                          data-air-card
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "20px 20px",
                            border: `1px solid ${FAINT}`,
                            borderRadius: RADIUS,
                            cursor: "pointer",
                            transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                            gap: 20,
                            background: BG,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = ACCENT_SOFT;
                            e.currentTarget.style.borderColor = "rgba(234, 88, 12, 0.2)";
                            e.currentTarget.style.boxShadow = SHADOW;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = BG;
                            e.currentTarget.style.borderColor = FAINT;
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 0, flex: 1 }}>
                            <span style={{
                              width: 32, height: 32, borderRadius: 8,
                              background: SURFACE, color: SUBTLE, fontSize: "0.7rem", fontWeight: 600,
                              fontVariantNumeric: "tabular-nums",
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            {proj.image ? (
                              <div style={{ width: 56, height: 40, borderRadius: 8, overflow: "hidden", background: SURFACE, flexShrink: 0 }}>
                                <img src={proj.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            ) : null}
                            <div style={{ minWidth: 0 }}>
                              <span style={{ fontSize: "0.95rem", fontWeight: 500, color: TEXT, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {proj.title}
                              </span>
                              {proj.tags?.[0] && (
                                <span style={{ fontSize: "0.72rem", color: SUBTLE, marginTop: 2, display: "block" }}>
                                  {proj.tags[0]}
                                </span>
                              )}
                            </div>
                          </div>
                          <svg width="18" height="18" fill="none" stroke={SUBTLE} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: "transform 0.2s" }}
                            className="air-arrow">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </Fade>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ══════════════ ABOUT ══════════════ */}
        {currentPage === "about" && (
          <section style={{ ...page$, padding: "88px 24px" }}>

            <Fade>
              <Label>About</Label>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 200,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginTop: 16,
                marginBottom: 48,
              }}>
                {profile.name ?? "About me"}
              </h1>
            </Fade>

            <Rule />

            {/* Bio + photo (photo avec cadre) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 56, padding: "56px 0", alignItems: "start" }} className="about-bio-grid">
              <Fade className="bio-col">
                <p style={{ fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.85, color: SUBTLE, marginBottom: 28 }}>
                  {profile.bio ?? "Passionate about craft, clarity and purposeful design."}
                </p>
                {profile.title && (
                  <p style={{ fontSize: "0.9rem", fontWeight: 500, color: TEXT }}>{profile.title}</p>
                )}
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <p style={{ fontSize: "0.8rem", color: SUBTLE, marginTop: 12 }}>
                    {profile.hobbies.join("  ·  ")}
                  </p>
                )}
              </Fade>
              <Fade delay={80}>
                <div style={{
                  width: 140, height: 140,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: SURFACE,
                  flexShrink: 0,
                  boxShadow: SHADOW_MD,
                  border: `3px solid ${FAINT}`,
                  padding: 4,
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
                    {profile.photo
                      ? <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 200, color: SUBTLE }}>
                          {initials}
                        </div>}
                  </div>
                </div>
              </Fade>
            </div>

            <Rule />

            {/* Skills (cartes par catégorie) */}
            {Object.keys(skills).length > 0 && (
              <div style={{ padding: "56px 0" }}>
                <Fade><Label>Skills</Label></Fade>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 28, marginTop: 36 }}>
                  {Object.entries(skills).map(([title, items], idx) =>
                    Array.isArray(items) ? (
                      <Fade key={title} delay={idx * 60}>
                        <div style={{
                          padding: "24px 20px",
                          background: SURFACE,
                          borderRadius: RADIUS,
                          border: `1px solid ${FAINT}`,
                        }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: 600, color: TEXT, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                            {title}
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {items.map((s: string) => <Chip key={s}>{s}</Chip>)}
                          </div>
                        </div>
                      </Fade>
                    ) : null
                  )}
                </div>
              </div>
            )}

            <Rule />

            {/* Experience (timeline visuelle) */}
            {experiences.length > 0 && (
              <div style={{ padding: "56px 0" }}>
                <Fade><Label>Experience</Label></Fade>
                <div style={{ position: "relative", marginTop: 32, paddingLeft: 24 }}>
                  <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: FAINT, borderRadius: 1 }} />
                  {experiences.map((exp, i) => (
                    <Fade key={exp.id} delay={i * 50}>
                      <div style={{ position: "relative", paddingBottom: 36 }}>
                        <span style={{
                          position: "absolute", left: -24, top: 6,
                          width: 12, height: 12, borderRadius: "50%",
                          background: i === 0 ? ACCENT : SURFACE,
                          border: `2px solid ${i === 0 ? ACCENT : FAINT}`,
                        }} />
                        <div style={{
                          padding: "20px 24px",
                          background: i === 0 ? ACCENT_SOFT : "transparent",
                          borderRadius: RADIUS,
                          border: `1px solid ${i === 0 ? "rgba(234,88,12,0.2)" : FAINT}`,
                        }}>
                          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: TEXT }}>{exp.role}</p>
                          <p style={{ fontSize: "0.82rem", color: SUBTLE, marginTop: 4 }}>
                            {exp.company}{(exp as { location?: string }).location ? ` · ${(exp as { location?: string }).location}` : ""}
                          </p>
                          {exp.period && (
                            <p style={{ fontSize: "0.72rem", color: SUBTLE, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>{exp.period}</p>
                          )}
                          {exp.description && (
                            <p style={{ fontSize: "0.82rem", color: SUBTLE, marginTop: 12, lineHeight: 1.65 }}>{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </Fade>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div style={{ padding: "56px 0" }}>
                <Fade><Label>Education</Label></Fade>
                <div style={{ marginTop: 32 }}>
                  {education.map((ed, i) => (
                    <Fade key={ed.id} delay={i * 50}>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 20,
                        padding: "22px 24px",
                        marginBottom: 12,
                        border: `1px solid ${FAINT}`,
                        borderRadius: RADIUS,
                        background: SURFACE,
                        alignItems: "center",
                      }}>
                        <div>
                          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: TEXT }}>{ed.degree}</p>
                          <p style={{ fontSize: "0.8rem", color: SUBTLE, marginTop: 4 }}>
                            {ed.school}{ed.location ? ` · ${ed.location}` : ""}
                          </p>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: SUBTLE, fontVariantNumeric: "tabular-nums" }}>{ed.year}</span>
                      </div>
                    </Fade>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ══════════════ PROJECTS LIST ══════════════ */}
        {currentPage === "projects" && !projectDetail && (
          <section style={{ ...page$, padding: "88px 24px" }}>
            <Fade>
              <Label>Work</Label>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 200,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginTop: 16,
                marginBottom: 48,
              }}>
                Selected projects
              </h1>
            </Fade>

            <Rule />

            {projects.length > 0 ? (
              <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                {projects.map((proj, i) => (
                  <Fade key={proj.id} delay={i * 50}>
                    <Link href={`${basePath}/project-${proj.id}`} style={{ textDecoration: "none" }}>
                      <div
                        data-air-card
                        style={{
                          padding: 0,
                          border: `1px solid ${FAINT}`,
                          borderRadius: RADIUS,
                          cursor: "pointer",
                          overflow: "hidden",
                          background: BG,
                          transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = ACCENT_SOFT;
                          e.currentTarget.style.borderColor = "rgba(234, 88, 12, 0.2)";
                          e.currentTarget.style.boxShadow = SHADOW_MD;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = BG;
                          e.currentTarget.style.borderColor = FAINT;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "row", gap: 0, alignItems: "stretch" }} className="project-card-inner">
                          <div style={{ flex: 1, padding: "32px 28px", minWidth: 0 }}>
                            {(proj as { category?: string }).category && (
                              <div style={{ marginBottom: 8 }}><Label>{(proj as { category?: string }).category}</Label></div>
                            )}
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: TEXT, marginTop: 4, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                              {proj.title}
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: SUBTLE, lineHeight: 1.65, marginTop: 12, marginBottom: 16 }}>
                              {proj.desc}
                            </p>
                            {(proj.tags?.length ?? 0) > 0 && (
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {(proj.tags ?? []).map((t) => <Chip key={t}>{t}</Chip>)}
                              </div>
                            )}
                          </div>
                          {proj.image && (
                            <div style={{ width: 200, flexShrink: 0, background: SURFACE }} className="project-card-img">
                              <img src={proj.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 180 }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Fade>
                ))}
              </div>
            ) : (
              <div style={{ padding: "80px 24px", textAlign: "center", background: SURFACE, borderRadius: RADIUS, border: `1px solid ${FAINT}` }}>
                <p style={{ color: SUBTLE, fontSize: "1rem" }}>No projects yet.</p>
              </div>
            )}
          </section>
        )}

        {/* ══════════════ PROJECT DETAIL ══════════════ */}
        {currentPage === "project" && (
          <section style={{ ...page$, padding: "80px 24px" }}>
            {!projectDetail ? (
              <div style={{ textAlign: "center", paddingTop: 80 }}>
                <p style={{ fontSize: "1rem", color: SUBTLE }}>Project not found.</p>
                <Link href={`${basePath}/projects`} style={{ fontSize: "0.82rem", color: SUBTLE, textDecoration: "underline", textUnderlineOffset: 3, marginTop: 16, display: "inline-block" }}>
                  ← Back to work
                </Link>
              </div>
            ) : (
              <>
                <Fade>
                  <Link href={`${basePath}/projects`}
                    style={{ fontSize: "0.78rem", color: SUBTLE, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 48, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = SUBTLE)}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to work
                  </Link>
                </Fade>

                <Fade delay={40}>
                  {(projectDetail as { category?: string }).category && (
                    <div style={{ marginBottom: 12 }}><Label>{(projectDetail as { category?: string }).category}</Label></div>
                  )}
                  <h1 style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.15,
                    marginBottom: 24,
                  }}>
                    {projectDetail.title}
                  </h1>
                  <p style={{ fontSize: "1rem", fontWeight: 300, lineHeight: 1.75, color: SUBTLE, maxWidth: 540, marginBottom: 40 }}>
                    {projectDetail.desc}
                  </p>
                </Fade>

                {projectDetail.image && (
                  <Fade delay={80}>
                    <div style={{
                      width: "100%", aspectRatio: "16/9", borderRadius: RADIUS, overflow: "hidden",
                      background: SURFACE, marginBottom: 48, boxShadow: SHADOW_MD, border: `1px solid ${FAINT}`,
                    }}>
                      <img src={projectDetail.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </Fade>
                )}

                <Rule />

                <Fade delay={120}>
                  <div style={{ padding: "44px 0" }}>
                    {[
                      { label: "Objective", value: projectDetail.objective },
                      { label: "Role",      value: projectDetail.role },
                      { label: "Outcome",   value: projectDetail.result },
                    ].filter((r) => r.value).map((row, i, arr) => (
                      <div key={row.label} style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: 28,
                        padding: "24px 0",
                        borderBottom: i < arr.length - 1 ? `1px solid ${FAINT}` : "none",
                        alignItems: "start",
                      }}>
                        <Label>{row.label}</Label>
                        <p style={{ fontSize: "0.9375rem", color: TEXT, lineHeight: 1.7 }}>{row.value}</p>
                      </div>
                    ))}

                    {(projectDetail.tags?.length ?? 0) > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 28, padding: "24px 0", alignItems: "start" }}>
                        <Label>Stack</Label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {(projectDetail.tags ?? []).map((t) => <Chip key={t}>{t}</Chip>)}
                        </div>
                      </div>
                    )}
                  </div>
                </Fade>

                {projectDetail.link && (
                  <Fade delay={160}>
                    <a
                      href={projectDetail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "12px 24px",
                        background: ACCENT, color: "#fff",
                        borderRadius: 999, fontSize: "0.82rem",
                        fontWeight: 500, textDecoration: "none",
                        transition: "opacity 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      Visit project ↗
                    </a>
                  </Fade>
                )}
              </>
            )}
          </section>
        )}

        {/* ══════════════ CONTACT ══════════════ */}
        {currentPage === "contact" && (
          <section style={{ ...page$, padding: "88px 24px" }}>
            <Fade>
              <Label>Contact</Label>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 200,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginTop: 16,
                marginBottom: 48,
              }}>
                Let's work together.
              </h1>
            </Fade>

            <Rule />

            <div className="contact-grid" style={{ paddingTop: 56 }}>

              {/* Info column */}
              <Fade>
                <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                  {email && (
                    <div>
                      <Label>Email</Label>
                      <a href={`mailto:${email}`}
                        style={{ display: "block", marginTop: 8, fontSize: "0.88rem", color: TEXT, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = TEXT)}>
                        {email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div>
                      <Label>Phone</Label>
                      <a href={`tel:${contact.phone}`}
                        style={{ display: "block", marginTop: 8, fontSize: "0.88rem", color: TEXT, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = TEXT)}>
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {(profile.links?.linkedin || profile.links?.github) && (
                    <div>
                      <Label>Social</Label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                        {profile.links?.linkedin && (
                          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: "0.85rem", color: TEXT, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = TEXT)}>
                            LinkedIn ↗
                          </a>
                        )}
                        {profile.links?.github && (
                          <a href={profile.links.github} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: "0.85rem", color: TEXT, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = TEXT)}>
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Fade>

              {/* Form (carte) */}
              <Fade delay={80}>
                <div style={{
                  padding: "40px 36px",
                  background: SURFACE,
                  borderRadius: RADIUS,
                  border: `1px solid ${FAINT}`,
                }}>
                <form
                  style={{ display: "flex", flexDirection: "column", gap: 28 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = e.currentTarget;
                    const name    = (f.querySelector('[name="name"]')    as HTMLInputElement)?.value ?? "";
                    const mail    = (f.querySelector('[name="email"]')   as HTMLInputElement)?.value ?? "";
                    const message = (f.querySelector('[name="message"]') as HTMLTextAreaElement)?.value ?? "";
                    window.location.href = `mailto:${email || "contact@example.com"}?subject=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${mail}\n\n${message}`)}`;
                  }}
                >
                  {[
                    { id: "name",  label: "Name",    type: "text",  ph: "Your name"       },
                    { id: "email", label: "Email",   type: "email", ph: "your@email.com"  },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} style={{ display: "block", marginBottom: 8 }}><Label>{f.label}</Label></label>
                      <input
                        id={f.id} name={f.id} type={f.type} required placeholder={f.ph}
                        style={{
                          width: "100%", background: "none", outline: "none",
                          border: "none", borderBottom: `2px solid ${FAINT}`,
                          padding: "10px 0", fontSize: "0.88rem", color: TEXT,
                          fontFamily: "inherit", transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => (e.target.style.borderBottomColor = ACCENT)}
                        onBlur={(e)  => (e.target.style.borderBottomColor = FAINT)}
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" style={{ display: "block", marginBottom: 8 }}><Label>Message</Label></label>
                    <textarea
                      id="message" name="message" required rows={5}
                      placeholder={contact.messagePlaceholder ?? "What are you working on?"}
                      style={{
                        width: "100%", background: "none", outline: "none",
                        border: "none", borderBottom: `2px solid ${FAINT}`,
                        padding: "10px 0", fontSize: "0.88rem", color: TEXT,
                        fontFamily: "inherit", resize: "vertical", transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderBottomColor = ACCENT)}
                      onBlur={(e)  => (e.target.style.borderBottomColor = FAINT)}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      style={{
                        padding: "12px 28px", background: ACCENT, color: "#fff",
                        border: "none", borderRadius: 999, fontSize: "0.82rem",
                        fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                        letterSpacing: "0.01em", transition: "opacity 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => { const t = e.currentTarget as HTMLButtonElement; t.style.opacity = "0.9"; t.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={(e) => { const t = e.currentTarget as HTMLButtonElement; t.style.opacity = "1"; t.style.transform = "translateY(0)"; }}
                    >
                      Send →
                    </button>
                  </div>
                </form>
                </div>
              </Fade>
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${FAINT}`,
        marginTop: 80,
        padding: "32px 24px",
      }}>
        <div style={{
          maxWidth: 780, margin: "0 auto",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: "0.75rem", color: SUBTLE }}>
              {profile.name ?? "Portfolio"}
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  style={{ fontSize: "0.72rem", color: link.active ? ACCENT : SUBTLE, textDecoration: "none", transition: "color 0.2s", fontWeight: link.active ? 600 : 400 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = link.active ? ACCENT : SUBTLE)}>
                  {link.label}
                </Link>
              ))}
            </div>
            <span style={{ fontSize: "0.72rem", color: SUBTLE }}>
              © {new Date().getFullYear()}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, paddingTop: 12, borderTop: `1px solid ${FAINT}` }}>
            <span style={{ fontSize: "0.7rem", color: SUBTLE }}>Partager</span>
            <ShareBar basePath={basePath} slug={data.slug} profileName={profile.name ?? "Portfolio"} />
            {data.slug && basePath.startsWith("/p/") && (
              <Link
                href={`/p/${data.slug}/feedback`}
                style={{ fontSize: "0.7rem", color: SUBTLE, textDecoration: "underline", marginLeft: "auto" }}
              >
                Donner mon avis à {profile.name ?? "l'auteur"}
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}