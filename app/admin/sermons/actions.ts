'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { fetchVimeoOEmbed, parseVimeoUrl } from '@/lib/vimeo';

function getAdminEmails(): string[] {
  const list = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '';
  return list
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function requireAdmin() {
  const supabase = await createSupabaseSSR();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated.');
  }
  const allowlist = getAdminEmails();
  const email = (user.email ?? '').toLowerCase();
  if (allowlist.length > 0 && !allowlist.includes(email)) {
    throw new Error('Not authorized.');
  }
  return { supabase, user };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseSSR>>,
  base: string,
  excludeId?: string
): Promise<string> {
  let candidate = base;
  let attempt = 1;
  // Cap iterations defensively; in practice collisions are rare.
  for (let i = 0; i < 50; i++) {
    let q = supabase
      .from('sermons')
      .select('id', { count: 'exact', head: true })
      .eq('slug', candidate);
    if (excludeId) q = q.neq('id', excludeId);
    const { count, error } = await q;
    if (error) throw new Error(`slug uniqueness check failed: ${error.message}`);
    if (!count) return candidate;
    attempt++;
    candidate = `${base}-${attempt}`;
  }
  throw new Error('Unable to generate unique slug after 50 attempts');
}

export interface SaveSermonInput {
  id?: string;
  title: string;
  speaker: string;
  series: string;
  sermon_date: string;
  video_url: string;
  description: string;
  scripture_reference: string;
  transcript_markdown: string;
  featured: boolean;
  published: boolean;
}

export interface SaveSermonResult {
  ok: true;
  id: string;
  slug: string;
}

export async function saveSermon(
  input: SaveSermonInput
): Promise<SaveSermonResult> {
  const { supabase } = await requireAdmin();

  if (!input.title?.trim()) throw new Error('Title is required');
  if (!input.speaker?.trim()) throw new Error('Speaker is required');
  if (!input.sermon_date) throw new Error('Sermon date is required');

  let vimeo_id: string | null = null;
  let thumbnail_url: string | null = null;
  let duration_seconds: number | null = null;

  if (input.video_url?.trim()) {
    const parts = parseVimeoUrl(input.video_url);
    if (parts) {
      vimeo_id = parts.id;
      try {
        const oembed = await fetchVimeoOEmbed(input.video_url);
        thumbnail_url = oembed.thumbnail_url;
        duration_seconds = oembed.duration;
      } catch (e) {
        console.warn('Vimeo oEmbed fetch failed during save:', e);
        // Keep going — vimeo_id is parsed; thumbnail/duration can be filled in
        // on a later edit if oEmbed comes back online.
      }
    }
  }

  let slug: string;
  if (input.id) {
    const { data: existing, error: readErr } = await supabase
      .from('sermons')
      .select('slug')
      .eq('id', input.id)
      .single();
    if (readErr) throw new Error(`Couldn't load sermon: ${readErr.message}`);
    if (existing?.slug) {
      slug = existing.slug;
    } else {
      const base = `${slugify(input.title)}-${input.sermon_date}`;
      slug = await ensureUniqueSlug(supabase, base, input.id);
    }
  } else {
    const base = `${slugify(input.title)}-${input.sermon_date}`;
    slug = await ensureUniqueSlug(supabase, base);
  }

  const payload = {
    title: input.title.trim(),
    speaker: input.speaker.trim(),
    series: input.series?.trim() || null,
    sermon_date: input.sermon_date,
    video_url: input.video_url?.trim() || null,
    description: input.description?.trim() || null,
    scripture_reference: input.scripture_reference?.trim() || null,
    transcript_markdown: input.transcript_markdown?.trim() || null,
    featured: input.featured,
    published: input.published,
    slug,
    vimeo_id,
    thumbnail_url,
    duration_seconds,
  };

  let id: string;
  if (input.id) {
    const { data, error } = await supabase
      .from('sermons')
      .update(payload)
      .eq('id', input.id)
      .select('id')
      .single();
    if (error) throw new Error(`Update failed: ${error.message}`);
    id = data.id;
  } else {
    const { data, error } = await supabase
      .from('sermons')
      .insert(payload)
      .select('id')
      .single();
    if (error) throw new Error(`Insert failed: ${error.message}`);
    id = data.id;
  }

  revalidatePath('/sermons');
  revalidatePath(`/sermons/${slug}`);
  revalidatePath('/admin/sermons');

  return { ok: true, id, slug };
}

export async function deleteSermon(id: string): Promise<{ ok: true }> {
  if (!id) throw new Error('id required');
  const { supabase } = await requireAdmin();

  const { data: existing } = await supabase
    .from('sermons')
    .select('slug')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('sermons').delete().eq('id', id);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidatePath('/sermons');
  revalidatePath('/admin/sermons');
  if (existing?.slug) revalidatePath(`/sermons/${existing.slug}`);

  return { ok: true };
}

export interface VimeoPreview {
  vimeo_id: string;
  title: string;
  duration: number;
  thumbnail_url: string;
  author_name: string;
}

export async function previewVimeo(
  videoUrl: string
): Promise<{ ok: true; preview: VimeoPreview } | { ok: false; error: string }> {
  const trimmed = videoUrl?.trim();
  if (!trimmed) return { ok: false, error: 'No URL provided' };
  const parts = parseVimeoUrl(trimmed);
  if (!parts) {
    return { ok: false, error: 'Not a valid Vimeo URL' };
  }
  try {
    const oembed = await fetchVimeoOEmbed(trimmed);
    return {
      ok: true,
      preview: {
        vimeo_id: parts.id,
        title: oembed.title,
        duration: oembed.duration,
        thumbnail_url: oembed.thumbnail_url,
        author_name: oembed.author_name,
      },
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Vimeo lookup failed',
    };
  }
}
