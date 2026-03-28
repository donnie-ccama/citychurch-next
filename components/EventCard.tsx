'use client';

import Link from 'next/link';
import { Event } from '@/lib/types';

interface EventCardProps extends Event {}

export default function EventCard({
  title,
  event_date,
  event_time,
  description,
  location,
  google_maps_url,
  apple_maps_url,
  registration_url,
  image_url,
}: EventCardProps) {
  const date = new Date(event_date);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div
      className="card-hover"
      style={{
        backgroundColor: `var(--bg-card)`,
        border: `1px solid var(--border-color)`,
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Event Image */}
      {image_url && (
        <div
          style={{
            width: '100%',
            height: '200px',
            overflow: 'hidden',
          }}
        >
          <img
            src={image_url}
            alt={title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}

      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Date Badge */}
        <div
          style={{
            backgroundColor: `var(--accent)`,
            color: 'white',
            borderRadius: '8px',
            padding: '0.625rem 0.875rem',
            textAlign: 'center',
            minWidth: '56px',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {day}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {month}
          </span>
        </div>

        {/* Title & Time */}
        <div>
          <h3
            style={{
              fontWeight: 600,
              fontSize: '1.0625rem',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color: `var(--text-muted)`,
              fontSize: '0.8125rem',
            }}
          >
            {event_time}
          </p>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          color: `var(--text-secondary)`,
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          flex: 1,
          whiteSpace: 'pre-line',
        }}
      >
        {description}
      </p>

      {/* Location & Map Links */}
      {location && (
        <div style={{ marginTop: '1rem' }}>
          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              marginBottom: '0.375rem',
            }}
          >
            Location
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            {location}
          </p>
          {(google_maps_url || apple_maps_url) && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {google_maps_url && (
                <a
                  href={google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                  }}
                >
                  Google Maps ↗
                </a>
              )}
              {apple_maps_url && (
                <a
                  href={apple_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                  }}
                >
                  Apple Maps ↗
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Register Link */}
      <Link
        href={registration_url}
        target={registration_url.startsWith('http') ? '_blank' : undefined}
        rel={registration_url.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          marginTop: '1.25rem',
          color: `var(--accent)`,
          fontWeight: 600,
          fontSize: '0.875rem',
          textDecoration: 'none',
          transition: 'gap 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.gap = '0.625rem';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.gap = '0.375rem';
        }}
      >
        Register
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
      </div>

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
