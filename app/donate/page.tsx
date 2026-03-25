import { Metadata } from 'next';
import DonateButton from '@/components/DonateButton';
import ImpactStats from '@/components/ImpactStats';
import EmailSignup from '@/components/EmailSignup';

export const metadata: Metadata = {
  title: 'Donate — Feed a Child in Amarillo | Citychurch',
  description: 'Just $2.50 feeds a child in Amarillo. Each meal includes a freshly prepared hot item, fresh fruit, and popcorn. Give today to help us find, feed, and teach children and families.',
};

const mealTiers = [
  {
    amount: '$2.50',
    label: 'Feed a Child',
    description: '1 meal — a hot item, fresh fruit, and popcorn',
  },
  {
    amount: '$17.50',
    label: 'Feed a Child for a Week',
    description: '7 meals for one child',
  },
  {
    amount: '$75',
    label: 'Feed a Child for a Month',
    description: '30 meals for one child',
  },
  {
    amount: '$25/mo',
    label: 'Monthly Partner',
    description: '10 meals every month — ongoing impact',
    featured: true,
  },
];

export default function DonatePage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* HERO */}
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }} className="reveal">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}
          >
            Give Today
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            $2.50 Feeds a Child
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '0.5rem',
            }}
          >
            Every meal includes a freshly prepared hot item, fresh fruit, and popcorn — served with dignity to children and families in Amarillo who need it most.
          </p>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            "No child in Amarillo should go to bed hungry."
          </p>
        </div>
      </section>

      {/* DONATION TIERS */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {mealTiers.map((tier, idx) => (
              <div
                key={idx}
                className="reveal card-hover"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: tier.featured ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
              >
                {tier.featured && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-0.75rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                    }}
                  >
                    Greatest Impact
                  </span>
                )}
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--accent)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {tier.amount}
                </p>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.0625rem',
                    letterSpacing: '-0.01em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {tier.label}
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    flex: 1,
                    marginBottom: '1.5rem',
                  }}
                >
                  {tier.description}
                </p>
                <DonateButton
                  label={tier.featured ? 'Give Monthly' : 'Give Now'}
                  fullWidth
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }} className="reveal">
            <DonateButton
              label="Give a Custom Amount"
              variant="outline"
              icon={false}
            />
          </div>
        </div>
      </section>

      {/* HOW YOUR GIFT HELPS */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }} className="reveal">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your Impact</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Where Your Gift Goes
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            100% of your donation goes directly to feeding children and families in Amarillo. Every meal is freshly prepared by our volunteers and served with care. We don't just hand out food — we sit with families, build relationships, and walk alongside them toward lasting change.
          </p>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '1.125rem',
              color: 'var(--text-muted)',
              marginTop: '2rem',
            }}
          >
            "Help with no hope is no help at all."
          </p>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="reveal">
          <ImpactStats />
        </div>
      </section>

      {/* EMAIL SIGNUP */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="reveal">
          <EmailSignup
            heading="Not Ready to Give? Stay Connected."
            subtext="Join our email list for stories of impact, ministry updates, and ways to help."
          />
        </div>
      </section>

    </div>
  );
}
