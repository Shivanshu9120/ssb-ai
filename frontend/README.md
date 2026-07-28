# SSB Mentor AI — Frontend Web App

Next.js 16 (App Router) interface for SSB Mentor AI, providing the candidate dashboard, AI chat interface, PIQ manager, preparation timeline, and subscription settings.

For complete project setup and architecture details, see the [Root README](../README.md).

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

## Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Main Routes

- `/` — Landing page
- `/login` / `/signup` — Auth pages
- `/dashboard` — Main candidate overview
- `/chat` — AI mentor chat interface
- `/piq` — PIQ form editor & PDF exporter
- `/timeline` — 5-Day SSB preparation guide & checklist
- `/study` — Study materials and OLQ reference guides
- `/billing` — Usage & subscription management
