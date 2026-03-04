"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { ProfileSection } from "@/types/portfolio";

export default function SectionProfile() {
  const { portfolio, replaceSection, uploadFile } = useDashboard();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);

  const STEPS = [
    { id: 0, label: "Identité", short: "1" },
    { id: 1, label: "Parcours", short: "2" },
    { id: 2, label: "CV & Liens", short: "3" },
  ] as const;

  const profile: ProfileSection = portfolio?.content?.profile ?? {};
  const cvUrl = profile.cv ?? profile.links?.cv ?? "";
  const [form, setForm] = useState({
    name: profile.name ?? "",
    title: profile.title ?? "",
    bio: profile.bio ?? "",
    photo: profile.photo ?? "",
    yearsOfExperience: profile.yearsOfExperience != null ? String(profile.yearsOfExperience) : "",
    projectsCount: profile.projectsCount != null ? String(profile.projectsCount) : "",
    hobbies: (profile.hobbies ?? []).join(", "),
    linkedin: profile.links?.linkedin ?? "",
    github: profile.links?.github ?? "",
    website: profile.links?.website ?? "",
    cv: cvUrl,
    openToWork: profile.openToWork ?? false,
    openToWorkMessage: profile.openToWorkMessage ?? "",
  });

  useEffect(() => {
    const cv = profile.cv ?? profile.links?.cv ?? "";
    setForm({
      name: profile.name ?? "",
      title: profile.title ?? "",
      bio: profile.bio ?? "",
      photo: profile.photo ?? "",
      yearsOfExperience: profile.yearsOfExperience != null ? String(profile.yearsOfExperience) : "",
      projectsCount: profile.projectsCount != null ? String(profile.projectsCount) : "",
      hobbies: (profile.hobbies ?? []).join(", "),
      linkedin: profile.links?.linkedin ?? "",
      github: profile.links?.github ?? "",
      website: profile.links?.website ?? "",
      cv,
      openToWork: profile.openToWork ?? false,
      openToWorkMessage: profile.openToWorkMessage ?? "",
    });
  }, [portfolio?.id, portfolio?.content?.profile]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const { url } = await uploadFile(file);
      setForm((f) => ({ ...f, photo: url }));
    } catch (err) {
      setError((err as Error).message);
    }
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const years = form.yearsOfExperience.trim() ? parseInt(form.yearsOfExperience, 10) : undefined;
      const count = form.projectsCount.trim() ? parseInt(form.projectsCount, 10) : undefined;
      const hobbiesList = form.hobbies
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean);
      await replaceSection("profile", {
        name: form.name,
        title: form.title,
        bio: form.bio,
        photo: form.photo,
        yearsOfExperience: years,
        projectsCount: count,
        hobbies: hobbiesList.length ? hobbiesList : undefined,
        cv: form.cv || undefined,
        links: {
          linkedin: form.linkedin || undefined,
          github: form.github || undefined,
          website: form.website || undefined,
          cv: form.cv || undefined,
        },
        openToWork: form.openToWork,
        openToWorkMessage: form.openToWorkMessage?.trim() || undefined,
      });
      setSuccess("Profil enregistré.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Alert type="success" message={success} onDismiss={() => setSuccess("")} autoDismissMs={4000} />
      )}
      {error && (
        <Alert type="error" message={error} onDismiss={() => setError("")} />
      )}

      <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-white/90">
        <p className="font-medium text-orange-300">Configuration rapide</p>
        <p className="mt-1 text-white/70">Remplissez les 3 onglets (Identité, Parcours, CV & Liens) en quelques minutes. Import automatique depuis LinkedIn : <span className="text-white/50">bientôt disponible.</span></p>
      </div>

      {/* Stepper horizontal */}
      <div className="flex items-center justify-between w-full" role="tablist" aria-label="Étapes du profil">
        {STEPS.map((s, index) => (
          <div key={s.id} className="flex flex-1 items-center last:flex-initial">
            <button
              type="button"
              onClick={() => setStep(s.id)}
              className="flex flex-col sm:flex-row items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-lg py-2 px-1 min-w-0"
              aria-current={step === s.id ? "step" : undefined}
              aria-label={`Étape ${s.id + 1}: ${s.label}`}
            >
              <span
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step === s.id
                    ? "bg-orange-500 text-[var(--color-bg)]"
                    : step > s.id
                      ? "bg-orange-500/80 text-[var(--color-bg)]"
                      : "bg-white/10 text-white/60 group-hover:bg-white/20"
                }`}
              >
                {step > s.id ? "✓" : s.short}
              </span>
              <span className={`text-sm font-medium truncate max-w-[120px] sm:max-w-none ${step === s.id ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
                {s.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 sm:mx-2 rounded transition-colors ${
                  step > s.id ? "bg-orange-500/60" : "bg-white/10"
                }`}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>

      {/* Étape 0: Identité */}
      {step === 0 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <label className="block text-sm text-white/70 mb-1">Photo de profil</label>
        <input
          id="profile-photo-upload"
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="sr-only"
          onChange={handlePhotoChange}
          aria-label="Choisir une photo de profil"
        />
        <div className="flex items-center gap-4">
          {form.photo ? (
            <img src={form.photo} alt="Profil" className="w-20 h-20 rounded-full object-cover border border-white/20" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-sm">
              Pas de photo
            </div>
          )}
          <label
            htmlFor="profile-photo-upload"
            className="text-orange-400 text-sm hover:underline cursor-pointer"
          >
            Changer la photo
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm text-white/70 mb-1">Nom</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="title" className="block text-sm text-white/70 mb-1">Titre</label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Développeur Full Stack"
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm text-white/70 mb-1">Bio</label>
        <textarea
          id="bio"
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={6}
          className="w-full min-h-[8rem] bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none resize-y transition-colors"
        />
      </div>
      <div className="rounded-lg border border-white/20 bg-white/5 p-4 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.openToWork}
            onChange={(e) => setForm((f) => ({ ...f, openToWork: e.target.checked }))}
            className="rounded border-white/30 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm text-white/90">En recherche (afficher &quot;Open to work&quot; sur mon portfolio)</span>
        </label>
        {form.openToWork && (
          <input
            type="text"
            value={form.openToWorkMessage}
            onChange={(e) => setForm((f) => ({ ...f, openToWorkMessage: e.target.value }))}
            placeholder="Ex. Recherche CDI Paris, Disponible pour missions"
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500 focus:outline-none placeholder:text-white/40"
          />
        )}
      </div>
          <div className="flex justify-end">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-lg bg-orange-500 text-[var(--color-bg)] font-medium hover:bg-orange-400 transition-colors">
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Étape 1: Parcours */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="yearsOfExperience" className="block text-sm text-white/70 mb-1">Années d&apos;expérience</label>
          <input
            id="yearsOfExperience"
            type="number"
            min={0}
            max={70}
            value={form.yearsOfExperience}
            onChange={(e) => setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))}
            placeholder="5"
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="projectsCount" className="block text-sm text-white/70 mb-1">Nombre de projets réalisés</label>
          <input
            id="projectsCount"
            type="number"
            min={0}
            max={1000}
            value={form.projectsCount}
            onChange={(e) => setForm((f) => ({ ...f, projectsCount: e.target.value }))}
            placeholder="25"
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="hobbies" className="block text-sm text-white/70 mb-1">Loisirs / Centres d&apos;intérêt</label>
        <input
          id="hobbies"
          type="text"
          value={form.hobbies}
          onChange={(e) => setForm((f) => ({ ...f, hobbies: e.target.value }))}
          placeholder="Lecture, sport, open source (séparés par des virgules)"
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
        />
      </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(0)} className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              ← Précédent
            </button>
            <button type="button" onClick={() => setStep(2)} className="px-4 py-2 rounded-lg bg-orange-500 text-[var(--color-bg)] font-medium hover:bg-orange-400 transition-colors">
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Étape 2: CV & Liens */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <label htmlFor="cv-url" className="block text-sm text-white/70 mb-2">Lien vers votre CV (URL)</label>
        <input
          id="cv-url"
          type="url"
          placeholder="https://… ou lien vers votre CV"
          value={form.cv}
          onChange={(e) => setForm((f) => ({ ...f, cv: e.target.value }))}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">Liens</label>
        <div className="space-y-2">
          <input
            type="url"
            placeholder="LinkedIn"
            value={form.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
          />
          <input
            type="url"
            placeholder="GitHub"
            value={form.github}
            onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
          />
          <input
            type="url"
            placeholder="Site web"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none placeholder:text-white/30 transition-colors"
          />
        </div>
      </div>
          <div className="flex justify-end">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              ← Précédent
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-white/10 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-orange-500 text-[var(--color-bg)] rounded-lg font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors inline-flex items-center gap-2 min-w-[160px] justify-center"
        >
          {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer le profil"}
        </button>
      </div>
    </form>
  );
}
