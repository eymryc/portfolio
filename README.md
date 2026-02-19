# Portfolio – Romaric Ouangni

Portfolio professionnel développé avec **Next.js 15** (App Router), **TypeScript** et **Tailwind CSS**.

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
portfolio-romaric/
├── app/
│   ├── layout.tsx        # Layout principal avec métadonnées SEO
│   ├── page.tsx          # Page d'accueil
│   └── globals.css       # Styles globaux + animations
├── components/
│   └── Portfolio.tsx     # Composant principal du portfolio (Client Component)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🛠️ Stack technique

- **Next.js 15.1.6** – Framework React avec App Router
- **TypeScript** – Typage statique
- **Tailwind CSS 3** – Styles utilitaires
- **DM Sans + Space Mono** – Typographie via Google Fonts (next/font)

## 📦 Build de production

```bash
npm run build
npm start
```

## 🎨 Design

- Thème sombre (dark mode natif) avec palette ambre/rouge/violet
- Animations CSS fluides (fade-up, typewriter, pulse)
- Navigation sticky avec blur au scroll
- Filtrage des projets par catégorie
- Fully responsive (mobile-first)
- Grille héroïque et effets ambient glow

## ✏️ Personnalisation

Toutes les données (projets, compétences, expériences) sont centralisées en haut du fichier `components/Portfolio.tsx` sous forme de constantes. Modifiez-les directement pour mettre à jour le portfolio.
