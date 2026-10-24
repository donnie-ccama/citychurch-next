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
