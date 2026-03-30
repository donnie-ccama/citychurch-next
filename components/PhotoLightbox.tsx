'use client';

import { useEffect, useCallback, useState } from 'react';

interface Photo {
  id: string;
  name: string;
  src: string;
  alt: string;
}

interface PhotoLightboxProps {
  photo: Photo;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function PhotoLightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: PhotoLightboxProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState('');

  // Clean filename for download
  const cleanName = photo.alt
    .replace(/copy of /gi, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    || 'citychurch-photo';

  const downloadUrl = `/api/carousel/image?id=${photo.id}&download=1&name=${encodeURIComponent(cleanName)}`;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${siteUrl}/?photo=${photo.id}`;

  // Close on Escape, navigate with arrows
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const toast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(''), 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Could not copy link');
    }
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Citychurch — ' + photo.alt,
          text: 'Check out this photo from Citychurch Amarillo',
          url: shareUrl,
        });
      } catch {
        // User cancelled share — that's fine
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Toast notification */}
      {showToast && (
        <div className="lightbox-toast">{showToast}</div>
      )}

      {/* Close button */}
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Prev arrow */}
      {hasPrev && onPrev && (
        <button
          className="lightbox-nav lightbox-nav-prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous photo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {hasNext && onNext && (
        <button
          className="lightbox-nav lightbox-nav-next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next photo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      )}

      {/* Image + actions container */}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* The image */}
        <div className="lightbox-image-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            className="lightbox-image"
            draggable={false}
          />
        </div>

        {/* Caption */}
        <p className="lightbox-caption">{photo.alt}</p>

        {/* Action buttons */}
        <div className="lightbox-actions">
          {/* Download */}
          <a
            href={downloadUrl}
            className="lightbox-btn"
            download
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download</span>
          </a>

          {/* Facebook */}
          <button
            className="lightbox-btn"
            onClick={(e) => { e.stopPropagation(); handleFacebookShare(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>

          {/* Native share (mobile) or Copy Link (desktop) */}
          {hasNativeShare ? (
            <button
              className="lightbox-btn"
              onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Share</span>
            </button>
          ) : (
            <button
              className="lightbox-btn"
              onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
