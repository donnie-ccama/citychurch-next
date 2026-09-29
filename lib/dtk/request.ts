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
