// Vimeo helpers for the sermon admin (URL parsing + oEmbed) and the public player.
// No API key required — Vimeo oEmbed is a public endpoint.

export interface VimeoUrlParts {
  id: string;
  // Privacy hash for unlisted videos: vimeo.com/12345/abcdef  or  ?h=abcdef
  hash: string | null;
}

export interface VimeoOEmbed {
  title: string;
  description: string | null;
  duration: number;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
  author_name: string;
  upload_date: string;
}

export interface VimeoEmbedOptions {
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  title?: boolean;
  byline?: boolean;
  portrait?: boolean;
  hash?: string | null;
}

/**
 * Parse a Vimeo URL into its numeric video ID and optional privacy hash.
 * Accepts: vimeo.com/12345, vimeo.com/12345/hashvalue, player.vimeo.com/video/12345,
 * channel/group/album/event URLs, and URLs with query strings.
 * Returns null if no valid Vimeo video ID can be extracted.
 */
export function parseVimeoUrl(input: string): VimeoUrlParts | null {
  if (!input) return null;

  let parsed: URL;
  try {
    parsed = new URL(input.trim());
  } catch {
    return null;
  }

  if (!parsed.hostname.endsWith('vimeo.com')) return null;

  const segments = parsed.pathname.split('/').filter(Boolean);

  // Find the last all-digits segment — that's the video ID.
  // (Walking from the end skips channels/, groups/, video/, album/, event/ prefixes.)
  let idIndex = -1;
  for (let i = segments.length - 1; i >= 0; i--) {
    if (/^\d+$/.test(segments[i])) {
      idIndex = i;
      break;
    }
  }
  if (idIndex === -1) return null;

  const id = segments[idIndex];

  // Privacy hash can come in two shapes:
  //   1. Path segment immediately after the ID:   vimeo.com/12345/abcdef
  //   2. Query param ?h=abcdef:                    player.vimeo.com/video/12345?h=abcdef
  const nextSegment = segments[idIndex + 1];
  const pathHash =
    nextSegment && /^[a-zA-Z0-9]+$/.test(nextSegment) ? nextSegment : null;
  const queryHash = parsed.searchParams.get('h');
  const hash = pathHash ?? queryHash ?? null;

  return { id, hash };
}

/** Convenience wrapper that returns just the numeric ID. */
export function parseVimeoId(input: string): string | null {
  return parseVimeoUrl(input)?.id ?? null;
}

/**
 * Fetch Vimeo oEmbed metadata for a video URL.
 * Throws if the URL isn't a Vimeo URL, the video is private, or the request fails.
 */
export async function fetchVimeoOEmbed(
  url: string,
  opts: { width?: number } = {}
): Promise<VimeoOEmbed> {
  const parts = parseVimeoUrl(url);
  if (!parts) {
    throw new Error(`Not a valid Vimeo URL: ${url}`);
  }

  // Normalize to the canonical share URL so oEmbed accepts it reliably.
  const canonical = parts.hash
    ? `https://vimeo.com/${parts.id}/${parts.hash}`
    : `https://vimeo.com/${parts.id}`;

  const endpoint = new URL('https://vimeo.com/api/oembed.json');
  endpoint.searchParams.set('url', canonical);
  endpoint.searchParams.set('width', String(opts.width ?? 1280));

  const res = await fetch(endpoint.toString(), {
    headers: { Accept: 'application/json' },
    // Cache for 24h server-side — thumbnails and titles rarely change.
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        `Vimeo oEmbed denied for ${canonical} (status 403 — video may be private or embed-domain-restricted)`
      );
    }
    if (res.status === 404) {
      throw new Error(`Vimeo video not found: ${canonical}`);
    }
    throw new Error(`Vimeo oEmbed failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as VimeoOEmbed;
}

/**
 * Build a normalized player.vimeo.com embed URL.
 * Only the options we actually use are exposed; defaults match Vimeo's defaults
 * so a bare buildVimeoEmbedUrl(id) returns a clean URL with no query string.
 */
export function buildVimeoEmbedUrl(
  vimeoId: string,
  opts: VimeoEmbedOptions = {}
): string {
  const params = new URLSearchParams();
  if (opts.autoplay) params.set('autoplay', '1');
  if (opts.muted) params.set('muted', '1');
  if (opts.controls === false) params.set('controls', '0');
  if (opts.loop) params.set('loop', '1');
  if (opts.title === false) params.set('title', '0');
  if (opts.byline === false) params.set('byline', '0');
  if (opts.portrait === false) params.set('portrait', '0');
  if (opts.hash) params.set('h', opts.hash);

  const qs = params.toString();
  return `https://player.vimeo.com/video/${vimeoId}${qs ? `?${qs}` : ''}`;
}
