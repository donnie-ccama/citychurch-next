import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import EventCard from '@/components/EventCard';
import { demoEvents } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Ministries — Citychurch',
  description: 'Ministries and volunteer opportunities at Citychurch Amarillo. Join us in serving our neighbors.',
};

export default function Ministries() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>


      {/* HERO */}
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className="reveal">
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            Ministries
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            Join us as we serve our community through meal services, cleanups, prayer walks, and more. All are welcome.
          </p>
        </div>
      </section>

      {/* MINISTRIES GRID */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Get Involved" title="Upcoming Ministries" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {demoEvents.map((event) => (
              <div key={event.id} className="reveal">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOLUNTEER SECTION */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <div
              style={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ways to Help</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '3rem' }}>
              Get Involved With Citychurch
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                title: 'Volunteer for a Ministry',
                description: 'Help serve meals, coordinate logistics, or lead a team at one of our outreach ministries. Sign up for the specific date that works for you.',
                cta: 'Browse Ministries',
                href: '#',
              },
              {
                title: 'Attend a Ministry',
                description: 'Come experience community with us. Whether you want to serve or just be part of what\'s happening, you belong here.',
                cta: 'See What\'s Coming',
                href: '#',
              },
              {
                title: 'Join Our Team',
                description: 'We\'re looking for people committed to the long-term work. Leadership roles available in outreach, media, and community partnership.',
                cta: 'Get In Touch',
                href: '/contact',
              },
              {
                title: 'Support Our Work',
                description: 'Our ministries run on donated supplies, volunteer time, and community generosity. Every contribution matters.',
                cta: 'Learn More',
                href: '/contact',
              },
            ].map((item, idx) => (
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
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    letterSpacing: '-0.02em',
                    marginBottom: '1rem',
                  }}
                >
                  {item.title}
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
                  {item.description}
                </p>
                <Link
                  href={item.href}
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
                  {item.cta}
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
            ))}
          </div>

        </div>
      </section>

      {/* GOOGLE FORM CTA */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              Ready to Get Involved?
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Fill out the form below to register for a ministry, volunteer, or inquire about our programs.
            </p>

            {/* Placeholder for Google Form */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '2px dashed var(--border-color)',
                borderRadius: '12px',
                padding: '4rem 2rem',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1rem' }}>
                Google Form Embed Placeholder
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Replace the iframe src with your actual Google Form URL in the components/GoogleFormEmbed component
              </p>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2rem' }}>
              You can also reach us at <a href="mailto:hello@citychurch.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>hello@citychurch.com</a> or visit us on social media.
            </p>
          </div>
        </div>
      </section>



    </div>
  );
}
