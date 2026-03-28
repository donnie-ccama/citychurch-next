'use client';

import { useState, useEffect, useCallback } from 'react';
import ProofOfLifeCard from './ProofOfLifeCard';

interface Submission {
  id: string;
  photo_url: string;
  description: string | null;
  created_at: string;
}

interface ProofOfLifeGridProps {
  initialSubmissions: Submission[];
}

export default function ProofOfLifeGrid({ initialSubmissions }: ProofOfLifeGridProps) {
  const [submissions] = useState<Submission[]>(initialSubmissions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const selected = submissions.find((s) => s.id === selectedId) || null;

  const openModal = (id: string) => {
    setSelectedId(id);
    // Trigger animation on next frame
    requestAnimationFrame(() => setIsAnimating(true));
  };

  const closeModal = useCallback(() => {
    setIsAnimating(false);
    // Wait for animation to finish before removing
    setTimeout(() => setSelectedId(null), 300);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedId]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedId) closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedId, closeModal]);

  if (submissions.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          No photos yet! Be the first to share a moment.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Layout */}
      <div className="pol-masonry">
        {submissions.map((submission) => (
          <div key={submission.id} className="reveal pol-masonry-item">
            <ProofOfLifeCard
              {...submission}
              onClick={() => openModal(submission.id)}
            />
          </div>
        ))}
      </div>

      <style>{`
        .pol-masonry {
          columns: 3;
          column-gap: 1.5rem;
        }
        .pol-masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
        }

        /* Tablet: 2 columns */
        @media (max-width: 1024px) {
          .pol-masonry {
            columns: 2;
          }
        }

        /* Phone: single column */
        @media (max-width: 640px) {
          .pol-masonry {
            columns: 1;
          }
        }
      `}</style>

      {/* Modal Overlay */}
      {selectedId && selected && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backgroundColor: isAnimating ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0)',
            transition: 'background-color 0.3s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              overflow: 'hidden',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              transform: isAnimating ? 'scale(1)' : 'scale(0.9)',
              opacity: isAnimating ? 1 : 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontSize: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 101,
              }}
            >
              &times;
            </button>

            {/* Image — full natural size */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.photo_url}
              alt={selected.description || 'Community photo'}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                backgroundColor: 'var(--bg-muted)',
              }}
            />

            {/* Details */}
            <div style={{ padding: '1.5rem' }}>
              {selected.description && (
                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {selected.description}
                </p>
              )}
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                }}
              >
                {new Date(selected.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
