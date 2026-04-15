import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import EmailSignup from '@/components/EmailSignup';

const CITYBOOKS_URL = 'https://citybooks.me';

export const metadata: Metadata = {
  title: 'Free Resources | Citychurch',
  description:
    'Free resources from Citychurch to encourage and equip families in our community, including CityBooks — our free resource library.',
};

const resources = [
  {
    icon: '◉',
    title: 'CityBooks',
    description:
      'Our free resource library — a collection of reading materials, guides, and tools designed to encourage and equip families in our community.',
    cta: 'Open CityBooks',
    href: CITYBOOKS_URL,
    external: true,
    subtitle: 'citybooks.me',
  },
];

export default function ResourcesPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* HERO */}
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }} className="reveal">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}
          >
            Free Resources
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            Tools We Want People To Use Right Away
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            We&rsquo;ve built dedicated apps and tools that serve our community. Each resource below opens in its own space, purpose-built for the best experience.
          </p>
        </div>
      </section>

      {/* RESOURCES */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Our Resources" title="Built for Our Community" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {resources.map((resource, idx) => (
              <div
                key={idx}
                className="reveal card-hover"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    color: 'var(--accent)',
                    marginBottom: '1rem',
                  }}
                >
                  {resource.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {resource.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    flex: 1,
                    marginBottom: '1.5rem',
                  }}
                >
                  {resource.description}
                </p>
                {resource.subtitle && (
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {resource.subtitle}
                  </p>
                )}
                <a
                  href={resource.href}
                  target={resource.external ? '_blank' : undefined}
                  rel={resource.external ? 'noopener noreferrer' : undefined}
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  {resource.cta}
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
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MORE COMING SOON */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }} className="reveal">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Have a Suggestion?</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            More Resources Coming Soon
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
            We&rsquo;re always building new tools for our community. If you have an idea for a resource that would help families in Amarillo, we&rsquo;d love to hear it.
          </p>

          <Link
            href="/contact"
            style={{
              color: 'var(--accent)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            Get in Touch
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
      </section>

      {/* EMAIL SIGNUP */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="reveal">
          <EmailSignup
            heading="Stay Connected"
            subtext="Join our email list for updates on new resources, ministry stories, and ways to help."
          />
        </div>
      </section>

    </div>
  );
}
