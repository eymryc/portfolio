# Portfolio as a Service — API Laravel 12

## Concept

Plateforme permettant à chaque utilisateur de créer et publier son **portfolio web professionnel**.
Inspiré de CVDesignR mais pour les portfolios web de développeurs/designers.

```
Laravel 12 API  ←→  Next.js Frontend
api.domain.com      domain.com
```

---

## Flux complet Next.js ↔ Laravel

```
┌─────────────────────────────────────────────────────────────────────┐
│ ONBOARDING                                                          │
│   1. POST /auth/register          → crée le compte                 │
│   2. GET  /templates              → liste les templates dispo       │
│   3. POST /me/portfolio           → crée le portfolio vide          │
│                                                                     │
│ DASHBOARD ÉDITEUR                                                   │
│   4. GET  /me/portfolio           → charge tout (template + content)│
│   5. PUT  /me/portfolio/sections/profile    → sauvegarde profil     │
│   6. POST /me/portfolio/sections/experiences/items → ajout exp.     │
│   7. POST /me/portfolio/upload    → upload photo/image S3           │
│   8. PATCH /me/portfolio/template → change le design                │
│   9. POST /me/portfolio/preview   → lien preview 30 min             │
│  10. PATCH /me/portfolio/visibility {is_public:true} → publie       │
│                                                                     │
│ PAGE PUBLIQUE (Next.js SSG/ISR)                                     │
│  11. GET /portfolios/{slug}       → données pour rendu /p/{slug}    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Endpoints

### Auth
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/v1/auth/register` | public | Inscription |
| POST | `/api/v1/auth/login` | public | Connexion → token |
| POST | `/api/v1/auth/logout` | sanctum | Déconnexion |
| GET  | `/api/v1/auth/me` | sanctum | Profil + hasPortfolio |

### Public
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/v1/portfolios/{slug}` | public | Données portfolio (SSG/ISR) |
| GET | `/api/v1/search?query=` | public | Recherche portfolios |
| GET | `/api/v1/templates` | public | Liste templates |
| GET | `/api/v1/templates/{id}/schema` | public | Schema JSON template |
| GET | `/sitemap.xml` | public | Sitemap SEO |

### Mon Portfolio
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/api/v1/me/portfolio` | sanctum | Charger le portfolio |
| POST   | `/api/v1/me/portfolio` | sanctum | Créer (onboarding) |
| PATCH  | `/api/v1/me/portfolio/template` | sanctum | Changer de template |
| PATCH  | `/api/v1/me/portfolio/visibility` | sanctum | Publier / Dépublier |
| DELETE | `/api/v1/me/portfolio` | sanctum | Supprimer |
| POST   | `/api/v1/me/portfolio/preview` | sanctum | Lien preview 30 min |

### Sections (éditeur)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | `/sections/{section}` | Lire la section |
| PUT    | `/sections/{section}` | Remplacer la section entière |
| POST   | `/sections/{section}/items` | Ajouter un item (arrays) |
| PUT    | `/sections/{section}/items/{id}` | Modifier un item |
| DELETE | `/sections/{section}/items/{id}` | Supprimer un item |

**Sections objet** (remplacement en bloc) : `profile` · `skills` · `contact`
**Sections array** (CRUD items) : `experiences` · `projects` · `education`

### Uploads
| Méthode | Route | Description |
|---------|-------|-------------|
| POST   | `/api/v1/me/portfolio/upload` | Upload image S3 |
| GET    | `/api/v1/me/uploads` | Mes uploads |
| DELETE | `/api/v1/me/uploads/{id}` | Supprimer |

### Domaines
| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | `/api/v1/me/domains` | Mes domaines |
| POST   | `/api/v1/me/domains` | Ajouter → token DNS TXT |
| POST   | `/api/v1/me/domains/{id}/verify` | Vérifier DNS |
| DELETE | `/api/v1/me/domains/{id}` | Supprimer |

### Admin
| Méthode | Route | Description |
|---------|-------|-------------|
| GET  | `/api/v1/admin/users` | Liste utilisateurs |
| GET  | `/api/v1/admin/portfolios` | Liste portfolios |
| GET  | `/api/v1/admin/stats` | Statistiques |
| POST | `/api/v1/admin/cache/flush` | Vider le cache |

---

## Structure contenu portfolio (JSON)

```json
{
  "profile": {
    "name": "Jean Dupont",
    "title": "Développeur Full Stack",
    "bio": "...",
    "photo": "https://cdn.../portfolios/1/uuid.jpg",
    "links": { "linkedin": "...", "github": "...", "website": "..." }
  },
  "skills": {
    "Frontend": ["React", "Next.js", "Tailwind"],
    "Backend": ["Laravel", "Node.js"]
  },
  "experiences": [
    { "id": "uuid", "period": "2022–Présent", "role": "Dev Senior", "company": "Acme", "current": true }
  ],
  "projects": [
    { "id": "uuid", "title": "Mon projet", "desc": "...", "tags": ["React"], "link": "https://..." }
  ],
  "education": [
    { "id": "uuid", "year": "2020–2022", "degree": "Master", "school": "Université X" }
  ],
  "contact": {
    "email": "jean@example.com",
    "phone": "+33 6 00 00 00 00",
    "messagePlaceholder": "Contactez-moi"
  }
}
```

---

## Installation

```bash
# 1. Dépendances
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# 2. .env
FRONTEND_URL=https://domain.com
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_DEFAULT_REGION=eu-west-1
AWS_BUCKET=xxx
AWS_URL=https://cdn.domain.com

# 3. Templates (à créer dans resources/templates/)
# resources/templates/classic/meta.json
# resources/templates/classic/schema.json

# 4. Tests
php artisan test --filter AuthTest
php artisan test --filter PortfolioTest
php artisan test --filter SectionTest
```

---

## Fichiers générés

```
app/
├── Exceptions/Handler.php
├── Http/
│   ├── Controllers/Api/
│   │   ├── Auth/  RegisterController · LoginController · LogoutController · MeController
│   │   ├── Public/ PortfolioPublicController · TemplateController · SearchController · SitemapController
│   │   ├── Me/    PortfolioController · SectionController · UploadController · DomainController
│   │   └── Admin/ UserAdminController · PortfolioAdminController · StatsAdminController
│   ├── Requests/
│   │   ├── Auth/      RegisterRequest · LoginRequest
│   │   ├── Portfolio/ StorePortfolioRequest · UpdateTemplateRequest · UpdateVisibilityRequest
│   │   ├── Section/   SectionReplaceRequest · SectionItemRequest
│   │   ├── Upload/    UploadFileRequest
│   │   └── Domain/    StoreDomainRequest
│   └── Resources/  PortfolioResource · UploadResource · UserResource
├── Models/ User · Portfolio · Upload · Domain · PortfolioPreviewToken
├── Services/ PortfolioService
└── Providers/ AppServiceProvider

database/migrations/  (5 fichiers)
config/portfolio.php
routes/api.php
tests/Feature/  AuthTest · PortfolioTest · SectionTest
```
