'use client';

import { useState } from 'react';
import { DTK_COPY } from '@/lib/dtk/i18n';
import type { DtkLang } from '@/lib/dtk/pages';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkRequestForm({ lang, defaultEmail }: { lang: DtkLang; defaultEmail: string }) {
  const copy = DTK_COPY[lang];
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
      setError(res.status === 400 && body.error ? body.error : copy.formGenericError);
    } catch {
      setError(copy.formGenericError);
    }
    setState('idle');
  }

  if (state === 'sent') {
    return (
      <p role="status" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
        {copy.formReceived}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <input type="hidden" name="lang" value={lang} />
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        {copy.formName}
        <input name="name" required maxLength={200} autoComplete="name" style={inputStyle} />
      </label>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        {copy.formEmail}
        <input name="email" type="email" required defaultValue={defaultEmail} autoComplete="email" style={inputStyle} />
      </label>
      <label style={{ display: 'grid', gap: '0.375rem' }}>
        {copy.formNote}
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
        {state === 'sending' ? copy.formSending : copy.formSubmit}
      </button>
    </form>
  );
}
