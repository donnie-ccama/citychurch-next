'use client';

import { useState } from 'react';

/**
 * EmailSignup — Mailchimp email list signup component.
 *
 * Integration options (choose one and uncomment):
 * 1. Mailchimp embedded form action URL (simplest)
 * 2. Next.js API route that calls Mailchimp API (best UX)
 * 3. Supabase table as fallback
 *
 * Replace MAILCHIMP_FORM_URL with your Mailchimp embedded form action URL.
 * Find it in Mailchimp → Audience → Signup forms → Embedded forms → form action URL.
 */

// TODO: Replace with your Mailchimp form action URL
const MAILCHIMP_FORM_URL = 'https://YOUR_MAILCHIMP_FORM_ACTION_URL';

interface EmailSignupProps {
  variant?: 'inline' | 'stacked' | 'footer';
  heading?: string;
  subtext?: string;
  tag?: string;
}

export default function EmailSignup({
  variant = 'stacked',
  heading = 'Stay Connected',
  subtext = 'Get stories of impact, ministry updates, and ways to help — delivered to your inbox.',
  tag = 'website-signup-2026',
}: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const isInline = variant === 'inline';
  const isFooter = variant === 'footer';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // Option 1: Direct Mailchimp form submission (basic — no JS feedback)
      // Uncomment and use this if you want the simplest approach:
      // window.open(`${MAILCHIMP_FORM_URL}&EMAIL=${encodeURIComponent(email)}&FNAME=${encodeURIComponent(firstName)}&TAGS=${tag}`, '_blank');

      // Option 2: API route (recommended for better UX)
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, tag }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
        setFirstName('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (status === 'success') {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          You're in.
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Thank you for joining us. Watch your inbox for stories of hope from Amarillo.
        </p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: isFooter ? 'left' : 'center' }}>
      {!isFooter && heading && (
        <h3
          style={{
            fontWeight: 700,
            fontSize: isInline ? '1.125rem' : '1.5rem',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
          }}
        >
          {heading}
        </h3>
      )}
      {!isFooter && subtext && (
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            maxWidth: '480px',
            margin: '0 auto 1.5rem',
          }}
        >
          {subtext}
        </p>
      )}
      {isFooter && (
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
          Join Our Email List
        </h4>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: isInline ? 'row' : 'column',
          gap: '0.75rem',
          maxWidth: isFooter ? '100%' : '420px',
          margin: isFooter ? '0' : '0 auto',
        }}
      >
        {!isFooter && (
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.9375rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: "'Inter', system-ui, sans-serif",
              boxSizing: 'border-box',
              width: '100%',
            }}
          />
        )}
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isFooter ? 'Your email' : 'Email address'}
            required
            style={{
              padding: '0.75rem 1rem',
              fontSize: isFooter ? '0.875rem' : '0.9375rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: "'Inter', system-ui, sans-serif",
              boxSizing: 'border-box',
              flex: 1,
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: isFooter ? '0.75rem 1rem' : '0.75rem 1.5rem',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: isFooter ? '0.8125rem' : '0.9375rem',
              cursor: status === 'loading' ? 'default' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
              fontFamily: "'Inter', system-ui, sans-serif",
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'loading' ? 'Joining...' : isFooter ? 'Join' : 'Join the List'}
          </button>
        </div>
      </form>

      {status === 'error' && (
        <p style={{ fontSize: '0.8125rem', color: '#ef4444', marginTop: '0.75rem' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
