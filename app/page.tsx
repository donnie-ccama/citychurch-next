import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import HeroVideo from '@/components/HeroVideo';
import EventCard from '@/components/EventCard';
import BlogCard from '@/components/BlogCard';
import { demoSermons, demoEvents, demoBlogPosts } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Citychurch — ...for the heart of the city.',
  description: 'Citychurch Amarillo — For the heart of the city. Serving our community through outreach, worship, and authentic storytelling.',
};

export default function Home() {
  const featuredSermon = demoSermons[0];
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
          <Link
            href="/sermons"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              backgroundColor: 'var(--accent)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              borderRadius: '8px',
              transition: 'opacity 0.2s',
              letterSpacing: '-0.01em',
            }}
          >
            Watch Latest Sermon
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </Link>
          <Link
            href="/events"
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
            Upcoming Events
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
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Our Heart</span>
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
            We don't sell anything. We simply show up, serve our neighbors, and document what we see. Our work is rooted in the belief that authentic compassion — without pretense or agenda — can transform a city from the inside out.
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

      {/* UPCOMING EVENTS */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Get Involved" title="Upcoming Outreach Events" />
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
              href="/events"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              View All Events & Register →
            </Link>
          </div>
        </div>
      </section>

      {/* RECENT BLOG */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Stories" title="From the Field" />
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
              href="/blog"
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


    </div>
  );
}
