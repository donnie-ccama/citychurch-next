'use client';

import { useState } from 'react';

const schedule = [
  {
    heading: 'Sunday',
    items: [
      { label: 'Breakfast', time: '9:30 AM' },
      { label: 'Bible Study', time: '10:00 AM' },
      { label: 'Worship (EN)', time: '11:00 AM' },
      { label: 'Worship (ES)', time: '12:30 PM' },
    ],
  },
  {
    heading: 'Wednesday',
    items: [
      { label: 'Family Night Dinner', time: '5:30 PM' },
      { label: 'Groups', time: '6:15 PM' },
    ],
  },
  {
    heading: 'Volunteer Hours',
    items: [{ label: 'Mon\u2013Thu', time: '9:00 AM \u2013 5:00 PM' }],
  },
];

const headingStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.95)',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '0.8125rem',
  fontWeight: 500,
};

const timeStyle: React.CSSProperties = {
  color: 'var(--accent)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

export default function ServiceTimesCard() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '1.25rem',
        left: '1.25rem',
        zIndex: 10,
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: open ? '10px 10px 0 0' : '10px',
          color: 'var(--accent)',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'border-radius 0.3s ease, background 0.2s ease',
          letterSpacing: '-0.01em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Service Times
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transition: 'transform 0.3s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expandable panel */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? '500px' : '0',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.35s ease, opacity 0.25s ease',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            padding: '0.75rem 1.25rem 1rem',
            minWidth: '240px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {schedule.map((section, i) => (
              <div key={section.heading}>
                {i > 0 && (
                  <hr
                    style={{
                      border: 'none',
                      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                      margin: '0 0 0.75rem',
                    }}
                  />
                )}
                <h4 style={headingStyle}>{section.heading}</h4>
                <ul
                  style={{
                    listStyle: 'none',
                    margin: '0.375rem 0 0',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                  }}
                >
                  {section.items.map((item) => (
                    <li
                      key={item.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: '1rem',
                      }}
                    >
                      <span style={labelStyle}>{item.label}</span>
                      <span style={timeStyle}>{item.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
