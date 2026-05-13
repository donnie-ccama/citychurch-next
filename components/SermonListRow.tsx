import Link from 'next/link';
import Image from 'next/image';

interface SermonListRowProps {
  slug: string | null;
  title: string;
  speaker: string;
  series: string;
  sermon_date: string;
  description: string;
  thumbnail_url: string | null;
  variant?: 'default' | 'featured';
}

const MAX_DESC_CHARS = 140;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd() + '…';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ThumbnailFallback({ series }: { series: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(135deg, var(--bg-muted) 0%, var(--bg-secondary) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 600,
      }}
    >
      {series || 'Sermon'}
    </div>
  );
}

export default function SermonListRow({
  slug,
  title,
  speaker,
  series,
  sermon_date,
  description,
  thumbnail_url,
  variant = 'default',
}: SermonListRowProps) {
  const isFeatured = variant === 'featured';
  const href = slug ? `/sermons/${slug}` : null;
  const formattedDate = formatDate(sermon_date);
  const truncated = truncate(description ?? '', MAX_DESC_CHARS);

  const content = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isFeatured
          ? 'minmax(0, 1fr)'
          : 'minmax(240px, 320px) minmax(0, 1fr)',
        gap: isFeatured ? '0' : '1.75rem',
        alignItems: isFeatured ? 'stretch' : 'center',
        padding: isFeatured ? '0' : '1.5rem 0',
      }}
      className="sermon-row-grid"
    >
      <div
        style={{
          aspectRatio: '16 / 9',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-muted)',
          position: 'relative',
        }}
      >
        {thumbnail_url ? (
          <Image
            src={thumbnail_url}
            alt={title}
            fill
            sizes={isFeatured ? '100vw' : '(max-width: 768px) 100vw, 320px'}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ThumbnailFallback series={series} />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '0.5rem',
          paddingTop: isFeatured ? '1.5rem' : 0,
        }}
      >
        {series && (
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {series}
          </p>
        )}
        <h3
          style={{
            fontWeight: 600,
            fontSize: isFeatured ? '1.625rem' : '1.125rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            margin: 0,
          }}
        >
          {speaker} &middot; {formattedDate}
        </p>
        {truncated && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              margin: '0.25rem 0 0',
            }}
          >
            {truncated}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="card-hover"
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          padding: isFeatured ? '0' : '0 0.5rem',
          borderRadius: '12px',
          transition: 'all 0.2s ease',
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      style={{
        padding: isFeatured ? '0' : '0 0.5rem',
        opacity: 0.6,
        cursor: 'default',
      }}
      aria-disabled="true"
      title="Detail page not available yet"
    >
      {content}
    </div>
  );
}
