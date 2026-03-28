'use client';

import { useState } from 'react';

interface SocialShareProps {
  title: string;
  slug: string;
}

export default function SocialShare({ title, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showHandlePrompt, setShowHandlePrompt] = useState(false);
  const [lastPlatform, setLastPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getArticleUrl = () => `${window.location.origin}/blog/${slug}`;

  const logShare = async (platform: string, socialHandle?: string) => {
    try {
      await fetch('/api/blog-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          platform,
          handle: socialHandle || '',
        }),
      });
    } catch (err) {
      console.error('Failed to log share:', err);
    }
  };

  const handleShare = (platform: string) => {
    const url = getArticleUrl();
    const text = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    switch (platform) {
      case 'Facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'LinkedIn':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'Copy Link':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        break;
    }

    setLastPlatform(platform);
    setShowHandlePrompt(true);
    setHandle('');
    setSubmitted(false);
  };

  const handleSubmitHandle = async () => {
    if (!handle.trim()) return;
    setSubmitting(true);
    await logShare(lastPlatform, handle.trim());
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setShowHandlePrompt(false);
      setSubmitted(false);
    }, 2500);
  };

  const handleSkip = async () => {
    await logShare(lastPlatform);
    setShowHandlePrompt(false);
  };

  const platforms = [
    {
      name: 'Facebook',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Copy Link',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Share this story
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              title={platform.name === 'Copy Link' ? (copied ? 'Copied!' : 'Copy link') : `Share on ${platform.name}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {platform.icon}
            </button>
          ))}
        </div>

        {/* Copied tooltip */}
        {copied && (
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--accent)',
              fontWeight: 600,
              animation: 'fadeIn 0.2s ease',
            }}
          >
            Link copied!
          </span>
        )}
      </div>

      {/* Handle prompt */}
      {showHandlePrompt && !submitted && (
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            maxWidth: '480px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.375rem',
            }}
          >
            Shared this article?
          </p>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              lineHeight: 1.5,
            }}
          >
            Drop your {lastPlatform === 'Copy Link' ? 'social media' : lastPlatform} handle so we can thank you.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@yourhandle"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitHandle();
              }}
              style={{
                flex: 1,
                padding: '0.625rem 0.875rem',
                fontSize: '0.875rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSubmitHandle}
              disabled={submitting || !handle.trim()}
              style={{
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: submitting || !handle.trim() ? 'not-allowed' : 'pointer',
                opacity: submitting || !handle.trim() ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {submitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
          <button
            onClick={handleSkip}
            style={{
              marginTop: '0.625rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Skip
          </button>
        </div>
      )}

      {/* Thank you message */}
      {submitted && (
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--accent)',
            borderRadius: '10px',
            maxWidth: '480px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <p style={{ fontSize: '0.9375rem', color: 'var(--accent)', fontWeight: 600 }}>
            Thank you for sharing!
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
