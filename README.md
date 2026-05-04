# Projex

> Dashboard de suivi de projets personnels avec intégration CLI — gérez vos projets et étapes directement depuis votre terminal.

---

## Présentation

Projex est un outil full-stack pensé pour les développeurs. Il combine un dashboard web (type Trello) et un CLI Node.js qui permet de mettre à jour l'avancement de vos projets sans quitter votre éditeur.

```bash
# Lier un dossier à un projet
projex init

# Marquer une étape comme terminée
projex step4 ok

# Voir l'avancement du projet courant
projex status
```

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Express, TypeScript, JWT, Zod |
| Base de données | PostgreSQL, SQL vanilla, driver `pg` |
| CLI | Node.js, TypeScript, Commander.js |
| Monorepo | npm workspaces |

---

## Structure du projet

```
projex/
├── apps/
│   ├── web/          # Dashboard Next.js
│   ├── api/          # API REST Express
│   └── cli/          # Outil en ligne de commande
├── packages/
│   └── types/        # Types TypeScript partagés
└── package.json      # Racine du monorepo
```

---

## Base de données

Le projet utilise PostgreSQL avec du SQL vanilla (driver `pg`). Pas d'ORM — les requêtes sont écrites à la main.

**Tables principales**

- `users` — authentification
- `projects` — projets avec statut (`active`, `paused`, `completed`, `abandoned`, `future`)
- `steps` — étapes par projet avec statut (`todo`, `in_progress`, `done`, `skipped`)
- `cli_tokens` — tokens d'authentification pour le CLI (hashés en BDD)

---

## Fonctionnement du CLI

Lors du `projex init`, un fichier `.projex.json` est créé à la racine du dossier :

```json
{
  "projectId": "a3f8c2d1-9b4e-4f7a-8c3d-1e2f3a4b5c6d",
  "name": "mon-projet",
  "apiUrl": "http://localhost:3001/api",
  "token": "eyJhbGci..."
}
```

Chaque commande CLI lit ce fichier et envoie une requête HTTP à l'API. Le dashboard se met à jour en temps réel.

```
Terminal          API Express        Dashboard
────────          ───────────        ─────────
projex step4 ok → PATCH /steps/4  → Étape mise à jour
```

---

## Installation (développement)

```bash
# Cloner le projet
git clone https://github.com/votre-username/projex.git
cd projex

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Créer la base de données
psql -U postgres -f apps/api/sql/schema.sql

# Lancer tous les services
npm run dev
```

---

## Variables d'environnement

**apps/api/.env**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/projex
JWT_SECRET=votre_secret_jwt
PORT=3001
```

**apps/web/.env**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Commandes disponibles

```bash
npm run dev          # Lance web + api en parallèle
npm run dev:web      # Lance uniquement le frontend
npm run dev:api      # Lance uniquement le backend
npm run build        # Build tous les packages
npm run lint         # Lint l'ensemble du monorepo
```

**CLI (après installation globale)**
```bash
projex init          # Lie le dossier courant à un projet
projex status        # Affiche les étapes du projet courant
projex step<N> ok    # Marque l'étape N comme done
projex step<N> skip  # Marque l'étape N comme skipped
projex step<N> wip   # Marque l'étape N comme in_progress
```
