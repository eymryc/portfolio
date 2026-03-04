"use client";

import { useState, useRef } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/dashboard/EmptyState";
import type {
  ExperienceItem,
  ProjectItem,
  EducationItem,
  TestimonialItem,
  ServiceItem,
} from "@/types/portfolio";

const SECTION_LABELS: Record<string, string> = {
  experiences: "Expériences",
  projects: "Projets",
  education: "Formation",
  testimonials: "Témoignages",
  services: "Services / Tarifs",
};

type Item = ExperienceItem | ProjectItem | EducationItem | TestimonialItem | ServiceItem;

interface SectionItemsProps {
  section: "experiences" | "projects" | "education" | "testimonials" | "services";
}

export default function SectionItems({ section }: SectionItemsProps) {
  const { portfolio, addItem, updateItem, destroyItem, replaceSection, uploadFile } = useDashboard();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const items: Item[] = (portfolio?.content?.[section] as Item[]) ?? [];

  async function handleReorder(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    setError("");
    setSuccess("");
    setReordering(true);
    const newOrder = [...items];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    try {
      await replaceSection(section, newOrder);
      setSuccess("Ordre mis à jour.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setReordering(false);
    }
  }

  const emptyItem = (): Record<string, unknown> => {
    if (section === "experiences") return { period: "", role: "", company: "", location: "", current: false, desc: "" };
    if (section === "projects") return { title: "", desc: "", tags: [], link: "" };
    if (section === "testimonials") return { author: "", company: "", text: "" };
    if (section === "services") return { title: "", description: "", price: "" };
    return { year: "", degree: "", school: "", location: "" };
  };

  async function handleAdd() {
    setError("");
    setSuccess("");
    setAdding(true);
    try {
      await addItem(section, emptyItem());
      setSuccess("Élément ajouté.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdate(id: string, data: Record<string, unknown>) {
    setError("");
    setSuccess("");
    setUpdatingId(id);
    try {
      await updateItem(section, id, data);
      setSuccess("Modifications enregistrées.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(id: string) {
    setError("");
    setRemovingId(id);
    try {
      await destroyItem(section, id);
      setDeleteConfirm(null);
      setSuccess("Élément supprimé.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white/90">{SECTION_LABELS[section]}</h2>
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="px-4 py-2 bg-orange-500 text-[var(--color-bg)] rounded-lg text-sm font-medium hover:bg-orange-400 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 min-w-[100px]"
        >
          {adding ? <><Spinner size="sm" className="border-t-orange-900" /> Ajout…</> : "+ Ajouter"}
        </button>
      </div>
      {success && (
        <Alert type="success" message={success} onDismiss={() => setSuccess("")} autoDismissMs={4000} />
      )}
      {error && (
        <Alert type="error" message={error} onDismiss={() => setError("")} />
      )}
      <div className="space-y-3 dashboard-stagger">
        {items.map((item, index) => (
          <ItemCard
            key={item.id}
            section={section}
            item={item}
            index={index}
            total={items.length}
            isUpdating={updatingId === item.id}
            reordering={reordering}
            uploadFile={uploadFile}
            onUpdate={(data) => handleUpdate(item.id, data)}
            onRequestRemove={(id, title) => setDeleteConfirm({ id, title })}
            onMoveUp={() => handleReorder(index, -1)}
            onMoveDown={() => handleReorder(index, 1)}
          />
        ))}
        {items.length === 0 && (
          <EmptyState
            icon={
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            }
            title={section === "experiences" ? "Aucune expérience" : section === "projects" ? "Aucun projet" : section === "education" ? "Aucune formation" : section === "testimonials" ? "Aucun témoignage" : "Aucun service"}
            description={section === "experiences" ? "Ajoutez votre première expérience professionnelle pour enrichir votre portfolio." : section === "projects" ? "Présentez vos réalisations en ajoutant un premier projet." : section === "education" ? "Indiquez vos diplômes et formations." : section === "testimonials" ? "Les témoignages de clients ou collègues renforcent votre crédibilité." : "Décrivez vos offres de services et tarifs."}
            actionLabel={section === "experiences" ? "Ajouter une expérience" : section === "projects" ? "Ajouter un projet" : section === "education" ? "Ajouter une formation" : section === "testimonials" ? "Ajouter un témoignage" : "Ajouter un service"}
            onAction={handleAdd}
          />
        )}
      </div>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Supprimer cet élément ?"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => deleteConfirm && handleRemove(deleteConfirm.id)}
              disabled={!!removingId}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/90 text-white hover:bg-red-500 disabled:opacity-60 transition-colors inline-flex items-center gap-2 min-w-[100px] justify-center"
            >
              {removingId ? <><Spinner size="sm" className="border-t-white" /> Suppression…</> : "Supprimer"}
            </button>
          </>
        }
      >
        {deleteConfirm ? (
          <>
            <p className="text-white/80">
              Vous allez supprimer : <strong className="text-white">{deleteConfirm.title}</strong>
            </p>
            <p className="mt-2 text-white/60 text-xs">Cette action est irréversible.</p>
          </>
        ) : null}
      </Modal>
    </div>
  );
}

const inputClass = "w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm";
const textareaClass = "w-full min-h-[7rem] bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm resize-y";

function ItemCard({
  section,
  item,
  index,
  total,
  isUpdating,
  reordering,
  uploadFile,
  onUpdate,
  onRequestRemove,
  onMoveUp,
  onMoveDown,
}: {
  section: string;
  item: Item;
  index: number;
  total: number;
  isUpdating?: boolean;
  reordering?: boolean;
  uploadFile?: (file: File) => Promise<{ url: string }>;
  onUpdate: (data: Record<string, unknown>) => void;
  onRequestRemove: (id: string, title: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const isExperience = section === "experiences";
  const isProject = section === "projects";
  const isEducation = section === "education";
  const isTestimonial = section === "testimonials";
  const isService = section === "services";

  const displayTitle =
    isExperience ? (item as ExperienceItem).role || "(Sans titre)"
    : isProject ? (item as ProjectItem).title || "(Sans titre)"
    : isEducation ? (item as EducationItem).degree || "(Sans titre)"
    : isTestimonial ? (item as TestimonialItem).author || (item as TestimonialItem).company || "Témoignage"
    : isService ? (item as ServiceItem).title || "Service"
    : "(Sans titre)";

  if (!editing) {
    return (
      <div className="border border-white/10 rounded-xl p-4 flex justify-between items-start gap-4 bg-white/[0.02] hover:border-white/15 transition-all duration-200 dashboard-card-hover">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white">{displayTitle}</p>
          {isExperience && <p className="text-white/60 text-sm mt-0.5">{(item as ExperienceItem).company}</p>}
          {isProject && (
            <>
              {(item as ProjectItem).desc && (
                <p className="text-white/60 text-sm mt-1 line-clamp-2">{(item as ProjectItem).desc}</p>
              )}
              <p className="text-white/50 text-xs mt-0.5">{(item as ProjectItem).link || "—"}</p>
            </>
          )}
          {isEducation && <p className="text-white/60 text-sm mt-0.5">{(item as EducationItem).school}</p>}
          {isTestimonial && (
            <p className="text-white/60 text-sm mt-0.5 line-clamp-2">{(item as TestimonialItem).text || "—"}</p>
          )}
          {isService && (
            <>
              <p className="text-white/60 text-sm mt-0.5 line-clamp-2">{(item as ServiceItem).description || "—"}</p>
              {(item as ServiceItem).price && (
                <p className="text-orange-400/90 text-xs mt-0.5">{(item as ServiceItem).price}</p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {total > 1 && (
            <span className="flex flex-col mr-1">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0 || reordering}
                className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                title="Monter"
                aria-label="Monter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === total - 1 || reordering}
                className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                title="Descendre"
                aria-label="Descendre"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 rounded-lg text-orange-400 text-sm hover:bg-orange-500/10 transition-colors"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={() => onRequestRemove(item.id, displayTitle)}
            className="px-3 py-1.5 rounded-lg text-red-400 text-sm hover:bg-red-500/10 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    );
  }

  if (isExperience) {
    const e = item as ExperienceItem;
    return (
      <ExperienceEditForm
        item={e}
        saving={!!isUpdating}
        onSave={(data) => {
          onUpdate(data);
          setEditing(false);
        }}
        onClose={() => setEditing(false)}
      />
    );
  }

  if (isProject) {
    const p = item as ProjectItem;
    return (
      <ProjectEditForm
        item={p}
        saving={!!isUpdating}
        uploadFile={uploadFile}
        onSave={(data) => {
          onUpdate(data);
          setEditing(false);
        }}
        onClose={() => setEditing(false)}
      />
    );
  }

  if (isTestimonial) {
    const t = item as TestimonialItem;
    return (
      <TestimonialEditForm
        item={t}
        saving={!!isUpdating}
        onSave={(data) => {
          onUpdate(data);
          setEditing(false);
        }}
        onClose={() => setEditing(false)}
      />
    );
  }

  if (isService) {
    const s = item as ServiceItem;
    return (
      <ServiceEditForm
        item={s}
        saving={!!isUpdating}
        onSave={(data) => {
          onUpdate(data);
          setEditing(false);
        }}
        onClose={() => setEditing(false)}
      />
    );
  }

  const ed = item as EducationItem;
  return (
    <EducationEditForm
      item={ed}
      saving={!!isUpdating}
      onSave={(data) => {
        onUpdate(data);
        setEditing(false);
      }}
      onClose={() => setEditing(false)}
    />
  );
}

function ExperienceEditForm({
  item,
  saving,
  onSave,
  onClose,
}: {
  item: ExperienceItem;
  saving?: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [role, setRole] = useState(item.role ?? "");
  const [company, setCompany] = useState(item.company ?? "");
  const [period, setPeriod] = useState(item.period ?? "");
  const [location, setLocation] = useState(item.location ?? "");
  const [current, setCurrent] = useState(item.current ?? false);
  const rawDesc = item.description ?? (item as unknown as Record<string, unknown>).desc;
  const [desc, setDesc] = useState<string>(typeof rawDesc === "string" ? rawDesc : "");

  const handleSave = () => {
    onSave({ ...item, role, company, period, location, current, description: desc, desc });
  };

  return (
    <div className="border border-orange-500/30 rounded-lg p-4 space-y-3">
      <div>
        <label className="block text-sm text-white/70 mb-1">Rôle</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Ex: Développeur full-stack"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Entreprise</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Nom de l’entreprise"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Localisation</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ex: Paris, Abidjan"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Période</label>
        <input
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="Ex: 2022 – Présent"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Missions, réalisations..."
          rows={4}
          className={textareaClass}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} />
        Poste actuel
      </label>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 bg-orange-500 text-[var(--color-bg)] rounded-lg text-sm font-medium hover:bg-orange-400 disabled:opacity-60 inline-flex items-center gap-2 min-w-[110px] justify-center"
        >
          {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer"}
        </button>
        <button type="button" onClick={onClose} disabled={saving} className="text-orange-400 text-sm hover:underline disabled:opacity-60">
          Fermer
        </button>
      </div>
    </div>
  );
}

function ProjectEditForm({
  item,
  saving,
  uploadFile,
  onSave,
  onClose,
}: {
  item: ProjectItem;
  saving?: boolean;
  uploadFile?: (file: File) => Promise<{ url: string }>;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(item.title ?? "");
  const [desc, setDesc] = useState(item.desc ?? "");
  const [objective, setObjective] = useState(item.objective ?? "");
  const [role, setRole] = useState(item.role ?? "");
  const [result, setResult] = useState(item.result ?? "");
  const [link, setLink] = useState(item.link ?? "");
  const [image, setImage] = useState(item.image ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const projectImageInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({ ...item, title, desc, objective, role, result, link, image });
  };

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uploadFile) return;
    setUploadingImage(true);
    try {
      const { url } = await uploadFile(file);
      setImage(url);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  return (
    <div className="border border-orange-500/30 rounded-lg p-4 space-y-3">
      {uploadFile && (
        <div>
          <label className="block text-sm text-white/70 mb-1">Image du projet</label>
          <input type="file" ref={projectImageInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
          <div className="flex items-center gap-4">
            {image ? (
              <img src={image} alt="" className="w-20 h-20 rounded-lg object-cover border border-white/20" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center text-white/40 text-xs">Aucune image</div>
            )}
            <button type="button" onClick={() => projectImageInputRef.current?.click()} disabled={uploadingImage} className="text-orange-400 text-sm hover:underline disabled:opacity-50">
              {uploadingImage ? "Upload…" : "Choisir une image"}
            </button>
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm text-white/70 mb-1">Titre</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du projet" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description courte"
          rows={4}
          className={textareaClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Objectif du projet</label>
        <input
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Quel était l’objectif ?"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Votre rôle</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Votre rôle dans le projet"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Résultat obtenu</label>
        <input
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="Résultat ou impact"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Lien (URL)</label>
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" className={inputClass} />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 bg-orange-500 text-[var(--color-bg)] rounded-lg text-sm font-medium hover:bg-orange-400 disabled:opacity-60 inline-flex items-center gap-2 min-w-[110px] justify-center"
        >
          {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer"}
        </button>
        <button type="button" onClick={onClose} disabled={saving} className="text-orange-400 text-sm hover:underline disabled:opacity-60">
          Fermer
        </button>
      </div>
    </div>
  );
}

function EducationEditForm({
  item,
  saving,
  onSave,
  onClose,
}: {
  item: EducationItem;
  saving?: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [degree, setDegree] = useState(item.degree ?? "");
  const [school, setSchool] = useState(item.school ?? "");
  const [year, setYear] = useState(item.year ?? "");
  const [location, setLocation] = useState(item.location ?? "");

  const handleSave = () => {
    onSave({ ...item, degree, school, year, location });
  };

  return (
    <div className="border border-orange-500/30 rounded-lg p-4 space-y-3">
      <div>
        <label htmlFor="edu-degree" className="block text-sm text-white/70 mb-1">Diplôme</label>
        <input
          id="edu-degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          placeholder="Ex: Master Informatique"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="edu-school" className="block text-sm text-white/70 mb-1">Établissement</label>
        <input
          id="edu-school"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Nom de l’école ou université"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="edu-year" className="block text-sm text-white/70 mb-1">Année(s)</label>
        <input
          id="edu-year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Ex: 2015 – 2017"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="edu-location" className="block text-sm text-white/70 mb-1">Lieu / Ville</label>
        <input
          id="edu-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ex: Paris"
          className={inputClass}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 bg-orange-500 text-[var(--color-bg)] rounded-lg text-sm font-medium hover:bg-orange-400 disabled:opacity-60 inline-flex items-center gap-2 min-w-[110px] justify-center"
        >
          {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer"}
        </button>
        <button type="button" onClick={onClose} disabled={saving} className="text-orange-400 text-sm hover:underline disabled:opacity-60">
          Fermer
        </button>
      </div>
    </div>
  );
}

function TestimonialEditForm({
  item,
  saving,
  onSave,
  onClose,
}: {
  item: TestimonialItem;
  saving?: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [author, setAuthor] = useState(item.author ?? "");
  const [company, setCompany] = useState(item.company ?? "");
  const [role, setRole] = useState(item.role ?? "");
  const [text, setText] = useState(item.text ?? "");
  const [photo, setPhoto] = useState(item.photo ?? "");

  const handleSave = () => {
    onSave({ ...item, author, company, role, text, photo });
  };

  return (
    <div className="border border-orange-500/30 rounded-lg p-4 space-y-3">
      <div>
        <label className="block text-sm text-white/70 mb-1">Auteur</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nom du client ou partenaire" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Entreprise / Poste</label>
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Entreprise ou rôle" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Témoignage</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Citation ou commentaire"
          rows={5}
          className={textareaClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Photo (URL)</label>
        <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://…" className={inputClass} />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 bg-orange-500 text-[var(--color-bg)] rounded-lg text-sm font-medium hover:bg-orange-400 disabled:opacity-60 inline-flex items-center gap-2 min-w-[110px] justify-center"
        >
          {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer"}
        </button>
        <button type="button" onClick={onClose} disabled={saving} className="text-orange-400 text-sm hover:underline disabled:opacity-60">
          Fermer
        </button>
      </div>
    </div>
  );
}

function ServiceEditForm({
  item,
  saving,
  onSave,
  onClose,
}: {
  item: ServiceItem;
  saving?: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(item.title ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(item.price ?? "");

  const handleSave = () => {
    onSave({ ...item, title, description, price });
  };

  return (
    <div className="border border-orange-500/30 rounded-lg p-4 space-y-3">
      <div>
        <label className="block text-sm text-white/70 mb-1">Titre de la prestation</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Création de site web" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détail de la prestation"
          rows={4}
          className={textareaClass}
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Tarif (optionnel)</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: À partir de 500 €" className={inputClass} />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 bg-orange-500 text-[var(--color-bg)] rounded-lg text-sm font-medium hover:bg-orange-400 disabled:opacity-60 inline-flex items-center gap-2 min-w-[110px] justify-center"
        >
          {saving ? <><Spinner size="sm" className="border-t-orange-900" /> Enregistrement…</> : "Enregistrer"}
        </button>
        <button type="button" onClick={onClose} disabled={saving} className="text-orange-400 text-sm hover:underline disabled:opacity-60">
          Fermer
        </button>
      </div>
    </div>
  );
}
