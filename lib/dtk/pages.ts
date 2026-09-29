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
