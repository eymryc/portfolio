"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollAnimation from "@/components/ScrollAnimation";
import ParticleBackground from "@/components/ParticleBackground";
import Link from "next/link";
import { use } from "react";
import { useState, useEffect } from "react";

const PROJECTS: Record<string, any> = {
  "mastercard-vss-processing": {
    title: "MasterCard VSS Processing",
    desc: "Microservice Spring Boot traitant des fichiers de transactions MasterCard multi-sources (local, SFTP, SMB) avec API REST paginée sur données JSONB PostgreSQL.",
    longDesc: "Développement d'un microservice robuste pour le traitement de fichiers de transactions MasterCard provenant de multiples sources. Le système intègre des mécanismes de traitement asynchrone, une gestion d'erreurs avancée et une API REST complète avec pagination optimisée. L'architecture permet de traiter des milliers de transactions par seconde avec une haute disponibilité.",
    category: "Backend",
    icon: "💳",
    color: "#F59E0B",
    tags: ["Spring Boot", "PostgreSQL", "Redis", "Docker", "Swagger", "JPA", "REST API"],
    features: [
      "Traitement multi-sources (local, SFTP, SMB)",
      "API REST paginée avec filtres avancés",
      "Données JSONB PostgreSQL pour flexibilité",
      "Cache Redis pour performances optimales",
      "Documentation Swagger complète",
      "Gestion d'erreurs robuste avec retry",
      "Monitoring et logging avancés",
    ],
    challenges: [
      "Gérer la synchronisation de multiples sources de données",
      "Optimiser les performances pour de gros volumes",
      "Assurer la cohérence des données entre systèmes",
    ],
    solutions: [
      "Implémentation d'un système de queue avec RabbitMQ",
      "Utilisation de Redis pour cache distribué",
      "Architecture microservices avec circuit breaker",
    ],
    results: [
      "Traitement de 50K+ transactions/jour",
      "Réduction de 70% du temps de traitement",
      "Disponibilité de 99.9%",
    ],
    techStack: {
      backend: ["Spring Boot 3.x", "Spring Data JPA", "PostgreSQL 14", "Redis 7", "RabbitMQ"],
      tools: ["Docker", "Docker Compose", "Swagger/OpenAPI", "GitLab CI/CD"],
      patterns: ["Microservices", "CQRS", "Event-Driven Architecture"],
    },
    year: "2024",
    duration: "6 mois",
    team: "3 développeurs",
  },
  "jumphost-securise": {
    title: "Jumphost Sécurisé",
    desc: "Remote desktop sécurisé avec Apache Guacamole, reverse proxy Nginx (Let's Encrypt), stack entièrement dockerisée et SSO pour l'accès unifié aux serveurs.",
    longDesc: "Projet d'infrastructure visant à offrir un accès bureau à distance (remote desktop) sécurisé aux serveurs internes. La solution repose sur Apache Guacamole pour le remote desktop (accès RDP/SSH/VNC via le navigateur), un reverse proxy Nginx exposant uniquement les services nécessaires et sécurisé par certificats Let's Encrypt, une stack entièrement dockerisée pour le déploiement et la reproductibilité, et l'implémentation d'un SSO (Single Sign-On) pour authentifier les utilisateurs une seule fois et accéder à l'ensemble des ressources autorisées. L'architecture permet un accès distant fiable, tracé et conforme aux bonnes pratiques de sécurité.",
    category: "DevOps",
    icon: "🔐",
    color: "#EF4444",
    tags: ["Apache Guacamole", "Nginx", "Let's Encrypt", "Docker", "SSO", "Keycloak", "Remote Desktop"],
    features: [
      "Remote desktop avec Apache Guacamole (RDP, SSH, VNC via navigateur)",
      "Reverse proxy Nginx sécurisé avec certificats Let's Encrypt (HTTPS, renouvellement auto)",
      "Stack 100 % dockerisée (Guacamole, Nginx, SSO, services métier)",
      "SSO (Single Sign-On) pour une authentification unique et accès unifié",
      "Exposition contrôlée des services et durcissement Nginx",
      "Audit et traçabilité des sessions à distance",
    ],
    challenges: [
      "Exposer le remote desktop de façon sécurisée sans ouvrir RDP/SSH directement sur Internet",
      "Obtenir et renouveler automatiquement les certificats SSL (Let's Encrypt)",
      "Dockeriser Guacamole, Nginx et le fournisseur SSO de bout en bout",
      "Implémenter le SSO et faire dialoguer Guacamole avec le fournisseur d'identité",
    ],
    solutions: [
      "Apache Guacamole en frontal, Nginx en reverse proxy avec TLS et limitation de débit",
      "Intégration Certbot avec Nginx pour Let's Encrypt (obtention + renouvellement automatique)",
      "Docker Compose pour orchestrer Guacamole, Nginx, Certbot et le service SSO",
      "SSO (Keycloak/OpenID Connect ou équivalent) intégré à Guacamole pour l'authentification centralisée",
    ],
    results: [
      "Accès remote desktop sécurisé 100 % via navigateur (HTTPS, certificats valides)",
      "Stack reproductible et déployable en quelques commandes (Docker)",
      "Une seule authentification (SSO) pour accéder à l'ensemble des ressources autorisées",
      "Zéro exposition directe des protocoles RDP/SSH sur Internet",
    ],
    techStack: {
      remoteDesktop: ["Apache Guacamole", "RDP", "SSH", "VNC"],
      reverseProxy: ["Nginx", "Let's Encrypt", "Certbot", "SSL/TLS"],
      containerization: ["Docker", "Docker Compose"],
      security: ["SSO", "Keycloak", "OpenID Connect", "OAuth 2.0"],
    },
    year: "2024",
    duration: "3 mois",
    team: "2 DevOps",
  },
  "monetix": {
    title: "MONETIX",
    desc: "Application bancaire intelligente de décryptage et d'analyse des opérations financières avec stack ELK pour la visualisation et monitoring.",
    longDesc: "Application bancaire complète pour le décryptage et l'analyse des opérations financières. Le système utilise la stack ELK (Elasticsearch, Logstash, Kibana) pour la visualisation des données et le monitoring en temps réel. L'application traite des millions de transactions avec une précision de 99.9%.",
    category: "FinTech",
    icon: "🏦",
    color: "#10B981",
    tags: ["Java", "Spring Boot", "Kubernetes", "Jenkins", "ELK", "Microservices"],
    features: [
      "Décryptage automatique des transactions",
      "Analyse en temps réel avec Elasticsearch",
      "Stack ELK pour visualisation avancée",
      "Déploiement Kubernetes avec auto-scaling",
      "CI/CD avec Jenkins",
      "Alertes automatiques sur anomalies",
      "Rapports personnalisables",
    ],
    challenges: [
      "Traiter des volumes massifs de données financières",
      "Assurer la conformité réglementaire",
      "Maintenir la performance avec la croissance",
    ],
    solutions: [
      "Architecture microservices scalable",
      "Indexation Elasticsearch optimisée",
      "Pipeline de données avec Logstash",
    ],
    results: [
      "Traitement de 10M+ transactions/mois",
      "Temps de réponse < 200ms",
      "Conformité 100% aux réglementations",
    ],
    techStack: {
      backend: ["Java 17", "Spring Boot", "Spring Cloud"],
      infrastructure: ["Kubernetes", "Docker", "Jenkins"],
      data: ["Elasticsearch", "Logstash", "Kibana", "PostgreSQL"],
    },
    year: "2023-2024",
    duration: "12 mois",
    team: "5 développeurs",
  },
  "digifor": {
    title: "DIGIFOR",
    desc: "Plateforme de gestion foncière digitale réduisant les délais de traitement de 60% grâce à la dématérialisation des demandes de certificats fonciers.",
    longDesc: "Plateforme complète de digitalisation de la gestion foncière permettant de réduire significativement les délais de traitement. Le système inclut la dématérialisation complète des processus, la recherche avancée et le suivi en temps réel des dossiers. Plus de 50 000 dossiers traités depuis le lancement.",
    category: "GovTech",
    icon: "🏛️",
    color: "#6366F1",
    tags: ["Spring Boot", "React", "PostgreSQL", "Elasticsearch", "Docker"],
    features: [
      "Réduction de 60% des délais de traitement",
      "Dématérialisation complète des processus",
      "Recherche Elasticsearch avancée",
      "Interface React moderne et responsive",
      "API Spring Boot robuste et sécurisée",
      "Workflow de validation multi-niveaux",
      "Notifications en temps réel",
    ],
    challenges: [
      "Digitaliser des processus administratifs complexes",
      "Intégrer avec des systèmes legacy",
      "Former les utilisateurs aux nouveaux outils",
    ],
    solutions: [
      "Interface intuitive avec React",
      "APIs REST pour intégration",
      "Formation et documentation complète",
    ],
    results: [
      "60% de réduction des délais",
      "50K+ dossiers traités",
      "Satisfaction utilisateur de 95%",
    ],
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS", "Redux"],
      backend: ["Spring Boot", "Spring Security", "JPA"],
      data: ["PostgreSQL", "Elasticsearch", "Redis"],
    },
    year: "2023",
    duration: "8 mois",
    team: "4 développeurs",
  },
  "total-rent": {
    title: "TOTAL RENT",
    desc: "Plateforme complète de réservation et gestion de locations courte et longue durée (hôtels, appartements, résidences hôtelières).",
    longDesc: "Plateforme complète de réservation et gestion de locations avec système de paiement intégré, gestion de calendrier, et interface d'administration complète. Plus de 1000 propriétés gérées sur la plateforme.",
    category: "Frontend",
    icon: "🏨",
    color: "#3B82F6",
    tags: ["Next.js", "React", "Tailwind CSS", "REST API", "Stripe"],
    features: [
      "Système de réservation en temps réel",
      "Gestion de calendrier avancée",
      "Paiement sécurisé avec Stripe",
      "Interface d'administration complète",
      "Recherche et filtres avancés",
      "Notifications par email/SMS",
    ],
    challenges: [
      "Gérer la disponibilité en temps réel",
      "Intégrer le paiement de manière sécurisée",
      "Optimiser les performances de recherche",
    ],
    solutions: [
      "Cache Redis pour disponibilité",
      "Intégration Stripe sécurisée",
      "Indexation Elasticsearch",
    ],
    results: [
      "1000+ propriétés gérées",
      "10K+ réservations traitées",
      "Taux de conversion de 25%",
    ],
    techStack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      backend: ["Node.js", "Express", "PostgreSQL"],
      payment: ["Stripe", "Webhooks"],
    },
    year: "2023",
    duration: "5 mois",
    team: "3 développeurs",
  },
  "xsel-sms": {
    title: "XSEL SMS",
    desc: "Application web complète pour la gestion et l'envoi de campagnes SMS professionnelles à destination des entreprises.",
    longDesc: "Plateforme SaaS pour l'envoi de campagnes SMS marketing et transactionnelles. Interface intuitive pour créer, planifier et suivre les campagnes avec analytics détaillés. Plus de 5 millions de SMS envoyés avec un taux de délivrabilité exceptionnel.",
    category: "Web",
    icon: "📱",
    color: "#8B5CF6",
    tags: ["Laravel", "JavaScript", "jQuery", "Ajax", "API RESTful", "MySQL"],
    features: [
      "Création et planification de campagnes",
      "Envoi en masse optimisé",
      "Analytics et rapports détaillés",
      "API RESTful complète",
      "Gestion des contacts et listes",
      "Templates personnalisables",
    ],
    challenges: [
      "Gérer l'envoi de millions de SMS",
      "Optimiser les coûts d'envoi",
      "Assurer la délivrabilité",
    ],
    solutions: [
      "Queue system avec Redis",
      "Négociation avec multiples providers",
      "Monitoring de la délivrabilité",
    ],
    results: [
      "5M+ SMS envoyés",
      "Taux de délivrabilité de 98%",
      "100+ entreprises clientes",
    ],
    techStack: {
      backend: ["Laravel", "PHP", "MySQL"],
      frontend: ["JavaScript", "jQuery", "Bootstrap"],
      infrastructure: ["Redis", "Queue Workers"],
    },
    year: "2022-2023",
    duration: "6 mois",
    team: "2 développeurs",
  },
  "xsel-school": {
    title: "XSEL SCHOOL",
    desc: "Plateforme web complète pour la digitalisation de la gestion administrative et pédagogique d'établissements scolaires.",
    longDesc: "Solution complète pour la gestion scolaire incluant la gestion des élèves, des notes, des emplois du temps, de la facturation et de la communication avec les parents.",
    category: "EdTech",
    icon: "🎓",
    color: "#EC4899",
    tags: ["Next.js", "React", "Tailwind CSS", "GitLab CI/CD", "Jira"],
    features: [
      "Gestion complète des élèves et enseignants",
      "Système de notes et bulletins",
      "Gestion des emplois du temps",
      "Facturation automatisée",
      "Portail parents avec notifications",
      "Rapports et statistiques",
    ],
    challenges: [
      "Adapter le système à différents établissements",
      "Gérer les données sensibles d'élèves",
      "Assurer la disponibilité pendant les périodes critiques",
    ],
    solutions: [
      "Architecture multi-tenant",
      "Chiffrement des données sensibles",
      "Infrastructure scalable",
    ],
    results: [
      "50+ établissements utilisateurs",
      "20K+ élèves gérés",
      "Satisfaction de 92%",
    ],
    techStack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      backend: ["Laravel", "PostgreSQL"],
      tools: ["GitLab CI/CD", "Docker"],
    },
    year: "2023-2024",
    duration: "10 mois",
    team: "4 développeurs",
  },
  "pharma": {
    title: "PHARMA",
    desc: "Application web et API sécurisée pour la gestion complète de l'inventaire et la traçabilité des produits pharmaceutiques.",
    longDesc: "Système de gestion pharmaceutique avec traçabilité complète, gestion des stocks, alertes d'expiration et conformité réglementaire.",
    category: "HealthTech",
    icon: "💊",
    color: "#14B8A6",
    tags: ["Laravel", "Sanctum", "MySQL", "GitLab CI/CD"],
    features: [
      "Gestion d'inventaire en temps réel",
      "Traçabilité complète des produits",
      "Alertes d'expiration automatiques",
      "Conformité réglementaire",
      "API sécurisée avec Sanctum",
      "Rapports de conformité",
    ],
    challenges: [
      "Assurer la traçabilité complète",
      "Respecter les réglementations strictes",
      "Gérer les alertes critiques",
    ],
    solutions: [
      "Système de logs complet",
      "Validation automatique des règles",
      "Notifications en temps réel",
    ],
    results: [
      "100% de traçabilité",
      "Conformité réglementaire totale",
      "Réduction de 40% des pertes",
    ],
    techStack: {
      backend: ["Laravel", "Laravel Sanctum", "MySQL"],
      tools: ["GitLab CI/CD", "Docker"],
    },
    year: "2023",
    duration: "4 mois",
    team: "2 développeurs",
  },
  "ci-territory": {
    title: "CI TERRITORY",
    desc: "API RESTful géographique centralisant les données du découpage territorial ivoirien : régions, départements, communes et villages.",
    longDesc: "API complète pour accéder aux données géographiques de la Côte d'Ivoire. Utilisée par de nombreuses applications gouvernementales et privées.",
    category: "Backend",
    icon: "🗺️",
    color: "#F97316",
    tags: ["Laravel", "Sanctum", "MySQL", "REST API"],
    features: [
      "Données géographiques complètes",
      "API RESTful documentée",
      "Recherche géographique avancée",
      "Authentification avec Sanctum",
      "Cache pour performances",
      "Versioning de l'API",
    ],
    challenges: [
      "Maintenir la cohérence des données",
      "Gérer les mises à jour fréquentes",
      "Optimiser les performances",
    ],
    solutions: [
      "Système de versioning",
      "Cache Redis stratégique",
      "Indexation MySQL optimisée",
    ],
    results: [
      "50+ applications utilisatrices",
      "1M+ requêtes/mois",
      "Temps de réponse < 50ms",
    ],
    techStack: {
      backend: ["Laravel", "Laravel Sanctum", "MySQL"],
      cache: ["Redis"],
    },
    year: "2022",
    duration: "3 mois",
    team: "2 développeurs",
  },
  "mon-immobilier": {
    title: "MON IMMOBILIER",
    desc: "Plateforme web de gestion de portefeuilles immobiliers et mise en relation propriétaires-locataires.",
    longDesc: "Plateforme complète pour la gestion immobilière avec gestion des biens, recherche avancée, et mise en relation sécurisée.",
    category: "Frontend",
    icon: "🏠",
    color: "#84CC16",
    tags: ["Laravel", "Breeze", "MySQL", "jQuery"],
    features: [
      "Gestion de portefeuilles immobiliers",
      "Recherche avancée multi-critères",
      "Mise en relation propriétaires-locataires",
      "Gestion des visites et contrats",
      "Tableau de bord analytique",
    ],
    challenges: [
      "Gérer de gros volumes de biens",
      "Optimiser la recherche",
      "Faciliter la mise en relation",
    ],
    solutions: [
      "Indexation MySQL optimisée",
      "Algorithme de matching intelligent",
      "Interface intuitive",
    ],
    results: [
      "500+ biens gérés",
      "200+ mises en relation réussies",
      "Satisfaction de 88%",
    ],
    techStack: {
      backend: ["Laravel", "Laravel Breeze", "MySQL"],
      frontend: ["Blade", "jQuery", "Bootstrap"],
    },
    year: "2022",
    duration: "4 mois",
    team: "2 développeurs",
  },
  "gpi-parc-informatique": {
    title: "GPI – Parc Informatique",
    desc: "Système de gestion des équipements informatiques et suivi des interventions techniques.",
    longDesc: "Solution complète pour la gestion du parc informatique avec inventaire, suivi des interventions, gestion des tickets et reporting.",
    category: "App",
    icon: "🖥️",
    color: "#06B6D4",
    tags: ["Laravel", "MySQL", "JavaScript", "Ajax"],
    features: [
      "Inventaire complet des équipements",
      "Suivi des interventions techniques",
      "Gestion des tickets",
      "Historique et reporting",
      "Alertes de maintenance",
    ],
    challenges: [
      "Centraliser les informations dispersées",
      "Automatiser le suivi",
      "Générer des rapports utiles",
    ],
    solutions: [
      "Base de données centralisée",
      "Workflow automatisé",
      "Dashboard avec KPIs",
    ],
    results: [
      "1000+ équipements gérés",
      "Réduction de 50% du temps de gestion",
      "Taux de résolution de 95%",
    ],
    techStack: {
      backend: ["Laravel", "MySQL"],
      frontend: ["Blade", "JavaScript", "Ajax"],
    },
    year: "2021",
    duration: "3 mois",
    team: "2 développeurs",
  },
  "helpdesk": {
    title: "HELPDESK",
    desc: "Plateforme de centralisation du support technique et gestion des demandes d'assistance informatique.",
    longDesc: "Système de ticketing complet pour le support technique avec attribution automatique, escalade, et suivi des performances. Plus de 5000 tickets traités avec une satisfaction client élevée et un temps de résolution réduit de 40%.",
    category: "App",
    icon: "🛠️",
    color: "#A855F7",
    tags: ["Laravel", "Breeze", "MySQL", "jQuery"],
    features: [
      "Gestion des tickets centralisée",
      "Attribution automatique des tickets",
      "Escalade intelligente",
      "Suivi des performances",
      "Base de connaissances",
      "Notifications multi-canaux",
    ],
    challenges: [
      "Réduire les temps de résolution",
      "Améliorer la satisfaction client",
      "Optimiser la charge de travail",
    ],
    solutions: [
      "Algorithme d'attribution intelligent",
      "Base de connaissances enrichie",
      "Dashboard de performance",
    ],
    results: [
      "Temps de résolution réduit de 40%",
      "Satisfaction client de 90%",
      "5000+ tickets traités",
    ],
    techStack: {
      backend: ["Laravel", "Laravel Breeze", "MySQL"],
      frontend: ["Blade", "jQuery", "Bootstrap"],
    },
    year: "2021",
    duration: "4 mois",
    team: "2 développeurs",
  },
  // Sites Web
  "afor": {
    title: "AFOR",
    desc: "Site web moderne et responsive pour une organisation ou entreprise avec interface intuitive et design professionnel.",
    longDesc: "Site web corporate moderne développé avec Next.js et React, offrant une expérience utilisateur optimale sur tous les appareils. Le site présente les services de l'organisation avec un design épuré et professionnel, incluant des animations fluides et une navigation intuitive.",
    category: "Web",
    icon: "🌐",
    color: "#3B82F6",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript", "SEO"],
    features: [
      "Design responsive et moderne",
      "Optimisation SEO complète",
      "Animations fluides et interactives",
      "Performance optimale",
      "Interface utilisateur intuitive",
      "Intégration de formulaires de contact",
      "Galerie et portfolio intégrés",
    ],
    challenges: [
      "Créer un design unique et mémorable",
      "Optimiser les performances de chargement",
      "Assurer la compatibilité multi-navigateurs",
    ],
    solutions: [
      "Utilisation de Next.js pour le SSR",
      "Optimisation des images avec next/image",
      "Tests cross-browser approfondis",
    ],
    results: [
      "Temps de chargement < 2s",
      "Score Lighthouse > 90",
      "100% responsive",
    ],
    techStack: {
      frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      tools: ["Vercel", "GitHub Actions"],
    },
    year: "2024",
    duration: "2 mois",
    team: "1 développeur",
  },
  "villa-daujourdhui": {
    title: "Villa d'Aujourd'hui",
    desc: "Site web immobilier de luxe présentant des villas et propriétés haut de gamme avec galerie photos et système de recherche avancé.",
    longDesc: "Plateforme web premium pour la présentation de villas et propriétés de luxe. Le site inclut une galerie photo immersive, un système de recherche avancé avec filtres multiples, et une interface élégante mettant en valeur les propriétés.",
    category: "Web",
    icon: "🏡",
    color: "#10B981",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Image Gallery"],
    features: [
      "Galerie photo immersive",
      "Système de recherche avancé",
      "Filtres multiples (prix, localisation, type)",
      "Vue détaillée des propriétés",
      "Formulaire de contact intégré",
      "Design luxueux et élégant",
      "Animations Framer Motion",
    ],
    challenges: [
      "Présenter les propriétés de manière attractive",
      "Gérer de grandes quantités d'images",
      "Optimiser pour les conversions",
    ],
    solutions: [
      "Galerie optimisée avec lazy loading",
      "CDN pour les images",
      "Design centré sur l'expérience utilisateur",
    ],
    results: [
      "Taux de conversion de 15%",
      "Temps moyen sur site de 4min",
      "50+ propriétés présentées",
    ],
    techStack: {
      frontend: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
      images: ["next/image", "Cloudinary"],
    },
    year: "2024",
    duration: "3 mois",
    team: "2 développeurs",
  },
  "eue": {
    title: "EUE",
    desc: "Site web institutionnel avec présentation de services, actualités et formulaire de contact intégré.",
    longDesc: "Site web institutionnel complet présentant les services, les actualités et les informations de l'organisation. Le site inclut un système de gestion de contenu pour les actualités, des formulaires de contact et une section dédiée aux services.",
    category: "Web",
    icon: "🏢",
    color: "#6366F1",
    tags: ["Next.js", "React", "Tailwind CSS", "CMS", "SEO"],
    features: [
      "Présentation des services",
      "Système d'actualités/blog",
      "Formulaire de contact",
      "Design institutionnel professionnel",
      "Optimisation SEO",
      "Multilingue (FR/EN)",
      "Gestion de contenu simplifiée",
    ],
    challenges: [
      "Créer un design institutionnel crédible",
      "Faciliter la gestion de contenu",
      "Assurer la sécurité des formulaires",
    ],
    solutions: [
      "Design épuré et professionnel",
      "CMS headless pour la gestion",
      "Validation et sécurisation des formulaires",
    ],
    results: [
      "Augmentation du trafic de 200%",
      "Taux de conversion de 8%",
      "Satisfaction client élevée",
    ],
    techStack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      cms: ["Contentful", "Strapi"],
    },
    year: "2023",
    duration: "2 mois",
    team: "2 développeurs",
  },
  "xsel-services": {
    title: "XSEL Services",
    desc: "Site web corporate présentant les services de l'entreprise avec portfolio de projets et formulaire de contact.",
    longDesc: "Site web corporate complet pour présenter les services de XSEL Services, incluant un portfolio de projets réalisés, une présentation de l'équipe, et un système de contact avancé. Le site met en avant l'expertise technique de l'entreprise.",
    category: "Web",
    icon: "💼",
    color: "#F59E0B",
    tags: ["Next.js", "React", "Tailwind CSS", "SEO", "Portfolio"],
    features: [
      "Présentation des services",
      "Portfolio de projets interactif",
      "Présentation de l'équipe",
      "Formulaire de contact avancé",
      "Blog/Actualités",
      "Design corporate moderne",
      "Optimisation SEO complète",
    ],
    challenges: [
      "Mettre en valeur l'expertise technique",
      "Créer un portfolio attractif",
      "Générer des leads qualifiés",
    ],
    solutions: [
      "Portfolio avec filtres et animations",
      "Design mettant en avant les réalisations",
      "Formulaires optimisés pour la conversion",
    ],
    results: [
      "Augmentation des leads de 150%",
      "Temps moyen sur site de 5min",
      "Taux de rebond < 40%",
    ],
    techStack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      tools: ["Vercel", "Analytics"],
    },
    year: "2023-2024",
    duration: "3 mois",
    team: "2 développeurs",
  },
  "inter-clim": {
    title: "Inter-Clim",
    desc: "Site web pour une entreprise de climatisation avec présentation de services, catalogue produits et demande de devis en ligne.",
    longDesc: "Site web complet pour une entreprise spécialisée en climatisation, incluant la présentation des services, un catalogue de produits avec fiches détaillées, et un système de demande de devis en ligne. Le site permet aux clients de découvrir les solutions et de demander des devis directement.",
    category: "Web",
    icon: "❄️",
    color: "#06B6D4",
    tags: ["Next.js", "React", "Tailwind CSS", "Formulaires", "Catalogue"],
    features: [
      "Présentation des services",
      "Catalogue produits détaillé",
      "Demande de devis en ligne",
      "Galerie de réalisations",
      "Blog conseils et actualités",
      "Design professionnel",
      "Formulaire de contact multi-étapes",
    ],
    challenges: [
      "Présenter les produits de manière claire",
      "Faciliter la demande de devis",
      "Optimiser pour les conversions",
    ],
    solutions: [
      "Catalogue avec filtres et recherche",
      "Formulaire de devis simplifié",
      "Design centré sur l'action",
    ],
    results: [
      "50+ demandes de devis/mois",
      "Taux de conversion de 12%",
      "Satisfaction client de 95%",
    ],
    techStack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      forms: ["React Hook Form", "Validation"],
    },
    year: "2023",
    duration: "2 mois",
    team: "1 développeur",
  },
  // Applications
  "e-courrier": {
    title: "E-Courrier",
    desc: "Application web de gestion de courrier électronique et de messagerie interne pour entreprises avec suivi et archivage.",
    longDesc: "Application complète de gestion de courrier électronique et de messagerie interne pour les entreprises. Le système permet l'envoi, la réception, le suivi et l'archivage des courriers avec un système de workflow et de notifications.",
    category: "App",
    icon: "📧",
    color: "#8B5CF6",
    tags: ["Laravel", "MySQL", "JavaScript", "Ajax", "Workflow"],
    features: [
      "Envoi et réception de courriers",
      "Système de workflow",
      "Archivage et recherche",
      "Notifications en temps réel",
      "Gestion des pièces jointes",
      "Suivi des statuts",
      "Rapports et statistiques",
    ],
    challenges: [
      "Gérer de gros volumes de courriers",
      "Assurer la sécurité des données",
      "Optimiser les performances de recherche",
    ],
    solutions: [
      "Indexation MySQL optimisée",
      "Chiffrement des données sensibles",
      "Cache pour les recherches fréquentes",
    ],
    results: [
      "10K+ courriers gérés",
      "Réduction de 60% du temps de traitement",
      "Satisfaction utilisateur de 88%",
    ],
    techStack: {
      backend: ["Laravel", "MySQL"],
      frontend: ["Blade", "JavaScript", "Ajax"],
    },
    year: "2022",
    duration: "4 mois",
    team: "2 développeurs",
  },
  "sgh24": {
    title: "SGH24",
    desc: "Application de gestion hospitalière 24/7 pour le suivi des patients, des rendez-vous et de la gestion administrative.",
    longDesc: "Application complète de gestion hospitalière fonctionnant 24/7 pour le suivi des patients, la gestion des rendez-vous, la planification des lits, et l'administration hospitalière. Le système inclut des tableaux de bord pour le personnel médical et administratif.",
    category: "App",
    icon: "🏥",
    color: "#EF4444",
    tags: ["Laravel", "MySQL", "Bootstrap", "jQuery", "Hospital Management"],
    features: [
      "Gestion des dossiers patients",
      "Planification des rendez-vous",
      "Gestion des lits et chambres",
      "Tableaux de bord personnalisés",
      "Rapports médicaux",
      "Gestion du personnel",
      "Alertes et notifications",
    ],
    challenges: [
      "Gérer les données sensibles de santé",
      "Assurer la disponibilité 24/7",
      "Interface intuitive pour le personnel médical",
    ],
    solutions: [
      "Conformité aux normes de santé",
      "Architecture haute disponibilité",
      "Formation et documentation complète",
    ],
    results: [
      "Disponibilité de 99.5%",
      "Réduction de 50% du temps administratif",
      "500+ patients gérés quotidiennement",
    ],
    techStack: {
      backend: ["Laravel", "MySQL"],
      frontend: ["Blade", "Bootstrap", "jQuery"],
      security: ["Chiffrement", "Audit logs"],
    },
    year: "2022-2023",
    duration: "8 mois",
    team: "3 développeurs",
  },
};

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = PROJECTS[slug];
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen text-white pt-24 flex items-center justify-center" style={{ background: "#080C14" }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Projet non trouvé</h1>
            <Link href="/projects" className="text-amber-400 hover:underline">
              Retour aux projets
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "challenges", label: "Défis & Solutions" },
    { id: "tech", label: "Technologies" },
    { id: "results", label: "Résultats" },
  ];

  return (
    <>
      <Navigation />
      <ParticleBackground />
      <div className="min-h-screen text-white pt-24 relative z-10" style={{ background: "#080C14" }}>
        {/* Hero Section avec effet parallaxe */}
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at center, ${project.color}40, transparent 70%)`,
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto">
            <ScrollAnimation>
              <Link href="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour aux projets
              </Link>
            </ScrollAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollAnimation delay={100}>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-transform duration-300 hover:scale-110 hover:rotate-3"
                    style={{ background: `${project.color}22`, border: `3px solid ${project.color}44` }}
                  >
                    {project.icon}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: project.color }}>
                      {project.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">{project.title}</h1>
                  </div>
                </div>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">{project.desc}</p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  {project.year && (
                    <div className="px-4 py-2 rounded-lg backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <span className="text-xs text-slate-400 block">Année</span>
                      <span className="text-white font-semibold">{project.year}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className="px-4 py-2 rounded-lg backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <span className="text-xs text-slate-400 block">Durée</span>
                      <span className="text-white font-semibold">{project.duration}</span>
                    </div>
                  )}
                  {project.team && (
                    <div className="px-4 py-2 rounded-lg backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <span className="text-xs text-slate-400 block">Équipe</span>
                      <span className="text-white font-semibold">{project.team}</span>
                    </div>
                  )}
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={200} direction="right">
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                    style={{ background: project.color }}
                  />
                  <div 
                    className="relative rounded-3xl p-12 backdrop-blur-sm border-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${project.color}15, rgba(255,255,255,0.05))`,
                      borderColor: `${project.color}44`
                    }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{project.icon}</div>
                      <h3 className="text-2xl font-bold mb-2">Projet {project.category}</h3>
                      <p className="text-slate-400">Une solution innovante et performante</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="sticky top-24 z-40 backdrop-blur-xl bg-[#080C14]/80 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-white border-b-2"
                      : "text-slate-400 hover:text-white"
                  }`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? project.color : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <ScrollAnimation delay={0}>
                  <div className="rounded-3xl p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span style={{ color: project.color }}>📋</span>
                      Description détaillée
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-lg">{project.longDesc}</p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation delay={100}>
                  <div className="rounded-3xl p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span style={{ color: project.color }}>✨</span>
                      Fonctionnalités principales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.features.map((feature: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 rounded-xl hover:scale-[1.02] transition-transform"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          <span className="text-xl mt-0.5" style={{ color: project.color }}>✓</span>
                          <span className="text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === "challenges" && project.challenges && (
              <div className="space-y-8">
                <ScrollAnimation delay={0}>
                  <div className="rounded-3xl p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span style={{ color: project.color }}>🎯</span>
                      Défis rencontrés
                    </h2>
                    <div className="space-y-4">
                      {project.challenges.map((challenge: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl"
                          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-red-400 font-bold text-xl">!</span>
                            <p className="text-slate-300">{challenge}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation delay={100}>
                  <div className="rounded-3xl p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span style={{ color: project.color }}>💡</span>
                      Solutions apportées
                    </h2>
                    <div className="space-y-4">
                      {project.solutions.map((solution: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl"
                          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-green-400 font-bold text-xl">✓</span>
                            <p className="text-slate-300">{solution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            )}

            {/* Tech Stack Tab */}
            {activeTab === "tech" && (
              <div className="space-y-8">
                <ScrollAnimation delay={0}>
                  <div className="rounded-3xl p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span style={{ color: project.color }}>🛠️</span>
                      Stack technique
                    </h2>
                    {project.techStack ? (
                      <div className="space-y-6">
                        {Object.entries(project.techStack).map(([category, techs]: [string, any]) => (
                          <div key={category}>
                            <h3 className="text-xl font-semibold mb-3 capitalize text-slate-300">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                              {techs.map((tech: string) => (
                                <span
                                  key={tech}
                                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                  style={{ background: `${project.color}22`, color: project.color, border: `1px solid ${project.color}44` }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                            style={{ background: `${project.color}22`, color: project.color, border: `1px solid ${project.color}44` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollAnimation>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === "results" && project.results && (
              <div className="space-y-8">
                <ScrollAnimation delay={0}>
                  <div className="rounded-3xl p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span style={{ color: project.color }}>📊</span>
                      Résultats obtenus
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {project.results.map((result: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-6 rounded-2xl text-center transition-all hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${project.color}15, rgba(255,255,255,0.05))`, border: `1px solid ${project.color}33` }}
                        >
                          <div className="text-4xl mb-3" style={{ color: project.color }}>🎯</div>
                          <p className="text-slate-300 font-medium">{result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
