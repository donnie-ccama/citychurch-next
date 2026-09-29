'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkLoginPage() {
  const router = useRouter();
  const [supabase] = useState(createSupabaseBrowser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.replace('/discipleship');
    router.refresh();
  }

  async function handleForgotPassword() {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Enter your email above, then click "Forgot password?" again.');
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/discipleship/set-password`,
    });
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage('Check your email for a link to set a new password.');
  }

  return (
    <main style={{ maxWidth: '24rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Discipleship Training Kit login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.375rem' }}>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '0.375rem' }}>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" style={inputStyle} />
        </label>
        {error && <p role="alert" style={{ color: '#b3261e', margin: 0 }}>{error}</p>}
        {message && <p role="status" style={{ margin: 0 }}>{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '0.75rem', border: 'none', borderRadius: '6px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer' }}
        >
          {isLoading ? 'Signing in...' : 'Log in'}
        </button>
        <button
          type="button"
          onClick={handleForgotPassword}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, justifySelf: 'start' }}
        >
          Forgot password?
        </button>
      </form>
    </main>
  );
}
