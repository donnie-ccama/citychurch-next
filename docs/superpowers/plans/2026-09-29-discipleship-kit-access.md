# Discipleship Training Kit Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the Discipleship Training Kit at `/discipleship` to admin-approved users only, with a public request form and an admin approval page.

**Architecture:** Kit HTML lives in `content/discipleship/` (never served directly). A Next.js server route checks the Supabase session plus a `dtk_access_requests` row before reading and rendering a kit page. Requests are saved through an API route with the service role client. Admins approve on `/admin/discipleship`, which invites the user through Supabase Auth.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Resend REST API, Node 26 built-in test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-09-29-discipleship-kit-access-design.md`

## Global Constraints

- Work on branch `feature/discipleship-kit`.
- No new npm dependencies.
- Emails are stored and compared lowercase and trimmed everywhere.
- Admin list comes from `ADMIN_EMAILS` (fallback `ADMIN_EMAIL`), comma-separated. An empty list grants admin to no one.
- Resend sender stays `Citychurch <onboarding@resend.dev>`.
- `proxy.ts` is not changed.
- Commit messages carry no co-author line.
- Kit page names allowed: `index`, `pitfalls`, `training`, `toolkit`, `sources`.

## Review Focus

1. Mixed-case or padded email (`" Jane@Example.com "`) on the request form must match the same person's login. Pinned in Task 2 tests.
2. Path tricks like `/discipleship/..%2Fpackage` or `/discipleship/Pitfalls` must 404, never read another file. Pinned in Task 1 tests.
3. Empty `ADMIN_EMAILS` must not make every logged-in user a kit admin. Pinned in Task 2 tests.
4. Submitting the same email twice must not email admins twice or create a second row. Pinned in Task 3 by the unique `email` column and in Task 8 browser check 9.
5. An expired or reused invite link must show a clear "get a new link" message, not a blank page. Pinned in Task 5 and Task 8 browser check 10.

---

### Task 1: Test runner and kit page resolver

**Files:**
- Modify: `package.json` (scripts)
- Modify: `tsconfig.json` (compilerOptions)
- Create: `lib/dtk/pages.ts`
- Test: `lib/dtk/pages.test.ts`

**Interfaces:**
- Produces: `DTK_PAGES`, `type DtkPage`, `resolveDtkPage(segments: string[] | undefined): DtkPage | null`, `extractBody(html: string): string`

- [ ] **Step 1: Add the test script and allow `.ts` import extensions**

In `package.json` `scripts`, add after `"lint": "eslint"`:

```json
    "lint": "eslint",
    "test": "node --test \"lib/**/*.test.ts\""
```

In `tsconfig.json` `compilerOptions`, add (safe because `noEmit` is already `true`):

```json
    "allowImportingTsExtensions": true,
```

- [ ] **Step 2: Write the failing test** at `lib/dtk/pages.test.ts`

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDtkPage, extractBody } from './pages.ts';

test('resolveDtkPage maps no segments to index', () => {
  assert.equal(resolveDtkPage(undefined), 'index');
  assert.equal(resolveDtkPage([]), 'index');
});

test('resolveDtkPage accepts every known page', () => {
  for (const name of ['index', 'pitfalls', 'training', 'toolkit', 'sources']) {
    assert.equal(resolveDtkPage([name]), name);
  }
});

test('resolveDtkPage rejects unknown, nested, cased, and traversal paths', () => {
  assert.equal(resolveDtkPage(['secret']), null);
  assert.equal(resolveDtkPage(['pitfalls', 'extra']), null);
  assert.equal(resolveDtkPage(['Pitfalls']), null);
  assert.equal(resolveDtkPage(['../package']), null);
  assert.equal(resolveDtkPage(['..%2Fpackage']), null);
  assert.equal(resolveDtkPage(['pitfalls.html']), null);
});

test('extractBody returns the markup inside body', () => {
  const html = '<html><head><title>x</title></head><body class="a">\n<main><p>Hi</p></main>\n</body></html>';
  assert.equal(extractBody(html), '<main><p>Hi</p></main>');
});

test('extractBody throws when there is no body', () => {
  assert.throws(() => extractBody('<p>no body</p>'), /no <body>/);
});
```

- [ ] **Step 3: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL with `Cannot find module` for `./pages.ts`.

- [ ] **Step 4: Write `lib/dtk/pages.ts`**

```ts
export const DTK_PAGES = ['index', 'pitfalls', 'training', 'toolkit', 'sources'] as const;
export type DtkPage = (typeof DTK_PAGES)[number];

// Maps the segments of /discipleship/[[...page]] to a known kit page.
// Anything else returns null so the route can 404 without touching the disk.
export function resolveDtkPage(segments: string[] | undefined): DtkPage | null {
  if (!segments || segments.length === 0) return 'index';
  if (segments.length > 1) return null;
  const name = segments[0];
  return (DTK_PAGES as readonly string[]).includes(name) ? (name as DtkPage) : null;
}

// Returns the markup between <body> and </body> of a kit page.
export function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!match) throw new Error('Kit page has no <body>');
  return match[1].trim();
}
```

- [ ] **Step 5: Run tests to confirm they pass**

Run: `npm test`
Expected: 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json lib/dtk/pages.ts lib/dtk/pages.test.ts
git commit -m "Add kit page resolver and node test runner"
```

---

### Task 2: Access rules and request validation

**Files:**
- Create: `lib/dtk/access.ts`
- Create: `lib/dtk/request.ts`
- Test: `lib/dtk/access.test.ts`
- Test: `lib/dtk/request.test.ts`

**Interfaces:**
- Produces:
  - `type DtkRequestStatus = 'pending' | 'approved' | 'denied'`
  - `normalizeEmail(email: string): string`
  - `parseAdminEmails(raw: string | undefined): string[]`
  - `canViewDtk(email: string | null | undefined, adminEmails: string[], status: DtkRequestStatus | null): boolean`
  - `type DtkRequestInput = { name: string; email: string; note: string | null }`
  - `validateDtkRequest(body: unknown): { ok: true; spam: boolean; value: DtkRequestInput } | { ok: false; error: string }`

- [ ] **Step 1: Write the failing tests**

`lib/dtk/access.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canViewDtk, normalizeEmail, parseAdminEmails } from './access.ts';

test('normalizeEmail trims and lowercases', () => {
  assert.equal(normalizeEmail('  Jane@Example.COM '), 'jane@example.com');
});

test('parseAdminEmails splits, trims, lowercases, drops blanks', () => {
  assert.deepEqual(parseAdminEmails(' A@x.com, ,b@X.com '), ['a@x.com', 'b@x.com']);
  assert.deepEqual(parseAdminEmails(undefined), []);
  assert.deepEqual(parseAdminEmails(''), []);
});

test('admins can view regardless of request status', () => {
  assert.equal(canViewDtk('Admin@x.com', ['admin@x.com'], null), true);
});

test('only approved requests grant access', () => {
  assert.equal(canViewDtk('u@x.com', [], 'approved'), true);
  assert.equal(canViewDtk('u@x.com', [], 'pending'), false);
  assert.equal(canViewDtk('u@x.com', [], 'denied'), false);
  assert.equal(canViewDtk('u@x.com', [], null), false);
});

test('no email means no access, even with an empty admin list', () => {
  assert.equal(canViewDtk(null, [], null), false);
  assert.equal(canViewDtk('', [], null), false);
  assert.equal(canViewDtk(undefined, [], 'approved'), false);
});
```

`lib/dtk/request.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDtkRequest } from './request.ts';

test('valid request is trimmed and email lowercased', () => {
  const result = validateDtkRequest({ name: ' Jane ', email: ' Jane@Example.com ', note: ' hi ' });
  assert.deepEqual(result, { ok: true, spam: false, value: { name: 'Jane', email: 'jane@example.com', note: 'hi' } });
});

test('empty note becomes null', () => {
  const result = validateDtkRequest({ name: 'Jane', email: 'jane@example.com', note: '   ' });
  assert.equal(result.ok && result.value.note, null);
});

test('missing name or bad email is rejected', () => {
  assert.deepEqual(validateDtkRequest({ name: '', email: 'jane@example.com' }), { ok: false, error: 'Please enter your name.' });
  assert.deepEqual(validateDtkRequest({ name: 'Jane', email: 'jane' }), { ok: false, error: 'Please enter a valid email address.' });
  assert.deepEqual(validateDtkRequest(null), { ok: false, error: 'Please enter your name.' });
});

test('overly long fields are rejected', () => {
  const result = validateDtkRequest({ name: 'J', email: 'j@x.com', note: 'x'.repeat(2001) });
  assert.deepEqual(result, { ok: false, error: 'Your name or note is too long.' });
});

test('filled honeypot is flagged as spam', () => {
  const result = validateDtkRequest({ name: 'Bot', email: 'bot@x.com', website: 'http://spam' });
  assert.equal(result.ok && result.spam, true);
});
```

- [ ] **Step 2: Run to confirm they fail**

Run: `npm test`
Expected: FAIL with `Cannot find module` for `./access.ts` and `./request.ts`.

- [ ] **Step 3: Write `lib/dtk/access.ts`**

```ts
export type DtkRequestStatus = 'pending' | 'approved' | 'denied';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Same format proxy.ts reads: a comma-separated list.
export function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? '').split(',').map(normalizeEmail).filter(Boolean);
}

// Admins always see the kit. Everyone else needs an approved request.
// An empty admin list makes no one an admin.
export function canViewDtk(
  email: string | null | undefined,
  adminEmails: string[],
  status: DtkRequestStatus | null
): boolean {
  if (!email) return false;
  if (adminEmails.includes(normalizeEmail(email))) return true;
  return status === 'approved';
}
```

- [ ] **Step 4: Write `lib/dtk/request.ts`**

```ts
import { normalizeEmail } from './access.ts';

export type DtkRequestInput = { name: string; email: string; note: string | null };

export type DtkRequestValidation =
  | { ok: true; spam: boolean; value: DtkRequestInput }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// `website` is a hidden honeypot field. People never fill it in; bots do.
export function validateDtkRequest(body: unknown): DtkRequestValidation {
  const data = (body ?? {}) as Record<string, unknown>;
  const name = text(data.name);
  const email = normalizeEmail(text(data.email));
  const note = text(data.note);

  if (!name) return { ok: false, error: 'Please enter your name.' };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (name.length > 200 || note.length > 2000) {
    return { ok: false, error: 'Your name or note is too long.' };
  }

  return { ok: true, spam: text(data.website) !== '', value: { name, email, note: note || null } };
}
```

- [ ] **Step 5: Run tests to confirm they pass**

Run: `npm test`
Expected: all tests in `pages`, `access`, `request` pass.

- [ ] **Step 6: Commit**

```bash
git add lib/dtk/access.ts lib/dtk/request.ts lib/dtk/access.test.ts lib/dtk/request.test.ts
git commit -m "Add kit access rules and request validation"
```

---

### Task 3: Database table, server helpers, and request API

**Files:**
- Create: `supabase/migrations/20260929000000_dtk_access_requests.sql`
- Create: `lib/dtk/server.ts`
- Create: `lib/dtk/notify.ts`
- Create: `app/api/discipleship/request/route.ts`

**Interfaces:**
- Consumes: `canViewDtk`, `normalizeEmail`, `parseAdminEmails`, `DtkRequestStatus` (Task 2), `validateDtkRequest`, `DtkRequestInput` (Task 2), `createAdminClient()` from `lib/supabase-admin.ts`, `createSupabaseSSR()` from `lib/supabase-ssr.ts`
- Produces:
  - `getAdminEmails(): string[]`
  - `getDtkViewer(): Promise<{ email: string | null; status: DtkRequestStatus | null; allowed: boolean }>`
  - `requireAdmin(): Promise<string>` (throws `Error('Not authorized')` for non-admins)
  - `notifyAdminsOfDtkRequest(request: DtkRequestInput, adminEmails: string[]): Promise<void>`
  - `POST /api/discipleship/request` with JSON `{ name, email, note?, website? }` → `200 { success: true }` or `400/500 { error }`

- [ ] **Step 1: Write the migration** `supabase/migrations/20260929000000_dtk_access_requests.sql`

```sql
-- Discipleship Training Kit access requests.
-- No RLS policies: only server code using the service role key reads or
-- writes this table, so anon and authenticated clients get nothing.

CREATE TABLE IF NOT EXISTS public.dtk_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE CHECK (email = lower(btrim(email))),
  note text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'denied')),
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by text
);

ALTER TABLE public.dtk_access_requests ENABLE ROW LEVEL SECURITY;
```

Note: this replaces the spec's `lower(email)` expression index with a plain `UNIQUE` column plus a lowercase `CHECK`. Same guarantee, and it lets `upsert(..., { onConflict: 'email' })` target the column.

- [ ] **Step 2: Write `lib/dtk/server.ts`**

```ts
import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { createAdminClient } from '@/lib/supabase-admin';
import {
  canViewDtk,
  normalizeEmail,
  parseAdminEmails,
  type DtkRequestStatus,
} from '@/lib/dtk/access';

export function getAdminEmails(): string[] {
  return parseAdminEmails(process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL);
}

async function getSessionEmail(): Promise<string | null> {
  const supabase = await createSupabaseSSR();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ? normalizeEmail(user.email) : null;
}

// Who is looking at /discipleship, and may they see the kit?
export async function getDtkViewer(): Promise<{
  email: string | null;
  status: DtkRequestStatus | null;
  allowed: boolean;
}> {
  const email = await getSessionEmail();
  if (!email) return { email: null, status: null, allowed: false };

  const { data } = await createAdminClient()
    .from('dtk_access_requests')
    .select('status')
    .eq('email', email)
    .maybeSingle();
  const status = (data?.status ?? null) as DtkRequestStatus | null;

  return { email, status, allowed: canViewDtk(email, getAdminEmails(), status) };
}

// Server actions run as POSTs, so they check admin rights themselves
// rather than trusting the page gate.
export async function requireAdmin(): Promise<string> {
  const email = await getSessionEmail();
  if (!email || !getAdminEmails().includes(email)) {
    throw new Error('Not authorized');
  }
  return email;
}
```

- [ ] **Step 3: Write `lib/dtk/notify.ts`**

```ts
import type { DtkRequestInput } from '@/lib/dtk/request';

// Emails the admins about a new kit request. Never throws: a failed email
// must not lose the request, which is already saved.
export async function notifyAdminsOfDtkRequest(
  request: DtkRequestInput,
  adminEmails: string[]
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || adminEmails.length === 0) return;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Citychurch <onboarding@resend.dev>',
        to: adminEmails,
        subject: `Discipleship kit access request: ${request.name}`,
        text: [
          `${request.name} (${request.email}) asked for access to the Discipleship Training Kit.`,
          '',
          `Note: ${request.note ?? '(none)'}`,
          '',
          'Review it at https://www.citykid.me/admin/discipleship',
        ].join('\n'),
      }),
    });
    if (!res.ok) {
      console.error('[DTK Notify Error]', res.status, await res.text());
    }
  } catch (err) {
    console.error('[DTK Notify Error]', err);
  }
}
```

- [ ] **Step 4: Write `app/api/discipleship/request/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { validateDtkRequest } from '@/lib/dtk/request';
import { notifyAdminsOfDtkRequest } from '@/lib/dtk/notify';
import { getAdminEmails } from '@/lib/dtk/server';

export async function POST(request: NextRequest) {
  try {
    const result = validateDtkRequest(await request.json());
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Bots get the same answer as people, but nothing is saved.
    if (result.spam) {
      return NextResponse.json({ success: true });
    }

    const { data, error } = await createAdminClient()
      .from('dtk_access_requests')
      .upsert(result.value, { onConflict: 'email', ignoreDuplicates: true })
      .select('id');

    if (error) {
      console.error('[DTK Request DB Error]', error);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    // Only a brand-new row comes back. Repeats change nothing and email no one.
    if (data && data.length > 0) {
      await notifyAdminsOfDtkRequest(result.value, getAdminEmails());
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DTK Request API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

- [ ] **Step 5: Check types and lint**

Run: `npx tsc --noEmit -p . && npx eslint lib/dtk app/api/discipleship && npm test`
Expected: no output from `tsc` and `eslint`, all tests pass.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260929000000_dtk_access_requests.sql lib/dtk/server.ts lib/dtk/notify.ts app/api/discipleship/request/route.ts
git commit -m "Add kit access table, server helpers, and request API"
```

---

### Task 4: Kit content and the gated kit route

**Files:**
- Create: `content/discipleship/index.html`, `pitfalls.html`, `training.html`, `toolkit.html`, `sources.html` (copied from the kit repo)
- Create: `app/discipleship/dtk.css`
- Create: `app/discipleship/[[...page]]/page.tsx`
- Create: `components/DtkRequestGate.tsx`
- Create: `components/DtkRequestForm.tsx`
- Modify: `next.config.ts` (add `outputFileTracingIncludes`)

**Interfaces:**
- Consumes: `resolveDtkPage`, `extractBody` (Task 1), `getDtkViewer` (Task 3), `DtkRequestStatus` (Task 2), `POST /api/discipleship/request` (Task 3)
- Produces: routes `/discipleship` and `/discipleship/<page>`; `<DtkRequestGate email status />`; `<DtkRequestForm defaultEmail />`

- [ ] **Step 1: Copy the kit pages and rewrite internal links**

```bash
DTK_SRC="$(mktemp -d)/dtk-src"
git clone -q https://github.com/donnie-ccama/discipleship-training-kit.git "$DTK_SRC"
mkdir -p content/discipleship
cp "$DTK_SRC"/{index,pitfalls,training,toolkit,sources}.html content/discipleship/
cd content/discipleship
sed -i '' \
  -e 's#href="index.html"#href="/discipleship"#g' \
  -e 's#href="pitfalls.html"#href="/discipleship/pitfalls"#g' \
  -e 's#href="training.html"#href="/discipleship/training"#g' \
  -e 's#href="toolkit.html"#href="/discipleship/toolkit"#g' \
  -e 's#href="sources.html"#href="/discipleship/sources"#g' \
  -e 's#href="\([a-z]*\)\.html\#\([^"]*\)"#href="/discipleship/\1\#\2"#g' \
  *.html
cd ../..
grep -n 'href="[a-z]*\.html' content/discipleship/*.html
```

Expected: the final `grep` prints nothing (no relative `.html` links left).

- [ ] **Step 2: Write the scoped stylesheet** `app/discipleship/dtk.css`

This is the kit's `styles.css` with every rule scoped under `.dtk`, so it cannot affect the rest of the site.

```css
.dtk { --ink:#222; --muted:#666; --accent:#7a5c3e; --line:#e5e0d8; --bg:#faf8f5; font-family: Georgia, 'Times New Roman', serif; color:var(--ink); background:var(--bg); line-height:1.6; }
.dtk * { box-sizing: border-box; }
.dtk header.site { border-bottom:1px solid var(--line); padding:2rem 1.5rem 1rem; max-width:52rem; margin:0 auto; }
.dtk header.site h1 { margin:0 0 .25rem; font-size:1.9rem; }
.dtk header.site p.sub { margin:0; color:var(--muted); font-style:italic; }
.dtk nav.site { max-width:52rem; margin:0 auto; padding:.75rem 1.5rem; border-bottom:1px solid var(--line); display:flex; gap:1.25rem; flex-wrap:wrap; font-family: -apple-system, 'Segoe UI', sans-serif; font-size:.95rem; }
.dtk nav.site a { color:var(--accent); text-decoration:none; }
.dtk nav.site a:hover { text-decoration:underline; }
.dtk main { max-width:52rem; margin:0 auto; padding:1.5rem; }
.dtk h2 { font-size:1.4rem; margin-top:2.25rem; border-bottom:1px solid var(--line); padding-bottom:.3rem; }
.dtk h3 { font-size:1.1rem; margin-top:1.75rem; }
.dtk table { border-collapse:collapse; width:100%; margin:1rem 0; font-family:-apple-system,'Segoe UI',sans-serif; font-size:.95rem; }
.dtk td, .dtk th { border:1px solid var(--line); padding:.5rem .75rem; text-align:left; vertical-align:top; }
.dtk .callout { background:#fff; border:1px solid var(--line); border-left:4px solid var(--accent); padding:1rem 1.25rem; margin:1.5rem 0; }
.dtk .callout.warn { border-left-color:#b3541e; }
.dtk .key { font-size:1.15rem; font-weight:bold; }
.dtk .src { color:var(--muted); font-size:.85rem; font-family:-apple-system,'Segoe UI',sans-serif; }
.dtk footer.site { max-width:52rem; margin:0 auto; padding:2rem 1.5rem; color:var(--muted); font-size:.85rem; border-top:1px solid var(--line); }
.dtk a { color:var(--accent); }
.dtk table { display:block; overflow-x:auto; }
```

The last two rules are additions: link color inside kit text, and horizontal scroll for wide tables on phones.

- [ ] **Step 3: Write `components/DtkRequestForm.tsx`**

```tsx
'use client';

import { useState } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkRequestForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setState('sending');

    try {
      const res = await fetch('/api/discipleship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      if (res.ok) {
        setState('sent');
        return;
      }
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Something went wrong. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setState('idle');
  }

  if (state === 'sent') {
    return (
      <p role="status" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
        Request received. An admin will review it.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        Name
        <input name="name" required maxLength={200} autoComplete="name" style={inputStyle} />
      </label>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        Email
        <input name="email" type="email" required defaultValue={defaultEmail} autoComplete="email" style={inputStyle} />
      </label>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        Note (optional)
        <textarea name="note" rows={3} maxLength={2000} style={inputStyle} />
      </label>
      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <p role="alert" style={{ color: '#b3261e', margin: 0 }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        style={{
          padding: '0.75rem 1.25rem',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: 'var(--accent)',
          color: 'white',
          fontWeight: 600,
          cursor: state === 'sending' ? 'wait' : 'pointer',
        }}
      >
        {state === 'sending' ? 'Sending...' : 'Request access'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Write `components/DtkRequestGate.tsx`**

```tsx
import Link from 'next/link';
import DtkRequestForm from '@/components/DtkRequestForm';
import type { DtkRequestStatus } from '@/lib/dtk/access';

export default function DtkRequestGate({
  email,
  status,
}: {
  email: string | null;
  status: DtkRequestStatus | null;
}) {
  return (
    <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Discipleship Training Kit</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Training for launching discipleship groups among our staff and volunteers: common
        pitfalls, a six-session training plan, and a weekly group toolkit. Access is by approval.
      </p>

      {email && (
        <p style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {status === 'pending'
            ? `You're signed in as ${email}. Your request is waiting for approval.`
            : `You're signed in as ${email}, but this account doesn't have access yet.`}
        </p>
      )}

      {status !== 'pending' && <DtkRequestForm defaultEmail={email ?? ''} />}

      <p style={{ marginTop: '1.5rem' }}>
        Already approved?{' '}
        <Link href="/discipleship/login" style={{ color: 'var(--accent)' }}>
          Log in
        </Link>
      </p>
    </main>
  );
}
```

- [ ] **Step 5: Write `app/discipleship/[[...page]]/page.tsx`**

```tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DtkRequestGate from '@/components/DtkRequestGate';
import { extractBody, resolveDtkPage } from '@/lib/dtk/pages';
import { getDtkViewer } from '@/lib/dtk/server';
import '../dtk.css';

export const metadata: Metadata = {
  title: 'Discipleship Training Kit | Citychurch',
  robots: { index: false, follow: false },
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'discipleship');

export default async function DiscipleshipPage({
  params,
}: {
  params: Promise<{ page?: string[] }>;
}) {
  const { page } = await params;
  const name = resolveDtkPage(page);
  if (!name) notFound();

  const viewer = await getDtkViewer();
  if (!viewer.allowed) {
    return <DtkRequestGate email={viewer.email} status={viewer.status} />;
  }

  const html = await readFile(path.join(CONTENT_DIR, `${name}.html`), 'utf8');
  return <div className="dtk" dangerouslySetInnerHTML={{ __html: extractBody(html) }} />;
}
```

- [ ] **Step 6: Bundle the content folder with the server function**

In `next.config.ts`, add inside `const nextConfig: NextConfig = {` right after the `turbopack` block:

```ts
  // Kit pages are read from disk at request time, so ship them with the
  // server function. They are never placed in public/.
  outputFileTracingIncludes: {
    '/discipleship/[[...page]]': ['./content/discipleship/**/*'],
  },
```

- [ ] **Step 7: Check types, lint, tests, and build**

Run: `npx tsc --noEmit -p . && npx eslint app/discipleship components/DtkRequestGate.tsx components/DtkRequestForm.tsx next.config.ts && npm test && npm run build`
Expected: all pass. The build output lists `ƒ /discipleship/[[...page]]` (dynamic).

- [ ] **Step 8: Commit**

```bash
git add content/discipleship app/discipleship components/DtkRequestGate.tsx components/DtkRequestForm.tsx next.config.ts
git commit -m "Serve the Discipleship Training Kit behind an access check"
```

---

### Task 5: Kit login and set-password pages

**Files:**
- Create: `app/discipleship/login/page.tsx`
- Create: `app/discipleship/set-password/page.tsx`

**Interfaces:**
- Consumes: `createSupabaseBrowser()` from `lib/supabase-browser.ts`
- Produces: routes `/discipleship/login` and `/discipleship/set-password`. The set-password page accepts invite links (tokens in the URL hash) and password-reset links (`?code=`).

- [ ] **Step 1: Write `app/discipleship/login/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkLoginPage() {
  const router = useRouter();
  const [supabase] = useState(createSupabaseBrowser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.replace('/discipleship');
    router.refresh();
  }

  async function handleForgotPassword() {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Enter your email above, then click "Forgot password?" again.');
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/discipleship/set-password`,
    });
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage('Check your email for a link to set a new password.');
  }

  return (
    <main style={{ maxWidth: '24rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Discipleship Training Kit login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.375rem' }}>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '0.375rem' }}>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" style={inputStyle} />
        </label>
        {error && <p role="alert" style={{ color: '#b3261e', margin: 0 }}>{error}</p>}
        {message && <p role="status" style={{ margin: 0 }}>{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '0.75rem', border: 'none', borderRadius: '6px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer' }}
        >
          {isLoading ? 'Signing in...' : 'Log in'}
        </button>
        <button
          type="button"
          onClick={handleForgotPassword}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, justifySelf: 'start' }}
        >
          Forgot password?
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 2: Write `app/discipleship/set-password/page.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const EXPIRED_MESSAGE =
  'This link is invalid or has expired. Use "Forgot password?" on the login page to get a new one.';

// Invite links arrive with tokens in the URL hash (#access_token=...).
// Password-reset links arrive with ?code=... . The default browser client
// rejects hash tokens, so this page turns off auto-detection and reads both.
function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { detectSessionInUrl: false } }
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkSetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(createClient);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function startSession() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const code = new URLSearchParams(window.location.search).get('code');
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');

      const result =
        accessToken && refreshToken
          ? await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          : code
            ? await supabase.auth.exchangeCodeForSession(code)
            : null;

      if (!result || result.error) {
        setError(EXPIRED_MESSAGE);
        return;
      }

      // Drop the tokens from the address bar.
      window.history.replaceState(null, '', window.location.pathname);
      setReady(true);
    }
    startSession();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }
    router.replace('/discipleship');
    router.refresh();
  }

  return (
    <main style={{ maxWidth: '24rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Set your password</h1>
      {!ready && !error && <p>Checking your link...</p>}
      {error && <p role="alert" style={{ color: '#b3261e' }}>{error}</p>}
      {ready && (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.375rem' }}>
            New password
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" style={inputStyle} />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: '0.75rem', border: 'none', borderRadius: '6px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer' }}
          >
            {isLoading ? 'Saving...' : 'Save password'}
          </button>
        </form>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Check types, lint, and build**

Run: `npx tsc --noEmit -p . && npx eslint app/discipleship && npm run build`
Expected: all pass. The build lists `/discipleship/login` and `/discipleship/set-password`. If ESLint's `react-hooks/set-state-in-effect` rule flags `startSession`, keep the logic and move the `setError`/`setReady` calls after an `await` (they already are), or add a single-line disable with the reason "state set after async Supabase call".

- [ ] **Step 4: Commit**

```bash
git add app/discipleship/login app/discipleship/set-password
git commit -m "Add kit login and set-password pages"
```

---

### Task 6: Admin approval page

**Files:**
- Modify: `app/admin/actions.ts` (append two actions)
- Create: `app/admin/discipleship/page.tsx`
- Modify: `components/AdminSidebar.tsx:87-89` (add nav link after Proof of Life)

**Interfaces:**
- Consumes: `requireAdmin()` (Task 3), `normalizeEmail` and `DtkRequestStatus` (Task 2), `createAdminClient()`
- Produces: `approveDtkRequest(formData: FormData): Promise<void>`, `denyDtkRequest(formData: FormData): Promise<void>`, route `/admin/discipleship`

- [ ] **Step 1: Append the actions to `app/admin/actions.ts`**

Update the imports at the top of the file to:

```ts
'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { createAdminClient } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/dtk/server';
```

Append below `signOut`:

```ts
const DTK_ADMIN_PATH = '/admin/discipleship';

function dtkAdminError(message: string): never {
  redirect(`${DTK_ADMIN_PATH}?error=${encodeURIComponent(message)}`);
}

export async function approveDtkRequest(formData: FormData) {
  const adminEmail = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const supabase = createAdminClient();

  const { data: row } = await supabase
    .from('dtk_access_requests')
    .select('email')
    .eq('id', id)
    .maybeSingle();
  if (!row) dtkAdminError('Request not found.');

  const origin = (await headers()).get('origin') ?? 'https://www.citykid.me';
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(row.email, {
    redirectTo: `${origin}/discipleship/set-password`,
  });
  // An existing account can't be invited again. That's fine: they log in
  // with the password they already have.
  if (inviteError && inviteError.code !== 'email_exists') {
    dtkAdminError(`Invite failed: ${inviteError.message}`);
  }

  const { error: updateError } = await supabase
    .from('dtk_access_requests')
    .update({ status: 'approved', decided_at: new Date().toISOString(), decided_by: adminEmail })
    .eq('id', id);
  if (updateError) dtkAdminError(`Could not save approval: ${updateError.message}`);

  revalidatePath(DTK_ADMIN_PATH);
  redirect(DTK_ADMIN_PATH);
}

export async function denyDtkRequest(formData: FormData) {
  const adminEmail = await requireAdmin();
  const id = String(formData.get('id') ?? '');

  const { error } = await createAdminClient()
    .from('dtk_access_requests')
    .update({ status: 'denied', decided_at: new Date().toISOString(), decided_by: adminEmail })
    .eq('id', id);
  if (error) dtkAdminError(`Could not save: ${error.message}`);

  revalidatePath(DTK_ADMIN_PATH);
  redirect(DTK_ADMIN_PATH);
}
```

- [ ] **Step 2: Write `app/admin/discipleship/page.tsx`**

```tsx
import { approveDtkRequest, denyDtkRequest } from '@/app/admin/actions';
import { createAdminClient } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/dtk/server';
import type { DtkRequestStatus } from '@/lib/dtk/access';

type DtkRequestRow = {
  id: string;
  name: string;
  email: string;
  note: string | null;
  status: DtkRequestStatus;
  created_at: string;
};

const SECTIONS: { status: DtkRequestStatus; title: string }[] = [
  { status: 'pending', title: 'Pending' },
  { status: 'approved', title: 'Approved' },
  { status: 'denied', title: 'Denied' },
];

const cell: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid var(--border-color)',
  textAlign: 'left',
  verticalAlign: 'top',
};

const button: React.CSSProperties = {
  padding: '0.375rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
};

export default async function AdminDiscipleshipPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;

  const { data } = await createAdminClient()
    .from('dtk_access_requests')
    .select('id, name, email, note, status, created_at')
    .order('created_at', { ascending: false });
  const rows = (data ?? []) as DtkRequestRow[];

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Discipleship Kit Access</h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Approving sends a set-password email to people without an account.
      </p>
      {error && (
        <p role="alert" style={{ color: '#b3261e', marginTop: '1rem' }}>
          {error}
        </p>
      )}

      {SECTIONS.map(({ status, title }) => {
        const list = rows.filter((r) => r.status === status);
        return (
          <section key={status} style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              {title} ({list.length})
            </h2>
            {list.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>None.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={cell}>Name</th>
                      <th style={cell}>Email</th>
                      <th style={cell}>Note</th>
                      <th style={cell}>Requested</th>
                      <th style={cell} aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((r) => (
                      <tr key={r.id}>
                        <td style={cell}>{r.name}</td>
                        <td style={cell}>{r.email}</td>
                        <td style={cell}>{r.note ?? ''}</td>
                        <td style={cell}>{new Date(r.created_at).toLocaleDateString('en-US')}</td>
                        <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                          {status !== 'approved' && (
                            <form action={approveDtkRequest} style={{ display: 'inline' }}>
                              <input type="hidden" name="id" value={r.id} />
                              <button type="submit" style={button}>Approve</button>
                            </form>
                          )}
                          {status !== 'denied' && (
                            <form action={denyDtkRequest} style={{ display: 'inline', marginLeft: '0.5rem' }}>
                              <input type="hidden" name="id" value={r.id} />
                              <button type="submit" style={button}>
                                {status === 'approved' ? 'Revoke' : 'Deny'}
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Add the sidebar link** in `components/AdminSidebar.tsx`, directly after the Proof of Life link:

```tsx
        <Link href="/admin/proof-of-life" style={linkStyle('/admin/proof-of-life')}>
          Proof of Life
        </Link>
        <Link href="/admin/discipleship" style={linkStyle('/admin/discipleship')}>
          Discipleship
        </Link>
```

- [ ] **Step 4: Check types, lint, and build**

Run: `npx tsc --noEmit -p . && npx eslint app/admin components/AdminSidebar.tsx && npm run build`
Expected: all pass. If `tsc` reports `row` possibly null after `dtkAdminError`, confirm the helper's return type is `never`.

- [ ] **Step 5: Commit**

```bash
git add app/admin/actions.ts app/admin/discipleship components/AdminSidebar.tsx
git commit -m "Add admin page to approve and revoke kit access"
```

---

### Task 7: Homepage link

**Files:**
- Modify: `app/page.tsx` (new section directly before the `{/* IMPACT STATS */}` section)

**Interfaces:**
- Consumes: route `/discipleship` (Task 4)

- [ ] **Step 1: Add the section** in `app/page.tsx`, directly above `{/* IMPACT STATS */}`. `Link` from `next/link` must be imported at the top of the file if it is not already.

```tsx
      {/* DISCIPLESHIP TRAINING KIT */}
      <section className="home-section-compact home-section-secondary">
        <div className="home-container reveal" style={{ textAlign: 'center' }}>
          <div className="divider-ornament">
            <span>For Staff &amp; Volunteers</span>
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Discipleship Training Kit</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Training for leading discipleship groups. Request access to get started.
          </p>
          <Link href="/discipleship" className="nav-link" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Open the kit →
          </Link>
        </div>
      </section>
```

- [ ] **Step 2: Check lint and build**

Run: `npx eslint app/page.tsx && npm run build`
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Link the Discipleship Training Kit from the homepage"
```

---

### Task 8: Go-live setup and browser verification

These steps touch live services. The executor stops and asks the user before each one marked **(ask first)**.

- [ ] **Step 1: Confirm the live Supabase project (ask first)**

Ask the user which Supabase project the live site uses. `NEXT_PUBLIC_SUPABASE_URL` in Vercel holds the project ref. Do not guess from `supabase projects list`.

- [ ] **Step 2: Apply the migration (ask first)**

Run `supabase/migrations/20260929000000_dtk_access_requests.sql` against that project, either in the Supabase SQL editor or with `supabase db push` after `supabase link --project-ref <ref>`.

Verify with SQL:

```sql
select column_name from information_schema.columns where table_name = 'dtk_access_requests' order by ordinal_position;
```

Expected: `id, name, email, note, status, created_at, decided_at, decided_by`.

- [ ] **Step 3: Allow the set-password redirect (user does this)**

In Supabase → Authentication → URL Configuration → Redirect URLs, add:

```
https://www.citykid.me/discipleship/set-password
http://localhost:3000/discipleship/set-password
```

- [ ] **Step 4: Run locally against the live project**

Needs `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`, `RESEND_API_KEY` (user provides, for example with `npx vercel env pull .env.local` after linking). Run `npm run dev`.

- [ ] **Step 5: Browser checks** (use a throwaway test email the user controls, and delete its row and auth user afterwards)

1. Logged out, `/discipleship`: request form shows, kit text does not.
2. Submit the form: "Request received." A row appears with status `pending`. Admin email arrives.
3. Log in as that test user before approval (if it already has an account): "waiting for approval" message, no kit.
4. `/admin/discipleship` as admin: request under Pending. Approve: moves to Approved. Invite email arrives.
5. Open the invite link: set-password form shows. Save: lands on the kit with site header and footer. Kit nav links work.
6. Admin views `/discipleship` with no request row: kit shows.
7. A logged-in non-admin with no row: no kit.
8. `/discipleship/secret` and `/discipleship/..%2Fpackage`: 404. `/content/discipleship/index.html`: 404.
9. Submit the same email again in any casing: "Request received," no second row, no second admin email.
10. Open the used invite link again: expired message shows.
11. Revoke the test user: next page load shows no kit.
12. Other pages (home, visit) look unchanged: kit styles did not leak.

- [ ] **Step 6: Final checks and PR**

```bash
npm test && npx tsc --noEmit -p . && npm run lint && npm run build
git push -u origin feature/discipleship-kit
gh pr create --base main --title "Gated Discipleship Training Kit" --body "..."
```

Note: Vercel preview builds currently fail on missing Preview env vars (`supabaseUrl is required.`). That is not caused by this branch.

- [ ] **Step 7: Make the kit repo private and archive it (ask first, after merge)**

```bash
gh repo edit donnie-ccama/discipleship-training-kit --visibility private --accept-visibility-change-consequences
gh repo archive donnie-ccama/discipleship-training-kit --yes
```
