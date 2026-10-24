# Build Plan — Sermons & Ministries

This plan adds two features to citychurch-next while honoring the existing design system (inline-style CSS vars, Inter + Source Serif 4 fonts, `.reveal` / `.card-hover` patterns, hero/section rhythm at `6rem 1.5rem`):

1. **Sermons** — public list, detail page with autoplaying Vimeo embed, inline transcript, downloadable branded PDF, and a working Supabase-backed admin CRUD.
2. **Ministries showcase** — extends the existing `/ministries` (How We Help) page with a new "Main Ministry Efforts" section using TODO placeholders.

---

## Locked-in decisions

| Decision | Choice |
|---|---|
| Ministries strategy | **Merge** — extend existing `/ministries` with a new showcase section above (or alongside) the current programs/$2.50 content. |
| Detail-page autoplay | **Muted autoplay with "tap to unmute" overlay** (Vimeo Player.js, already a dependency). |
| Transcript & PDF | **Paste markdown transcript in admin** → render inline with `react-markdown` → generate branded PDF on-the-fly via `@react-pdf/renderer` server route. |
| Vimeo thumbnails | **Auto-fetch from Vimeo oEmbed** (`https://vimeo.com/api/oembed.json?url=…`) on admin save. No auth required. |
| Scope | **Full stack** — public pages read from Supabase, admin is real CRUD, transcript & thumbnail handling is end-to-end. |
| Ministry list content | **TODO placeholders** — 5–6 scaffolded cards Donnie fills in later. |

### Defaults I picked (override anytime)

- **Sermon URL**: `/sermons/[slug]` — slug auto-generated from title + date (e.g. `protection-and-purity-of-marriage-2026-03-09`). Matches existing blog pattern.
- **List-card description**: auto-truncated from full `description` (~140 chars, word-boundary safe). No separate `short_description` column.
- **Series filter / search**: deferred to v1.1.

---

## Sitemap impact

```
/sermons              (existing — rebuild as list reading from Supabase)
/sermons/[slug]       (new — detail page: video, full description, transcript, PDF link)
/api/sermons/[slug]/transcript.pdf   (new — server route streaming a branded PDF)
/api/admin/sermons    (new — admin CRUD endpoints; alternatively use Supabase client directly from auth-gated admin page)
/admin/sermons        (existing — replace stubbed demo state with real Supabase CRUD)
/ministries           (existing — add new "Main Ministry Efforts" showcase section)
```

---

## Data model

The `sermons` table already exists (`supabase/schema.sql:24`). We need a new migration that **adds** the following columns — non-destructive, defaults included:

```sql
-- supabase/migrations/2026XXXX_sermons_detail_fields.sql

ALTER TABLE sermons
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS vimeo_id TEXT,                -- parsed from video_url (e.g. "1172206088")
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,           -- from Vimeo oEmbed
  ADD COLUMN IF NOT EXISTS transcript_markdown TEXT,     -- editable in admin
  ADD COLUMN IF NOT EXISTS scripture_reference TEXT,     -- optional, e.g. "Ephesians 5:21-33"
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,     -- from oEmbed
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_sermons_slug ON sermons(slug);
CREATE INDEX IF NOT EXISTS idx_sermons_published ON sermons(published);

-- Tighten public RLS so unpublished drafts stay private
DROP POLICY IF EXISTS "Public can view all sermons" ON sermons;
CREATE POLICY "Public can view published sermons"
  ON sermons
  FOR SELECT
  USING (published = TRUE);
```

Update `lib/types.ts` `Sermon` interface accordingly.

---

## Dependencies to add

```json
"@react-pdf/renderer": "^4.x"   // server-side PDF generation
```

Already installed and reusable:
- `@vimeo/player` — for muted-autoplay unmute overlay
- `react-markdown` + `remark-gfm` — for transcript rendering
- `@supabase/supabase-js` — DB access

---

## Build phases

### Phase 1 — Schema & types (foundation)

1. Write migration `supabase/migrations/2026XXXX_sermons_detail_fields.sql` (see SQL above).
2. Apply migration (Supabase CLI or Studio).
3. Update `lib/types.ts` `Sermon` interface with new fields.
4. Backfill any existing demo rows or skip (we'll seed via admin).

**Done when:** Local Supabase has the new columns; TypeScript compiles.

---

### Phase 2 — Vimeo oEmbed helper

1. Create `lib/vimeo.ts` exporting:
   - `parseVimeoId(url: string): string | null` — extracts the numeric ID from either `https://vimeo.com/123` or `https://player.vimeo.com/video/123?…`.
   - `fetchVimeoOEmbed(url: string): Promise<{ thumbnail_url, duration, title, description, html }>` — calls `https://vimeo.com/api/oembed.json?url=…&width=1280`.
   - `buildVimeoEmbedUrl(vimeoId, opts: { autoplay, muted, controls })` — produces a normalized `https://player.vimeo.com/video/{id}?…` URL we control.
2. No API key needed; oEmbed is public.

**Done when:** Calling `fetchVimeoOEmbed('https://vimeo.com/1172206088')` returns a thumbnail URL.

---

### Phase 3 — Public `/sermons` list page (rebuild)

Replace `app/sermons/page.tsx` (currently reads `demoSermons`) with a server component that:

1. Fetches sermons via `createServerClient()`: `select('*').eq('published', true).order('sermon_date', { ascending: false })`.
2. **Hero** — unchanged from current copy/style (`6rem 1.5rem`, gradient `var(--bg-primary) → var(--bg-muted)`, clamp font).
3. **Featured/Latest sermon** — top of list rendered as a large card with the Vimeo thumbnail at left and title/series/speaker/date/short description at right. Click → `/sermons/[slug]`.
4. **Stacked list view** — under the featured card, each subsequent sermon is a horizontal row:
   - Left: 16:9 Vimeo thumbnail (`<Image>` with `unoptimized` since Vimeo CDN), ~240px wide on desktop, full-width on mobile.
   - Right: title (`font-weight 600, 1.125rem`), `series` chip in `var(--accent)` uppercase, `speaker · date`, truncated description (~140 chars).
   - Whole row wrapped in `<Link href={\`/sermons/${slug}\`}>` with `.card-hover` class.
   - Use `border-bottom: 1px solid var(--border-color)` between rows for the stacked feel.
5. Empty state: "No sermons yet — check back Sunday" using muted-text style.
6. Use `.reveal` on each row for the existing scroll-in animation.

**Component**: extract `<SermonListRow>` into `components/SermonListRow.tsx` for reuse.

**Done when:** Visiting `/sermons` shows real sermons from Supabase in a stacked list with thumbnails.

---

### Phase 4 — Public `/sermons/[slug]` detail page

Create `app/sermons/[slug]/page.tsx` as a server component:

1. `generateStaticParams()` for ISR (mirror `app/blog/[slug]/page.tsx` pattern).
2. `generateMetadata()` — title, description, OG image = `thumbnail_url`.
3. Fetch sermon by slug; 404 if not found or unpublished.
4. Layout:
   - **Section 1 — Video block** (`6rem 1.5rem`, `var(--bg-secondary)` background): a client component `<SermonPlayer vimeoId={...} title={...} />` (see Phase 5) for muted autoplay with unmute overlay.
   - **Section 2 — Sermon meta**: series chip, speaker · date, scripture reference, full description (max-width 780px, serif font for readability).
   - **Section 3 — Transcript** (`var(--bg-primary)`):
     - Heading: "Transcript" with download button (anchor → `/api/sermons/[slug]/transcript.pdf`, `download` attribute, accent-colored, matches existing CTA style).
     - Body: `<ReactMarkdown remarkPlugins={[remarkGfm]}>` rendering `transcript_markdown` inside a `prose`-style wrapper (font-family Source Serif 4 for body, 1.0625rem, line-height 1.7 to match blog detail).
     - If no transcript yet: muted "Transcript will be posted shortly." message; hide download button.
   - **Section 4 — Related/Recent sermons**: 3 most recent other sermons from the same series, fallback to most recent overall. Reuse `<SermonListRow>` in a compact 3-col grid.
   - **Section 5 — Back-to-all CTA**.

**Done when:** Navigating `/sermons/protection-and-purity-of-marriage-2026-03-09` shows the video, description, transcript, and a working PDF download button.

---

### Phase 5 — `<SermonPlayer>` client component (muted autoplay + unmute)

Create `components/SermonPlayer.tsx` (`"use client"`):

1. Render an iframe with `src = buildVimeoEmbedUrl(vimeoId, { autoplay: 1, muted: 1, controls: 1 })`.
2. On mount, attach `@vimeo/player`'s `Player` to the iframe.
3. Overlay a translucent button in the top-right of the embed: "🔊 Tap to unmute" (use existing button styling — no emoji unless Donnie wants it; default to text label only).
4. On click: `player.setMuted(false).then(() => player.setVolume(1))` and hide overlay.
5. Auto-hide overlay after the user has unmuted, or if the user pauses/seeks (interaction has happened — sound should already work).
6. Style the wrapper identically to existing `VideoEmbed.tsx` (aspect-ratio 16:9, rounded 12px, `var(--bg-muted)` placeholder).

**Done when:** Loading the detail page starts the video muted, with a clearly visible unmute control that works on first tap.

---

### Phase 6 — Transcript PDF route

Create `app/api/sermons/[slug]/transcript.pdf/route.ts`:

1. `GET` handler fetches the sermon by slug (server client, RLS-safe).
2. 404 if no transcript.
3. Build a PDF with `@react-pdf/renderer`:
   - Cover header: Citychurch logo/wordmark + sermon title + speaker + date + scripture reference.
   - Body: render `transcript_markdown` as styled blocks (paragraphs, headings, blockquotes). Markdown → react-pdf is non-trivial — write a small recursive renderer or use a markdown-to-react-pdf helper. Keep it simple: split on `\n\n`, treat lines starting with `#` as headings, lines starting with `>` as blockquotes; bold/italic via inline markers.
   - Footer: page numbers + "citychurch.com" + sermon URL.
   - Use system fonts (Helvetica/Times) — registering custom fonts in `@react-pdf/renderer` is optional polish for v1.1.
4. Stream as `Response` with `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="${slug}.pdf"`.
5. Cache-Control: `public, max-age=3600, s-maxage=86400` (transcripts rarely change).

**Done when:** Hitting `/api/sermons/<slug>/transcript.pdf` downloads a clean, branded PDF in browsers.

---

### Phase 7 — Admin CRUD (`/admin/sermons`)

Replace the current stubbed `app/admin/sermons/page.tsx`:

1. Verify auth via the same pattern used in other admin pages (check `app/admin/layout.tsx` for the gating mechanism).
2. Page is a server component fetching all sermons (`order by sermon_date desc`).
3. Render the same table styling as the current stubbed page, but each row's Edit/Delete buttons hit real Supabase via a client component.
4. Extract the form into `components/SermonForm.tsx` (`"use client"`) with fields:
   - Title, Speaker, Series, Sermon Date
   - Vimeo URL — on blur, hit a server action `previewVimeo(url)` that parses the ID and fetches oEmbed → shows preview thumbnail + duration inline.
   - Description (textarea)
   - Scripture reference
   - Transcript markdown (large textarea; optionally a tabbed "Preview" using `react-markdown`).
   - Featured (checkbox)
   - Published (checkbox)
5. Server action `saveSermon(formData)`:
   - Parse Vimeo ID, fetch oEmbed, derive `thumbnail_url`, `duration_seconds`.
   - Generate slug from title + date (slugify, lowercase, hyphens). On collision, append `-2`, `-3`.
   - Upsert into `sermons` table using `lib/supabase-admin.ts` (service-role client).
   - `revalidatePath('/sermons')` and `revalidatePath(\`/sermons/\${slug}\`)`.
6. Server action `deleteSermon(id)` with confirm dialog.

**Done when:** Donnie can sign into `/admin/sermons`, paste a Vimeo URL, hit save, and immediately see the new sermon on `/sermons` and `/sermons/<slug>`.

---

### Phase 8 — Ministries showcase section

Extend `app/ministries/page.tsx` (do not replace existing content):

1. **Insert a new section between the hero and the existing "Our Programs · Find. Feed. Teach." grid** — so the page reads: Hero → New ministry showcase → Find/Feed/Teach programs → $2.50 → Volunteer → CTA.

   *Alternative ordering:* if the new showcase should be the primary identity of the page, put it **immediately after** the hero and **rename** the existing "Our Programs" section to a sub-heading like "How We Show Up Each Week." Decide with Donnie before coding.

2. New section uses `SectionHeader label="Our Ministries" title="Where We Show Up"` (or similar — copy TBD).
3. Grid of 5–6 ministry cards (`repeat(auto-fit, minmax(280px, 1fr))`). Each card has:
   - Icon (text glyph like the existing programs section, or a small SVG)
   - Title
   - Short description (3–4 lines)
   - Optional "Learn more →" link (can point to `/contact` or `#` until each gets its own page)
4. Cards use existing `.card-hover` class + the same `var(--bg-card)` / `var(--border-color)` / `12px` radius style as the rest of the site.
5. **Placeholder content** (Donnie to fill in):
   - `TODO: Ministry 1 — name + 3-line description`
   - `TODO: Ministry 2 …`
   - …
6. v1.1 idea: each ministry gets its own subpage `/ministries/[slug]` with photos and contact CTA. Not in v1.

**Done when:** `/ministries` shows the new showcase section, the existing $2.50/meal + volunteer content is intact, and the page reads coherently top to bottom.

---

### Phase 9 — Navigation & polish

1. Confirm `/sermons` is in the main `Navbar.tsx` (it should be — verify).
2. Add "Latest Sermon" tile to the homepage (`app/page.tsx`) if not already there — optional polish, can defer.
3. Smoke-test:
   - List page loads under 1s on cold cache.
   - Detail page autoplays muted; unmute button works on Chrome, Safari, Firefox, iOS Safari.
   - PDF downloads cleanly and is readable on mobile and desktop PDF viewers.
   - Admin save → public visibility under 5s (revalidation works).
   - 404 path: `/sermons/nonexistent` returns the not-found UI gracefully.
4. Run `npm run lint`. Fix any new warnings.

---

## File-level checklist

```
NEW   supabase/migrations/2026XXXX_sermons_detail_fields.sql
EDIT  lib/types.ts                                       (Sermon interface)
NEW   lib/vimeo.ts                                       (parse + oEmbed helpers)
EDIT  app/sermons/page.tsx                               (real DB + stacked list)
NEW   app/sermons/[slug]/page.tsx                        (detail page)
NEW   app/api/sermons/[slug]/transcript.pdf/route.ts     (PDF stream)
NEW   components/SermonListRow.tsx                       (reusable row)
NEW   components/SermonPlayer.tsx                        (muted autoplay + unmute)
NEW   components/SermonForm.tsx                          (admin form)
EDIT  app/admin/sermons/page.tsx                         (real CRUD)
EDIT  app/ministries/page.tsx                            (showcase section)
EDIT  package.json                                       (+ @react-pdf/renderer)
```

---

## Out of scope (v1.1+)

- Series filter / search on `/sermons`
- Series landing pages (`/sermons/series/[name]`)
- `/ministries/[slug]` subpages
- Custom fonts in the PDF (register Inter/Source Serif 4 with `@react-pdf/renderer`)
- Vimeo Showcase / playlist auto-sync (could replace manual admin entry later)
- Sermon notes upload (separate PDF resource per sermon)
- Audio-only podcast feed derived from sermons

---

## Open questions to confirm before/during build

1. **Section ordering on `/ministries`** — should the new showcase be above or below the existing "Find. Feed. Teach." programs grid? (See Phase 8 step 1.)
2. **Auth** — confirm the existing `/admin` auth gate is suitable, or do you want an extra check on the sermon CRUD actions specifically?
3. **PDF branding** — do you have a wordmark/logo SVG to use in the PDF header? If not, plain-text "Citychurch" for v1.
4. **Sermon detail back-link** — back to `/sermons` only, or also a "next/previous sermon" pair at the bottom?

---

## Suggested execution order

If you green-light this, I'd execute Phases 1 → 2 → 7 first (so you can add real sermon data immediately), then 3 → 4 → 5 → 6 (public reading experience built on top of real data), then 8 (Ministries showcase, independent of sermons), then 9 (polish). Phase 8 can also run in parallel with 3–6 since it touches different files.
