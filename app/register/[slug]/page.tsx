import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { demoEvents } from '@/lib/supabase-server';

// Map event IDs to URL-friendly slugs
const eventSlugs: Record<string, string> = {
  '1': 'sunday-mornings',
  '2': 'family-night',
  '3': 'volunteer',
};

function getEventBySlug(slug: string) {
  const entry = Object.entries(eventSlugs).find(([, s]) => s === slug);
  if (!entry) return null;
  const event = demoEvents.find((e) => e.id === entry[0]);
  return event || null;
}

export function generateStaticParams() {
  return Object.values(eventSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) {
    return { title: 'Register — Citychurch' };
  }
  return {
    title: `Register: ${event.title} — Citychurch`,
    description: `Sign up for ${event.title} at Citychurch Amarillo. ${event.event_time} at ${event.location}.`,
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflowX: 'hidden',
      }}
    >
      {/* HERO */}
      <section
        style={{
          padding: '4rem 1.5rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }} className="reveal">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.8,
              marginBottom: '0.75rem',
            }}
          >
            Register
          </p>
          <h1
            style={{
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            {event.title}
          </h1>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              opacity: 0.9,
            }}
          >
            {event.event_time}
          </p>
        </div>
      </section>

      {/* EVENT DETAILS + FORM */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Event details */}
          <div className="reveal" style={{ marginBottom: '3rem' }}>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line',
                marginBottom: '1.5rem',
              }}
            >
              {event.description}
            </p>

            {/* Location */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
              }}
            >
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
                {event.location}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {event.google_maps_url && (
                  <a
                    href={event.google_maps_url}
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
                {event.apple_maps_url && (
                  <a
                    href={event.apple_maps_url}
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
            </div>
          </div>

          {/* Divider */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontStyle: 'italic',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}
            >
              Sign Up Below
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          {/* Registration Form */}
          <EventRegistrationForm
            eventSlug={slug}
            eventTitle={event.title}
          />

          {/* Back link */}
          <div className="reveal" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/ministries"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              ← Back to All Ministries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
