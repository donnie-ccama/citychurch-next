# Citychurch Next.js

A Next.js 16 web app for Citychurch Amarillo — a community church website with sermons, blog, events, media, and an admin panel.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (browser + server clients)
- **Language**: TypeScript

## Project Structure

- `app/` — Next.js App Router pages (home, about, blog, sermons, events, media, contact, admin)
- `components/` — Shared React components (Navbar, Footer, HeroVideo, BlogCard, etc.)
- `lib/` — Supabase clients and demo data
  - `supabase-browser.ts` — Client-side Supabase client (uses `NEXT_PUBLIC_*` env vars)
  - `supabase-server.ts` — Server-side Supabase client + demo data fallbacks
- `public/` — Static assets
- `supabase/` — Supabase config

## Environment Variables

The following environment variables are required for Supabase connectivity:

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anonymous/public key

Without these, the app falls back to demo data defined in `lib/supabase-server.ts`.

## Running

```bash
npm run dev   # Starts dev server on port 5000
npm run build # Production build
npm run start # Starts production server on port 5000
```

## Replit Configuration

- Dev server runs on port 5000 bound to `0.0.0.0` for Replit preview compatibility
- `next.config.ts` sets `allowedDevOrigins: ["*"]` to allow Replit's proxied iframe
- Workflow: "Start application" → `npm run dev`
