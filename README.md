## Jarvis Web Intelligence System

Web-based AI Brain + Memory + Automation platform.

### Implemented MVP Scope

- Chat AI brain interface
- Persistent memory store
- Tasks and goals system
- Daily plan agent
- Event ingestion
- Real-time dashboard (poll-based)

### Architecture

- Brain + Memory Layer: `src/lib/jarvis`
- Integration Layer: `src/app/api/*` (`/chat`, `/memory`, `/tasks`, `/goals`, `/events`, `/dashboard`, `/agents`)
- Automation + Dashboard Layer: `src/app/(jarvis)/*`

### AI Provider Switching

Set provider in environment:

`AI_PROVIDER=local` or `AI_PROVIDER=openai`

Optional OpenAI-compatible settings:

- `AI_API_BASE_URL`
- `AI_API_KEY`
- `AI_MODEL`

### Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Notes

- Current storage uses `jarvis-store.json` for persistence in this refactor phase.
- Legacy domain routes were pruned to keep only PRD-aligned product surfaces.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
