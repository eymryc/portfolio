# Organisation des dossiers de templates

Un template a **deux emplacements** : métadonnées côté API Laravel, vue côté Next.js.  
L’**id** du template doit être **identique** des deux côtés (dossier Laravel, meta.json, registre Next.js si vue dédiée).

---

## Convention de nommage des ids (pour beaucoup de templates)

Pour rester lisible et scalable avec **beaucoup de templates** :

| Règle | Exemple |
|-------|--------|
| **Slug** : minuscules, lettres + chiffres + tirets uniquement | `modern-dark`, `minimal-resume` |
| **Max 50 caractères** (contrainte BDD) | ✅ |
| **Pas d’espaces, pas de underscores** | ❌ `mon template` → ✅ `mon-template` |
| **Descriptif** : style ou usage | `corporate-classic`, `creative-fullscreen`, `one-page-2024` |

**Suggestion par catégorie** (optionnel) : préfixer l’id pour filtrer plus tard dans l’UI :

- `minimal-*` : minimal, `minimal-resume`, `minimal-dark`
- `creative-*` : créatif, `creative-fullscreen`, `creative-portfolio`
- `corporate-*` : corporate, `corporate-classic`, `corporate-modern`
- `pro-*` / `free-*` : si tu distingues offres plus tard

Le **nom affiché** (champ `name` dans `meta.json`) peut être plus long et lisible : "Classique moderne", "Minimal — CV une page", etc. L’**id** sert d’identifiant technique (dossier, URL, BDD).

---

## 1. API Laravel — métadonnées et schéma

**Dossier :** `v1-api-portfolio/resources/templates/{id}/`

```
v1-api-portfolio/resources/templates/
├── v1/
│   ├── meta.json      ← obligatoire (nom, description, liste)
│   └── schema.json    ← optionnel (champs pour l’éditeur)
├── classic/
│   ├── meta.json
│   └── schema.json
└── minimal/
    └── meta.json
```

### Contenu de `meta.json` (obligatoire)

```json
{
  "id": "v1",
  "name": "Classique v1",
  "version": "1.0",
  "description": "Template sobre avec Hero, sections...",
  "thumbnail": null
}
```

- **id** : doit être le **nom du dossier** (et le même que dans le registre Next.js).
- **name** : affiché sur la landing et à l’onboarding.
- **description**, **version**, **thumbnail** : optionnels.

### Contenu de `schema.json` (optionnel)

Décrit les sections/champs pour l’éditeur dynamique. Voir `v1/schema.json` comme exemple.

---

## 2. Next.js — vues (composants React)

Actuellement une **seule vue** est utilisée pour tous les templates : **`components/portfolio/PortfolioView.tsx`**.  
Le registre **`components/portfolio/templateRegistry.tsx`** renvoie toujours cette vue (le `template_id` API est conservé pour une évolution future).

Quand tu ajouteras **plusieurs designs** :

- Créer un composant par design, ex. `components/portfolio/templates/MinimalResume.tsx`, `CreativeFullscreen.tsx`, etc.
- Dans **`templateRegistry.tsx`** : associer chaque **id** (slug) à son composant, ex. `"minimal-resume": MinimalResume`, `"creative-fullscreen": CreativeFullscreen`.
- L’**id** doit être le **même** que le dossier Laravel (`resources/templates/{id}/`) et le champ `id` dans `meta.json`.

---

## 3. Ajouter un nouveau template (checklist)

| Étape | Où | Action |
|-------|-----|--------|
| 1 | Laravel | Créer `v1-api-portfolio/resources/templates/{id}/` avec au minimum `meta.json` (id = nom du dossier, slug conforme à la convention ci‑dessus). |
| 2 | Laravel | (Optionnel) Ajouter `schema.json` pour un éditeur dynamique basé sur le schéma. |
| 3 | Next.js | Si tu as une **vue dédiée** : créer le composant et l’enregistrer dans `templateRegistry.tsx` avec la clé `{id}`. Sinon la vue par défaut (PortfolioView) est utilisée. |

L’**id** (ex. `minimal-resume`) doit être **le même** dans :
- le nom du dossier Laravel `resources/templates/minimal-resume/`,
- le `"id"` dans `meta.json`,
- la clé dans le registre Next.js si tu ajoutes une vue dédiée.

---

## 4. Résumé

| Côté | Chemin | Rôle |
|------|--------|------|
| **Laravel** | `v1-api-portfolio/resources/templates/{id}/meta.json` | Liste des templates (landing, onboarding). **id** = slug (ex. `minimal-resume`). |
| **Laravel** | `v1-api-portfolio/resources/templates/{id}/schema.json` | Optionnel : structure pour l’éditeur. |
| **Next.js** | `components/portfolio/PortfolioView.tsx` | Vue par défaut (un seul design pour l’instant). |
| **Next.js** | `components/portfolio/templateRegistry.tsx` | Association `templateId` → composant (extension future). |
