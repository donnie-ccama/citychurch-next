'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

interface Submission {
  id: string;
  photo_url: string;
  description: string | null;
  created_at: string;
}

export default function ProofOfLifeHomepagePreview() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) {
          setLoaded(true);
          return;
        }

        const supabase = createClient(url, key);
        const { data } = await supabase
          .from('proof_of_life')
          .select('id, photo_url, description, created_at')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(4);

        setSubmissions(data || []);
      } catch {
        // Silently fail — homepage preview is non-critical
      } finally {
        setLoaded(true);
      }
    }

    fetchRecent();
  }, []);

  if (!loaded) return null;

  return (
    <div>
      {submissions.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {submissions.map((s) => (
            <Link
              key={s.id}
              href="/proof-of-life"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="card-hover"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    aspectRatio: '4/3',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-muted)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.photo_url}
                    alt={s.description || 'Community photo'}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
                {s.description && (
                  <div style={{ padding: '0.75rem 1rem' }}>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {s.description}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            No photos shared yet. Be the first to contribute!
          </p>
          <Link
            href="/proof-of-life/submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.625rem 1.25rem',
              backgroundColor: 'var(--accent)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            Share a Photo &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
