import { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import MediaClient from '@/components/MediaClient';
import { demoMediaItems } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Media — Citychurch',
  description: 'Photos, training videos, and podcasts from Citychurch Amarillo. Documentary content showing our work in the community.',
};

export default function Media() {
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
            Media
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            Documentary photos, training videos, and podcast conversations from our work in Amarillo.
          </p>
        </div>
      </section>

      {/* MEDIA SECTION */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHeader label="Explore" title="Our Story in Media" />
          </div>

          {/* Client Component for Tab Management */}
          <MediaClient mediaItems={demoMediaItems} />
        </div>
      </section>



    </div>
  );
}
