"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollAnimation from "@/components/ScrollAnimation";
import Image from "next/image";


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

export default function About() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen text-white pt-24" style={{ background: "#080C14" }}>
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <ScrollAnimation>
                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    À propos de <span className="gradient-text">moi</span>
                  </h1>
                </ScrollAnimation>
                <ScrollAnimation delay={100}>
                  <p className="text-xl text-slate-400 max-w-3xl mx-auto lg:mx-0">
                    Passionné par le développement logiciel et l&apos;innovation technologique
                  </p>
                </ScrollAnimation>
              </div>
              <ScrollAnimation delay={200} direction="right">
                <div className="relative flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", opacity: 0.2, filter: "blur(40px)" }} />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                      <Image
                        src="/photo-profil.jpg"
                        alt="Romaric Ouangni"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 256px, 320px"
                      />
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Compétences</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Stack Technique</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Technologies et outils maîtrisés au fil des projets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(SKILLS).map(([title, skills], idx) => (
                <ScrollAnimation key={title} delay={idx * 100}>
                  <div
                    className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
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
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Experience & Education */}
        <section className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Parcours</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Expérience & Formation</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-white font-semibold text-xl mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "#F59E0B22" }}>💼</span>
                  Expériences Professionnelles
                </h3>
                {EXPERIENCES.map((exp, idx) => (
                  <div key={exp.company + exp.role} className="relative pl-8 mb-6 fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
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
                      className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
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
                  {EDUCATION.map((edu, idx) => (
                    <div
                      key={edu.degree}
                      className="p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] fade-up"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", animationDelay: `${idx * 0.1}s` }}
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
                      className="p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm transition-all duration-300 hover:scale-105"
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
      </div>
      <Footer />
    </>
  );
}
