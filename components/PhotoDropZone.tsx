'use client';

import { useState, useRef, useCallback } from 'react';

interface PhotoDropZoneProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_SIZE = 20 * 1024 * 1024;

export default function PhotoDropZone({ onFileSelect, file }: PhotoDropZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Please select a JPEG, PNG, WebP, or HEIC image.');
      return;
    }

    if (f.size > MAX_SIZE) {
      setError('File is too large. Maximum size is 20MB.');
      return;
    }

    onFileSelect(f);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border-color)'}`,
          borderRadius: '12px',
          padding: file ? '0' : '3rem 2rem',
          textAlign: 'center',
          cursor: file ? 'default' : 'pointer',
          backgroundColor: isDragging ? 'var(--bg-muted)' : 'var(--bg-card)',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {preview ? (
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '10px',
              }}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                fontSize: '1.125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
              aria-label="Remove photo"
            >
              &times;
            </button>
          </div>
        ) : (
          <div>
            {/* Camera/Upload Icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: '0 auto 1rem' }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Tap to choose a photo
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              or drag and drop here
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              JPEG, PNG, WebP, or HEIC &middot; Max 20MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: 'var(--accent)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
