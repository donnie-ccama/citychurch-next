'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', message: '' });

      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="reveal" style={{ marginBottom: '2rem' }}>
      {/* NAME */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="name"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.875rem',
            fontSize: '1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
          placeholder="Your name"
        />
      </div>

      {/* EMAIL */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.875rem',
            fontSize: '1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
          placeholder="your@email.com"
        />
      </div>

      {/* MESSAGE */}
      <div style={{ marginBottom: '2rem' }}>
        <label
          htmlFor="message"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          style={{
            width: '100%',
            padding: '0.875rem',
            fontSize: '1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxSizing: 'border-box',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'border-color 0.2s ease',
            resize: 'vertical',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
          placeholder="Tell us more..."
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading || submitted}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: submitted ? 'var(--accent)' : loading ? 'var(--accent)' : 'var(--accent)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 600,
          border: 'none',
          borderRadius: '8px',
          cursor: loading || submitted ? 'default' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: loading || submitted ? 0.8 : 1,
          letterSpacing: '-0.01em',
        }}
        onMouseEnter={(e) => {
          if (!loading && !submitted) {
            e.currentTarget.style.opacity = '0.9';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && !submitted) {
            e.currentTarget.style.opacity = '1';
          }
        }}
      >
        {loading ? 'Sending...' : submitted ? 'Thanks for reaching out!' : 'Send Message'}
      </button>

      {/* SUCCESS MESSAGE */}
      {submitted && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.9375rem',
            textAlign: 'center',
          }}
        >
          We've received your message! We'll get back to you soon.
        </div>
      )}
    </form>
  );
}
