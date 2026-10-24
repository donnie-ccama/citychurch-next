import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SermonPlayer from '@/components/SermonPlayer';
import SermonListRow from '@/components/SermonListRow';
import { createServerClient } from '@/lib/supabase-server';
import { Sermon } from '@/lib/types';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = createServerClient();
  const { data } = await supabase
    .from('sermons')
    .select('slug')
    .eq('published', true)
    .not('slug', 'is', null);
  return (data ?? [])
    .filter((s): s is { slug: string } => typeof s.slug === 'string')
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: sermon } = await supabase
    .from('sermons')
    .select('title, description, thumbnail_url')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!sermon) {
    return {
      title: 'Sermon Not Found — Citychurch',
      description: 'The sermon you are looking for does not exist.',
    };
  }

  const description = (sermon.description ?? '').slice(0, 160);

  return {
    title: `${sermon.title} — Citychurch Sermons`,
    description,
    openGraph: sermon.thumbnail_url
      ? {
          title: sermon.title,
          description,
          images: [{ url: sermon.thumbnail_url }],
        }
      : { title: sermon.title, description },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: sermon, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single<Sermon>();

  if (error || !sermon) {
    notFound();
  }

  // 3 most recent other sermons — prefer same series, fall back to overall recent.
  let related: Sermon[] = [];
  if (sermon.series) {
    const { data } = await supabase
      .from('sermons')
      .select('*')
      .eq('published', true)
      .eq('series', sermon.series)
      .neq('id', sermon.id)
      .order('sermon_date', { ascending: false })
      .limit(3);
    related = (data ?? []) as Sermon[];
  }
  if (related.length < 3) {
    const exclude = [sermon.id, ...related.map((r) => r.id)];
    const { data } = await supabase
      .from('sermons')
      .select('*')
      .eq('published', true)
      .not('id', 'in', `(${exclude.join(',')})`)
      .order('sermon_date', { ascending: false })
      .limit(3 - related.length);
    related = [...related, ...((data ?? []) as Sermon[])];
  }

  const hasVimeo = Boolean(sermon.vimeo_id);
  const hasTranscript = Boolean(sermon.transcript_markdown?.trim());

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* VIDEO + HEADER */}
      <section
        style={{
          padding: '4rem 1.5rem 3rem',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '2rem' }}>
            <Link
              href="/sermons"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                marginBottom: '1.5rem',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              All sermons
            </Link>
            {sermon.series && (
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                }}
              >
                {sermon.series}
              </p>
            )}
            <h1
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '1rem',
              }}
            >
              {sermon.title}
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9375rem',
              }}
            >
              {sermon.speaker} &middot; {formatDate(sermon.sermon_date)}
              {sermon.scripture_reference && (
                <>
                  {' '}
                  &middot;{' '}
                  <span style={{ fontStyle: 'italic' }}>
                    {sermon.scripture_reference}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="reveal">
            {hasVimeo ? (
              <SermonPlayer
                vimeoId={sermon.vimeo_id as string}
                title={sermon.title}
              />
            ) : (
              <div
                style={{
                  aspectRatio: '16 / 9',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.9375rem',
                }}
              >
                Video unavailable
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {sermon.description && (
        <section style={{ padding: '4rem 1.5rem 2rem' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }} className="reveal">
            <p
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
            >
              {sermon.description}
            </p>
          </div>
        </section>
      )}

      {/* TRANSCRIPT */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div
            className="reveal"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Transcript
            </h2>
            {hasTranscript && (
              <a
                href={`/api/sermons/${sermon.slug}/transcript.pdf`}
                download
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.125rem',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </a>
            )}
          </div>

          <div className="reveal">
            {hasTranscript ? (
              <div
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '1.0625rem',
                  lineHeight: 1.8,
                  color: 'var(--text-primary)',
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p style={{ marginBottom: '1.5rem' }}>{children}</p>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          letterSpacing: '-0.015em',
                          margin: '2.5rem 0 1rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          letterSpacing: '-0.01em',
                          margin: '2rem 0 0.75rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        style={{
                          borderLeft: '4px solid var(--accent)',
                          paddingLeft: '1.5rem',
                          margin: '2rem 0',
                          fontStyle: 'italic',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {sermon.transcript_markdown ?? ''}
                </ReactMarkdown>
              </div>
            ) : (
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9375rem',
                  fontStyle: 'italic',
                }}
              >
                Transcript will be posted shortly.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* RELATED SERMONS */}
      {related.length > 0 && (
        <section
          style={{
            padding: '4rem 1.5rem 6rem',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2
              className="reveal"
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '2rem',
              }}
            >
              More sermons
            </h2>
            <div role="list">
              {related.map((r, idx) => (
                <div
                  key={r.id}
                  role="listitem"
                  className="reveal"
                  style={{
                    borderBottom:
                      idx === related.length - 1
                        ? 'none'
                        : '1px solid var(--border-color)',
                  }}
                >
                  <SermonListRow
                    slug={r.slug}
                    title={r.title}
                    speaker={r.speaker}
                    series={r.series}
                    sermon_date={r.sermon_date}
                    description={r.description}
                    thumbnail_url={r.thumbnail_url}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
