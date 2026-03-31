import { Metadata } from 'next';
import Link from 'next/link';
import ImpactStats from '@/components/ImpactStats';
import DonateButton from '@/components/DonateButton';
import EmailSignup from '@/components/EmailSignup';
import GuidingPrinciples from '@/components/GuidingPrinciples';

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
              textAlign: 'center',
            }}
          >
            It all began with a simple question: What if the Gospel were as free as the air we breathe?
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
            }}
          >
            It sounds like an easy question, but in reality, churches were often started everywhere except the poorest parts of the city. In one of the most underserved areas of the Texas Panhandle, thousands of children struggle with hunger, instability, and loneliness. Citychurch began because we believe these children and their families deserve more than just sympathy. They deserve real pastoral care. They deserve to be found, fed, and shown the hope of Jesus Christ.
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
            }}
          >
            Our approach is straightforward. We meet children where they are—whether in parks, neighborhoods, or at their doorsteps. We provide meals with dignity and reliability. We also teach, introducing children and families to Jesus Christ through ongoing discipleship and a steady presence.
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}
          >
            We believe children are the key to reaching families. When a child feels cared for, trust grows. With trust, families become open to conversation, relationships, and the gospel. As the gospel takes root, families can begin to break the cycle of poverty for future generations.
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
              Citychurch started in 1997 when the Lane family moved into an old warehouse in downtown Amarillo. Don and Diana Lane, along with their children Donnie, James, and Anna, were recovering from a difficult time. Don had just received a liver transplant, and the family had lost their church, home, cars, and financial security. Through it all, they stuck together and believed God had protected them for a special purpose.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              Don and Diana always cared deeply for families often overlooked by churches, whether because of where they lived, their struggles, or the color of their skin.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              Citychurch started in a simple way: talking with people on sidewalks and knocking on doors in neighborhoods that many others ignored.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              What started with a few meals turned into a movement. Over the years, Citychurch has become a welcoming place for families, churches, and neighbors who care about helping those in need, especially children. The Cafe is now a spot where children and families can eat together and hear the Word of God. Park Ministry took the mission outside, meeting children where they are. Visiting neighborhoods and homes has built real relationships, where discipleship happens not in a classroom, but around a kitchen table.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              Over time, we found a way to help families heal: serve the children first to earn the family&#39;s trust. When we support and guide caregivers, parents, grandparents, aunts, and uncles, real change happens that lasts beyond any program. We believe that help without hope is not enough, so we offer both.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}
            >
              Today, Citychurch keeps growing, not because of advertising, but because faithful people continue to show up. We are a lifeboat for the poorest children and families in Amarillo, and we will keep going until everyone knows Him.
            </p>
          </div>
        </div>
      </section>

      {/* OUR GUIDING PRINCIPLES */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>What Guides Us</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Our Guiding Principles</h2>
          </div>

          <div className="reveal">
            <GuidingPrinciples />
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
