import { Metadata } from 'next';
import ProofOfLifeSubmitForm from '@/components/ProofOfLifeSubmitForm';

export const metadata: Metadata = {
  title: 'Share Your Story — Proof of Life — Citychurch',
  description: 'Submit a photo to the Citychurch community bulletin board. Share a moment from your life or service.',
};

export default function SubmitPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
      }}
    >
      <section style={{ padding: '4rem 1.5rem 6rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          {/* Header */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--accent)',
                marginBottom: '0.5rem',
              }}
            >
              Proof of Life
            </p>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              Share Your Story
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.65,
                maxWidth: '440px',
                margin: '0 auto',
              }}
            >
              Snap a photo from your day, a moment of service, or something that made you smile — and share it with the Citychurch community.
            </p>
          </div>

          {/* Form */}
          <div className="reveal">
            <ProofOfLifeSubmitForm />
          </div>
        </div>
      </section>
    </div>
  );
}
