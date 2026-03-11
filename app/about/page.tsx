import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'About — Citychurch',
  description: "Learn about Citychurch Amarillo's mission, values, and the team serving the heart of the city through authentic outreach and documentary storytelling.",
};

export default function About() {
  const values = [
    {
      icon: '◆',
      title: 'Authenticity',
      description: 'We show up as our real selves. No performance, no agenda, no sales pitch. We believe genuine presence is more powerful than polished messaging.',
    },
    {
      icon: '☙',
      title: 'Service First',
      description: 'We serve without strings attached. No one is asked to believe anything or join anything. We simply serve because we believe it\'s the right thing to do.',
    },
    {
      icon: '◇',
      title: 'Community',
      description: 'We belong to each other and to Amarillo. We celebrate the dignity and stories of every person we encounter. Community is not transactional.',
    },
    {
      icon: '▪',
      title: 'Documentary Witness',
      description: 'We document and share what we see. Through photographs, video, stories, and conversation — we honor the work and amplify the voices of those we serve.',
    },
  ];

  const teamMembers = [
    {
      name: 'Sarah Mitchell',
      role: 'Founder & Director',
      bio: 'Sarah founded Citychurch in 2019 after a calling to serve downtown Amarillo. She leads with vision, humility, and a deep commitment to authentic community.',
    },
    {
      name: 'Marcus Johnson',
      role: 'Community Outreach Lead',
      bio: 'Marcus coordinates our outreach events and works directly with neighbors in the community. His heart for service is contagious and real.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Documentary & Media',
      bio: 'Emma captures our story through photography and video. She believes every moment and every person deserves to be honored and witnessed.',
    },
    {
      name: 'David Chen',
      role: 'Partnership & Development',
      bio: 'David builds relationships with local organizations and helps Citychurch extend its reach. He\'s passionate about collaboration.',
    },
    {
      name: 'Jennifer Lee',
      role: 'Volunteer Coordinator',
      bio: 'Jennifer mobilizes our volunteers and helps turn passion into action. She understands that our work is only possible because of generous people.',
    },
    {
      name: 'Michael Torres',
      role: 'Spiritual Formation',
      bio: 'Michael leads reflection, prayer, and spiritual practices within our team. He helps us stay grounded in our why.',
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
            About Citychurch
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            We are a community of people dedicated to authentic service, documentary witness, and the belief that transformation happens when we show up without agenda.
          </p>
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Our Mission</span>
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
            We don't sell anything. We don't ask for commitments. We simply show up, serve our neighbors with genuine compassion, and document what we see.
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
            }}
          >
            Citychurch exists to be a present, humble witness to the work of transformation happening in Amarillo. Our approach is documentary-style and authentic. We believe the most powerful witness is not a sales pitch or a campaign — it's simply people showing up, doing the work, and letting the story speak for itself.
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}
          >
            We serve our community through outreach, prayer, presence, and storytelling. We trust that authentic compassion, without pretense or hidden agenda, can reshape a city from the inside out.
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
              How We Began
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
              Citychurch was founded on a simple conviction: that the heart of a city can be transformed through authentic presence and genuine service. We didn't start as an organization with a strategic plan. We started as a group of people who felt called to be present in downtown Amarillo.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              What began as weekly meal services and prayer walks evolved into something larger — a movement of people committed to seeing their neighbors, celebrating their stories, and walking alongside them. Every outreach event, every conversation, every documented moment has shaped who we are.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              Today, Citychurch is composed of people from different faith traditions, different backgrounds, and different walks of life. What unites us is this: a deep love for Amarillo, a commitment to authentic witness, and the belief that small acts of service are never small when done with intention and love.
            </p>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}
            >
              We continue to evolve, learn, and listen. We don't have all the answers. What we do have is a commitment to showing up, documenting the work, and sharing the stories of the people and the city we love.
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>What We Believe</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Our Core Values</h2>
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

      {/* LEADERSHIP TEAM */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
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
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="reveal card-hover"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    aspectRatio: '1/1',
                    backgroundColor: 'var(--bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Portrait Placeholder</span>
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{member.name}</h3>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {member.role}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{member.bio}</p>
                </div>
              </div>
            ))}
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
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get Involved</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>Join the Work</h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            We're always looking for people who want to show up, serve, and be part of something real. Whether you can volunteer for a few hours, join us at an event, or simply walk alongside us in this work — you belong here.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/events"
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
              Upcoming Events
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
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
              Get In Touch
            </Link>
          </div>
        </div>
      </section>



    </div>
  );
}
