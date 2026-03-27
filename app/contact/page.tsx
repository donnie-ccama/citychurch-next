import { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import DonateButton from '@/components/DonateButton';
import EmailSignup from '@/components/EmailSignup';

export const metadata: Metadata = {
  title: 'Get Involved — Citychurch',
  description: 'No child in Amarillo should go to bed hungry. Give, volunteer, host a food drive, or pray with Citychurch as we feed children and families across the city.',
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
            No child in Amarillo should go to bed hungry. Whether you give, serve, pray, or show up — there's a place for you in this mission.
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
                title: 'Feed a Child',
                description: 'Just $2.50 feeds a child today. Give once, or become a monthly partner and feed children every week.',
                icon: '♥',
                hasDonate: true,
              },
              {
                title: 'Volunteer',
                description: 'Serve meals, deliver food, or help in the Cafe. We need hands and hearts every week.',
                icon: '✋',
                hasDonate: false,
              },
              {
                title: 'Host a Food Drive',
                description: 'Rally your church, school, or business. We\'ll give you everything you need to collect food and supplies for children in Amarillo.',
                icon: '☐',
                hasDonate: false,
              },
              {
                title: 'Pray With Us',
                description: 'Lift up the children and families we serve. Pray for provision, for healing, and for generational transformation.',
                icon: '✝',
                hasDonate: false,
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
                    fontSize: '2rem',
                    color: 'var(--accent)',
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
                    flex: 1,
                    marginBottom: item.hasDonate ? '1.5rem' : '0',
                  }}
                >
                  {item.description}
                </p>
                {item.hasDonate && (
                  <div style={{ marginTop: 'auto' }}>
                    <DonateButton label="Feed a Child Today" />
                  </div>
                )}
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

      {/* EMAIL SIGNUP */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="reveal">
          <EmailSignup heading="Stay Connected" subtext="Get stories of impact, ministry updates, and ways to help — delivered to your inbox." />
        </div>
      </section>

      {/* CHURCH INFO */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
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
                  value: 'donnie@citykid.me',
                  href: 'mailto:donnie@citykid.me',
                },
                {
                  label: 'Phone',
                  value: '(806) 371-0089',
                  href: 'tel:+18063710089',
                },
                {
                  label: 'Location',
                  value: '205 S. Polk Street, Amarillo, TX 79101',
                  href: 'https://maps.google.com/?q=205+S+Polk+St+Amarillo+TX+79101',
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
                {[
                  { name: 'Facebook', href: 'https://www.facebook.com/citychurchamarillo' },
                  { name: 'Instagram', href: '#' },
                  { name: 'YouTube', href: '#' },
                  { name: 'Vimeo', href: '#' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href !== '#' ? '_blank' : undefined}
                    rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {social.name}
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
