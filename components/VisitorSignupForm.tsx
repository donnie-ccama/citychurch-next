'use client';

import { useState } from 'react';

const visitTypeOptions = [
  { value: 'general', label: "I'm planning to visit in person" },
  { value: 'volunteer', label: "I'd like to volunteer" },
  { value: 'family', label: "I'm interested for my family" },
  { value: 'online', label: 'Just learning more online' },
];

export default function VisitorSignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    visitType: 'general',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', visitType: 'general' });
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        <p style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Welcome to Citychurch!
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          We're so glad you're here. You'll hear from us soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="reveal"
      style={{ maxWidth: '520px', margin: '0 auto' }}
    >
      {/* FIRST NAME + LAST NAME */}
      <div className="name-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="visitor-firstName" style={labelStyle}>
            First Name
          </label>
          <input
            type="text"
            id="visitor-firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
            placeholder="First name"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="visitor-lastName" style={labelStyle}>
            Last Name
          </label>
          <input
            type="text"
            id="visitor-lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
            placeholder="Last name"
            style={inputStyle}
          />
        </div>
      </div>

      {/* EMAIL */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="visitor-email" style={labelStyle}>
          Email
        </label>
        <input
          type="email"
          id="visitor-email"
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
        <label htmlFor="visitor-phone" style={labelStyle}>
          Phone <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
        </label>
        <input
          type="tel"
          id="visitor-phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="(555) 123-4567"
          style={inputStyle}
        />
      </div>

      {/* VISIT TYPE */}
      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="visitor-visitType" style={labelStyle}>
          How can we help?
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="visitor-visitType"
            name="visitType"
            value={formData.visitType}
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
            {visitTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
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

      {/* SUBMIT BUTTON */}
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
        {status === 'loading' ? 'Submitting...' : 'Count Me In'}
      </button>

      {/* ERROR */}
      {status === 'error' && (
        <p style={{ fontSize: '0.8125rem', color: '#ef4444', marginTop: '0.75rem', textAlign: 'center' }}>
          Something went wrong. Please try again.
        </p>
      )}

      <style jsx>{`
        @media (max-width: 480px) {
          .name-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </form>
  );
}
