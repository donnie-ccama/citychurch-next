'use client';

import Link from 'next/link';
import Image from 'next/image';
import EmailSignup from './EmailSignup';

const DONATE_URL = 'https://aecfdssy.donorsupport.co';

export default function Footer() {
  const footerLinkStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.9375rem',
    textDecoration: 'none' as const,
    transition: 'color 0.2s ease',
    display: 'block' as const,
  };

  return (
    <footer
      style={{
        padding: '4rem 1.5rem 2rem',
        backgroundColor: 'var(--bg-muted)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <Image
                src="/logo.png"
                alt="Citychurch"
                width={32}
                height={32}
                style={{ objectFit: 'contain' }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Citychurch
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontStyle: 'italic',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}
            >
              ...for the heart of the city.
            </p>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                marginTop: '0.5rem',
                lineHeight: 1.5,
              }}
            >
              Finding, feeding, and teaching children and families in Amarillo.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4
              style={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}
            >
              Navigate
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Link href="/visit" style={footerLinkStyle}>Plan Your Visit</Link>
              <Link href="/about" style={footerLinkStyle}>Our Story</Link>
              <Link href="/ministries" style={footerLinkStyle}>How We Help</Link>
              <Link href="/donate" style={footerLinkStyle}>Give</Link>
              <Link href="/contact" style={footerLinkStyle}>Get Involved</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4
              style={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}
            >
              Connect
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <a href="https://www.facebook.com/citychurchamarillo" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Facebook</a>
              <a href="https://www.instagram.com/citychurchamarillo" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Instagram</a>
              <a href="https://www.youtube.com/@AmarilloCitychurch" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>YouTube</a>
              <a href="https://vimeo.com/heartofthecity" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Vimeo</a>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...footerLinkStyle,
                  color: 'var(--accent)',
                  fontWeight: 600,
                }}
              >
                Donate
              </a>
            </div>
          </div>

          {/* Email Signup */}
          <div>
            <EmailSignup variant="footer" />
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
            }}
          >
            &copy; {new Date().getFullYear()} Citychurch Amarillo. All rights reserved.
          </p>
          <a
            href="https://www.perplexity.ai/computer"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.6875rem',
              textDecoration: 'none',
              opacity: 0.7,
            }}
          >
            Created with Perplexity Computer
          </a>
        </div>
      </div>
    </footer>
  );
}
