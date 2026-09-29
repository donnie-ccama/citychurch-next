'use client';

import { useState } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkRequestForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setState('sending');

    try {
      const res = await fetch('/api/discipleship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      if (res.ok) {
        setState('sent');
        return;
      }
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Something went wrong. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setState('idle');
  }

  if (state === 'sent') {
    return (
      <p role="status" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
        Request received. An admin will review it.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        Name
        <input name="name" required maxLength={200} autoComplete="name" style={inputStyle} />
      </label>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        Email
        <input name="email" type="email" required defaultValue={defaultEmail} autoComplete="email" style={inputStyle} />
      </label>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        Note (optional)
        <textarea name="note" rows={3} maxLength={2000} style={inputStyle} />
      </label>
      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <p role="alert" style={{ color: '#b3261e', margin: 0 }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        style={{
          padding: '0.75rem 1.25rem',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: 'var(--accent)',
          color: 'white',
          fontWeight: 600,
          cursor: state === 'sending' ? 'wait' : 'pointer',
        }}
      >
        {state === 'sending' ? 'Sending...' : 'Request access'}
      </button>
    </form>
  );
}
