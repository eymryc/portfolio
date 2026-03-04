/** Utilisateur (auth/me, register, login) */
export interface User {
  id: number;
  name: string;
  email: string;
  hasPortfolio: boolean;
  createdAt: string;
}

/** Réponse login */
export interface LoginResponse {
  token: string;
  user: User;
}

/** Template (liste + schema) */
export interface TemplateMeta {
  id: string;
  name: string;
  version?: string;
  description?: string;
  thumbnail?: string;
}

/** Portfolio (dashboard = owner, public/preview = owner false) */
export interface PortfolioData {
  templateId: string;
  templateVersion: string | null;
  content: PortfolioContent;
  id?: number;
  slug?: string;
  isPublic?: boolean;
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioContent {
  profile?: ProfileSection;
  skills?: SkillsSection;
  experiences?: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
  testimonials?: TestimonialItem[];
  services?: ServiceItem[];
  contact?: ContactSection;
  seo?: SeoSection;
}

export interface SeoSection {
  title?: string;
  description?: string;
}

export interface ProfileSection {
  name?: string;
  title?: string;
  bio?: string;
  photo?: string;
  /** Nombre d'années d'expérience professionnelle */
  yearsOfExperience?: number;
  /** Nombre de projets réalisés (affiché dans le hero) */
  projectsCount?: number;
  /** Loisirs / centres d'intérêt */
  hobbies?: string[];
  /** URL du CV uploadé (PDF) — affiché en lien de téléchargement */
  cv?: string;
  /** LinkedIn, GitHub, website, cv + liens additionnels */
  links?: { linkedin?: string; github?: string; website?: string; cv?: string; [key: string]: string | undefined };
  /** Mode recrutement : afficher "Open to work" / "Disponible" */
  openToWork?: boolean;
  /** Message court (ex. "Recherche CDI Paris") */
  openToWorkMessage?: string;
}

export interface SkillsSection {
  [category: string]: string[] | undefined;
}

export interface ExperienceItem {
  id: string;
  period?: string;
  role?: string;
  company?: string;
  /** Ville, pays ou adresse du poste */
  location?: string;
  current?: boolean;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title?: string;
  desc?: string;
  objective?: string;
  role?: string;
  result?: string;
  tags?: string[];
  link?: string;
  /** URL de l'image du projet */
  image?: string;
  icon?: string;
  color?: string;
  category?: string;
}

export interface TestimonialItem {
  id: string;
  author?: string;
  company?: string;
  role?: string;
  text?: string;
  photo?: string;
}

export interface ServiceItem {
  id: string;
  title?: string;
  description?: string;
  price?: string;
}

export interface EducationItem {
  id: string;
  year?: string;
  degree?: string;
  school?: string;
  location?: string;
}

export interface ContactSection {
  email?: string;
  phone?: string;
  messagePlaceholder?: string;
}

/** Réponse visibility */
export interface VisibilityResponse {
  isPublic: boolean;
  slug: string;
  publicUrl: string | null;
}

/** Réponse preview */
export interface PreviewResponse {
  previewUrl: string;
  expiresAt: string;
}
