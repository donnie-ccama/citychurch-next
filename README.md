# Citychurch — ...for the heart of the city.

The website for Citychurch Amarillo, a non-profit ministry that finds, feeds, and teaches children and families who are most vulnerable. Built with Next.js 16, Supabase, and Tailwind CSS v4.

**Live site:** [citychurch-next.vercel.app](https://citychurch-next.vercel.app)  
**Repository:** [github.com/donnie-ccama/citychurch-next](https://github.com/donnie-ccama/citychurch-next)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19) |
| Styling | Tailwind CSS v4 + inline styles with CSS custom properties |
| Database | Supabase (PostgreSQL with Row-Level Security) |
| Donations | FundraiseUp (portal: aecfdssy.donorsupport.co) |
| Email list | Mailchimp (Audience ID: 4fed0cb6a0, Server: us21) |
| Sheets sync | Google Sheets API via googleapis (service account) |
| Hosting | Vercel |
| Language | TypeScript |
| Fonts | Inter (body), Source Serif 4 (editorial/accent) |

## Project Structure

```
citychurch-next/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── visit/page.tsx            # First-time visitor landing page
│   ├── about/page.tsx            # Our Story
│   ├── ministries/page.tsx       # How We Help
│   ├── donate/page.tsx           # Give / Donate
│   ├── contact/page.tsx          # Get Involved
│   ├── blog/                     # Blog listing + [slug] detail pages (featured: Feeding the Greatest Hunger)
│   ├── sermons/page.tsx          # Sermon archive
│   ├── media/page.tsx            # Media gallery
│   ├── register/[slug]/page.tsx  # Event registration (dynamic)
│   ├── admin/                    # Admin dashboard (protected)
│   ├── api/                      # API routes
│   │   ├── visitors/route.ts     # Visitor sign-up form handler
│   │   ├── contact/route.ts      # Contact form handler
│   │   ├── subscribe/route.ts    # Email signup (Mailchimp + Supabase + Sheets)
│   │   ├── register/route.ts     # Event registration handler
│   │   └── blog-share/route.ts   # Blog social share logging (→ Google Sheets)
│   ├── layout.tsx                # Root layout (Navbar, Footer, ScrollReveal)
│   └── globals.css               # Tailwind v4 + custom CSS (taupe palette, dark mode)
│
├── components/                   # Shared React components
│   ├── Navbar.tsx                # Sticky nav with mobile hamburger
│   ├── Footer.tsx                # Site footer with links + email signup
│   ├── HeroImage.tsx             # Static hero image with gradient overlay (homepage)
│   ├── HeroVideo.tsx             # Vimeo background video hero (preserved, not active)
│   ├── DonateButton.tsx          # FundraiseUp donation link
│   ├── EmailSignup.tsx           # Mailchimp email list signup
│   ├── ContactForm.tsx           # Contact form (→ /api/contact)
│   ├── VisitorSignupForm.tsx     # Visitor sign-up form (→ /api/visitors)
│   ├── EventRegistrationForm.tsx # Event registration form (→ /api/register)
│   ├── EventCard.tsx             # Ministry event card with registration link
│   ├── BlogCard.tsx              # Blog post preview card
│   ├── BlogClient.tsx            # Blog listing client component with category filter
│   ├── SocialShare.tsx           # Social share buttons (Facebook, LinkedIn, Copy Link) + handle capture
│   ├── SermonCard.tsx            # Sermon card with video embed
│   ├── SectionHeader.tsx         # Reusable section label + title
│   ├── ImpactStats.tsx           # Impact metrics display
│   ├── ScrollReveal.tsx          # Intersection observer scroll animations
│   ├── ThemeToggle.tsx           # Light/dark mode toggle
│   ├── VideoEmbed.tsx            # Responsive video embed wrapper
│   ├── MediaClient.tsx           # Media gallery client component
│   └── AdminSidebar.tsx          # Admin navigation sidebar
│
├── lib/                          # Shared utilities
│   ├── supabase-browser.ts       # Client-side Supabase client
│   ├── supabase-server.ts        # Server-side Supabase client + demo data
│   ├── google-sheets.ts          # Google Sheets sync helper
│   ├── types.ts                  # TypeScript interfaces for all data models
│   └── useScrollReveal.ts        # Scroll reveal React hook
│
├── supabase/                     # Database schema & migrations
│   ├── schema.sql                # Base schema (blog_posts, sermons, events, media_items)
│   └── migrations/
│       ├── 20260311000000_initial_schema.sql  # Initial tables
│       └── 001_forms.sql                      # Form tables (visitors, contacts, subscribers, registrations)
│
└── public/                       # Static assets
    └── images/
        ├── web-hero-3-27-26.png  # Homepage hero image (1920×1080)
        ├── blog-01-feeding-the-greatest-hunger.jpg  # Featured image for first blog post
        ├── ministry-01.jpg       # Visit page gallery photos
        ├── ministry-02.jpg
        ├── ministry-03.jpg
        ├── ministry-04.jpg
        ├── ministry-05.jpg
        └── ministry-06.jpg
```

## Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | Homepage — hero image, visitor banner, mission, impact stats, events, stories, email signup |
| `/visit` | Static | First-time visitor landing page — what to expect, $2.50 callout, photo gallery, sign-up form, location |
| `/about` | Static | Our Story |
| `/ministries` | Static | How We Help — ministry event cards |
| `/donate` | Static | Give — donation tiers with FundraiseUp |
| `/contact` | Static | Get Involved — ways to connect, contact form, church info |
| `/blog` | Static | Blog listing — featured story + category filter grid |
| `/blog/[slug]` | SSG | Blog article — featured image, markdown body, social share, related posts |
| `/sermons` | Static | Sermon archive |
| `/media` | Static | Media gallery |
| `/register/[slug]` | SSG | Event registration (sunday-mornings, family-night, volunteer) |
| `/admin` | Static | Admin dashboard |
| `/api/visitors` | Dynamic | POST — visitor sign-up submissions |
| `/api/contact` | Dynamic | POST — contact form submissions |
| `/api/subscribe` | Dynamic | POST — email list signups |
| `/api/register` | Dynamic | POST — event registration submissions |
| `/api/blog-share` | Dynamic | POST — blog social share logging |

## Unified Form Architecture

All forms follow the same pattern:

```
User submits form → API route → Supabase (primary) + Google Sheets (sync) + Mailchimp (email signups only)
```

### Data Flow

| Form | API Route | Supabase Table | Sheets Tab | Mailchimp |
|---|---|---|---|---|
| Visitor sign-up | `/api/visitors` | `visitors` | Visitors | — |
| Contact form | `/api/contact` | `contacts` | Contacts | — |
| Email signup | `/api/subscribe` | `subscribers` | Subscribers | Yes |
| Event registration | `/api/register` | `registrations` | Registrations | — |
| Blog social share | `/api/blog-share` | — | Blog Shares | — |

### Google Sheets Sync

- Spreadsheet: [Citychurch Form Submissions](https://docs.google.com/spreadsheets/d/10Fm3rkvzCEn6bv6SNIyZFjjG-auLoVzpqP1pk0DLlEA/edit)
- Auth: GCP service account (`citychurch-sheets@citychurch-website-491521.iam.gserviceaccount.com`)
- The sync is non-blocking (fire-and-forget) — if Sheets is unavailable, form submission still succeeds via Supabase
- Shared helper: `lib/google-sheets.ts`

### Sheets Tab Columns

| Tab | Columns |
|---|---|
| Visitors | First Name, Last Name, Email, Phone, Visit Type, Date |
| Contacts | Name, Email, Message, Date |
| Subscribers | Email, First Name, Tag, Date |
| Registrations | Event, Name, Email, Phone, Number of People, Comments, Date |
| Blog Shares | Article Title, Article Slug, Platform, Social Handle, Date |

## Environment Variables

All variables are set on Vercel for Production and Development environments.

| Variable | Purpose | Where to find |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API |
| `MAILCHIMP_API_KEY` | Mailchimp API key | Mailchimp → Account → Extras → API keys |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Target Google Sheets spreadsheet | `10Fm3rkvzCEn6bv6SNIyZFjjG-auLoVzpqP1pk0DLlEA` |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | GCP service account email | `citychurch-sheets@citychurch-website-491521.iam.gserviceaccount.com` |
| `GOOGLE_SHEETS_PRIVATE_KEY` | GCP service account private key | Downloaded JSON key file |

### Mailchimp Settings

- Audience: Citychurch Website Subscribers
- Audience ID: `4fed0cb6a0`
- Server: `us21`
- Tag for website signups: `website-signup-2026`

### FundraiseUp Settings

- Portal URL: `https://aecfdssy.donorsupport.co`
- Donors are redirected back to the site upon completion (no JS modal)
- Cost per meal: $2.50 (hot item + fresh fruit + popcorn)
- Suggested tiers: $2.50 (1 meal), $17.50 (1 week), $75 (1 month)

### GCP Service Account

- Project: `citychurch-website-491521`
- Service account: `citychurch-sheets@citychurch-website-491521.iam.gserviceaccount.com`
- Required API: Google Sheets API (enabled in GCP console)
- The service account must be shared as an Editor on the Citychurch Form Submissions spreadsheet

## Design System

### Color Palette (Taupe / Oatmeal)

Uses CSS custom properties with oklch values. Light and dark mode via `.dark` class on `<html>`.

- `--accent`: oklch(63% 0.2 360) — brand red from logo
- `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-muted` — surface colors
- `--text-primary`, `--text-secondary`, `--text-muted` — text hierarchy
- `--border-color`, `--border-subtle` — borders

### Typography

- Body: Inter (system-ui fallback)
- Editorial: Source Serif 4 (Georgia fallback)
- Headings: Inter, weight 700-800, tight letter-spacing (-0.02em to -0.04em)

### Components

- Inputs: 0.875rem padding, 8px border-radius, bg-card background, accent border on focus
- Buttons: accent background, white text, 600 weight, 8px radius, opacity hover
- Cards: bg-card, 1px border, 12px radius, 2rem padding, card-hover class for lift effect
- Sections: 6rem/1.5rem padding (5rem for callouts), max-width 1000px/720px/520px
- Scroll animations: `.reveal` class + `.animate-in` via IntersectionObserver

### Styling Convention

All components use **inline styles with CSS custom properties** — not Tailwind utility classes in JSX. This is the established pattern throughout the entire codebase.

## Database Schema

### Content Tables (initial schema)

- `blog_posts` — title, slug, content, excerpt, category, author, featured_image, published
- `sermons` — title, speaker, series, sermon_date, video_url, description, featured
- `events` — title, event_date, event_time, description, location, registration_url, featured, active
- `media_items` — title, media_type, url, thumbnail_url, description

### Form Tables (001_forms.sql — deployed 2026-03-27)

- `visitors` — first_name, last_name, email, phone, visit_type, source
- `contacts` — name, email, message, source
- `subscribers` — email (unique), first_name, tag, source
- `registrations` — event_slug, event_title, name, email, phone, num_people, comments, source

All form tables have:
- UUID primary key
- `created_at` timestamp
- RLS: anonymous inserts, authenticated reads
- Indexes on email and created_at

## Running Locally

```bash
npm install
npm run dev       # Starts dev server on port 5000
npm run build     # Production build
npm run start     # Production server on port 5000
```

Without Supabase env vars, the app falls back to demo data defined in `lib/supabase-server.ts`.

## Deployment

Hosted on Vercel. Every push to `main` triggers an automatic deployment.

- Vercel project: `donnies-projects-02859c02/citychurch-next`
- Production URL: [citychurch-next.vercel.app](https://citychurch-next.vercel.app)
- Domain: Will be pointed from Squarespace when ready to launch

## Pending Tasks

- [x] Run `supabase/migrations/001_forms.sql` against Supabase database (completed 2026-03-27)
- [x] Replace photo placeholders on /visit page with real ministry photos (completed 2026-03-27)
- [x] Add first blog post: "Feeding the Greatest Hunger" by Donnie Lane Jr. (completed 2026-03-27)
- [x] Add featured image for first blog post (completed 2026-03-27)
- [x] Wire up social share buttons with handle capture + Google Sheets logging (completed 2026-03-27)
- [ ] Replace demo data in `lib/supabase-server.ts` with live Supabase queries
- [ ] Update real impact numbers in ImpactStats component
- [ ] Add real ministry photos to event cards
- [ ] Replace remaining two placeholder blog posts with real articles
- [ ] Point production domain from Squarespace to Vercel
