'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import PhotoDropZone from './PhotoDropZone';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ProofOfLifeSubmitForm() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const maxChars = 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setFormState('submitting');
    setErrorMessage('');

    try {
      // Step 1: Upload photo directly to Supabase Storage from the client
      // This bypasses Vercel's 4.5MB serverless body size limit
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Upload service is not configured');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('proof-of-life-photos')
        .upload(filename, file, {
          contentType: file.type,
          cacheControl: '3600',
        });

      if (uploadError) {
        throw new Error('Failed to upload photo. Please try again.');
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('proof-of-life-photos')
        .getPublicUrl(filename);

      const photoUrl = urlData.publicUrl;

      // Step 2: Send metadata to API route (just the URL + description, no file)
      const res = await fetch('/api/proof-of-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo_url: photoUrl,
          description: description.trim() || null,
        }),
      });

      if (!res.ok) {
        let errMsg = 'Something went wrong';
        try {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } catch {
          // Response wasn't JSON — use status text
          errMsg = res.statusText || errMsg;
        }
        throw new Error(errMsg);
      }

      setFormState('success');
    } catch (err) {
      setFormState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (formState === 'success') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: '0 auto 1.25rem' }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Photo submitted!
        </h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          It will appear on the bulletin board once approved. Thank you for sharing your story!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Photo Drop Zone */}
      <div style={{ marginBottom: '1.5rem' }}>
        <PhotoDropZone onFileSelect={setFile} file={file} />
      </div>

      {/* Description */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="pol-description"
          style={{
            display: 'block',
            fontWeight: 600,
            fontSize: '0.9375rem',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          Description
        </label>
        <textarea
          id="pol-description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
          placeholder="Tell us about this moment... (optional)"
          rows={3}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            resize: 'vertical',
            fontFamily: "'Inter', system-ui, sans-serif",
            boxSizing: 'border-box',
          }}
        />
        <p
          style={{
            fontSize: '0.75rem',
            color: description.length >= maxChars ? 'var(--accent)' : 'var(--text-muted)',
            textAlign: 'right',
            marginTop: '0.25rem',
          }}
        >
          {description.length} / {maxChars}
        </p>
      </div>

      {/* Error Message */}
      {formState === 'error' && errorMessage && (
        <p
          style={{
            color: 'var(--accent)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-muted)',
            borderRadius: '8px',
          }}
        >
          {errorMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || formState === 'submitting'}
        style={{
          width: '100%',
          padding: '0.875rem 2rem',
          backgroundColor: !file || formState === 'submitting' ? 'var(--text-muted)' : 'var(--accent)',
          color: 'white',
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: !file || formState === 'submitting' ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.2s ease, background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        {formState === 'submitting' ? (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Uploading...
          </>
        ) : (
          'Submit Photo'
        )}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
