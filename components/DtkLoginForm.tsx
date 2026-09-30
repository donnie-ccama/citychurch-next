'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { DTK_COPY } from '@/lib/dtk/i18n';
import { dtkPath, type DtkLang } from '@/lib/dtk/pages';
import DtkLanguageSwitch from '@/components/DtkLanguageSwitch';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  font: 'inherit',
};

export default function DtkLoginForm({ lang }: { lang: DtkLang }) {
  const copy = DTK_COPY[lang];
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
      setError(
        copy.loginFailed === null
          ? signInError.message
          : signInError.code === 'invalid_credentials'
            ? copy.loginFailed
            : copy.formGenericError
      );
      setIsLoading(false);
      return;
    }

    router.replace(dtkPath(lang, 'index'));
    router.refresh();
  }

  async function handleForgotPassword() {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError(copy.forgotNeedEmail);
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${dtkPath(lang, 'set-password')}`,
    });
    if (resetError) {
      setError(lang === 'es' ? copy.formGenericError : resetError.message);
      return;
    }
    setMessage(copy.forgotSent);
  }

  return (
    <main lang={lang} style={{ maxWidth: '24rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <DtkLanguageSwitch lang={lang} page="login" />
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{copy.loginTitle}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.375rem' }}>
          {copy.formEmail}
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '0.375rem' }}>
          {copy.loginPassword}
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" style={inputStyle} />
        </label>
        {error && <p role="alert" style={{ color: '#b3261e', margin: 0 }}>{error}</p>}
        {message && <p role="status" style={{ margin: 0 }}>{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '0.75rem', border: 'none', borderRadius: '6px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer' }}
        >
          {isLoading ? copy.loginSigningIn : copy.logIn}
        </button>
        <button
          type="button"
          onClick={handleForgotPassword}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, justifySelf: 'start' }}
        >
          {copy.forgotPassword}
        </button>
      </form>
    </main>
  );
}
