# Discipleship Training Kit: gated access design

Date: 2026-09-29

## Goal

Host the Discipleship Training Kit (DTK) on citykid.me behind a login. Anyone can request access from a homepage link. No one gets access until a site admin approves them.

## Decisions

| Ref | Decision |
|-----|----------|
| O1 | DTK content is private. The `donnie-ccama/discipleship-training-kit` GitHub repo becomes private and is archived after the move. |
| O3 | DTK pages move into this repo. This repo is the only place they are edited. |
| O5 | Approved users log in with email and password. Approval sends one Supabase invite email to set a password. |
| O7 | Each new request emails the admins via Resend and appears on an admin page. |
| O9 | Build on the existing Supabase Auth, `proxy.ts` gate, and admin area. No new auth provider. |

## User flow

1. Homepage shows a "Discipleship Training Kit" link card that points to `/discipleship`.
2. A visitor without access sees `/discipleship` as a short intro plus a request form: name, email, optional note. Submitting shows "Request received."
3. The request is saved to `dtk_access_requests` with status `pending`. Admins get an email.
4. An admin opens `/admin/discipleship` and clicks Approve or Deny.
   - Approve: sets status `approved` and calls Supabase `auth.admin.inviteUserByEmail`. If the email already has a Supabase account, no invite is sent and the user logs in with their existing password.
   - Deny: sets status `denied`. No email is sent.
5. The approved user sets a password from the invite link, then logs in at `/discipleship/login` and sees the kit.
6. An admin can later change an approved user to `denied`. Access ends on their next page load.

## Data

New migration `supabase/migrations/<timestamp>_dtk_access_requests.sql`:

```sql
create table public.dtk_access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  note text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by text
);
create unique index dtk_access_requests_email_key
  on public.dtk_access_requests (lower(email));
alter table public.dtk_access_requests enable row level security;
```

No RLS policies are added. All reads and writes go through server code using the service role client (`lib/supabase-admin.ts`), so the anon and authenticated roles cannot read or write the table directly.

The unique email index means one row per email. A repeat request from a `pending` or `approved` email changes nothing and shows the same "Request received" message. A repeat from a `denied` email also changes nothing.

## Content

- The five kit pages (`index.html`, `pitfalls.html`, `training.html`, `toolkit.html`, `sources.html`) and `styles.css` are copied into `content/discipleship/`. This folder is outside `public/`, so the files are never served directly.
- Route `app/discipleship/[[...page]]/page.tsx` handles `/discipleship` and `/discipleship/<name>`. After the access check passes, it reads the matching file on the server, extracts its `<main>` or `<body>` content, and renders it inside the normal site header and footer.
- Only the five known page names are allowed. Any other name returns 404.
- Internal links such as `pitfalls.html` are rewritten in the source files to `/discipleship/pitfalls`.
- Kit styles from `styles.css` are scoped under a `.dtk` wrapper class so they cannot affect the rest of the site.

## Access check

`lib/dtk-access.ts` exports one function, `hasDtkAccess(user)`. It returns true when either:

1. the user's email is in `ADMIN_EMAILS`, or
2. `dtk_access_requests` has a row for that email with status `approved`.

Being logged in is not enough. The Supabase project already has accounts for other features, such as the mission trip planner, and those users do not get the kit.

`/discipleship` and `/discipleship/*` call `hasDtkAccess` on every request. `/discipleship/login` is the only kit route open to everyone. The existing `/admin` gate in `proxy.ts` is not changed.

## Admin page

`/admin/discipleship` lists requests grouped by status, newest first, with name, email, note, and date. Pending rows have Approve and Deny buttons. Approved rows have a Revoke button, which sets status to `denied`. Denied rows have an Approve button. Actions are server actions in `app/admin/actions.ts` and run only for admins.

A "Discipleship" link is added to the admin navigation.

## Email

- New request: the server sends one email to every address in `ADMIN_EMAILS` via the Resend REST API, matching `app/api/proof-of-life/route.ts`. The sender stays `Citychurch <onboarding@resend.dev>`. Resend only delivers from that sender to the Resend account owner, so admins other than the owner receive mail only after a domain is verified in Resend.
- Approval: Supabase sends the invite email.
- Forgot password: `/discipleship/login` has a "Forgot password?" link that calls Supabase `resetPasswordForEmail`.

## Error handling

- If the Resend call fails, the request is still saved and still shown on the admin page. The error is logged with `console.error`.
- If the Supabase invite fails, the status stays unchanged and the admin page shows the error message.
- The request form has a hidden honeypot field. Submissions that fill it are dropped silently.

## Testing

Checked in a real browser before merge:

1. Logged out: `/discipleship` shows the request form, not the kit.
2. Pending or denied user: no kit.
3. Approved user: kit pages render with site header and footer.
4. Admin: kit pages render.
5. Logged-in user with no DTK row, such as a mission trip planner user: no kit.
6. Unknown page name such as `/discipleship/secret`: 404.
7. `/content/discipleship/index.html` and similar direct paths: not served.
8. Revoked user: locked out on next page load.

Also: `npx eslint`, `npx tsc --noEmit`, and `npm run build` pass.

## Out of scope

- Roles or access levels inside the kit.
- Tracking who read which page.
- Editing kit content from the admin area.
- Verifying a Resend sending domain.
