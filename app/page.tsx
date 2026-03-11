import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/SectionHeader';
import VideoEmbed from '@/components/VideoEmbed';
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
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>


      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)',
        }}
      >
        {/* Background Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '800px', padding: '2rem 1.5rem' }}>
          <div className="reveal">
            <Image
              src="/logo.png"
              alt="Citychurch"
              width={100}
              height={100}
              style={{ margin: '0 auto 2rem', objectFit: 'contain' }}
            />
          </div>

          <h1
            className="reveal"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
            }}
          >
            Citychurch
          </h1>

          <p
            className="reveal"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              letterSpacing: '0.01em',
            }}
          >
            ...for the heart of the city.
          </p>

          <p
            className="reveal"
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              margin: '0 auto 3rem',
              lineHeight: 1.7,
            }}
          >
            Documenting the work. Serving our neighbors. Telling the story of a community transformed by compassion and authenticity in Amarillo, Texas.
          </p>

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
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
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
        </div>

      </section>

      {/* FEATURED SERMON */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="reveal">
          <SectionHeader label="This Week" title="Latest Sermon" />

          <VideoEmbed url={featuredSermon.video_url} title={featuredSermon.title} />

          <div style={{ textAlign: 'center' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
              }}
            >
              {featuredSermon.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {featuredSermon.speaker} &middot; {new Date(featuredSermon.sermon_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} &middot; {featuredSermon.series}
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              href="/sermons"
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
              Browse All Sermons
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

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
