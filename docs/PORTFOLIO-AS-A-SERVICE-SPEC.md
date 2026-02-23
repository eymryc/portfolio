# Portfolio as a Service – Spécifications & Stack technique

Document de spécification pour une plateforme permettant à tout utilisateur (lambda) de créer son portfolio en renseignant ses détails et en choisissant un thème, avec hébergement multi-utilisateurs.

---

## 1. Contexte & objectif

- **Produit** : Un site où chaque utilisateur peut s’inscrire, remplir son profil (bio, compétences, expériences, projets, contact) et choisir un thème. Son portfolio est alors généré et accessible à une URL dédiée (ex. `tonsite.com/p/jean-dupont`).
- **Profil dev** : Laravel, Spring Boot, React.js → la stack proposée s’appuie sur ces compétences tout en restant pragmatique (délai, hébergement, maintenance).

---

## 2. Parcours utilisateur (résumé)

1. Inscription (email + mot de passe ou OAuth).
2. Connexion → accès au dashboard « Mon portfolio ».
3. Renseigner : profil, compétences, expériences, formations, projets, contact.
4. Choisir un thème (ex. Sombre, Clair, Minimal).
5. Son portfolio est en ligne à `/p/<slug>` ; il partage le lien. Toute modification se reflète immédiatement.

---

## 3. Stack technique recommandée et justifications

Tu es à l’aise en **Laravel**, **Spring Boot** et **React**. Deux architectures cohérentes sont possibles ; celle recommandée ici privilégie Laravel + React/Next.js.

### 3.1 Option A (recommandée) : Laravel API + Next.js (React) front

| Couche        | Techno              | Version suggérée | Pourquoi |
|---------------|---------------------|------------------|----------|
| **Backend API** | **Laravel**         | 11.x             | Tu maîtrises Laravel ; auth (Sanctum), validation, ORM, storage et filesystem sont rapides à mettre en place. Idéal pour API REST/JSON. |
| **Base de données** | **MySQL** ou **PostgreSQL** | 8.x / 16.x | Habituel avec Laravel ; migrations, relations, indexation simples. PostgreSQL si tu veux du JSON natif pour le contenu portfolio. |
| **Auth API**  | **Laravel Sanctum** | inclus Laravel    | Tokens API pour SPA ; pas de session serveur à gérer côté front. Tu peux ajouter login social (Google, GitHub) via Socialite. |
| **Frontend**  | **Next.js** (React) | 16.x LTS          | Ton portfolio actuel est déjà en Next.js ; tu réutilises composants et design. Next = SSR/SEO pour les pages publiques `/p/[slug]` et React pour le dashboard. |
| **Hébergement API** | VPS (Hetzner, OVH, etc.) ou **Laravel Forge** + **Railway** / **Render** | - | Laravel tourne bien sur un serveur PHP classique ou sur des runtimes PHP (Railway, Render). |
| **Hébergement Front** | **Vercel**          | -                 | Déploiement Next.js optimisé, gratuit pour petits projets. Le front appelle l’API Laravel via l’URL déployée. |
| **Stockage fichiers** | **Laravel** (disque local ou **S3** / **Spaces**) | - | Upload photo de profil et images de projets : `Storage::disk('public')` ou S3/DO Spaces pour la prod. |

**Pourquoi cette option**  
- Réutilisation maximale de ton portfolio Next.js existant (thèmes, composants).  
- Laravel pour tout ce qui est métier : utilisateurs, portfolios, auth, uploads.  
- Séparation claire : une API à documenter et à maintenir, un front React unique.  
- Alignée avec ton profil **Laravel + React**.

---

### 3.2 Option B : Full Next.js (API Routes + React)

| Couche        | Techno              | Version suggérée | Pourquoi |
|---------------|---------------------|------------------|----------|
| **Backend + API** | **Next.js** (API Routes / Route Handlers) | 16.x | Une seule codebase ; pas de second serveur. Moins naturel qu’un framework backend dédié pour règles métier complexes. |
| **ORM / DB**  | **Prisma** ou **Drizzle** | dernier      | Accès type-safe à la DB depuis Node ; migrations simples. Très bien intégré à Next. |
| **Base de données** | **PostgreSQL** (Vercel Postgres, Supabase, Neon) ou **MySQL** | - | Hébergement serverless possible ; Prisma/Drizzle supportent les deux. |
| **Auth**      | **NextAuth.js** ou **Clerk** | dernier      | Gestion login/session/OAuth dans l’écosystème Next. |
| **Frontend**  | **Next.js** (React) | 16.x             | Même app : dashboard + pages `/p/[slug]`. |
| **Hébergement** | **Vercel**        | -               | Un seul déploiement (front + API). |

**Pourquoi cette option**  
- Un seul langage (JS/TS), un seul repo, déploiement unique.  
- Utile si tu veux rester 100 % dans l’écosystème React/Next et ne pas gérer un backend Laravel séparé.

---

### 3.3 Option C : Spring Boot API + React front

| Couche        | Techno              | Version suggérée | Pourquoi |
|---------------|---------------------|------------------|----------|
| **Backend API** | **Spring Boot**     | 3.2.x            | Tu maîtrises Spring ; adapté si l’équipe ou le contexte est plutôt Java (entreprise, intégrations JVM). |
| **Auth**      | **Spring Security** + **JWT** ou **OAuth2** | 6.x | Contrôle fin des rôles et de l’API. Plus de configuration qu’avec Laravel Sanctum. |
| **Base de données** | **PostgreSQL** ou **MySQL** | - | JPA/Hibernate standard. |
| **Frontend**  | **Next.js** (React) | 16.x             | Inchangé par rapport aux autres options. |

**Pourquoi cette option**  
- Cohérent avec ton profil **Spring Boot + React**.  
- À privilégier si le projet doit évoluer vers des règles métier lourdes, intégrations Java, ou environnement principalement Java.

---

## 4. Recommandation synthétique (pour toi, profil Laravel / Spring Boot / React)

- **Pour livrer vite et réutiliser ton portfolio actuel** : **Option A (Laravel API + Next.js)**.  
- **Pour tout garder en un seul projet Next.js** : **Option B (Full Next.js)**.  
- **Si le contexte est plutôt Java / entreprise** : **Option C (Spring Boot + Next.js)**.

Le reste du document décrit l’option A (Laravel + Next.js) en détail ; les principes (modèle de données, routes, flux) s’appliquent aussi aux options B et C en adaptant les technos.

---

## 5. Modèle de données (option Laravel)

### 5.1 Tables

- **users**  
  - `id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`.  
  - Géré par Laravel (migration `create_users_table`).

- **portfolios**  
  - `id`, `user_id` (FK), `slug` (unique, ex. `jean-dupont`), `theme` (string : `dark`, `light`, `minimal`), `content` (JSON ou colonne JSON), `created_at`, `updated_at`.  
  - Un portfolio par utilisateur (ou plusieurs si besoin plus tard).

- **uploads** (optionnel si tu ne stockes que des chemins dans le JSON)  
  - `id`, `portfolio_id`, `path`, `disk`, `created_at`.  
  - Ou simplement stocker les URLs dans `content` après upload (Laravel Storage).

### 5.2 Structure du JSON `content`

```json
{
  "profile": {
    "name": "Jean Dupont",
    "title": "Développeur Full Stack",
    "bio": "Texte court...",
    "photo": "/storage/portfolios/abc123/photo.jpg",
    "email": "jean@mail.com",
    "location": "Paris",
    "links": {
      "linkedin": "https://...",
      "github": "https://..."
    }
  },
  "skills": {
    "Frontend": ["React", "Next.js"],
    "Backend": ["Laravel", "Spring Boot"]
  },
  "experiences": [
    {
      "period": "2022 – Présent",
      "role": "Développeur",
      "company": "Acme",
      "location": "Paris",
      "desc": "...",
      "tags": ["Laravel", "React"],
      "current": true
    }
  ],
  "education": [
    {
      "year": "2020 – 2022",
      "degree": "Master",
      "school": "Université X",
      "location": "Paris"
    }
  ],
  "projects": [
    {
      "title": "Mon projet",
      "desc": "...",
      "tags": ["Laravel", "React"],
      "category": "Web",
      "icon": "🌐",
      "color": "#3B82F6",
      "link": "https://..."
    }
  ],
  "contact": {
    "email": "jean@mail.com",
    "messagePlaceholder": "Votre message..."
  }
}
```

Tu peux valider ce JSON côté Laravel avec des **Form Requests** ou des **DTOs** + règles de validation.

---

## 6. API backend (Laravel) – Routes et rôles

- **Public (non authentifié)**  
  - `GET /api/portfolio/{slug}`  
    - Retourne le portfolio (profil, thème, `content`) pour la page `/p/[slug]`.  
    - 404 si slug inconnu.

- **Authentifié (Sanctum)**  
  - `GET /api/me/portfolio`  
    - Retourne le portfolio de l’utilisateur connecté (édition).  
  - `PUT /api/me/portfolio`  
    - Met à jour `slug` (si unique), `theme`, `content`. Validation stricte du JSON.  
  - `POST /api/me/portfolio/upload`  
    - Upload photo profil ou image projet ; retourne l’URL à mettre dans `content`.

- **Auth**  
  - `POST /api/register` (si custom)  
  - `POST /api/login` (retourne token Sanctum)  
  - `POST /api/logout`  
  - Ou utilisation de **Laravel Sanctum** + **Laravel Fortify** / **Socialite** pour OAuth.

Côté Next.js, tu appelles ces routes avec `fetch` ou axios, en envoyant le token Sanctum (header `Authorization: Bearer <token>`).

---

## 7. Frontend (Next.js)

- **Pages publiques**  
  - `/` : landing / présentation du produit.  
  - `/p/[slug]` : affichage du portfolio (données + thème). Même structure que ton portfolio actuel (Hero, À propos, Projets, Contact), données injectées depuis l’API Laravel.

- **Pages authentification**  
  - `/login`, `/register` (ou intégration OAuth).

- **Dashboard (authentifié)**  
  - `/dashboard` (ou `/mon-portfolio`) : formulaires pour éditer profil, compétences, expériences, formations, projets, contact ; sélecteur de thème ; aperçu optionnel.

- **Thèmes**  
  - Un composant ou layout qui, selon `theme` retourné par l’API, applique les bonnes classes CSS ou variables (ex. thème sombre = ton design actuel ; clair = variante light).  
  - Données toujours dans la même structure ; seul le rendu visuel change.

---

## 8. Sécurité & bonnes pratiques

- **Laravel** : validation des entrées, protection CSRF désactivée pour l’API (stateless), rate limiting sur login/register et sur les routes API sensibles.  
- **Sanctum** : tokens avec expiration ; refresh ou re-login côté front.  
- **Uploads** : vérifier type MIME et taille ; stocker hors `public` si possible et servir via une route dédiée ou CDN.  
- **Slug** : unique, généré ou choisi à l’inscription/édition ; éviter caractères spéciaux (regex ou slugify).

---

## 9. Déploiement (option A)

- **Laravel** : serveur PHP (Forge, VPS) ou Plateform (Railway, Render) ; `.env` avec `APP_URL`, `DB_*`, `SANCTUM_STATEFUL_DOMAINS` si front et API sur domaines différents ; CORS configuré pour le domaine Next.js.  
- **Next.js** : Vercel ; variable d’environnement `NEXT_PUBLIC_API_URL` pointant vers l’API Laravel.  
- **DB** : MySQL ou PostgreSQL sur le même hébergeur ou service managé (PlanetScale, Supabase, etc.).

---

## 10. Résumé des technos (option A)

| Rôle            | Techno              | Raison principale |
|-----------------|---------------------|-------------------|
| Backend         | Laravel             | Aligné avec ton expertise ; auth, API, storage rapides. |
| DB              | MySQL / PostgreSQL  | Standard Laravel ; PostgreSQL pratique pour colonne JSON. |
| Auth API        | Laravel Sanctum    | Tokens pour SPA ; simple à brancher. |
| Frontend        | Next.js (React)     | Réutilisation de ton portfolio ; SSR pour `/p/[slug]`. |
| Hébergement API | VPS / Forge / Railway / Render | Selon budget et préférence. |
| Hébergement Front | Vercel            | Idéal pour Next.js. |
| Fichiers        | Laravel Storage + S3/Spaces (optionnel) | Scalable en production. |

Tu peux utiliser ce document comme référence unique (spécifications + stack + justifications) et l’adapter selon le choix final (A, B ou C). Si tu veux, on peut détailler la suite en « Plan de tâches » (sprints) ou en structure de dossiers Laravel + Next.js.
