import { Metadata } from 'next';
import Link from 'next/link';
import DonateButton from '@/components/DonateButton';
import EmailSignup from '@/components/EmailSignup';
import SummerMissionFAQ from '@/components/SummerMissionFAQ';

/**
 * /summer-mission — Campaign landing page for cold social traffic.
 *
 * Primary CTA: FundraiseUp portal with UTM params for attribution.
 * Lead magnet: 2026 Impact Report email capture (tagged in Mailchimp).
 *
 * Design: matches the citykid.me taupe / oatmeal theme — Inter + Source Serif 4,
 * accent rules, card-hover, reveal scroll animations.
 */

export const metadata: Metadata = {
  title: 'Summer Mission 2026 — Double Your Impact for Amarillo Kids | Citychurch',
  description:
    'This summer, every new monthly gift up to $100 is matched dollar-for-dollar. Help us invest $250,000 in 1,400 children right here in the Texas Panhandle.',
  openGraph: {
    title: 'Summer Mission 2026 — Double Your Impact',
    description:
      'Every new monthly commitment up to $100 will be matched — doubling your impact before August.',
    type: 'website',
  },
};

// Donate URL with UTM params for campaign attribution
const SUMMER_MISSION_DONATE_URL =
  'https://www.citykid.online/?form=FUNAFYBLTAV' +
  '&utm_source=social' +
  '&utm_medium=organic' +
  '&utm_campaign=summer_mission_2026' +
  '&utm_content=monthly_partner';

const findFeedTeach = [
  {
    step: 'Find',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8z" />
      </svg>
    ),
    body: 'We go to where the children are — in apartments that are hard to find and easy to ignore.',
  },
  {
    step: 'Feed',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h18l-1.5 9.5a1 1 0 0 1-1 .5h-13a1 1 0 0 1-1-.5L3 11z" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <path d="M12 4V2" />
      </svg>
    ),
    body: '150,000 meals served this year alone — a hot item, fresh fruit, and popcorn at every visit.',
  },
  {
    step: 'Teach',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8l10-5 10 5-10 5L2 8z" />
        <path d="M6 10v6a6 6 0 0 0 12 0v-6" />
        <path d="M22 8v6" />
      </svg>
    ),
    body: 'Discipleship and family restoration — the architecture of hope, built one relationship at a time.',
  },
];

const proofQuotes = [
  {
    quote: 'Hot, fresh, and right out of the oven!',
    attribution: 'A volunteer at 205 S. Polk',
  },
  {
    quote: 'Miss Citychurch! Miss Citychurch! Are you coming back tomorrow?',
    attribution: 'A child in the Eastridge apartments',
  },
  {
    quote: "I didn't know anyone cared about us out here. Now my kids ask about you all week.",
    attribution: 'A mother we serve',
  },
];

const faqItems = [
  {
    question: 'Is Citychurch a registered nonprofit?',
    answer:
      'Yes. Citychurch is a registered 501(c)(3) nonprofit organization. Your gift is tax-deductible to the full extent allowed by law, and 100% of your donation goes directly to programs that find, feed, and teach children and families in Amarillo.',
  },
  {
    question: 'Can I cancel my monthly gift anytime?',
    answer:
      'Absolutely. You can cancel, pause, or adjust the amount of your monthly gift at any time — no questions, no friction. Just email us or use the link in your donation receipt.',
  },
  {
    question: 'What if I want to give once instead?',
    answer:
      "We welcome one-time gifts too. Every meal costs about $2.50, so even a single gift goes a long way. Use the \"Give a Custom Amount\" option on the donation page to make a one-time contribution.",
  },
  {
    question: 'How do I know my gift is being used well?',
    answer:
      'Visit our Proof of Life page — it is updated weekly with real photos and stories from the apartments we serve. You will see the children, the meals, and the volunteers your gift makes possible.',
  },
];

export default function SummerMissionPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflowX: 'hidden',
      }}
    >
      {/* ============================================
          SECTION 1 — CAMPAIGN HERO
          ============================================ */}
      <section
        style={{
          padding: '6rem 1.5rem 5rem',
          background:
            'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }} className="reveal">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}
          >
            Summer Mission · 2026
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 6.5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1.5rem',
            }}
          >
            This Summer, We&rsquo;re Investing $250,000 in Amarillo Kids.
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.1875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.25rem',
              maxWidth: '640px',
              margin: '0 auto 2.25rem',
            }}
          >
            Every new monthly commitment up to $100 will be matched &mdash; doubling
            your impact before August.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <DonateButton
              label="Become a Monthly Partner →"
              href={SUMMER_MISSION_DONATE_URL}
            />
            <a
              href="#impact-report"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                borderRadius: '8px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                fontFamily: "'Inter', system-ui, sans-serif",
                transition: 'all 0.2s ease',
              }}
            >
              Download the 2026 Impact Report
            </a>
          </div>

          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
              marginTop: '2.5rem',
            }}
          >
            &ldquo;...for the heart of the city.&rdquo;
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 2 — WHY AMARILLO (Geographic urgency)
          ============================================ */}
      <section
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div className="reveal">
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
                Why Amarillo
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                }}
              >
                Right here in the Texas Panhandle, 1,400 children are waiting.
              </h2>
              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '1.0625rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: '1rem',
                }}
              >
                From our home at 205 S. Polk Street in downtown Amarillo, we walk
                into apartments that most people drive past without seeing. The
                children there are hungry, but the deeper hunger is for someone
                to know their name.
              </p>
              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '1.0625rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                }}
              >
                For 29 years, Citychurch has been showing up &mdash; meal by meal,
                week by week &mdash; to the same apartments, the same families,
                the same kids. This summer, we are going further.
              </p>
            </div>

            <div className="reveal">
              <div
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  aspectRatio: '4 / 3',
                  backgroundColor: 'var(--bg-muted)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ministry-01.jpg"
                  alt="Citychurch volunteers serving meals in an Amarillo apartment community"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem 1.25rem 1rem',
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: 'white',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: '0.9375rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    205 S. Polk Street &middot; Amarillo, TX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3 — THE MODEL: FIND, FEED, TEACH
          ============================================ */}
      <section
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '3rem',
            }}
            className="reveal"
          >
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
              The Model
            </p>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              Find. Feed. Teach.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
          >
            {findFeedTeach.map((col, idx) => (
              <div
                key={idx}
                className="reveal card-hover"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '2.25rem 1.75rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  {col.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {col.step}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                  }}
                >
                  {col.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4 — THE MATCH (Urgency mechanic)
          ============================================ */}
      <section
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            textAlign: 'center',
          }}
          className="reveal"
        >
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '1rem',
            }}
          >
            Limited-Time Match
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
            }}
          >
            Every new monthly gift, doubled.
          </h2>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.92)',
              marginBottom: '2rem',
            }}
          >
            For a limited time, every new monthly gift up to $100 is matched
            dollar-for-dollar by our Summer Mission Fund.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              maxWidth: '520px',
              margin: '0 auto 2.5rem',
            }}
          >
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
              }}
            >
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85, marginBottom: '0.5rem' }}>
                You give
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>$25/mo</p>
              <p style={{ fontSize: '0.8125rem', opacity: 0.85, marginTop: '0.25rem' }}>
                we receive <strong>$50</strong>
              </p>
            </div>
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
              }}
            >
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85, marginBottom: '0.5rem' }}>
                You give
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>$50/mo</p>
              <p style={{ fontSize: '0.8125rem', opacity: 0.85, marginTop: '0.25rem' }}>
                we receive <strong>$100</strong>
              </p>
            </div>
          </div>

          <a
            href={SUMMER_MISSION_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.9375rem 2.25rem',
              backgroundColor: 'white',
              color: 'var(--accent)',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            }}
          >
            Start My Monthly Gift →
          </a>
        </div>
      </section>

      {/* ============================================
          SECTION 5 — SOCIAL PROOF / PROOF OF LIFE
          ============================================ */}
      <section
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div
            style={{ textAlign: 'center', marginBottom: '3rem' }}
            className="reveal"
          >
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
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              Voices from the apartments we serve
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {proofQuotes.map((q, idx) => (
              <figure
                key={idx}
                className="reveal"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderLeft: '3px solid var(--accent)',
                  borderRadius: '12px',
                  padding: '2rem 1.75rem',
                  margin: 0,
                }}
              >
                <blockquote
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: '1.125rem',
                    fontStyle: 'italic',
                    lineHeight: 1.55,
                    color: 'var(--text-primary)',
                    margin: 0,
                    marginBottom: '1.25rem',
                  }}
                >
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                  }}
                >
                  &mdash; {q.attribution}
                </figcaption>
              </figure>
            ))}
          </div>

          <div style={{ textAlign: 'center' }} className="reveal">
            <Link
              href="/proof-of-life"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              See more on the Proof of Life page →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6 — LEAD MAGNET
          ============================================ */}
      <section
        id="impact-report"
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            textAlign: 'center',
          }}
          className="reveal"
        >
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              marginBottom: '0.75rem',
            }}
          >
            Free Download
          </p>
          <h2
            style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
            }}
          >
            Not ready to give today? Start with something free.
          </h2>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Download our 2026 Impact Report &mdash; full of stories, stats, and
            ways to pray for the 1,400 kids we serve.
          </p>

          <EmailSignup
            heading=""
            subtext=""
            tag="summer-mission-2026-impact-report"
          />

          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginTop: '1rem',
            }}
          >
            We&rsquo;ll email you the report and occasional updates from the field. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 7 — FAQ / OBJECTION HANDLING
          ============================================ */}
      <section
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div
            style={{ textAlign: 'center', marginBottom: '3rem' }}
            className="reveal"
          >
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
              Common Questions
            </p>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              Before you give, here&rsquo;s what people ask.
            </h2>
          </div>

          <div className="reveal">
            <SummerMissionFAQ items={faqItems} />
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8 — FOOTER CTA
          ============================================ */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background:
            'linear-gradient(135deg, var(--bg-muted) 0%, var(--bg-primary) 100%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{ maxWidth: '640px', margin: '0 auto' }}
          className="reveal"
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Join the Summer Mission.
          </h2>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.25rem',
            }}
          >
            Be one of the partners who help us reach $250,000 before August.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <DonateButton
              label="Become a Monthly Partner →"
              href={SUMMER_MISSION_DONATE_URL}
            />
          </div>

          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
              marginTop: '2.5rem',
            }}
          >
            citykid.me/give
          </p>
        </div>
      </section>
    </div>
  );
}
