"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollAnimation from "@/components/ScrollAnimation";
import ParticleBackground from "@/components/ParticleBackground";
import Link from "next/link";
import { useState } from "react";

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
    desc: "Remote desktop avec Apache Guacamole, reverse proxy Nginx (Let's Encrypt), stack dockerisée et SSO pour accès unifié aux serveurs.",
    tags: ["Apache Guacamole", "Nginx", "Let's Encrypt", "Docker", "SSO"],
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
    category: "Web",
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
    category: "App",
    icon: "🖥️",
    color: "#06B6D4",
  },
  {
    title: "HELPDESK",
    desc: "Plateforme de centralisation du support technique et gestion des demandes d'assistance informatique.",
    tags: ["Laravel", "Breeze", "MySQL", "jQuery"],
    category: "App",
    icon: "🛠️",
    color: "#A855F7",
  },
  // Sites Web
  {
    title: "AFOR",
    desc: "Site web moderne et responsive pour une organisation ou entreprise avec interface intuitive et design professionnel.",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    category: "Web",
    icon: "🌐",
    color: "#3B82F6",
  },
  {
    title: "Villa d'Aujourd'hui",
    desc: "Site web immobilier de luxe présentant des villas et propriétés haut de gamme avec galerie photos et système de recherche avancé.",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    category: "Web",
    icon: "🏡",
    color: "#10B981",
  },
  {
    title: "EUE",
    desc: "Site web institutionnel avec présentation de services, actualités et formulaire de contact intégré.",
    tags: ["Next.js", "React", "Tailwind CSS", "CMS"],
    category: "Web",
    icon: "🏢",
    color: "#6366F1",
  },
  {
    title: "XSEL Services",
    desc: "Site web corporate présentant les services de l'entreprise avec portfolio de projets et formulaire de contact.",
    tags: ["Next.js", "React", "Tailwind CSS", "SEO"],
    category: "Web",
    icon: "💼",
    color: "#F59E0B",
  },
  {
    title: "Inter-Clim",
    desc: "Site web pour une entreprise de climatisation avec présentation de services, catalogue produits et demande de devis en ligne.",
    tags: ["Next.js", "React", "Tailwind CSS", "Formulaires"],
    category: "Web",
    icon: "❄️",
    color: "#06B6D4",
  },
  // Applications
  {
    title: "E-Courrier",
    desc: "Application web de gestion de courrier électronique et de messagerie interne pour entreprises avec suivi et archivage.",
    tags: ["Laravel", "MySQL", "JavaScript", "Ajax"],
    category: "App",
    icon: "📧",
    color: "#8B5CF6",
  },
  {
    title: "SGH24",
    desc: "Application de gestion hospitalière 24/7 pour le suivi des patients, des rendez-vous et de la gestion administrative.",
    tags: ["Laravel", "MySQL", "Bootstrap", "jQuery"],
    category: "App",
    icon: "🏥",
    color: "#EF4444",
  },
];

const CATEGORIES = ["Tous", "Backend", "Frontend", "DevOps", "FinTech", "GovTech", "EdTech", "HealthTech", "Web", "App"];

interface Project {
  title: string;
  desc: string;
  tags: string[];
  category: string;
  icon: string;
  color: string;
}

function getProjectSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const slug = getProjectSlug(project.title);
  
  return (
    <Link href={`/projects/${slug}`} className="h-full block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative rounded-2xl p-6 cursor-pointer transition-all duration-500 group h-full flex flex-col"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${project.color}18, #0f172a)`
            : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? project.color + "66" : "rgba(255,255,255,0.07)"}`,
          transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          boxShadow: hovered ? `0 20px 40px ${project.color}22` : "none",
          minHeight: "320px",
        }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: `${project.color}22`, border: `1px solid ${project.color}44` }}
          >
            {project.icon}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-mono uppercase tracking-widest mb-1 block" style={{ color: project.color }}>
              {project.category}
            </span>
            <h3 className="text-white font-bold text-lg leading-tight mb-2">{project.title}</h3>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">{project.desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-xs font-mono transition-all duration-300 hover:scale-105"
              style={{ background: `${project.color}22`, color: project.color, border: `1px solid ${project.color}44` }}
            >
              {t}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs font-mono text-slate-500">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Voir les détails
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Projects() {
  const [filterCat, setFilterCat] = useState("Tous");

  const filtered = filterCat === "Tous" ? PROJECTS : PROJECTS.filter((p) => p.category === filterCat);

  return (
    <>
      <Navigation />
      <ParticleBackground />
      <div className="min-h-screen text-white pt-24 relative z-10" style={{ background: "#080C14" }}>
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-up">
              Mes <span className="gradient-text">Projets</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto fade-up" style={{ animationDelay: "0.1s" }}>
              Une sélection de projets couvrant FinTech, GovTech, EdTech et systèmes d&apos;entreprise.
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollAnimation delay={0}>
              <div className="flex flex-wrap gap-3 mb-12 justify-center">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 relative overflow-hidden group"
                    style={{
                      background: filterCat === cat ? "linear-gradient(135deg, #F59E0B, #EF4444)" : "rgba(255,255,255,0.05)",
                      color: filterCat === cat ? "#000" : "#94A3B8",
                      border: filterCat === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="relative z-10">{cat}</span>
                    {filterCat === cat && (
                      <span className="absolute inset-0 bg-white/20 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <ScrollAnimation key={p.title} delay={i * 50}>
                  <ProjectCard project={p} index={i} />
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
