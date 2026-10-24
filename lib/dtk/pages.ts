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
