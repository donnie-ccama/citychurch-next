# Changelog

All notable changes to the Citychurch website are documented here.

---

## 2026-03-27 (evening) — Hero Image + Database Migration

### Added
- **Static hero image** — replaced Vimeo video background with `web-hero-3-27-26.png` (1920×1080 ministry photo)
  - New `HeroImage` component (`components/HeroImage.tsx`) with gradient overlay and CTA buttons
  - `HeroVideo.tsx` preserved for potential future use
  - Image stored at `public/images/web-hero-3-27-26.png`

### Completed
- **Supabase migration `001_forms.sql` executed** — all four form tables now live in production:
  - `visitors` — first-time visitor sign-ups
  - `contacts` — contact form submissions
  - `subscribers` — email signups (local record, supplements Mailchimp)
  - `registrations` — event registrations
- All tables include UUID primary keys, `created_at` timestamps, email + created_at indexes, and RLS policies (anonymous inserts, authenticated reads)
- Database password reset after migration

---

## 2026-03-27 — Unified Form Architecture + Visitor Page

### Added
- **Unified form system** — all forms now use Supabase as primary store with Google Sheets sync
  - `lib/google-sheets.ts` — shared Sheets sync helper using googleapis
  - `app/api/visitors/route.ts` — visitor sign-up API
  - `app/api/contact/route.ts` — contact form API
  - `app/api/register/route.ts` — event registration API
  - `supabase/migrations/001_forms.sql` — visitors, contacts, subscribers, registrations tables
  - TypeScript interfaces: Visitor, Contact, Subscriber, Registration

- **First-time visitor page** (`/visit`)
  - Hero section with welcome message
  - "What to Expect" cards (Worship & Teaching, Family Night, Serving Together)
  - $2.50 impact callout with donate button
  - Photo gallery section (placeholders ready for real photos)
  - Visitor sign-up form (first name, last name, email, phone, visit type)
  - Location & service times with Google Maps / Apple Maps links

- **Visitor sign-up form** (`components/VisitorSignupForm.tsx`)
  - Fields: first name, last name, email, phone (optional), visit type dropdown
  - Posts to `/api/visitors` → Supabase + Google Sheets "Visitors" tab

- **Event registration system** — replaces Google Forms
  - `components/EventRegistrationForm.tsx` — reusable form (name, email, phone, number of people, comments)
  - `app/register/[slug]/page.tsx` — dynamic registration pages
  - Three registration pages: `/register/sunday-mornings`, `/register/family-night`, `/register/volunteer`
  - Posts to `/api/register` → Supabase + Google Sheets "Registrations" tab

- **Homepage "First time here?" banner** — prominent link to `/visit` between hero and mission sections
- **"Visit" link in navbar** — second item after Home
- **"Plan Your Visit" link in footer** — first item in Navigate section
- **Visitor banner responsive CSS** — stacks vertically on mobile

- **Google Sheets spreadsheet** — "Citychurch Form Submissions" with tabs: Visitors, Contacts, Subscribers, Registrations
  - Spreadsheet ID: `10Fm3rkvzCEn6bv6SNIyZFjjG-auLoVzpqP1pk0DLlEA`
  - GCP service account: `citychurch-sheets@citychurch-website-491521.iam.gserviceaccount.com`

### Changed
- **ContactForm** — refactored from `setTimeout` simulation to real `fetch('/api/contact')` with error handling
- **`/api/subscribe` route** — added Supabase upsert + Google Sheets sync while keeping existing Mailchimp integration
- **Event card registration URLs** — changed from external Google Forms links to internal `/register/[slug]` paths:
  - Sunday Mornings: `/register/sunday-mornings`
  - Family Night: `/register/family-night`
  - Volunteer: `/register/volunteer`

### Environment Variables Added (Vercel)
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_CLIENT_EMAIL`
- `GOOGLE_SHEETS_PRIVATE_KEY`

### Dependencies Added
- `googleapis` — Google Sheets API for form sync

---

## 2026-03-25 — Phases 1-3: Content, Donations, Email

### Added
- Mission-aligned copy rewrite across all pages (find, feed, teach voice)
- FundraiseUp donation integration (portal URL: aecfdssy.donorsupport.co)
- Mailchimp email signup component with `/api/subscribe` route
- $2.50 per meal framing with suggested donation tiers
- Real social media links (Facebook, Instagram, YouTube, Vimeo)
- Real contact info (email, phone, address)
- Sunday Mornings, Family Night, and Volunteer event cards with schedules
- Google Maps and Apple Maps links for all events

### Changed
- "Events" renamed to "Ministries" across all user-facing content
- DonateButton updated from `#donate` to FundraiseUp portal link

---

## 2026-03-11 — Initial Build

### Added
- Next.js 16 project with App Router and Turbopack
- Tailwind CSS v4 with custom taupe/oatmeal color palette
- Light and dark mode theming
- Supabase integration (browser + server clients)
- Vimeo hero video background
- Blog with markdown rendering and slug-based routing
- Sermon archive with video embeds
- Media gallery
- Admin dashboard layout
- Responsive design (phone, tablet, desktop, landscape)
- Scroll reveal animations
- Demo data fallbacks for development
