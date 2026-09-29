# Discipleship Training Kit Spanish Version Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the whole Discipleship Training Kit experience in Spanish at `/discipleship/es/...` with an English / Español switch, one shared approval, and bilingual access emails.

**Architecture:** A pure language layer (`lib/dtk/pages.ts` routing + `lib/dtk/i18n.ts` UI strings) drives every kit screen. Spanish kit HTML lives in `content/discipleship/es/`. Requests record a `language` column that the admin page, admin email, and invite redirect use. Supabase email templates become bilingual through dashboard edits.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase, Resend, Node 26 built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-29-discipleship-kit-spanish-design.md`

## Global Constraints

- Work on branch `feature/discipleship-kit-spanish`.
- No new npm dependencies. Commit messages carry no co-author line.
- English addresses, English wording, and English behavior do not change.
- Spanish addresses: `/discipleship/es`, `/discipleship/es/{pitfalls,training,toolkit,sources}`, `/discipleship/es/login`, `/discipleship/es/set-password`. Page slugs stay English.
- `type DtkLang = 'en' | 'es'`; anything not `'es'` is `'en'`.
- Spanish register: neutral Latin American Spanish. Kit content addresses leaders as "ustedes"; one-to-one UI text (forms, login, messages) uses "usted". No Spain-only forms ("vosotros", "ordenador").
- Build command on this machine: `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy SUPABASE_SERVICE_ROLE_KEY=dummy npm run build` (never write env values to files).
- `proxy.ts` is not changed.

## Review Focus

1. `/discipleship/es` must still resolve to the kit route even though `app/discipleship/es/` exists for login and set-password. Pinned in Task 5 Step 4 (build route list and curl checks).
2. The Supabase invite and reset templates are shared with the mission trip planner app on the same project, so the bilingual templates must name Citychurch, not the kit. Pinned in Task 7 template text.
3. The `language` column must exist in the live database before the code deploys, or every request insert fails. Pinned in Task 7 step order (migration before merge).
4. Spanish kit pages must keep the English page structure exactly (same tags and classes), or styles and the menu highlight break. Pinned in Task 3 by `lib/dtk/content.test.ts`.
5. Switching language on set-password would drop the one-time link. Set-password shows no language switch; its language comes from the address. Pinned in Task 5 code.

---

### Task 1: Language routing and UI strings

**Files:**
- Modify: `lib/dtk/pages.ts`
- Create: `lib/dtk/i18n.ts`
- Modify: `lib/dtk/pages.test.ts`
- Create: `lib/dtk/i18n.test.ts`

**Interfaces:**
- Produces:
  - `type DtkLang = 'en' | 'es'`
  - `type DtkRouteName = DtkPage | 'login' | 'set-password'`
  - `resolveDtkRoute(segments: string[] | undefined): { lang: DtkLang; page: DtkPage } | null` (replaces `resolveDtkPage`)
  - `dtkPath(lang: DtkLang, name: DtkRouteName): string`
  - `DTK_COPY: Record<DtkLang, DtkCopy>` with the keys listed in Step 5
  - `extractBody` unchanged

- [ ] **Step 1: Replace the resolver tests** in `lib/dtk/pages.test.ts`. Delete the three `resolveDtkPage` tests and the `resolveDtkPage` import, and add:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dtkPath, extractBody, resolveDtkRoute } from './pages.ts';

test('resolveDtkRoute maps English addresses', () => {
  assert.deepEqual(resolveDtkRoute(undefined), { lang: 'en', page: 'index' });
  assert.deepEqual(resolveDtkRoute([]), { lang: 'en', page: 'index' });
  for (const page of ['index', 'pitfalls', 'training', 'toolkit', 'sources']) {
    assert.deepEqual(resolveDtkRoute([page]), { lang: 'en', page });
  }
});

test('resolveDtkRoute maps Spanish addresses', () => {
  assert.deepEqual(resolveDtkRoute(['es']), { lang: 'es', page: 'index' });
  for (const page of ['index', 'pitfalls', 'training', 'toolkit', 'sources']) {
    assert.deepEqual(resolveDtkRoute(['es', page]), { lang: 'es', page });
  }
});

test('resolveDtkRoute rejects unknown, nested, cased, and traversal paths', () => {
  for (const segments of [
    ['secret'],
    ['pitfalls', 'extra'],
    ['Pitfalls'],
    ['../package'],
    ['..%2Fpackage'],
    ['pitfalls.html'],
    ['es', 'es'],
    ['ES'],
    ['es', 'secret'],
    ['es', 'pitfalls', 'extra'],
    ['en'],
  ]) {
    assert.equal(resolveDtkRoute(segments), null, segments.join('/'));
  }
});

test('dtkPath builds addresses for both languages', () => {
  assert.equal(dtkPath('en', 'index'), '/discipleship');
  assert.equal(dtkPath('en', 'pitfalls'), '/discipleship/pitfalls');
  assert.equal(dtkPath('en', 'login'), '/discipleship/login');
  assert.equal(dtkPath('es', 'index'), '/discipleship/es');
  assert.equal(dtkPath('es', 'toolkit'), '/discipleship/es/toolkit');
  assert.equal(dtkPath('es', 'set-password'), '/discipleship/es/set-password');
});
```

Keep the two existing `extractBody` tests unchanged.

- [ ] **Step 2: Write `lib/dtk/i18n.test.ts`**

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DTK_COPY } from './i18n.ts';

test('English and Spanish copy have the same keys', () => {
  assert.deepEqual(Object.keys(DTK_COPY.es).sort(), Object.keys(DTK_COPY.en).sort());
  assert.deepEqual(Object.keys(DTK_COPY.es.heroAlt).sort(), Object.keys(DTK_COPY.en.heroAlt).sort());
});

test('signed-in messages include the email', () => {
  for (const lang of ['en', 'es'] as const) {
    assert.match(DTK_COPY[lang].gatePending('a@x.com'), /a@x\.com/);
    assert.match(DTK_COPY[lang].gateNoAccess('a@x.com'), /a@x\.com/);
  }
});
```

- [ ] **Step 3: Run tests to confirm they fail**

Run: `npm test`
Expected: FAIL (`resolveDtkRoute`/`dtkPath` not exported; `./i18n.ts` not found).

- [ ] **Step 4: Update `lib/dtk/pages.ts`** to exactly:

```ts
export const DTK_PAGES = ['index', 'pitfalls', 'training', 'toolkit', 'sources'] as const;
export type DtkPage = (typeof DTK_PAGES)[number];
export type DtkLang = 'en' | 'es';
export type DtkRouteName = DtkPage | 'login' | 'set-password';

function isDtkPage(name: string): name is DtkPage {
  return (DTK_PAGES as readonly string[]).includes(name);
}

// Maps the segments of /discipleship/[[...page]] to a language and a known
// kit page. A leading "es" selects Spanish. Anything else returns null so the
// route can 404 without touching the disk.
export function resolveDtkRoute(
  segments: string[] | undefined
): { lang: DtkLang; page: DtkPage } | null {
  const parts = segments ?? [];
  const lang: DtkLang = parts[0] === 'es' ? 'es' : 'en';
  const rest = lang === 'es' ? parts.slice(1) : parts;
  if (rest.length === 0) return { lang, page: 'index' };
  if (rest.length > 1) return null;
  return isDtkPage(rest[0]) ? { lang, page: rest[0] } : null;
}

// Address of a kit page, login, or set-password in a given language.
export function dtkPath(lang: DtkLang, name: DtkRouteName): string {
  const base = lang === 'es' ? '/discipleship/es' : '/discipleship';
  return name === 'index' ? base : `${base}/${name}`;
}

// Returns the markup between <body> and </body> of a kit page.
export function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!match) throw new Error('Kit page has no <body>');
  return match[1].trim();
}
```

- [ ] **Step 5: Write `lib/dtk/i18n.ts`** to exactly:

```ts
import type { DtkLang, DtkPage } from './pages.ts';

// Every kit UI string outside the kit HTML files, in both languages.
// English strings match what the English kit showed before Spanish existed.
export type DtkCopy = {
  pageTitle: string;
  switchLabel: string;
  heroAlt: Record<DtkPage, string>;
  gateTitle: string;
  gateIntro: string;
  gatePending: (email: string) => string;
  gateNoAccess: (email: string) => string;
  alreadyApproved: string;
  logIn: string;
  formName: string;
  formEmail: string;
  formNote: string;
  formSubmit: string;
  formSending: string;
  formReceived: string;
  formGenericError: string;
  errName: string;
  errEmail: string;
  errTooLong: string;
  loginTitle: string;
  loginPassword: string;
  loginSigningIn: string;
  loginFailed: string | null;
  forgotPassword: string;
  forgotNeedEmail: string;
  forgotSent: string;
  setTitle: string;
  setChecking: string;
  setNewPassword: string;
  setSave: string;
  setSaving: string;
  setTooShort: string;
  setExpired: string;
  setResetLink: string;
};

export const DTK_COPY: Record<DtkLang, DtkCopy> = {
  en: {
    pageTitle: 'Discipleship Training Kit | Citychurch',
    switchLabel: 'Language',
    heroAlt: {
      index: 'A small group of adults sitting in a circle with open Bibles, listening as one woman speaks',
      pitfalls: 'A small group around a table listening closely as one man shares, a friend’s hand on his shoulder',
      training: 'Group leaders around a table with Bibles and notebooks as one woman leads the discussion',
      toolkit: 'Three women praying together with joined hands beside an open Bible',
      sources: 'Hands resting on open Bibles and notebooks across a wooden table',
    },
    gateTitle: 'Discipleship Training Kit',
    gateIntro:
      'Training for launching discipleship groups among our staff and volunteers: common pitfalls, a six-session training plan, and a weekly group toolkit. Access is by approval.',
    gatePending: (email) => `You're signed in as ${email}. Your request is waiting for approval.`,
    gateNoAccess: (email) => `You're signed in as ${email}, but this account doesn't have access yet.`,
    alreadyApproved: 'Already approved?',
    logIn: 'Log in',
    formName: 'Name',
    formEmail: 'Email',
    formNote: 'Note (optional)',
    formSubmit: 'Request access',
    formSending: 'Sending...',
    formReceived: 'Request received. An admin will review it.',
    formGenericError: 'Something went wrong. Please try again.',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email address.',
    errTooLong: 'Your name or note is too long.',
    loginTitle: 'Discipleship Training Kit login',
    loginPassword: 'Password',
    loginSigningIn: 'Signing in...',
    loginFailed: null,
    forgotPassword: 'Forgot password?',
    forgotNeedEmail: 'Enter your email above, then click "Forgot password?" again.',
    forgotSent: 'Check your email for a link to set a new password.',
    setTitle: 'Set your password',
    setChecking: 'Checking your link...',
    setNewPassword: 'New password',
    setSave: 'Save password',
    setSaving: 'Saving...',
    setTooShort: 'Use at least 8 characters.',
    setExpired:
      'This link is invalid or has expired. Use "Forgot password?" on the login page to get a new one.',
    setResetLink:
      'This reset link didn\'t work. Open it in the same browser where you clicked "Forgot password?", or request a new one there.',
  },
  es: {
    pageTitle: 'Kit de Capacitación en Discipulado | Citychurch',
    switchLabel: 'Idioma',
    heroAlt: {
      index: 'Un grupo pequeño de adultos sentados en círculo con sus Biblias abiertas, escuchando a una mujer que habla',
      pitfalls: 'Un grupo pequeño alrededor de una mesa escuchando con atención a un hombre que comparte, con la mano de una amiga sobre su hombro',
      training: 'Líderes de grupo alrededor de una mesa con Biblias y cuadernos mientras una mujer dirige la conversación',
      toolkit: 'Tres mujeres orando juntas tomadas de las manos junto a una Biblia abierta',
      sources: 'Manos sobre Biblias abiertas y cuadernos en una mesa de madera',
    },
    gateTitle: 'Kit de Capacitación en Discipulado',
    gateIntro:
      'Capacitación para lanzar grupos de discipulado entre nuestro personal y voluntarios: errores comunes, un plan de capacitación de seis sesiones y herramientas para el grupo semanal. El acceso requiere aprobación.',
    gatePending: (email) => `Inició sesión como ${email}. Su solicitud está esperando aprobación.`,
    gateNoAccess: (email) => `Inició sesión como ${email}, pero esta cuenta todavía no tiene acceso.`,
    alreadyApproved: '¿Ya tiene acceso?',
    logIn: 'Iniciar sesión',
    formName: 'Nombre',
    formEmail: 'Correo electrónico',
    formNote: 'Nota (opcional)',
    formSubmit: 'Solicitar acceso',
    formSending: 'Enviando...',
    formReceived: 'Solicitud recibida. Un administrador la revisará.',
    formGenericError: 'Algo salió mal. Inténtelo de nuevo.',
    errName: 'Escriba su nombre.',
    errEmail: 'Escriba un correo electrónico válido.',
    errTooLong: 'Su nombre o nota es demasiado largo.',
    loginTitle: 'Iniciar sesión en el Kit de Capacitación en Discipulado',
    loginPassword: 'Contraseña',
    loginSigningIn: 'Iniciando sesión...',
    loginFailed: 'El correo electrónico o la contraseña no son correctos.',
    forgotPassword: '¿Olvidó su contraseña?',
    forgotNeedEmail: 'Escriba su correo electrónico arriba y vuelva a hacer clic en "¿Olvidó su contraseña?".',
    forgotSent: 'Revise su correo electrónico. Le enviamos un enlace para crear una nueva contraseña.',
    setTitle: 'Cree su contraseña',
    setChecking: 'Revisando su enlace...',
    setNewPassword: 'Nueva contraseña',
    setSave: 'Guardar contraseña',
    setSaving: 'Guardando...',
    setTooShort: 'Use al menos 8 caracteres.',
    setExpired:
      'Este enlace no es válido o ya venció. Use "¿Olvidó su contraseña?" en la página de inicio de sesión para recibir uno nuevo.',
    setResetLink:
      'Este enlace para restablecer la contraseña no funcionó. Ábralo en el mismo navegador donde hizo clic en "¿Olvidó su contraseña?", o solicite uno nuevo allí.',
  },
};
```

`loginFailed` is `null` in English so English keeps showing Supabase's own message, exactly as before.

- [ ] **Step 6: Run tests to confirm they pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add lib/dtk/pages.ts lib/dtk/pages.test.ts lib/dtk/i18n.ts lib/dtk/i18n.test.ts
git commit -m "Add kit language routing and Spanish UI strings"
```

Note: `app/discipleship/[[...page]]/page.tsx` still imports `resolveDtkPage` until Task 4, so `tsc` fails between Task 1 and Task 4. Tasks 1 to 4 are reviewed in order; `tsc` is required green from Task 4 on.

---

### Task 2: Request language, database column, and admin email

**Files:**
- Modify: `lib/dtk/request.ts`
- Modify: `lib/dtk/request.test.ts`
- Create: `supabase/migrations/20260930000000_dtk_access_requests_language.sql`
- Modify: `lib/dtk/notify.ts`

**Interfaces:**
- Consumes: `DtkLang` (Task 1), `DTK_COPY` (Task 1)
- Produces: `DtkRequestInput = { name: string; email: string; note: string | null; language: DtkLang }`. `validateDtkRequest` reads `lang` from the body and returns errors in that language. The API route (unchanged) upserts `result.value`, so `language` is saved.

- [ ] **Step 1: Update tests** in `lib/dtk/request.test.ts`. Replace the first test's expected value and add Spanish tests:

```ts
test('valid request is trimmed and email lowercased', () => {
  const result = validateDtkRequest({ name: ' Jane ', email: ' Jane@Example.com ', note: ' hi ' });
  assert.deepEqual(result, {
    ok: true,
    spam: false,
    value: { name: 'Jane', email: 'jane@example.com', note: 'hi', language: 'en' },
  });
});

test('Spanish request keeps its language and gets Spanish errors', () => {
  const ok = validateDtkRequest({ name: 'Ana', email: 'ana@example.com', lang: 'es' });
  assert.equal(ok.ok && ok.value.language, 'es');
  assert.deepEqual(validateDtkRequest({ name: '', email: 'ana@example.com', lang: 'es' }), {
    ok: false,
    error: 'Escriba su nombre.',
  });
  assert.deepEqual(validateDtkRequest({ name: 'Ana', email: 'ana', lang: 'es' }), {
    ok: false,
    error: 'Escriba un correo electrónico válido.',
  });
});

test('unknown language falls back to English', () => {
  const result = validateDtkRequest({ name: 'Jo', email: 'jo@example.com', lang: 'fr' });
  assert.equal(result.ok && result.value.language, 'en');
});
```

Keep the other existing tests; their English error strings stay the same.

- [ ] **Step 2: Run to confirm failure**

Run: `npm test`
Expected: FAIL (no `language` in value; English errors for Spanish input).

- [ ] **Step 3: Update `lib/dtk/request.ts`** to exactly:

```ts
import { normalizeEmail } from './access.ts';
import { DTK_COPY } from './i18n.ts';
import type { DtkLang } from './pages.ts';

export type DtkRequestInput = {
  name: string;
  email: string;
  note: string | null;
  language: DtkLang;
};

export type DtkRequestValidation =
  | { ok: true; spam: boolean; value: DtkRequestInput }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// `website` is a hidden honeypot field. People never fill it in; bots do.
// `lang` picks the error language and is saved with the request.
export function validateDtkRequest(body: unknown): DtkRequestValidation {
  const data = (body ?? {}) as Record<string, unknown>;
  const language: DtkLang = data.lang === 'es' ? 'es' : 'en';
  const copy = DTK_COPY[language];
  const name = text(data.name);
  const email = normalizeEmail(text(data.email));
  const note = text(data.note);

  if (!name) return { ok: false, error: copy.errName };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: copy.errEmail };
  if (name.length > 200 || note.length > 2000) {
    return { ok: false, error: copy.errTooLong };
  }

  return {
    ok: true,
    spam: text(data.website) !== '',
    value: { name, email, note: note || null, language },
  };
}
```

- [ ] **Step 4: Write the migration** `supabase/migrations/20260930000000_dtk_access_requests_language.sql`:

```sql
-- Language each kit access request was made in. Existing rows are English.
ALTER TABLE public.dtk_access_requests
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en'
  CHECK (language IN ('en', 'es'));
```

Do not apply it to any database.

- [ ] **Step 5: Update `lib/dtk/notify.ts`** so the email names the language. Replace the `subject` and `text` fields with:

```ts
        subject: `Discipleship kit access request: ${request.name}${request.language === 'es' ? ' (Spanish)' : ''}`,
        text: [
          `${request.name} (${request.email}) asked for access to the Discipleship Training Kit in ${request.language === 'es' ? 'Spanish' : 'English'}.`,
          '',
          `Note: ${request.note ?? '(none)'}`,
          '',
          'Review it at https://www.citykid.me/admin/discipleship',
        ].join('\n'),
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add lib/dtk/request.ts lib/dtk/request.test.ts lib/dtk/notify.ts supabase/migrations/20260930000000_dtk_access_requests_language.sql
git commit -m "Record request language and send Spanish form errors"
```

---

### Task 3: Spanish kit content

**Files:**
- Create: `content/discipleship/es/index.html`, `pitfalls.html`, `training.html`, `toolkit.html`, `sources.html`
- Create: `lib/dtk/content.test.ts`

**Interfaces:**
- Consumes: the English files in `content/discipleship/*.html` as the source.
- Produces: five Spanish files with the same markup structure, loaded by the kit route in Task 4.

- [ ] **Step 1: Write the structure test** `lib/dtk/content.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'content', 'discipleship');
const PAGES = ['index', 'pitfalls', 'training', 'toolkit', 'sources'];

// Tag names plus class attributes, in order. Text and href values are ignored.
function shape(html: string): string[] {
  return [...html.matchAll(/<([a-z0-9]+)(?:[^>]*?class="([^"]*)")?[^>]*>/gi)].map(
    (m) => `${m[1].toLowerCase()}${m[2] ? '.' + m[2] : ''}`
  );
}

for (const page of PAGES) {
  test(`Spanish ${page} matches the English structure`, () => {
    const en = readFileSync(path.join(DIR, `${page}.html`), 'utf8');
    const es = readFileSync(path.join(DIR, 'es', `${page}.html`), 'utf8');
    assert.deepEqual(shape(es), shape(en));
  });

  test(`Spanish ${page} is marked Spanish and links to Spanish pages`, () => {
    const es = readFileSync(path.join(DIR, 'es', `${page}.html`), 'utf8');
    assert.match(es, /<html lang="es">/);
    const kitLinks = [...es.matchAll(/href="(\/discipleship[^"]*)"/g)].map((m) => m[1]);
    assert.ok(kitLinks.length >= 5, 'menu links present');
    for (const href of kitLinks) assert.match(href, /^\/discipleship\/es(\/|$)/, href);
  });
}
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test`
Expected: FAIL (`content/discipleship/es/*.html` not found).

- [ ] **Step 3: Translate the five pages.** For each English file in `content/discipleship/`, create the Spanish file at `content/discipleship/es/<same name>.html`. Copy the file, then translate the human-readable text only. Rules:

  1. Keep every tag, attribute, and class exactly as in English, in the same order. Change `<html lang="en">` to `<html lang="es">`.
  2. Rewrite the menu links: `/discipleship` → `/discipleship/es`, and `/discipleship/<page>` → `/discipleship/es/<page>`. Rewrite any other in-text link to a kit page the same way. Leave external `https://` links unchanged.
  3. Translate: `<title>`, `<h1>`, `p.sub`, headings, paragraphs, list items, table headers and cells, the callout, `.key`, and the footer. Menu labels: Overview → Inicio, Pitfalls → Errores comunes, Training → Capacitación, Toolkit → Herramientas, Sources → Fuentes.
  4. In `.src` lines, translate "Source:" / "Sources:" to "Fuente:" / "Fuentes:" and keep each English source title (the link text) in English.
  5. Bible references use Spanish book names and the same chapter and verse (James → Santiago, Matthew → Mateo, John → Juan, Acts → Hechos, Hebrews → Hebreos, Proverbs → Proverbios, Galatians → Gálatas, Ephesians → Efesios, Colossians → Colosenses, Romans → Romanos, Luke → Lucas, Mark → Marcos, Philippians → Filipenses, 2 Timothy → 2 Timoteo, 1 John → 1 Juan, Psalm → Salmo).
  6. Numbers, times, group sizes, and session counts match the English exactly (8 to 10 → 8 a 10; 1 hour and 15 minutes → 1 hora y 15 minutos; "35 min" stays "35 min").
  7. Register: neutral Latin American Spanish; address leaders as "ustedes"; no "vosotros"; plain, warm church language. "Small group" → "grupo pequeño"; "facilitator" → "facilitador"; "early adopters" → "pioneros"; "accountability" → "rendición de cuentas"; "covenant" → "pacto"; "memory verse" → "versículo para memorizar"; "check in" in the case study → "tiempo de compartir".
  8. Fill-in blanks in the covenant (`____`) stay as they are.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all pass, including 10 content tests.

- [ ] **Step 5: Self-check for leftovers**

Run: `grep -nE ">[^<]*\b(the|and|with|your|group|meeting)\b[^<]*<" content/discipleship/es/*.html | grep -v 'class="src"' | head`
Expected: no lines outside English source-title link text. Fix any untranslated sentence found.

- [ ] **Step 6: Commit**

```bash
git add content/discipleship/es lib/dtk/content.test.ts
git commit -m "Add Spanish kit pages"
```

---

### Task 4: Kit route, gate, form, and language switch

**Files:**
- Create: `components/DtkLanguageSwitch.tsx`
- Modify: `app/discipleship/[[...page]]/page.tsx`
- Modify: `components/DtkRequestGate.tsx`
- Modify: `components/DtkRequestForm.tsx`
- Modify: `app/page.tsx` (homepage kit section)

**Interfaces:**
- Consumes: `resolveDtkRoute`, `dtkPath`, `DtkLang`, `DtkRouteName`, `DtkPage` (Task 1), `DTK_COPY` (Task 1), `getDtkViewer` (existing), Spanish content (Task 3), API accepting `lang` (Task 2).
- Produces: `<DtkLanguageSwitch lang page />`, `<DtkRequestGate lang page email status />`, `<DtkRequestForm lang defaultEmail />`.

- [ ] **Step 1: Write `components/DtkLanguageSwitch.tsx`**

```tsx
import Link from 'next/link';
import { DTK_COPY } from '@/lib/dtk/i18n';
import { dtkPath, type DtkLang, type DtkRouteName } from '@/lib/dtk/pages';

const linkStyle = (active: boolean): React.CSSProperties => ({
  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
  fontWeight: active ? 600 : 400,
  textDecoration: active ? 'none' : 'underline',
  textUnderlineOffset: '3px',
});

// "English | Español" link pair that opens the same kit page in the other language.
export default function DtkLanguageSwitch({ lang, page }: { lang: DtkLang; page: DtkRouteName }) {
  return (
    <nav
      aria-label={DTK_COPY[lang].switchLabel}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        maxWidth: '1100px',
        margin: '0 auto 1rem',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '0.875rem',
      }}
    >
      <Link href={dtkPath('en', page)} lang="en" aria-current={lang === 'en' ? 'true' : undefined} style={linkStyle(lang === 'en')}>
        English
      </Link>
      <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>|</span>
      <Link href={dtkPath('es', page)} lang="es" aria-current={lang === 'es' ? 'true' : undefined} style={linkStyle(lang === 'es')}>
        Español
      </Link>
    </nav>
  );
}
```

- [ ] **Step 2: Replace `app/discipleship/[[...page]]/page.tsx`** with:

```tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import DtkLanguageSwitch from '@/components/DtkLanguageSwitch';
import DtkRequestGate from '@/components/DtkRequestGate';
import { DTK_COPY } from '@/lib/dtk/i18n';
import { dtkPath, extractBody, resolveDtkRoute } from '@/lib/dtk/pages';
import { getDtkViewer } from '@/lib/dtk/server';
import '../dtk.css';

type Params = Promise<{ page?: string[] }>;

const CONTENT_DIR = path.join(process.cwd(), 'content', 'discipleship');

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveDtkRoute((await params).page);
  return {
    title: DTK_COPY[route?.lang ?? 'en'].pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function DiscipleshipPage({ params }: { params: Params }) {
  const route = resolveDtkRoute((await params).page);
  if (!route) notFound();
  const { lang, page } = route;

  const viewer = await getDtkViewer();
  if (!viewer.allowed) {
    return <DtkRequestGate lang={lang} page={page} email={viewer.email} status={viewer.status} />;
  }

  const file =
    lang === 'es'
      ? path.join(CONTENT_DIR, 'es', `${page}.html`)
      : path.join(CONTENT_DIR, `${page}.html`);
  const html = await readFile(file, 'utf8');
  // The kit menu comes before any other kit link in the page, so the first
  // match is the menu tab for this page.
  const href = dtkPath(lang, page);
  const body = extractBody(html).replace(
    `<a href="${href}">`,
    `<a href="${href}" aria-current="page">`
  );
  return (
    <div className="dtk" lang={lang}>
      <DtkLanguageSwitch lang={lang} page={page} />
      <div className="dtk-hero">
        <Image
          src={`/images/discipleship/${page}.webp`}
          alt={DTK_COPY[lang].heroAlt[page]}
          width={2000}
          height={858}
          priority
          sizes="(max-width: 1100px) 100vw, 1100px"
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
```

- [ ] **Step 3: Replace `components/DtkRequestGate.tsx`** with:

```tsx
import Link from 'next/link';
import DtkLanguageSwitch from '@/components/DtkLanguageSwitch';
import DtkRequestForm from '@/components/DtkRequestForm';
import type { DtkRequestStatus } from '@/lib/dtk/access';
import { DTK_COPY } from '@/lib/dtk/i18n';
import { dtkPath, type DtkLang, type DtkPage } from '@/lib/dtk/pages';

export default function DtkRequestGate({
  lang,
  page,
  email,
  status,
}: {
  lang: DtkLang;
  page: DtkPage;
  email: string | null;
  status: DtkRequestStatus | null;
}) {
  const copy = DTK_COPY[lang];
  return (
    <main lang={lang} style={{ maxWidth: '40rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <DtkLanguageSwitch lang={lang} page={page} />
      <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{copy.gateTitle}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{copy.gateIntro}</p>

      {email && (
        <p style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {status === 'pending' ? copy.gatePending(email) : copy.gateNoAccess(email)}
        </p>
      )}

      {status !== 'pending' && <DtkRequestForm lang={lang} defaultEmail={email ?? ''} />}

      <p style={{ marginTop: '1.5rem' }}>
        {copy.alreadyApproved}{' '}
        <Link href={dtkPath(lang, 'login')} style={{ color: 'var(--accent)' }}>
          {copy.logIn}
        </Link>
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Update `components/DtkRequestForm.tsx`.**
  - Change the signature to `export default function DtkRequestForm({ lang, defaultEmail }: { lang: DtkLang; defaultEmail: string })` and add `const copy = DTK_COPY[lang];` as its first line.
  - Add imports: `import { DTK_COPY } from '@/lib/dtk/i18n';` and `import type { DtkLang } from '@/lib/dtk/pages';`.
  - Add `<input type="hidden" name="lang" value={lang} />` as the first child of the `<form>`.
  - Replace every hardcoded string with its copy key: `'Something went wrong. Please try again.'` → `copy.formGenericError` (both places), `Request received. An admin will review it.` → `{copy.formReceived}`, `Name` → `{copy.formName}`, `Email` → `{copy.formEmail}`, `Note (optional)` → `{copy.formNote}`, `'Sending...'` → `copy.formSending`, `'Request access'` → `copy.formSubmit`. The honeypot label `Website` stays.

- [ ] **Step 5: Homepage link.** In `app/page.tsx`, inside the `{/* DISCIPLESHIP TRAINING KIT */}` section, replace the single `<Link href="/discipleship" ...>Open the kit →</Link>` with:

```tsx
          <p style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', margin: 0 }}>
            <Link href="/discipleship" className="nav-link" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Open the kit →
            </Link>
            <Link href="/discipleship/es" lang="es" className="nav-link" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              En español →
            </Link>
          </p>
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit -p . && npx eslint app/discipleship components/Dtk*.tsx app/page.tsx && npm test && NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy SUPABASE_SERVICE_ROLE_KEY=dummy npm run build`
Expected: all pass. Then confirm tracing: `grep -o 'content/discipleship/es/[a-z]*\.html' ".next/server/app/discipleship/[[...page]]/page.js.nft.json" | sort -u` lists all five Spanish files.

- [ ] **Step 7: Commit**

```bash
git add components/DtkLanguageSwitch.tsx "app/discipleship/[[...page]]/page.tsx" components/DtkRequestGate.tsx components/DtkRequestForm.tsx app/page.tsx
git commit -m "Serve Spanish kit pages and gate with a language switch"
```

---

### Task 5: Spanish login and set-password

**Files:**
- Create: `components/DtkLoginForm.tsx` (logic moved from `app/discipleship/login/page.tsx`)
- Create: `components/DtkSetPasswordForm.tsx` (logic moved from `app/discipleship/set-password/page.tsx`)
- Modify: `app/discipleship/login/page.tsx`
- Modify: `app/discipleship/set-password/page.tsx`
- Create: `app/discipleship/es/login/page.tsx`
- Create: `app/discipleship/es/set-password/page.tsx`

**Interfaces:**
- Consumes: `DTK_COPY`, `dtkPath`, `DtkLang` (Task 1), `DtkLanguageSwitch` (Task 4).
- Produces: `<DtkLoginForm lang />`, `<DtkSetPasswordForm lang />`; routes `/discipleship/es/login`, `/discipleship/es/set-password`.

- [ ] **Step 1: Create `components/DtkLoginForm.tsx`.** Move the entire current contents of `app/discipleship/login/page.tsx` into it, then:
  - Rename the component to `DtkLoginForm` with props `{ lang }: { lang: DtkLang }`; add `const copy = DTK_COPY[lang];`.
  - Imports: add `DTK_COPY`, `dtkPath`, `type DtkLang`, and `DtkLanguageSwitch`.
  - After sign-in: `router.replace(dtkPath(lang, 'index'))`.
  - Sign-in error: `setError(copy.loginFailed ?? signInError.message)`.
  - Forgot password: `redirectTo: \`${window.location.origin}${dtkPath(lang, 'set-password')}\``; messages `copy.forgotNeedEmail` and `copy.forgotSent`; the reset error stays `resetError.message`.
  - Text: title `copy.loginTitle`, email label `copy.formEmail`, password label `copy.loginPassword`, button `copy.loginSigningIn` / `copy.logIn`, link button `copy.forgotPassword`.
  - Put `lang={lang}` on `<main>` and render `<DtkLanguageSwitch lang={lang} page="login" />` as its first child.

- [ ] **Step 2: Create `components/DtkSetPasswordForm.tsx`.** Move the entire current contents of `app/discipleship/set-password/page.tsx` into it, then:
  - Rename the component to `DtkSetPasswordForm` with props `{ lang }: { lang: DtkLang }`; add `const copy = DTK_COPY[lang];`.
  - Delete the `RESET_LINK_MESSAGE` and `EXPIRED_MESSAGE` constants; use `copy.setResetLink` and `copy.setExpired`.
  - After saving: `router.replace(dtkPath(lang, 'index'))`.
  - Text: title `copy.setTitle`, `copy.setChecking`, label `copy.setNewPassword`, `copy.setTooShort`, buttons `copy.setSaving` / `copy.setSave`.
  - Put `lang={lang}` on `<main>`. Do not add a language switch here: switching would drop the one-time link in the address.
  - Keep the `started` ref guard, `isSingleton: false`, and `detectSessionInUrl: false` exactly.

- [ ] **Step 3: Replace the four page files.**

`app/discipleship/login/page.tsx`:

```tsx
import DtkLoginForm from '@/components/DtkLoginForm';

export default function DtkLoginPage() {
  return <DtkLoginForm lang="en" />;
}
```

`app/discipleship/es/login/page.tsx`:

```tsx
import DtkLoginForm from '@/components/DtkLoginForm';

export default function DtkLoginPageEs() {
  return <DtkLoginForm lang="es" />;
}
```

`app/discipleship/set-password/page.tsx`:

```tsx
import DtkSetPasswordForm from '@/components/DtkSetPasswordForm';

export default function DtkSetPasswordPage() {
  return <DtkSetPasswordForm lang="en" />;
}
```

`app/discipleship/es/set-password/page.tsx`:

```tsx
import DtkSetPasswordForm from '@/components/DtkSetPasswordForm';

export default function DtkSetPasswordPageEs() {
  return <DtkSetPasswordForm lang="es" />;
}
```

- [ ] **Step 4: Verify routing** (Review Focus 1)

Run the checks, then the build:
`npx tsc --noEmit -p . && npx eslint app/discipleship components/Dtk*.tsx && npm test && NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy SUPABASE_SERVICE_ROLE_KEY=dummy npm run build`

Expected: the route list shows `/discipleship/[[...page]]`, `/discipleship/login`, `/discipleship/set-password`, `/discipleship/es/login`, `/discipleship/es/set-password`.

Then start the production build with `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy SUPABASE_SERVICE_ROLE_KEY=dummy npx next start -p 3100` in the background and check:

```bash
for p in /discipleship /discipleship/es /discipleship/es/pitfalls /discipleship/es/login /discipleship/es/set-password /discipleship/login; do printf "%s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100$p)"; done
for p in /discipleship/es/secret /discipleship/es/es /discipleship/en; do printf "%s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100$p)"; done
curl -s http://localhost:3100/discipleship/es | grep -o 'Solicitar acceso' | head -1
```

Expected: first six are `200`; the three rejects are `404`; the last line prints `Solicitar acceso`. Stop the server afterwards. If `/discipleship/es` returns 404, report BLOCKED with the route list; do not restructure routes on your own.

- [ ] **Step 5: Commit**

```bash
git add components/DtkLoginForm.tsx components/DtkSetPasswordForm.tsx app/discipleship/login app/discipleship/set-password app/discipleship/es
git commit -m "Add Spanish kit login and set-password pages"
```

---

### Task 6: Admin language column and invite redirect

**Files:**
- Modify: `app/admin/discipleship/page.tsx`
- Modify: `app/admin/actions.ts`

**Interfaces:**
- Consumes: `dtkPath`, `DtkLang` (Task 1); `language` column (Task 2).

- [ ] **Step 1: Admin page.** In `app/admin/discipleship/page.tsx`:
  - Add `language: DtkLang;` to `DtkRequestRow` and import `type DtkLang` from `@/lib/dtk/pages`.
  - Change the select to `'id, name, email, note, status, created_at, language'`.
  - Add a `<th style={cell}>Language</th>` after Email and a matching `<td style={cell}>{r.language === 'es' ? 'ES' : 'EN'}</td>` after the email cell.

- [ ] **Step 2: Approve redirect.** In `approveDtkRequest` in `app/admin/actions.ts`:
  - Change the first select to `'email, status, decided_at, decided_by, language'`.
  - Import `dtkPath` and `type DtkLang` from `@/lib/dtk/pages`.
  - Change the invite `redirectTo` to `` `${origin}${dtkPath((row.language as DtkLang) === 'es' ? 'es' : 'en', 'set-password')}` ``.
  - Nothing else in the action changes.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p . && npx eslint app/admin && npm test && NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy SUPABASE_SERVICE_ROLE_KEY=dummy npm run build`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add app/admin/discipleship/page.tsx app/admin/actions.ts
git commit -m "Show request language to admins and invite to the matching set-password page"
```

---

### Task 7: Go-live (controller with the user)

These steps touch live services. Stop and ask the user before each **(ask first)** step.

- [ ] **Step 1: Apply the migration (ask first)** to project `oykedxzykofrjvkbdckz`:
`supabase db query --linked --project-ref oykedxzykofrjvkbdckz -f /Users/donnielane/citychurch-next/supabase/migrations/20260930000000_dtk_access_requests_language.sql`
Verify: `select column_name, column_default from information_schema.columns where table_name='dtk_access_requests' and column_name='language'` returns one row with default `'en'::text`.

- [ ] **Step 2: Redirect URLs (user).** Supabase → Authentication → URL Configuration → Add:
```
https://www.citykid.me/discipleship/es/set-password
http://localhost:3000/discipleship/es/set-password
```

- [ ] **Step 3: Bilingual email templates (user).** Supabase → Authentication → Emails. These templates are shared with the mission trip planner, so they name Citychurch, not the kit.

**Invite user** subject: `Su invitación a Citychurch / Your Citychurch invitation`

```html
<h2>Citychurch</h2>
<p>Su solicitud fue aprobada. Haga clic en el botón para crear su contraseña.</p>
<p>Your request was approved. Click the button to set your password.</p>
<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 20px;background:#1c1917;color:#ffffff;border-radius:999px;text-decoration:none;font-weight:600">Crear contraseña / Set password</a></p>
<p style="color:#78716c;font-size:13px">Si no solicitó acceso, puede ignorar este correo.<br>If you didn't request access, you can ignore this email.</p>
```

**Reset password** subject: `Restablezca su contraseña / Reset your password`

```html
<h2>Citychurch</h2>
<p>Recibimos una solicitud para restablecer su contraseña. Abra este enlace en el mismo navegador donde la solicitó.</p>
<p>We received a request to reset your password. Open this link in the same browser where you asked for it.</p>
<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 20px;background:#1c1917;color:#ffffff;border-radius:999px;text-decoration:none;font-weight:600">Restablecer contraseña / Reset password</a></p>
<p style="color:#78716c;font-size:13px">Si no la solicitó, puede ignorar este correo.<br>If you didn't ask for this, you can ignore this email.</p>
```

- [ ] **Step 4: Local browser checks** against the live database (dev server on port 3000, real `.env.local`), with a throwaway plus-address the user controls; delete its account and row afterwards:
  1. Logged out `/discipleship/es`: Spanish gate and form; switch opens `/discipleship` in English.
  2. Submit in Spanish with a blank name: "Escriba su nombre." Submit properly: "Solicitud recibida…"; row has `language = 'es'`; admin email says "in Spanish".
  3. Admin page shows ES. Approve once: invite email arrives, bilingual.
  4. Invite link lands on `/discipleship/es/set-password` in Spanish; save password → `/discipleship/es` shows Spanish kit with Spanish menu and Spanish hero alt text; switch goes to the same English page.
  5. `/discipleship/es/login` → "¿Olvidó su contraseña?" → email → same browser → Spanish set-password → kit.
  6. Revoke → reload shows the Spanish no-access message.
  7. English kit pages, login, and gate look and read exactly as before.

- [ ] **Step 5: Spanish review (user).** A fluent Spanish-speaking leader reads the five Spanish pages and the gate, login, and set-password screens. Apply any wording changes before merge.

- [ ] **Step 6: Publish (ask first).** Push the branch, open a PR, and merge to `main` only after Step 1 is done (the code needs the `language` column). Wait for the Vercel deploy, then confirm live: `/discipleship/es` 200 with Spanish gate, `/discipleship/es/secret` 404, `/discipleship/es/login` 200.
