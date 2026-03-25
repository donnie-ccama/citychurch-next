import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import HeroVideo from '@/components/HeroVideo';
import EventCard from '@/components/EventCard';
import BlogCard from '@/components/BlogCard';
import DonateButton from '@/components/DonateButton';
import ImpactStats from '@/components/ImpactStats';
import EmailSignup from '@/components/EmailSignup';
import { demoEvents, demoBlogPosts } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Citychurch — ...for the heart of the city.',
  description: 'Citychurch Amarillo — Finding, feeding, and teaching children and families who are most vulnerable. $2.50 feeds a child a hot meal, fresh fruit, and popcorn.',
};

export default function Home() {
  const upcomingEvents = demoEvents.slice(0, 3);
  const recentPosts = demoBlogPosts.slice(0, 3);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* HERO SECTION — Video Background */}
      <HeroVideo videoId="1172206088">
        <div
          className="reveal"
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <DonateButton label="Feed a Child Today" />
          <Link
            href="/donate"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              borderRadius: '8px',
              transition: 'all 0.2s',
              letterSpacing: '-0.01em',
            }}
          >
            See How $2.50 Changes a Life
          </Link>
        </div>
      </HeroVideo>

      {/* MISSION STATEMENT */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }} className="reveal">
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Our Mission</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 'clamp(1.25rem, 3vw, 1.625rem)',
              lineHeight: 1.75,
              color: 'var(--text-primary)',
              fontWeight: 300,
            }}
          >
            Citychurch exists to find, feed, and teach children and families in Amarillo who are most vulnerable, introducing them to Jesus Christ while meeting practical needs with dignity, consistency, and long-term discipleship.
          </p>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              marginTop: '1.5rem',
              maxWidth: '620px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Every meal — a freshly prepared hot item, fresh fruit, and popcorn — costs just $2.50. But we don't just feed children. We sit with families, walk alongside them, and point them to lasting hope.
          </p>

          <div style={{ marginTop: '2.5rem' }}>
            <Link
              href="/about"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              Learn More About Our Mission →
            </Link>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="reveal">
          <ImpactStats />
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Get Involved" title="Upcoming Ministry Opportunities" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {upcomingEvents.map((event) => (
              <div key={event.id} className="reveal">
                <EventCard {...event} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }} className="reveal">
            <Link
              href="/ministries"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              View All Ministries & Register →
            </Link>
          </div>
        </div>
      </section>

      {/* $2.50 FEEDS A CHILD CALLOUT */}
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
            No Child in Amarillo Should Go to Bed Hungry
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
            $2.50 is all it takes. Each meal includes a freshly prepared hot item, fresh fruit, and popcorn — served with dignity to children and families who need it most.
          </p>
          <DonateButton
            label="Feed a Child Today"
            variant="outline"
            icon={true}
            className="donate-callout-btn"
          />
          {/* Inline style override for white-on-accent appearance */}
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

      {/* RECENT BLOG / STORIES */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Impact" title="Stories From the Field" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {recentPosts.map((post) => (
              <div key={post.id} className="reveal">
                <BlogCard {...post} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }} className="reveal">
            <Link
              href="/stories"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              Read More Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* EMAIL SIGNUP */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }} className="reveal">
          <EmailSignup />
        </div>
      </section>

    </div>
  );
}
