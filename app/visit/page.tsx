import { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import DonateButton from '@/components/DonateButton';
import VisitorSignupForm from '@/components/VisitorSignupForm';

export const metadata: Metadata = {
  title: 'Visit Citychurch — Plan Your First Visit',
  description:
    "Plan your first visit to Citychurch Amarillo. Worship times, what to expect, photos, and a simple way to let us know you're coming.",
};

const expectCards = [
  {
    icon: '🙏',
    title: 'Worship & Teaching',
    text: 'Sunday mornings start with breakfast at 9:30 AM, Bible Study at 10:00 AM, and worship at 11:00 AM (English) or 12:30 PM (Spanish). Come as you are — all are welcome.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Night',
    text: "Every Wednesday at 5:30 PM, families gather for dinner in the Café, kids play in the park, and adults join small groups. It's the best way to meet people and get connected.",
  },
  {
    icon: '🤝',
    title: 'Serving Together',
    text: 'Monday through Thursday, volunteers serve alongside us — from preparing meals to delivering emergency groceries. Bring your family, your friends, or just yourself.',
  },
];

const serviceTimes = [
  'Sunday: Breakfast 9:30 AM · Bible Study 10:00 AM · Worship 11:00 AM (EN) / 12:30 PM (ES)',
  'Wednesday: Family Night — Dinner 5:30 PM · Groups 6:15 PM',
  'Mon–Thu: Volunteer — 9:00 AM to 5:00 PM',
];

export default function Visit() {
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
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }} className="reveal">
          <h1
            style={{
              fontWeight: 800,
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Welcome to Citychurch
          </h1>
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              opacity: 0.92,
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Whether you're walking through our doors for the first time or
            discovering us online, we're glad you're here. Here's what to
            expect.
          </p>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Your First Visit" title="What to Expect" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {expectCards.map((card) => (
              <div
                key={card.title}
                className="card-hover reveal"
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
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                  }}
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* $2.50 IMPACT CALLOUT */}
      <section
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }} className="reveal">
          <h2
            style={{
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}
          >
            Every Meal Matters
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.75,
              opacity: 0.92,
              marginBottom: '2rem',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            For just $2.50, a child receives a freshly prepared hot item, fresh
            fruit, and popcorn — served with love and dignity. Your generosity
            changes lives.
          </p>
          <DonateButton
            label="Feed a Child Today"
            variant="outline"
            icon={true}
            className="donate-callout-btn"
          />
          <style>{`
            .donate-callout-btn {
              background-color: white !important;
              color: var(--accent) !important;
              border: none !important;
              font-weight: 700 !important;
            }
          `}</style>
        </div>
      </section>

      {/* PHOTO GALLERY (Placeholder) */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="See Our Ministry" title="Photos From the Field" />
          </div>

          {/* TODO: Replace placeholders with ministry photos from Donnie */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  aspectRatio: '4 / 3',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: '12px',
                  border: '1px dashed var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Photo Coming Soon
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGN-UP FORM */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <div className="reveal">
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: '0.75rem',
              }}
            >
              We'd Love to Meet You
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              Fill out the form below and we'll reach out to welcome you
              personally.
            </p>
          </div>

          <VisitorSignupForm />
        </div>
      </section>

      {/* LOCATION & SERVICE TIMES */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Find Us" title="Visit Citychurch" />
          </div>

          <div className="reveal" style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
              }}
            >
              205 S. Polk Street, Amarillo, TX 79101
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
            >
              <a
                href="https://maps.google.com/?q=205+S+Polk+St+Amarillo+TX+79101"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                }}
              >
                Google Maps ↗
              </a>
              <a
                href="https://maps.apple.com/?address=205+S+Polk+St,+Amarillo,+TX+79101"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                }}
              >
                Apple Maps ↗
              </a>
            </div>

            <div>
              {serviceTimes.map((time) => (
                <p
                  key={time}
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  {time}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
