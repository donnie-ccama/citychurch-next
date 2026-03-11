import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import VideoEmbed from '@/components/VideoEmbed';
import { demoSermons } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Sermons — Citychurch',
  description: 'Listen to messages from Citychurch Amarillo. Weekly sermons about authentic presence, service, and transformation.',
};

interface SermonCardProps {
  id: string;
  title: string;
  speaker: string;
  series: string;
  sermon_date: string;
  description: string;
}

function SermonCard({ title, speaker, series, sermon_date, description }: SermonCardProps) {
  const date = new Date(sermon_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="card-hover"
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
          fontWeight: 600,
          fontSize: '1.125rem',
          letterSpacing: '-0.01em',
          marginBottom: '0.75rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem',
        }}
      >
        {series}
      </p>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          marginBottom: '1rem',
        }}
      >
        {speaker} &middot; {date}
      </p>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          flex: 1,
          marginBottom: '1.25rem',
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default function Sermons() {
  const featuredSermon = demoSermons[0];
  const archiveSermons = demoSermons.slice(1);

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
            Sermons
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            Weekly messages about authentic presence, serving our neighbors, and the transformation that happens when we simply show up.
          </p>
        </div>
      </section>

      {/* FEATURED SERMON */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="reveal">
          <SectionHeader label="Latest" title={featuredSermon.title} />

          <VideoEmbed url={featuredSermon.video_url} title={featuredSermon.title} />

          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem',
                }}
              >
                {featuredSermon.series}
              </p>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                }}
              >
                {featuredSermon.speaker} &middot; {new Date(featuredSermon.sermon_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.7 }}>
                {featuredSermon.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERMON ARCHIVE */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Archive" title="All Sermons" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {archiveSermons.map((sermon) => (
              <div key={sermon.id} className="reveal">
                <SermonCard {...sermon} />
              </div>
            ))}
          </div>
        </div>

      </section>



    </div>
  );
}
