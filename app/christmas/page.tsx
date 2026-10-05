import type { Metadata } from 'next';
import Link from 'next/link';
import ChristmasReservationForm from '@/components/ChristmasReservationForm';
import { getChristmasEventWithBanquets } from '@/lib/christmas-data';
import { formatBanquetTime } from '@/lib/christmas';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Family Christmas Banquets — Citychurch',
  description:
    'Reserve a family table for the Citychurch Christmas Banquets on December 14 or 15, 2026. Doors open at 5:30 PM.',
  openGraph: {
    title: 'Reserve Your Family’s Christmas Table',
    description:
      'Choose December 14 or 15 and reserve one table for up to eight family members at Citychurch Amarillo.',
    url: 'https://www.citykid.me/christmas',
    siteName: 'Citychurch Amarillo',
    images: [
      {
        url: '/images/web-hero-3-27-26.png',
        width: 1200,
        height: 630,
        alt: 'A child smiling at Citychurch Amarillo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reserve Your Family’s Christmas Table',
    description: 'December 14 or 15 · Doors open at 5:30 PM · Dinner at 6:00 PM',
    images: ['/images/web-hero-3-27-26.png'],
  },
};

export default async function ChristmasPage() {
  const { event, banquets, usingPreviewData } = await getChristmasEventWithBanquets();
  const firstBanquet = banquets[0];

  return (
    <main
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflowX: 'hidden',
      }}
    >
      <section
        style={{
          padding: 'clamp(4.5rem, 11vw, 7.5rem) 1.5rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }} className="reveal">
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.75rem',
              fontWeight: 750,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              opacity: 0.86,
            }}
          >
            A Citychurch Christmas
          </p>
          <h1
            style={{
              margin: '0 auto 1.25rem',
              fontSize: 'clamp(2.25rem, 7vw, 4.5rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.055em',
              fontWeight: 850,
              maxWidth: '740px',
            }}
          >
            Reserve Your Family’s Table
          </h1>
          <p
            style={{
              margin: '0 auto',
              maxWidth: '620px',
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)',
              lineHeight: 1.65,
              opacity: 0.92,
            }}
          >
            Choose the evening that works best for your family and join us for dinner, celebration, and Christmas joy in the heart of the city.
          </p>
        </div>
      </section>

      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.35rem 1.5rem',
        }}
      >
        <div className="christmas-schedule-grid" style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Banquet dates
            </p>
            <p style={{ marginTop: '0.3rem', fontWeight: 700 }}>
              December 14 &amp; 15, 2026
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Evening schedule
            </p>
            <p style={{ marginTop: '0.3rem', fontWeight: 700 }}>
              Doors 5:30 · Dinner 6:00 · Ends 7:30
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your reservation
            </p>
            <p style={{ marginTop: '0.3rem', fontWeight: 700 }}>
              One table · Up to 8 guests
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem, 9vw, 6.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p
              style={{
                color: 'var(--accent)',
                fontSize: '0.75rem',
                fontWeight: 750,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.75rem',
              }}
            >
              Christmas Banquet RSVP
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.9rem, 5vw, 2.75rem)',
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
                marginBottom: '1rem',
              }}
            >
              Choose your evening
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '620px', margin: '0 auto' }}>
              Each banquet has 15 family tables. Your reservation holds one complete table for your household, with seating for up to eight guests.
            </p>
          </div>

          <div
            className="reveal"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: 'clamp(1.25rem, 5vw, 2.5rem)',
              boxShadow: '0 16px 45px rgba(54, 41, 35, 0.07)',
            }}
          >
            <ChristmasReservationForm
              banquets={banquets}
              location={event.location}
              usingPreviewData={usingPreviewData}
            />
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '4.5rem 1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }} className="reveal">
          <div className="christmas-info-grid">
            <div>
              <p style={{ color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.7rem' }}>
                What to expect
              </p>
              <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.035em', lineHeight: 1.15, marginBottom: '1rem' }}>
                A warm evening for the whole family
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Doors open at {firstBanquet ? formatBanquetTime(firstBanquet.doors_open) : '5:30 PM'}, giving your family time to get settled before dinner is served at {firstBanquet ? formatBanquetTime(firstBanquet.dinner_at) : '6:00 PM'}. The banquet concludes by {firstBanquet ? formatBanquetTime(firstBanquet.ends_at) : '7:30 PM'}.
              </p>
            </div>
            <div
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                Location
              </p>
              <p style={{ fontWeight: 700, lineHeight: 1.55, marginBottom: '1rem' }}>{event.location}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <a
                  href="https://maps.google.com/?q=205+S+Polk+St+Amarillo+TX+79101"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  Google Maps
                </a>
                <a
                  href="https://maps.apple.com/?address=205+S+Polk+St,+Amarillo,+TX+79101"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  Apple Maps
                </a>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Need help with your reservation?{' '}
              <Link href="/contact" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
                Contact Citychurch
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
