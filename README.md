# ImRabo Console

A client-only React + TypeScript application built with Vite. This repository contains the user-facing web interface only; it does not run a Next.js server, API routes, database, Prisma client, or backend services.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- MapLibre GL
- Browser APIs for geolocation, speech synthesis, and voice input

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

## Optional API integration

The UI owns its loading, error, and data state. It can run without a backend using demo data. To connect an independently deployed API, set:

```env
VITE_API_BASE_URL=https://api.example.com
```

The client currently expects these endpoints:

- `GET /api/dashboard`
- `GET /api/agents`
- `GET /api/tasks`
- `GET /api/memory`
- `GET /api/public/intelligence?lat={lat}&lng={lng}`
- `POST /api/chat` with `{ "message": "..." }`

The API must enable CORS for the deployed console origin. Only public API origins belong in `VITE_*` variables; never put secrets or private keys in frontend environment variables.

## Build

```bash
pnpm typecheck
pnpm build
pnpm preview
```

## GitHub Pages

The project is configured for the repository path `/console/`. The GitHub Actions workflow builds the static site and deploys the `dist/` directory to GitHub Pages.

## Scope

This repository is the presentation layer. Authentication, persistence, business logic, AI orchestration, secrets, and server-side integrations belong in a separately deployed backend.
