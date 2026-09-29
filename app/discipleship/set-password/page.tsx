'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const RESET_LINK_MESSAGE =
  'This reset link didn\'t work. Open it in the same browser where you clicked "Forgot password?", or request a new one there.';

const EXPIRED_MESSAGE =
  'This link is invalid or has expired. Use "Forgot password?" on the login page to get a new one.';

// Invite links arrive with tokens in the URL hash (#access_token=...).
// Password-reset links arrive with ?code=... . The default browser client
// rejects hash tokens, so this page turns off auto-detection and reads both.
function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { isSingleton: false, auth: { detectSessionInUrl: false } }
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkSetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(createClient);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    // Links are one-time use. StrictMode runs effects twice in dev.
    if (started.current) return;
    started.current = true;
    async function startSession() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const code = new URLSearchParams(window.location.search).get('code');
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');

      const usingHash = Boolean(accessToken && refreshToken);
      const result =
        accessToken && refreshToken
          ? await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          : code
            ? await supabase.auth.exchangeCodeForSession(code)
            : null;

      if (!result || result.error) {
        setError(!usingHash && code ? RESET_LINK_MESSAGE : EXPIRED_MESSAGE);
        return;
      }

      // Drop the tokens from the address bar.
      window.history.replaceState(null, '', window.location.pathname);
      setError('');
      setReady(true);
    }
    startSession();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }
    router.replace('/discipleship');
    router.refresh();
  }

  return (
    <main style={{ maxWidth: '24rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Set your password</h1>
      {!ready && !error && <p>Checking your link...</p>}
      {error && <p role="alert" style={{ color: '#b3261e' }}>{error}</p>}
      {ready && (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.375rem' }}>
            New password
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" style={inputStyle} />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: '0.75rem', border: 'none', borderRadius: '6px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer' }}
          >
            {isLoading ? 'Saving...' : 'Save password'}
          </button>
        </form>
      )}
    </main>
  );
}
