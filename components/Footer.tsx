'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer
      style={{
        padding: '4rem 1.5rem 2rem',
        backgroundColor: `var(--bg-muted)`,
        borderTop: `1px solid var(--border-color)`,
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <Image
                src="/logo.png"
                alt="Citychurch"
                width={32}
                height={32}
                style={{ objectFit: 'contain' }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Citychurch
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontStyle: 'italic',
                color: `var(--text-muted)`,
                fontSize: '0.875rem',
              }}
            >
              ...for the heart of the city.
            </p>
            <p
              style={{
                color: `var(--text-muted)`,
                fontSize: '0.8125rem',
                marginTop: '0.75rem',
              }}
            >
              Amarillo, Texas
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4
              style={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: `var(--text-muted)`,
                marginBottom: '1rem',
              }}
            >
              Navigate
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Link
                href="/about"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                About
              </Link>
              <Link
                href="/sermons"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Sermons
              </Link>
              <Link
                href="/events"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Events
              </Link>
              <Link
                href="/media"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Media
              </Link>
            </div>
          </div>

          {/* More */}
          <div>
            <h4
              style={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: `var(--text-muted)`,
                marginBottom: '1rem',
              }}
            >
              More
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Link
                href="/blog"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Get Involved
              </Link>
              <Link
                href="/media"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Training
              </Link>
              <Link
                href="/media"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Podcasts
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4
              style={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: `var(--text-muted)`,
                marginBottom: '1rem',
              }}
            >
              Connect
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <a
                href="#youtube"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                YouTube
              </a>
              <a
                href="#vimeo"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Vimeo
              </a>
              <a
                href="#instagram"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Instagram
              </a>
              <a
                href="#facebook"
                style={{
                  color: `var(--text-secondary)`,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    'var(--text-secondary)';
                }}
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: `1px solid var(--border-color)`,
            paddingTop: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: `var(--text-muted)`,
              fontSize: '0.75rem',
            }}
          >
            &copy; 2026 Citychurch Amarillo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
