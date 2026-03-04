/**
 * Contenu par défaut pour le remplissage des templates.
 * Utilisé quand le portfolio est vide ou partiellement rempli :
 * les champs manquants sont complétés par ces valeurs pour que
 * les templates (Classic, Air, etc.) affichent un rendu cohérent.
 */

import type {
  PortfolioContent,
  ProfileSection,
  SkillsSection,
  ContactSection,
  SeoSection,
  ExperienceItem,
  ProjectItem,
  EducationItem,
  TestimonialItem,
  ServiceItem,
} from "@/types/portfolio";

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  profile: {
    name: "Jean Dupont",
    title: "Développeur Full Stack & Architecte logiciel",
    bio: "Développeur passionné avec plus de 8 ans d'expérience dans la conception et la réalisation d'applications web et mobiles. Spécialisé en React, Node.js et architectures cloud, j'accompagne les équipes du MVP jusqu'à la mise en production à grande échelle. Fort d'une double compétence technique et produit, je m'investis dans l'open source, le mentorat et la veille technologique pour rester à la pointe des bonnes pratiques.",
    photo: undefined,
    yearsOfExperience: 8,
    projectsCount: 24,
    hobbies: ["Lecture", "Open source", "Course à pied", "Photographie", "Voyages", "Meetups tech"],
    cv: undefined,
    links: {
      linkedin: "https://linkedin.com/in/example",
      github: "https://github.com/example",
      website: "https://example.com",
      cv: undefined,
    },
    openToWork: true,
    openToWorkMessage: "Disponible pour des missions",
  },
  skills: {
    Frontend: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Vue.js",
      "Tailwind CSS",
      "Sass",
      "Redux",
      "React Query",
      "Storybook",
    ],
    Backend: [
      "Node.js",
      "PHP",
      "Laravel",
      "Symfony",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "REST API",
      "GraphQL",
    ],
    DevOps: ["Docker", "Kubernetes", "CI/CD", "GitHub Actions", "AWS", "Vercel", "Nginx", "Linux"],
    Outils: ["Git", "Figma", "Jira", "Notion", "VS Code", "Postman", "Swagger"],
    Méthodes: ["Agile", "Scrum", "Code review", "TDD", "Documentation technique"],
    Langues: ["Français (natif)", "Anglais (courant)", "Espagnol (notions)"],
  },
  contact: {
    email: "contact@example.com",
    phone: "+33 6 00 00 00 00",
    messagePlaceholder: "Décrivez votre projet ou posez-moi une question...",
  },
  seo: {
    title: "Jean Dupont – Développeur Full Stack | Portfolio & CV",
    description: "Portfolio de Jean Dupont, développeur full stack et architecte logiciel. 8+ ans d'expérience, projets React, Node.js, Laravel. Découvrez mes réalisations, compétences et services.",
  },
  experiences: [
    {
      id: "default-exp-1",
      role: "Lead Developer Full Stack",
      company: "TechScale SAS",
      period: "2022 – Présent",
      location: "Paris (hybride)",
      current: true,
      description:
        "Pilotage technique de la refonte de la plateforme B2B (React, Node.js, PostgreSQL). Encadrement de 3 développeurs, définition des standards de code et de l'architecture. Mise en place du CI/CD et des environnements de staging. Collaboration étroite avec le produit et le design pour prioriser les fonctionnalités.",
    },
    {
      id: "default-exp-2",
      role: "Développeur Full Stack",
      company: "StartupLab",
      period: "2020 – 2022",
      location: "Lyon",
      current: false,
      description:
        "Développement de fonctionnalités sur l'application SaaS (Laravel, Vue.js). Conception d'APIs REST, intégration de services tiers (paiement, envoi d'emails). Participation aux cérémonies Agile et à la revue de code. Formation des juniors aux bonnes pratiques.",
    },
    {
      id: "default-exp-3",
      role: "Développeur Frontend",
      company: "Agence Web Pro",
      period: "2018 – 2020",
      location: "Bordeaux",
      current: false,
      description:
        "Réalisation de sites vitrines et e-commerce (React, WordPress, WooCommerce). Refonte de l'interface utilisateur d'un outil interne et mise en place d'une design system partagée. Optimisation des performances et du référencement.",
    },
    {
      id: "default-exp-4",
      role: "Développeur web junior",
      company: "Digital Solutions",
      period: "2016 – 2018",
      location: "Toulouse",
      current: false,
      description:
        "Maintenance et évolutions sur des sites clients (PHP, JavaScript, MySQL). Correction de bugs, petites évolutions et déploiements. Apprentissage des processus de production et du travail en équipe.",
    },
  ],
  projects: [
    {
      id: "default-proj-1",
      title: "Plateforme de gestion de projets",
      desc: "Outil interne de suivi des projets, des livrables et du temps passé. Tableaux Kanban, rapports et export.",
      objective: "Centraliser les informations et réduire le temps passé en réunions de suivi.",
      role: "Lead développeur frontend et conception API",
      result: "Mise en production en 4 mois. Adoption par 50+ utilisateurs. Réduction du temps de reporting de 40 %.",
      tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST API"],
      link: "https://example.com/projet-1",
    },
    {
      id: "default-proj-2",
      title: "Site vitrine & blog",
      desc: "Site vitrine responsive avec blog, formulaire de contact et intégration analytics.",
      objective: "Renforcer la présence en ligne du client et générer des leads.",
      role: "Développement full stack et déploiement",
      result: "Livré en 6 semaines. Amélioration du positionnement SEO et +30 % de visites.",
      tags: ["Next.js", "Tailwind", "Vercel"],
      link: "https://example.com/projet-2",
    },
    {
      id: "default-proj-3",
      title: "Application mobile (PWA)",
      desc: "Progressive Web App pour la consultation de catalogues et la prise de commande sur le terrain.",
      objective: "Permettre aux commerciaux de consulter et commander sans connexion stable.",
      role: "Architecture et développement frontend",
      result: "Déployée en production. Utilisation offline fiable, adoption par toute l'équipe terrain.",
      tags: ["React", "PWA", "IndexedDB", "Service Worker"],
      link: "https://example.com/projet-3",
    },
    {
      id: "default-proj-4",
      title: "Dashboard analytics",
      desc: "Tableau de bord de visualisation de données (KPIs, graphiques, filtres par période et par segment).",
      objective: "Donner une vision claire des performances en temps quasi réel.",
      role: "Développeur full stack",
      result: "Intégration avec 3 sources de données. Mise à jour en temps réel via WebSockets.",
      tags: ["Vue.js", "Node.js", "Chart.js", "WebSocket"],
    },
    {
      id: "default-proj-5",
      title: "API de gestion des utilisateurs",
      desc: "API REST sécurisée (auth JWT, rôles, CRUD) pour une application multi-tenant.",
      objective: "Fournir un socle fiable et documenté pour les clients internes et partenaires.",
      role: "Conception et développement backend",
      result: "Documentation OpenAPI, tests automatisés, déploiement sur AWS.",
      tags: ["Laravel", "PHP", "PostgreSQL", "AWS", "OpenAPI"],
    },
    {
      id: "default-proj-6",
      title: "Extension navigateur",
      desc: "Extension Chrome pour sauvegarder et organiser des liens avec tags et recherche full-text.",
      objective: "Simplifier la veille et le partage de ressources au sein de l'équipe.",
      role: "Développement solo",
      result: "Publiée sur le Chrome Web Store. Plus de 500 utilisateurs actifs.",
      tags: ["JavaScript", "Chrome API", "IndexedDB"],
      link: "https://example.com/projet-6",
    },
  ],
  education: [
    {
      id: "default-edu-1",
      degree: "Master Informatique – Parcours Ingénierie logicielle",
      school: "Université Paris-Saclay",
      year: "2014 – 2016",
      location: "Orsay",
    },
    {
      id: "default-edu-2",
      degree: "Licence Informatique",
      school: "Université de Bordeaux",
      year: "2011 – 2014",
      location: "Bordeaux",
    },
    {
      id: "default-edu-3",
      degree: "Certification AWS Solutions Architect Associate",
      school: "Amazon Web Services",
      year: "2021",
      location: "En ligne",
    },
  ],
  testimonials: [
    {
      id: "default-test-1",
      author: "Marie Martin",
      company: "TechScale SAS",
      role: "Cheffe de projet",
      text: "Jean est un professionnel à l'écoute et force de proposition. Les livraisons sont toujours dans les temps et la qualité du code facilite la maintenance. Je recommande sans hésiter.",
    },
    {
      id: "default-test-2",
      author: "Thomas Bernard",
      company: "StartupLab",
      role: "CTO",
      text: "Un développeur solide sur toute la stack. Il a su prendre en main notre codebase rapidement et faire évoluer notre produit tout en formant les plus juniors. Très bon relationnel.",
    },
    {
      id: "default-test-3",
      author: "Sophie Leroy",
      company: "Agence Web Pro",
      role: "Directrice technique",
      text: "Collaboration fluide et livrables au rendez-vous. Jean a su comprendre nos contraintes clients et proposer des solutions techniques adaptées. Nous retravaillerons ensemble avec plaisir.",
    },
    {
      id: "default-test-4",
      author: "Lucas Petit",
      company: "Client freelance",
      role: "Fondateur",
      text: "J'ai fait appel à Jean pour la refonte de notre site. Il a été réactif, à l'écoute et a livré un résultat au-delà de nos attentes. Je le recommande pour tout projet web exigeant.",
    },
  ],
  services: [
    {
      id: "default-svc-1",
      title: "Création de site vitrine",
      description:
        "Site vitrine ou landing page sur mesure : design responsive, SEO de base, formulaire de contact, intégration analytics. Idéal pour les TPE, associations ou professionnels qui veulent une présence en ligne soignée.",
      price: "À partir de 1 500 €",
    },
    {
      id: "default-svc-2",
      title: "Application web sur mesure",
      description:
        "Développement d'applications métier : dashboards, outils internes, portails clients. Stack moderne (React, Node.js ou Laravel), hébergement et mise en production comprises. Accompagnement sur la durée.",
      price: "Sur devis (à partir de 5 000 €)",
    },
    {
      id: "default-svc-3",
      title: "Refonte & modernisation",
      description:
        "Migration d'une application legacy vers une stack actuelle, amélioration des performances, mise en place de tests et de CI/CD. Audit technique et plan de migration fournis.",
      price: "Sur devis",
    },
    {
      id: "default-svc-4",
      title: "Conseil & formation",
      description:
        "Accompagnement technique ponctuel : revue de code, architecture, bonnes pratiques. Sessions de formation pour équipes (React, TypeScript, API, Agile). Demi-journées ou journées.",
      price: "À partir de 400 € / demi-journée",
    },
    {
      id: "default-svc-5",
      title: "Maintenance & évolutions",
      description:
        "Contrat de maintenance : correctifs, mises à jour de sécurité, petites évolutions. Disponibilité et délais de réponse définis ensemble. Idéal pour sécuriser un projet à long terme.",
      price: "Forfait mensuel sur devis",
    },
  ],
};

/**
 * Fusionne le contenu API avec les valeurs par défaut.
 * Les champs renseignés dans content sont conservés ; les manquants
 * ou vides sont remplacés par DEFAULT_PORTFOLIO_CONTENT.
 * Utilisé dans PortfolioRenderer pour que les templates reçoivent
 * toujours un contenu complet (évite les blocs vides).
 */
export function mergeContentWithDefaults(content: PortfolioContent | undefined): PortfolioContent {
  if (!content) return { ...DEFAULT_PORTFOLIO_CONTENT };

  const defaultContent = DEFAULT_PORTFOLIO_CONTENT;

  const mergeProfile = (a?: ProfileSection | null, b?: ProfileSection | null): ProfileSection => {
    if (!a && !b) return defaultContent.profile ?? {};
    const base = (b ? { ...defaultContent.profile, ...b } : defaultContent.profile) ?? {};
    return (a ? { ...base, ...a } : base) as ProfileSection;
  };

  const mergeLinks = (
    a?: Record<string, string | undefined> | null,
    b?: Record<string, string | undefined> | null
  ) => {
    const def = defaultContent.profile?.links ?? {};
    return { ...def, ...b, ...a };
  };

  const profile: ProfileSection = mergeProfile(content.profile, defaultContent.profile);
  if (profile.links !== undefined || defaultContent.profile?.links) {
    profile.links = mergeLinks(
      content.profile?.links,
      defaultContent.profile?.links
    );
  }

  const hasSkills = content.skills && Object.keys(content.skills).length > 0;
  const skills: SkillsSection = (hasSkills ? content.skills : defaultContent.skills) ?? {};

  const mergeContact = (a?: ContactSection | null, b?: ContactSection | null): ContactSection => {
    const base = (b ? { ...defaultContent.contact, ...b } : defaultContent.contact) ?? {};
    return (a ? { ...base, ...a } : base) as ContactSection;
  };
  const contact = mergeContact(content.contact, defaultContent.contact);

  const mergeSeo = (a?: SeoSection | null, b?: SeoSection | null): SeoSection => {
    const base = (b ? { ...defaultContent.seo, ...b } : defaultContent.seo) ?? {};
    return (a ? { ...base, ...a } : base) as SeoSection;
  };
  const seo = mergeSeo(content.seo, defaultContent.seo);

  const experiences: ExperienceItem[] =
    content.experiences?.length ? content.experiences : (defaultContent.experiences ?? []);
  const projects: ProjectItem[] =
    content.projects?.length ? content.projects : (defaultContent.projects ?? []);
  const education: EducationItem[] =
    content.education?.length ? content.education : (defaultContent.education ?? []);
  const testimonials: TestimonialItem[] =
    content.testimonials?.length ? content.testimonials : (defaultContent.testimonials ?? []);
  const services: ServiceItem[] =
    content.services?.length ? content.services : (defaultContent.services ?? []);

  return {
    profile,
    skills,
    contact,
    seo,
    experiences,
    projects,
    education,
    testimonials,
    services,
  };
}
