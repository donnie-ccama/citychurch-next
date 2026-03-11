import { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Get Involved — Citychurch',
  description: 'Connect with Citychurch Amarillo. Volunteer, share your story, or get involved in our mission to serve the heart of the city.',
};

export default function Contact() {
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
            Get Involved
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            We'd love to connect with you. Whether you want to volunteer, attend an event, share your story, or support our work — you belong here.
          </p>
        </div>
      </section>

      {/* WAYS TO CONNECT */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
              Ways to Connect
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              How You Can Be Part of This
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                title: 'Volunteer',
                description: 'Help us serve our community. From meal prep to event coordination to media work — we have roles for every skill.',
                icon: '🤝',
              },
              {
                title: 'Attend an Event',
                description: 'Join us at one of our outreach events. Come to serve, come to eat, come to belong. All are welcome.',
                icon: '📅',
              },
              {
                title: 'Share Your Story',
                description: 'Have a story to tell? We\'d love to document and share what\'s happening in your life and community.',
                icon: '📖',
              },
              {
                title: 'Support Our Work',
                description: 'Our mission runs on donations, grants, and community support. Every contribution makes a real difference.',
                icon: '💝',
              },
            ].map((item, idx) => (
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
                    fontSize: '3rem',
                    marginBottom: '1rem',
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT FORM */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Let's Connect
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Fill out the form below and we'll get back to you soon.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* CHURCH INFO */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal">
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
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Direct Contact</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginTop: '3rem' }}>
              {[
                {
                  label: 'Email',
                  value: 'hello@citychurch.com',
                  href: 'mailto:hello@citychurch.com',
                },
                {
                  label: 'Phone',
                  value: '(806) 555-0123',
                  href: 'tel:+18065550123',
                },
                {
                  label: 'Location',
                  value: 'Amarillo, Texas',
                  href: '#',
                },
              ].map((info, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {info.label}
                  </p>
                  <a
                    href={info.href}
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      textDecoration: 'none',
                    }}
                  >
                    {info.value}
                  </a>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Follow Us</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                {['YouTube', 'Instagram', 'Facebook', 'Vimeo'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}
