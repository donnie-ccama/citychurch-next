import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerClient } from '@/lib/supabase-server';
import { SermonPdfDocument } from '@/lib/sermon-pdf';

export const runtime = 'nodejs';
export const revalidate = 3600;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  const supabase = createServerClient();
  const { data: sermon, error } = await supabase
    .from('sermons')
    .select(
      'title, speaker, series, sermon_date, scripture_reference, description, transcript_markdown, slug'
    )
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !sermon) {
    return new Response('Sermon not found', { status: 404 });
  }
  if (!sermon.transcript_markdown?.trim()) {
    return new Response('Transcript not available', { status: 404 });
  }

  const origin = req.nextUrl.origin;

  const buffer = await renderToBuffer(
    <SermonPdfDocument sermon={sermon} baseUrl={origin} />
  );

  return new Response(buffer as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slug}.pdf"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
