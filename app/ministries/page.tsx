import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import EventCard from '@/components/EventCard';
import DonateButton from '@/components/DonateButton';
import EmailSignup from '@/components/EmailSignup';
import { demoEvents } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Programs — How We Help | Citychurch',
  description: 'Citychurch feeds children and families across Amarillo through park meals, the Cafe, and family discipleship. Learn how $2.50 changes a life.',
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
            How We Help
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            Every week, Citychurch finds, feeds, and teaches children and families across Amarillo. Here's how we do it — and how you can be part of it.
          </p>
        </div>
      </section>

      {/* OUR PROGRAMS */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Our Programs" title="Find. Feed. Teach." />
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
                icon: '◉',
                title: 'Park & Neighborhood Meals',
                description: 'We go where the children are — parks, streets, neighborhoods. Each child receives a freshly prepared hot meal: a hot item, fresh fruit, and popcorn.',
              },
              {
                icon: '⌂',
                title: 'The Cafe',
                description: 'A safe, welcoming space where families gather for meals, conversation, and community. More than food — it\'s a place to belong.',
              },
              {
                icon: '✦',
                title: 'Family Discipleship',
                description: 'We don\'t just feed children — we walk alongside entire families. Home visits, mentorship, and long-term discipleship break generational cycles of poverty.',
              },
            ].map((program, idx) => (
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
                  {program.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {program.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                  }}
                >
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COST PER MEAL */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--accent)', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }} className="reveal">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.75rem',
              opacity: 0.85,
            }}
          >
            The Cost of Hope
          </p>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1.5rem',
            }}
          >
            $2.50 Per Meal
          </h2>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              lineHeight: 1.7,
              marginBottom: '2rem',
              opacity: 0.9,
            }}
          >
            Each meal includes: A freshly prepared hot item · Fresh fruit · Popcorn
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            <span>$2.50 = 1 meal</span>
            <span>$17.50 = 1 week</span>
            <span>$75 = 1 month</span>
            <span>$900 = 1 year</span>
          </div>
          <DonateButton
            label="Feed a Child Today"
            variant="outline"
          />
        </div>
      </section>

      {/* UPCOMING OPPORTUNITIES */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Volunteer" title="Upcoming Opportunities" />
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
              Come and Live the Mission
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
                title: 'Serve a Meal',
                description: 'Help prepare and serve meals to children and families. Every Saturday, volunteers gather to cook, plate, and deliver hope.',
                cta: 'Sign Up to Serve',
                href: '/contact',
              },
              {
                title: 'Deliver Meals',
                description: 'Bring meals directly to children in parks and neighborhoods. You are the hands and feet.',
                cta: 'Join a Delivery Team',
                href: '/contact',
              },
              {
                title: 'Host a Food Drive',
                description: 'Organize a food or supply drive at your church, school, or workplace. We\'ll provide everything you need to get started.',
                cta: 'Get Started',
                href: '/contact',
              },
              {
                title: 'Give Monthly',
                description: '$25/month feeds 10 children every month — consistent, reliable, life-changing. Become a monthly partner.',
                cta: 'Become a Partner',
                href: '/donate',
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

      {/* READY TO SERVE CTA */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              Ready to Serve?
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Fill out our volunteer form or contact us directly. There is a place for you in this mission.
            </p>

            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9375rem',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                letterSpacing: '-0.01em',
                marginBottom: '3rem',
              }}
            >
              Contact Us
            </Link>

            <EmailSignup />
          </div>
        </div>
      </section>



    </div>
  );
}
