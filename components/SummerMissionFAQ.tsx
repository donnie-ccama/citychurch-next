'use client';

import { useState } from 'react';

/**
 * SummerMissionFAQ — Lightweight accordion for the /summer-mission page.
 * Uses the site's taupe + accent design tokens.
 */

interface FAQItem {
  question: string;
  answer: string;
}

interface SummerMissionFAQProps {
  items: FAQItem[];
}

export default function SummerMissionFAQ({ items }: SummerMissionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: '28px',
                  height: '28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: isOpen ? 'var(--accent)' : 'var(--bg-muted)',
                  color: isOpen ? 'white' : 'var(--text-secondary)',
                  fontSize: '1.125rem',
                  lineHeight: 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {isOpen ? '–' : '+'}
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '0 1.5rem 1.25rem',
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
