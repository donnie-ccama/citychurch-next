import { Metadata } from 'next';
import Link from 'next/link';
import ImpactStats from '@/components/ImpactStats';
import DonateButton from '@/components/DonateButton';
import EmailSignup from '@/components/EmailSignup';

export const metadata: Metadata = {
  title: 'Our Story — Citychurch',
  description: "Citychurch exists to find, feed, and teach children and families in Amarillo who are most vulnerable — introducing them to Jesus Christ while meeting practical needs.",
};

export default function About() {
  const values = [
    {
      icon: '🔍',
      title: 'Find',
      description: 'We go where the children are. Parks, neighborhoods, doorsteps. We don\'t wait for them to come to us.',
    },
    {
      icon: '🍞',
      title: 'Feed',
      description: '$2.50 provides a freshly prepared hot item, fresh fruit, and popcorn. Every child eats with dignity.',
    },
    {
      icon: '✝',
      title: 'Teach',
      description: 'We introduce children and families to Jesus Christ through consistent presence, discipleship, and long-term relationship.',
    },
    {
      icon: '♻',
      title: 'Restore',
      description: 'We don\'t just serve children. We serve whole families. Parents, grandparents, and caregivers are part of the journey toward lasting transformation.',
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>


      {/* PAGE HEADER */}
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
            Our Story
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            Citychurch exists to find, feed, and teach children and families in Amarillo who are most vulnerable — introducing them to Jesus Christ while meeting practical needs with dignity, consistency, and long-term discipleship.
          </p>
        </div>
      </section>

      {/* SCRIPTURE ANCHOR */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }} className="reveal">
          <blockquote
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.375rem',
              fontStyle: 'italic',
              lineHeight: 1.8,
              color: 'var(--text-muted)',
              borderLeft: '3px solid var(--accent)',
              paddingLeft: '1.5rem',
              margin: 0,
              textAlign: 'center',
            }}
          >
            "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these."
            <span
              style={{
                display: 'block',
                marginTop: '0.75rem',
                fontSize: '0.9375rem',
                fontStyle: 'normal',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.02em',
              }}
            >
              — Matthew 19:14
            </span>
          </blockquote>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="reveal">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Why We Exist</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.625rem',
              lineHeight: 1.8,
              color: 'var(--text-primary)',
              fontWeight: 300,
              marginBottom: '1.5rem',
            }}
          >
            It started with a simple question: What if no child in Amarillo had to go to bed hungry?
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
            }}
          >
            In one of the most underserved areas of the Texas Panhandle, thousands of children face food insecurity, instability, and isolation. Citychurch was born from the conviction that these children — and the families who love them — deserve more than a system that overlooks them. They deserve to be found, fed, and taught the hope of Jesus Christ.
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
            }}
          >
            Our approach is direct: we find children where they are — in parks, in neighborhoods, on doorsteps. We feed them a freshly prepared meal for just $2.50 — a hot item, fresh fruit, and popcorn — served with dignity and consistency. And we teach them, introducing children and families to Jesus Christ through long-term discipleship and faithful presence.
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}
          >
            We believe children are the key to winning the hearts of the family. When a child is cared for, trust is built. When trust is built, doors open — to conversation, to relationship, to the gospel. And when the gospel takes root in a family, generational cycles of poverty begin to break.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="reveal">
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Our Story</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              How It Began
            </h2>
          </div>

          <div className="reveal" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              Citychurch didn't start with a strategic plan or a building. It started at street level — with a few people who believed that showing up mattered. Weekly meals in parks. Conversations on sidewalks. Knocking on doors in neighborhoods most people drive past.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              What began as a few meals became a movement. The Cafe grew into a place where children and families could gather, eat, and hear the Word of God. Park ministry brought the mission outdoors — meeting children on their turf. Neighborhood visits and home visits created the kind of relationships where real discipleship happens — not in a classroom, but at a kitchen table.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              Over time, a family restoration strategy took shape: serve the children, and you earn the trust of the family. Disciple the caregivers — parents, grandparents, aunts, uncles — and you begin to see transformation that outlasts any single program. Help with no hope is no help at all. So we bring both.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}
            >
              Today, Citychurch continues to grow — not because of a marketing strategy, but because faithful people keep showing up. We are a life-boat for the poorest children and families in Amarillo. And we will keep going — until they all know Him.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="reveal">
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>What We Do</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Find. Feed. Teach. Restore.</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {values.map((value, idx) => (
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
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span style={{ color: 'white', fontSize: '1.5rem' }}>{value.icon}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>{value.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{value.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* IMPACT STATS */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="reveal">
          <ImpactStats variant="hero" />
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="reveal">
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Our People</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Leadership Team</h2>
          </div>

          <div
            className="reveal"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '3rem 2.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--accent)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <span style={{ color: 'white', fontSize: '1.75rem' }}>♱</span>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Our Team</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.7 }}>
              Citychurch is led by faithful servants who have given their lives to the children and families of Amarillo. Team bios coming soon.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }} className="reveal">
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
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Come and Live the Mission</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>Join the Mission</h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Whether you give, pray, volunteer, or simply show up — you become part of something that changes lives. No child in Amarillo should go to bed hungry. Come and live the mission with us.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <DonateButton label="Feed a Child Today" />
            <Link
              href="/contact"
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
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* EMAIL SIGNUP */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="reveal">
          <EmailSignup />
        </div>
      </section>


    </div>
  );
}
