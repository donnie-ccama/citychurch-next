'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowser();

  const initialError =
    searchParams.get('error') === 'unauthorized'
      ? 'That account isn’t authorized to access the admin.'
      : '';

  const redirectTo = searchParams.get('redirect') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

    // Full reload so the middleware re-evaluates with the fresh cookie.
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--accent)',
              margin: 0,
              marginBottom: '0.5rem',
            }}
          >
            Citychurch
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Admin Panel
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginTop: 0,
              marginBottom: '1.5rem',
            }}
          >
            Sign In
          </h2>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                borderRadius: '8px',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
                color: '#DC2626',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: isLoading
                  ? 'var(--text-secondary)'
                  : 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            href="/"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
