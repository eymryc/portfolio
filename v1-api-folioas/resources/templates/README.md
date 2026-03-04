# Templates — API Laravel

Ce dossier contient les **métadonnées** des templates (pas les vues).

## Structure

```
resources/templates/
├── v1/
│   ├── meta.json      ← obligatoire
│   └── schema.json    ← optionnel
├── classic/
│   ├── meta.json
│   └── schema.json
└── ...
```

- **Un dossier par template** ; le nom du dossier = **id** du template (ex. `v1`, `classic`).
- **meta.json** : obligatoire. Utilisé par `GET /api/v1/templates` pour lister les templates (landing, onboarding).
- **schema.json** : optionnel. Utilisé par `GET /api/v1/templates/{id}/schema` pour l’éditeur dynamique.

## meta.json

Le fichier `meta.json` doit contenir au minimum :

```json
{
  "id": "v1",
  "name": "Nom affiché",
  "description": "Description courte",
  "version": "1.0",
  "thumbnail": null
}
```

Le champ **id** doit être identique au nom du dossier.

## Les vues (design) sont dans Next.js

Le rendu des portfolios (HTML, CSS, mise en page) est fait côté **Next.js** dans `components/templates/{id}/`.  
L’API ne fait que lister les templates et stocker le `template_id` choisi par l’utilisateur.

Voir la doc globale : `docs/ORGANISATION-TEMPLATES.md` (à la racine du projet Next.js).
