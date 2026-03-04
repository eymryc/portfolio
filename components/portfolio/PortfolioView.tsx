"use client";

import type { PortfolioData, PortfolioContent } from "@/types/portfolio";

interface PortfolioViewProps {
  data: PortfolioData;
  page?: string;
}

export default function PortfolioView({ data }: PortfolioViewProps) {
  const content: PortfolioContent = data.content ?? {};
  const profile = content.profile ?? {};
  const skills = content.skills ?? {};
  const experiences = content.experiences ?? [];
  const projects = content.projects ?? [];
  const education = content.education ?? [];
  const testimonials = content.testimonials ?? [];
  const services = content.services ?? [];
  const contact = content.contact ?? {};

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white font-[var(--font-sans)]">
      <header className="border-b border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
          {profile.photo && (
            <img
              src={profile.photo}
              alt={profile.name ?? "Photo"}
              className="w-24 h-24 rounded-full object-cover border-2 border-orange-500/50"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile.name ?? "Sans nom"}</h1>
            <p className="text-orange-400 text-lg mt-1">{profile.title ?? ""}</p>
            {profile.bio && <p className="text-white/70 mt-3 max-w-xl">{profile.bio}</p>}
            {(profile.links?.linkedin || profile.links?.github || profile.links?.website || profile.links?.cv) && (
              <div className="flex flex-wrap gap-4 mt-4">
                {profile.links.linkedin && (
                  <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                    LinkedIn
                  </a>
                )}
                {profile.links.github && (
                  <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                    GitHub
                  </a>
                )}
                {profile.links.website && (
                  <a href={profile.links.website} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                    Site web
                  </a>
                )}
                {profile.links.cv && (
                  <a href={profile.links.cv} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                    Télécharger le CV
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-6 space-y-12">
        {Object.keys(skills).length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Compétences</h2>
            <div className="space-y-3">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <p className="text-white/60 text-sm">{category}</p>
                  <p className="text-white/90">
                    {Array.isArray(items) ? items.join(" · ") : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Expériences</h2>
            <ul className="space-y-4">
              {experiences.map((exp) => (
                <li key={exp.id} className="border-l-2 border-orange-500/50 pl-4">
                  <p className="font-medium">{exp.role}</p>
                  <p className="text-white/70">{exp.company}</p>
                  {exp.period && <p className="text-white/50 text-sm">{exp.period}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Projets</h2>
            <ul className="space-y-4">
              {projects.map((proj) => (
                <li key={proj.id}>
                  <p className="font-medium">{proj.title}</p>
                  {proj.desc && <p className="text-white/70 text-sm mt-1">{proj.desc}</p>}
                  {proj.objective && <p className="text-white/60 text-xs mt-0.5"><strong>Objectif :</strong> {proj.objective}</p>}
                  {proj.role && <p className="text-white/60 text-xs mt-0.5"><strong>Rôle :</strong> {proj.role}</p>}
                  {proj.result && <p className="text-white/60 text-xs mt-0.5"><strong>Résultat :</strong> {proj.result}</p>}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-orange-400 text-sm hover:underline mt-1 inline-block">
                      Voir le projet →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {testimonials.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Témoignages</h2>
            <ul className="space-y-4">
              {testimonials.map((t) => (
                <li key={t.id} className="border-l-2 border-orange-500/50 pl-4">
                  {t.text && <p className="text-white/90 italic">&ldquo;{t.text}&rdquo;</p>}
                  {(t.author || t.company) && (
                    <p className="text-white/60 text-sm mt-1">— {[t.author, t.company].filter(Boolean).join(", ")}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {services.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Services / Tarifs</h2>
            <ul className="space-y-4">
              {services.map((s) => (
                <li key={s.id}>
                  <p className="font-medium">{s.title}</p>
                  {s.description && <p className="text-white/70 text-sm mt-1">{s.description}</p>}
                  {s.price && <p className="text-orange-400 text-sm mt-0.5">{s.price}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Formation</h2>
            <ul className="space-y-3">
              {education.map((ed) => (
                <li key={ed.id}>
                  <p className="font-medium">{ed.degree}</p>
                  <p className="text-white/70">{ed.school}</p>
                  {ed.year && <p className="text-white/50 text-sm">{ed.year}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(contact.email || contact.phone) && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Contact</h2>
            <div className="space-y-2">
              {contact.email && (
                <p>
                  <a href={`mailto:${contact.email}`} className="text-orange-400 hover:underline">
                    {contact.email}
                  </a>
                </p>
              )}
              {contact.phone && <p className="text-white/90">{contact.phone}</p>}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 py-6 px-6 text-center text-white/50 text-sm">
        Portfolio généré avec Portfolio as a Service
      </footer>
    </div>
  );
}
