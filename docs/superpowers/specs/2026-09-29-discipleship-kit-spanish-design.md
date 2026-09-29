# Discipleship Training Kit: Spanish version design

Date: 2026-09-29

## Goal

Serve the Discipleship Training Kit in Spanish to Spanish-speaking staff and volunteers from Mexico and Central and South America. The whole experience is available in Spanish: the five kit pages, the request form, login, set-password, form errors, and the access emails. Access control is unchanged: one approval grants both languages.

## Decisions

| Ref | Decision |
|-----|----------|
| O17 | Everything a Spanish speaker touches is in Spanish, not only the five kit pages. |
| O19 | Supabase invite and reset emails carry both languages in one email, Spanish first. No per-user template logic. |
| Design | Spanish lives at `/discipleship/es/...` with an English / Español switch. English addresses do not change. |

## Addresses

| English | Spanish |
|---------|---------|
| `/discipleship` | `/discipleship/es` |
| `/discipleship/pitfalls` | `/discipleship/es/pitfalls` |
| `/discipleship/training` | `/discipleship/es/training` |
| `/discipleship/toolkit` | `/discipleship/es/toolkit` |
| `/discipleship/sources` | `/discipleship/es/sources` |
| `/discipleship/login` | `/discipleship/es/login` |
| `/discipleship/set-password` | `/discipleship/es/set-password` |

Page slugs stay English in both languages so the switch maps one to one. Any other path under `/discipleship/es/` returns 404.

## Language model

- `type DtkLang = 'en' | 'es'`, English default.
- `lib/dtk/pages.ts` gains `resolveDtkRoute(segments): { lang: DtkLang; page: DtkPage } | null`. `['es']` maps to Spanish index, `['es', 'pitfalls']` to Spanish pitfalls, `['pitfalls']` stays English. `resolveDtkPage` is replaced by it. Unit tests cover both languages, unknown pages, `['es', 'es']`, `['ES']`, and traversal strings.
- `lib/dtk/i18n.ts` holds every UI string used outside the kit HTML (gate, form, login, set-password, form errors, switch labels, hero alt text, page title) as `DTK_COPY[lang]`, and `dtkPath(lang, page)` for building kit links. A unit test asserts the English and Spanish dictionaries have identical keys.

## Content

- Spanish kit pages: `content/discipleship/es/{index,pitfalls,training,toolkit,sources}.html`, same structure and classes as English, with menu links rewritten to `/discipleship/es/...`.
- The kit route reads `content/discipleship/es/<page>.html` for Spanish. Hero images are shared. The rendered wrapper carries `lang="es"` so browsers and screen readers read it as Spanish.
- The output tracing include for the kit route covers `content/discipleship/**/*` so Spanish files ship.

### Translation rules

- Neutral Latin American Spanish, second person plural "ustedes", plain warm church register. Avoid Spain-only vocabulary (for example "vosotros", "ordenador").
- Bible references use Spanish book names (Santiago 1:22, Mateo 28:19).
- Source titles and link text for English-language sources stay in English; the surrounding sentence is Spanish.
- Headings, table labels, lists, callouts, footer, and the page `<h1>` and subtitle are translated. Numbers, times, and group sizes match the English exactly.
- A fluent Spanish-speaking leader reviews the text before launch. This is an operator step, not a code gate.

## Language switch

- Every kit page, the gate (request form), login, and set-password show an "English | Español" control at the top, linking to the same page in the other language. The current language is marked `aria-current`.
- The homepage kit section adds an "En español →" link to `/discipleship/es` beside "Open the kit →".

## Request form and gate

- `DtkRequestGate` and `DtkRequestForm` take `lang` and render `DTK_COPY[lang]`.
- The form posts `lang` with the request. `validateDtkRequest` accepts `lang` (`'en'` or `'es'`, anything else becomes `'en'`) and returns error messages in that language. Existing English messages are unchanged.

## Login and set-password

- Spanish pages at `app/discipleship/es/login` and `app/discipleship/es/set-password` reuse the English page logic through shared client components that take `lang`. Only wording and link targets differ.
- Spanish login redirects to `/discipleship/es` after sign-in. Spanish "Forgot password?" sets `redirectTo` to `/discipleship/es/set-password`. Spanish set-password lands on `/discipleship/es`.

## Data

Migration `supabase/migrations/<timestamp>_dtk_access_requests_language.sql`:

```sql
ALTER TABLE public.dtk_access_requests
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en'
  CHECK (language IN ('en', 'es'));
```

Existing rows become `en`. A repeat request in a different language changes nothing (the unique email rule still holds).

## Admin side

- `/admin/discipleship` shows a Language column (EN / ES).
- The admin notification email states the language: "asked in Spanish" or "asked in English".
- Approve sends the invite with `redirectTo` set to the set-password page in the request's language. The claim-first logic is unchanged.

## Emails (operator steps in Supabase)

- Redirect URLs gain `https://www.citykid.me/discipleship/es/set-password` and `http://localhost:3000/discipleship/es/set-password`.
- Authentication → Emails → Invite user and Reset password get new bilingual templates: Spanish paragraph and English paragraph, one button using `{{ .ConfirmationURL }}`. The exact template HTML and subjects are delivered in the implementation plan.

## Error handling

Unchanged from the English kit. Spanish error strings mirror the English ones, including the expired-link and same-browser reset messages.

## Testing

- Unit: `resolveDtkRoute` for both languages and rejects; `validateDtkRequest` Spanish errors and `lang` fallback; i18n dictionaries have matching keys.
- `tsc`, `eslint`, `next build`, and the route's traced files include `content/discipleship/es/*.html`.
- Browser screenshots of a Spanish kit page (desktop and phone) and the Spanish gate.
- Live checks in Spanish: request, admin sees ES and email says Spanish, approve, invite lands on Spanish set-password, set password, Spanish forgot password, revoke, `/discipleship/es/secret` returns 404.

## Out of scope

- Spanish for the rest of citykid.me.
- Auto-detecting browser language or remembering the chosen language.
- Per-user email language (O20).
- Translated page slugs (for example `/es/errores`).
