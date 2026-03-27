'use client';

import { useState } from 'react';

interface EventRegistrationFormProps {
  eventSlug: string;
  eventTitle: string;
}

export default function EventRegistrationForm({
  eventSlug,
  eventTitle,
}: EventRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numPeople: '1',
    comments: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug,
          eventTitle,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          numPeople: parseInt(formData.numPeople, 10),
          comments: formData.comments,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', numPeople: '1', comments: '' });
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem',
    fontSize: '1rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    fontFamily: "'Inter', system-ui, sans-serif",
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--border-color)';
  };

  if (status === 'success') {
    return (
      <div
        style={{
          padding: '2rem',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          You're registered!
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          We're looking forward to seeing you at {eventTitle}. We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="reveal">
      {/* NAME */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor={`reg-name-${eventSlug}`} style={labelStyle}>
          Name
        </label>
        <input
          type="text"
          id={`reg-name-${eventSlug}`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          placeholder="Your name"
          style={inputStyle}
        />
      </div>

      {/* EMAIL */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor={`reg-email-${eventSlug}`} style={labelStyle}>
          Email
        </label>
        <input
          type="email"
          id={`reg-email-${eventSlug}`}
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          placeholder="your@email.com"
          style={inputStyle}
        />
      </div>

      {/* PHONE */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor={`reg-phone-${eventSlug}`} style={labelStyle}>
          Phone <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
        </label>
        <input
          type="tel"
          id={`reg-phone-${eventSlug}`}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="(555) 123-4567"
          style={inputStyle}
        />
      </div>

      {/* NUMBER OF PEOPLE */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor={`reg-numPeople-${eventSlug}`} style={labelStyle}>
          Number of People
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id={`reg-numPeople-${eventSlug}`}
            name="numPeople"
            value={formData.numPeople}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              ...inputStyle,
              appearance: 'none',
              paddingRight: '2.5rem',
              cursor: 'pointer',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              right: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* COMMENTS */}
      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor={`reg-comments-${eventSlug}`} style={labelStyle}>
          Comments <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
        </label>
        <textarea
          id={`reg-comments-${eventSlug}`}
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={3}
          placeholder="Anything we should know?"
          style={{
            ...inputStyle,
            resize: 'vertical',
          }}
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 600,
          border: 'none',
          borderRadius: '8px',
          cursor: status === 'loading' ? 'default' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: status === 'loading' ? 0.7 : 1,
          letterSpacing: '-0.01em',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
        onMouseEnter={(e) => {
          if (status !== 'loading') e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          if (status !== 'loading') e.currentTarget.style.opacity = '1';
        }}
      >
        {status === 'loading' ? 'Registering...' : 'Register'}
      </button>

      {/* ERROR */}
      {status === 'error' && (
        <p style={{ fontSize: '0.8125rem', color: '#ef4444', marginTop: '0.75rem', textAlign: 'center' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
