"use client";
import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "MasterCard VSS Processing",
    desc: "Microservice Spring Boot traitant des fichiers de transactions MasterCard multi-sources (local, SFTP, SMB) avec API REST paginée sur données JSONB PostgreSQL.",
    tags: ["Spring Boot", "PostgreSQL", "Redis", "Docker", "Swagger"],
    category: "Backend",
    icon: "💳",
    color: "#F59E0B",
  },
  {
    title: "Jumphost Sécurisé",
    desc: "Infrastructure Jumphost sécurisée avec Guacamole, SSO via Keycloak/OpenID Connect, reverse proxy Nginx et certificats SSL/TLS automatisés via Certbot.",
    tags: ["Docker", "Keycloak", "Nginx", "Certbot", "OpenID Connect"],
    category: "DevOps",
    icon: "🔐",
    color: "#EF4444",
  },
  {
    title: "MONETIX",
    desc: "Application bancaire intelligente de décryptage et d'analyse des opérations financières avec stack ELK pour la visualisation et monitoring.",
    tags: ["Java", "Spring Boot", "Kubernetes", "Jenkins", "ELK"],
    category: "FinTech",
    icon: "🏦",
    color: "#10B981",
  },
  {
    title: "DIGIFOR",
    desc: "Plateforme de gestion foncière digitale réduisant les délais de traitement de 60% grâce à la dématérialisation des demandes de certificats fonciers.",
    tags: ["Spring Boot", "React", "PostgreSQL", "Elasticsearch", "Docker"],
    category: "GovTech",
    icon: "🏛️",
    color: "#6366F1",
  },
  {
    title: "TOTAL RENT",
    desc: "Plateforme complète de réservation et gestion de locations courte et longue durée (hôtels, appartements, résidences hôtelières).",
    tags: ["Next.js", "React", "Tailwind CSS", "REST API"],
    category: "Frontend",
    icon: "🏨",
    color: "#3B82F6",
  },
  {
    title: "XSEL SMS",
    desc: "Application web complète pour la gestion et l'envoi de campagnes SMS professionnelles à destination des entreprises.",
    tags: ["Laravel", "JavaScript", "jQuery", "Ajax", "API RESTful"],
    category: "Backend",
    icon: "📱",
    color: "#8B5CF6",
  },
  {
    title: "XSEL SCHOOL",
    desc: "Plateforme web complète pour la digitalisation de la gestion administrative et pédagogique d'établissements scolaires.",
    tags: ["Next.js", "React", "Tailwind CSS", "GitLab CI/CD", "Jira"],
    category: "EdTech",
    icon: "🎓",
    color: "#EC4899",
  },
  {
    title: "PHARMA",
    desc: "Application web et API sécurisée pour la gestion complète de l'inventaire et la traçabilité des produits pharmaceutiques.",
    tags: ["Laravel", "Sanctum", "MySQL", "GitLab CI/CD"],
    category: "HealthTech",
    icon: "💊",
    color: "#14B8A6",
  },
  {
    title: "CI TERRITORY",
    desc: "API RESTful géographique centralisant les données du découpage territorial ivoirien : régions, départements, communes et villages.",
    tags: ["Laravel", "Sanctum", "MySQL", "REST API"],
    category: "Backend",
    icon: "🗺️",
    color: "#F97316",
  },
  {
    title: "MON IMMOBILIER",
    desc: "Plateforme web de gestion de portefeuilles immobiliers et mise en relation propriétaires-locataires.",
    tags: ["Laravel", "Breeze", "MySQL", "jQuery"],
    category: "Frontend",
    icon: "🏠",
    color: "#84CC16",
  },
  {
    title: "GPI – Parc Informatique",
    desc: "Système de gestion des équipements informatiques et suivi des interventions techniques.",
    tags: ["Laravel", "MySQL", "JavaScript", "Ajax"],
    category: "Backend",
    icon: "🖥️",
    color: "#06B6D4",
  },
  {
    title: "HELPDESK",
    desc: "Plateforme de centralisation du support technique et gestion des demandes d'assistance informatique.",
    tags: ["Laravel", "Breeze", "MySQL", "jQuery"],
    category: "Backend",
    icon: "🛠️",
    color: "#A855F7",
  },
];

const SKILLS: Record<string, string[]> = {
  "Langages & Frameworks": ["PHP / Laravel", "Java / Spring Boot", "JavaScript / Next.js", "Flutter / Dart", "React.js"],
  "Frontend": ["Next.js", "React.js", "Tailwind CSS", "jQuery / Ajax", "HTML5 / CSS3"],
  "DevOps & Cloud": ["Docker / Docker Compose", "Kubernetes", "Jenkins", "GitLab CI/CD", "Nginx"],
  "Bases de données": ["PostgreSQL", "MySQL", "Elasticsearch", "Redis"],
  "Sécurité & Auth": ["Keycloak / SSO", "OpenID Connect", "SSL/TLS", "Laravel Sanctum"],
  "Outils": ["Git / GitHub / GitLab", "Jira / Trello", "Scrum / Kanban", "Swagger / Postman"],
};

const EXPERIENCES = [
  {
    period: "Août 2025 – Présent",
    role: "Consultant Technique",
    company: "MICE",
    location: "Abidjan",
    desc: "Conception d'une solution API-first pour une plateforme web et mobile de gestion agricole. Développement d'API sécurisées sous Laravel et applications mobiles Flutter.",
    tags: ["Laravel", "Flutter", "API-first", "Mobile"],
    current: true,
  },
  {
    period: "Avr. 2021 – Présent",
    role: "Développeur Full Stack Senior",
    company: "XSEL-SERVICES",
    location: "Riviéra Palmeraie, Abidjan",
    desc: "Encadrement d'équipes sur des projets Laravel complexes. Gestion Agile (Scrum/Kanban), revues de code quotidiennes et livraison continue de fonctionnalités.",
    tags: ["Laravel", "Agile", "Mentorat", "Scrum"],
    current: true,
  },
  {
    period: "Mar. 2020 – Déc. 2020",
    role: "Développeur Web Freelance",
    company: "OURDREAM",
    location: "Yopougon",
    desc: "Conception et développement d'applications web sur mesure pour des clients variés.",
    tags: ["Freelance", "Web", "Laravel"],
    current: false,
  },
  {
    period: "Jan. 2020 – Déc. 2020",
    role: "Développeur Web",
    company: "FIRAPE",
    location: "Yopougon",
    desc: "Gestion des réseaux sociaux et responsabilités de développement.",
    tags: ["Web", "Réseaux sociaux"],
    current: false,
  },
];

const EDUCATION = [
  { year: "2024 – 2025", degree: "Master en Génie Logiciel", school: "ISTEMA", location: "Plateau, Abidjan" },
  { year: "2022 – 2023", degree: "Licence Professionnelle en Génie Logiciel", school: "ISTEMA", location: "Plateau, Abidjan" },
  { year: "2019 – 2020", degree: "Brevet de Technicien Supérieur – IDA", school: "PIGIER", location: "Plateau, Abidjan" },
];

const CATEGORIES = ["Tous", "Backend", "Frontend", "DevOps", "FinTech", "GovTech", "EdTech", "HealthTech"];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
interface Project {
  title: string;
  desc: string;
  tags: string[];
  category: string;
  icon: string;
  color: string;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-6 cursor-pointer transition-all duration-500"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${project.color}18, #0f172a)`
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? project.color + "66" : "rgba(255,255,255,0.07)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 40px ${project.color}22` : "none",
        transitionDelay: `${index * 20}ms`,
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${project.color}22`, border: `1px solid ${project.color}44` }}
        >
          {project.icon}
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest mb-1 block" style={{ color: project.color }}>
            {project.category}
          </span>
          <h3 className="text-white font-bold text-lg leading-tight">{project.title}</h3>
        </div>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.desc}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded text-xs font-mono"
            style={{ background: `${project.color}22`, color: project.color, border: `1px solid ${project.color}44` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [filterCat, setFilterCat] = useState("Tous");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [typeText, setTypeText] = useState("");

  const phrases = ["Ingénieur Full Stack", "Expert Spring Boot", "Architecte DevOps", "Développeur Laravel"];
  const phraseRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
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
  }, []);

  const filtered = filterCat === "Tous" ? PROJECTS : PROJECTS.filter((p) => p.category === filterCat);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: "hero", label: "Accueil" },
    { id: "projects", label: "Projets" },
    { id: "skills", label: "Compétences" },
    { id: "experience", label: "Expérience" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: "#080C14" }}>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrollY > 60 ? "rgba(8,12,20,0.95)" : "transparent",
          backdropFilter: scrollY > 60 ? "blur(12px)" : "none",
          borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-black"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", fontFamily: "var(--font-space-mono)" }}
            >
              RO
            </div>
            <span className="text-white font-semibold text-sm hidden sm:block tracking-wide">Romaric Ouangni</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm font-medium tracking-widest uppercase text-slate-400 hover:text-white transition-colors duration-300"
                style={{ letterSpacing: "0.12em" }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <a
            href="mailto:wangny.ouangni@gmail.com"
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 text-black"
            style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
          >
            Me contacter
          </a>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" />
                : <path d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-6 flex flex-col gap-4" style={{ background: "rgba(8,12,20,0.98)" }}>
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-left text-slate-300 hover:text-white font-medium py-2 border-b border-slate-800"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center hero-grid">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none pulse-slow"
          style={{ background: "radial-gradient(circle, #F59E0B22, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none pulse-slow"
          style={{ background: "radial-gradient(circle, #8B5CF622, transparent 70%)", animationDelay: "2s" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
          <div className="max-w-4xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 fade-up"
              style={{ background: "#F59E0B18", border: "1px solid #F59E0B44", animationDelay: "0.1s" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" style={{ boxShadow: "0 0 6px #4ADE80" }} />
              <span className="text-amber-400 text-sm" style={{ fontFamily: "var(--font-space-mono)" }}>
                Disponible pour des projets
              </span>
            </div>

            <h1
              className="fade-up mb-2"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                animationDelay: "0.2s",
              }}
            >
              Romaric<br />
              <span className="gradient-text">Ouangni</span>
            </h1>

            <div className="fade-up mb-6 h-12 flex items-center" style={{ animationDelay: "0.3s" }}>
              <span
                className="text-2xl md:text-3xl font-light text-slate-300"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {typeText}
                <span className="cursor text-amber-400">|</span>
              </span>
            </div>

            <p className="fade-up text-slate-400 text-lg leading-relaxed max-w-2xl mb-10" style={{ animationDelay: "0.4s" }}>
              Ingénieur logiciel Full Stack avec{" "}
              <strong className="text-white">5 ans d&apos;expérience</strong>, spécialisé dans la conception
              d&apos;applications web robustes, sécurisées et scalables. Passionné par les architectures
              microservices, le DevOps et l&apos;innovation technologique.
            </p>

            <div className="fade-up flex flex-wrap gap-4" style={{ animationDelay: "0.5s" }}>
              <button
                onClick={() => scrollTo("projects")}
                className="px-8 py-4 rounded-full font-semibold text-black transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", boxShadow: "0 8px 30px #F59E0B44" }}
              >
                Voir mes projets →
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}
              >
                Me contacter
              </button>
            </div>

            <div
              className="fade-up flex flex-wrap gap-8 mt-16 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)", animationDelay: "0.6s" }}
            >
              {[
                { n: "5+", label: "Ans d'expérience" },
                { n: "12+", label: "Projets livrés" },
                { n: "60%", label: "Réduction délais DIGIFOR" },
                { n: "2", label: "Postes en parallèle" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold gradient-text">{s.n}</div>
                  <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Projets Réalisés</h2>
            <p className="text-slate-400 max-w-xl">
              Une sélection de projets couvrant FinTech, GovTech, EdTech et systèmes d&apos;entreprise.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: filterCat === cat ? "linear-gradient(135deg, #F59E0B, #EF4444)" : "rgba(255,255,255,0.05)",
                  color: filterCat === cat ? "#000" : "#94A3B8",
                  border: filterCat === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Stack technique</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Compétences</h2>
            <p className="text-slate-400 max-w-xl">Technologies et outils maîtrisés au fil des projets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(SKILLS).map(([title, skills]) => (
              <div
                key={title}
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <h3 className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-4">{title}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-lg text-sm text-slate-300 font-medium hover:text-white transition-colors"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: "L'essentiel de Laravel", org: "LinkedIn Learning" },
              { title: "L'essentiel de Spring Boot", org: "LinkedIn Learning" },
            ].map((cert) => (
              <div
                key={cert.title}
                className="flex items-center gap-4 p-5 rounded-2xl"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <span className="text-2xl">📜</span>
                <div>
                  <div className="text-white font-semibold">{cert.title}</div>
                  <div className="text-amber-400 text-sm">{cert.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Parcours</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Expérience & Formation</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-white font-semibold text-xl mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "#F59E0B22" }}>💼</span>
                Expériences Professionnelles
              </h3>
              {EXPERIENCES.map((exp) => (
                <div key={exp.company + exp.role} className="relative pl-8">
                  <div
                    className="absolute left-0 top-2 w-3 h-3 rounded-full border-2"
                    style={{
                      background: exp.current ? "#F59E0B" : "#334155",
                      borderColor: exp.current ? "#F59E0B" : "#475569",
                      boxShadow: exp.current ? "0 0 12px #F59E0B88" : "none",
                    }}
                  />
                  <div className="absolute left-1.5 top-5 bottom-0 w-px bg-slate-700" />
                  <div
                    className="rounded-2xl p-6 mb-6"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-white font-bold text-lg">{exp.role}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-amber-400 font-semibold">{exp.company}</span>
                          <span className="text-slate-500 text-sm">·</span>
                          <span className="text-slate-400 text-sm">{exp.location}</span>
                        </div>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-mono"
                        style={{
                          background: exp.current ? "#F59E0B22" : "rgba(255,255,255,0.05)",
                          color: exp.current ? "#F59E0B" : "#94A3B8",
                          border: `1px solid ${exp.current ? "#F59E0B44" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{exp.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-xs font-mono text-slate-400"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-white font-semibold text-xl mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "#F59E0B22" }}>🎓</span>
                Formations
              </h3>
              <div className="space-y-4 mb-10">
                {EDUCATION.map((edu) => (
                  <div
                    key={edu.degree}
                    className="p-5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-1">{edu.year}</div>
                    <div className="text-white font-semibold">{edu.degree}</div>
                    <div className="text-slate-400 text-sm mt-1">{edu.school} · {edu.location}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-white font-semibold text-xl mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "#F59E0B22" }}>✨</span>
                Soft Skills
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🔄", label: "Apprentissage continu" },
                  { icon: "💬", label: "Communication technique" },
                  { icon: "🧩", label: "Résolution de problèmes" },
                  { icon: "🚀", label: "Leadership & Gestion" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span>{s.icon}</span>
                    <span className="text-slate-300 text-sm font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #F59E0B0A, #8B5CF60A)", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, #F59E0B08, transparent 70%)" }}
            />
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Contact</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Travaillons Ensemble</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
              Je suis ouvert aux opportunités de freelance, aux postes à temps plein et aux projets innovants.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <a
                href="mailto:wangny.ouangni@gmail.com"
                className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-black transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", boxShadow: "0 8px 30px #F59E0B44" }}
              >
                wangny.ouangni@gmail.com
              </a>
              <a
                href="tel:+2250788323276"
                className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                +225 07 88 32 32 76
              </a>
            </div>
            <p className="text-slate-500 text-sm">📍 Abidjan, Cocody, Côte d&apos;Ivoire</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-slate-600 text-sm" style={{ fontFamily: "var(--font-space-mono)" }}>
          © 2025 Romaric Ouangni · Ingénieur Logiciel Full Stack · Abidjan, CI
        </p>
      </footer>
    </div>
  );
}
