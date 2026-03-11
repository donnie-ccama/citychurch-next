'use client';

import Link from 'next/link';
import { Sermon } from '@/lib/types';
import VideoEmbed from './VideoEmbed';

interface SermonCardProps extends Sermon {}

export default function SermonCard({
  title,
  speaker,
  series,
  sermon_date,
  video_url,
  description,
  id,
}: SermonCardProps) {
  const date = new Date(sermon_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="card-hover"
      style={{
        backgroundColor: `var(--bg-card)`,
        border: `1px solid var(--border-color)`,
        borderRadius: '12px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Video Embed */}
      {video_url && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              aspectRatio: '16/9',
              backgroundColor: `var(--bg-muted)`,
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <iframe
              src={video_url}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Title */}
        <h3
          style={{
            fontWeight: 600,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
            color: `var(--text-primary)`,
          }}
        >
          {title}
        </h3>

        {/* Speaker, Series, Date */}
        <p
          style={{
            color: `var(--text-muted)`,
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {speaker && <>{speaker} &middot; </>}
          {date}
          {series && <> &middot; {series}</>}
        </p>

        {/* Description */}
        {description && (
          <p
            style={{
              color: `var(--text-secondary)`,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              marginBottom: '1rem',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* View Link */}
      <Link
        href={`/sermons/${id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          color: `var(--accent)`,
          fontWeight: 600,
          fontSize: '0.875rem',
          textDecoration: 'none',
          transition: 'gap 0.2s ease',
          marginTop: '1.25rem',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.gap = '0.625rem';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.gap = '0.375rem';
        }}
      >
        Watch Sermon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>

      <style jsx>{`
        .card-hover:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}
