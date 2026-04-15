import { Metadata } from 'next';
import Link from 'next/link';

const CITYBOOKS_URL = 'https://citybooks.me';

export const metadata: Metadata = {
  title: 'Free Resources | Citychurch',
  description:
    'Open free online resources from Citychurch, including the CityBooks app hosted separately at citybooks.me.',
};

export default function ResourcesPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <section
        style={{
          padding: '6rem 1.5rem 3rem',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
        }}
      >
        <div
          className="reveal"
          style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}
        >
          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '0.75rem',
            }}
          >
            Free Resources
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              marginBottom: '1rem',
            }}
          >
            Tools We Want People To Use Right Away
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: '0.75rem',
            }}
          >
            Some resources are best served by a dedicated app instead of living directly inside the
            main Citychurch website. This page keeps the experience connected while letting each tool
            run on the platform built for it.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 1.5rem 6rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div
            className="reveal"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent) 7%, white) 0%, var(--bg-card) 55%, color-mix(in srgb, var(--bg-muted) 70%, white) 100%)',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '0.75rem',
                }}
              >
                Featured Resource
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  marginBottom: '1rem',
                }}
              >
                CityBooks
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  marginBottom: '0.9rem',
                }}
              >
                CityBooks is a separate resource app now live at <strong>citybooks.me</strong>. We
                are linking to it directly so visitors can discover it from the front page while the
                app stays isolated on its own DigitalOcean deployment.
              </p>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                }}
              >
                Opening the resource uses a normal external link in a new tab. That means the
                Citychurch site is not proxying traffic, embedding the app, or changing how the
                droplet serves requests.
              </p>
              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                <a
                  href={CITYBOOKS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.4rem',
                    backgroundColor: 'var(--accent)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 600,
                    borderRadius: '999px',
                  }}
                >
                  Open CityBooks
                </a>
                <Link
                  href="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.4rem',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    borderRadius: '999px',
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  Ask About This Resource
                </Link>
              </div>
            </div>

            <div
              style={{
                alignSelf: 'stretch',
                padding: '1.25rem',
                borderRadius: '18px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'color-mix(in srgb, var(--bg-card) 88%, white)',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                Deployment Notes
              </p>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>citybooks.me</p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Hosted separately from the main Citychurch website.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Linked with standard new-tab security attributes to keep the handoff simple and safe.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
