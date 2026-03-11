'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';

interface BlogCardProps extends BlogPost {}

export default function BlogCard({
  title,
  slug,
  excerpt,
  category,
  created_at,
  featured_image,
  reading_time,
}: BlogCardProps) {
  const date = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        className="card-hover"
        style={{
          backgroundColor: `var(--bg-card)`,
          border: `1px solid var(--border-color)`,
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Image */}
        <div
          style={{
            aspectRatio: '16/10',
            backgroundColor: `var(--bg-muted)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {featured_image ? (
            <Image
              src={featured_image}
              alt={title}
              width={480}
              height={300}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <span
              style={{
                color: `var(--text-muted)`,
                fontSize: '0.8125rem',
              }}
            >
              Photo Placeholder
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Category & Date */}
          <p
            style={{
              fontSize: '0.75rem',
              color: `var(--text-muted)`,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {date} &middot; {category}
          </p>

          {/* Title */}
          <h3
            style={{
              fontWeight: 600,
              fontSize: '1.125rem',
              letterSpacing: '-0.015em',
              lineHeight: 1.35,
              marginBottom: '0.5rem',
              color: `var(--text-primary)`,
            }}
          >
            {title}
          </h3>

          {/* Excerpt */}
          <p
            style={{
              color: `var(--text-secondary)`,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {excerpt}
          </p>

          {/* Reading Time */}
          <p
            style={{
              fontSize: '0.75rem',
              color: `var(--text-muted)`,
              marginTop: '1rem',
              fontStyle: 'italic',
            }}
          >
            {reading_time} min read
          </p>
        </div>

        <style jsx>{`
          .card-hover:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
        `}</style>
      </div>
    </Link>
  );
}
