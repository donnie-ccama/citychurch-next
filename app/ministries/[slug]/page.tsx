import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';
import { ministries, getMinistry } from '@/lib/ministries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ministries.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry) return { title: 'Ministry Not Found | Citychurch' };
  return {
    title: `${ministry.title} | Citychurch`,
    description: ministry.description,
  };
}

export default async function MinistryPage({ params }: PageProps) {
  const { slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry) notFound();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* HERO */}
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className="reveal">
          <div
            style={{
              fontSize: '2.5rem',
              color: 'var(--accent)',
              marginBottom: '1rem',
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            {ministry.icon}
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
            }}
          >
            {ministry.title}
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            {ministry.description}
          </p>
        </div>
      </section>

      {/* DETAILS PLACEHOLDER */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }} className="reveal">
          <SectionHeader label="More Details" title="Coming Soon" />
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginTop: '1.5rem',
            }}
          >
            We&apos;re still building out this page. In the meantime, reach out and we&apos;ll connect you with the right person.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.875rem 2rem',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9375rem',
                borderRadius: '8px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              Get in Touch
            </Link>
            <Link
              href="/ministries"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.875rem 2rem',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid var(--border-color)',
                letterSpacing: '-0.01em',
              }}
            >
              ← All Ministries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
