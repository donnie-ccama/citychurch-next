'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import PhotoLightbox from './PhotoLightbox';

interface Photo {
  id: string;
  name: string;
  src: string;
  alt: string;
}

const AUTOPLAY_INTERVAL = 5000; // 5 seconds between slides

export default function PhotoCarousel() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch photos from the API route
  useEffect(() => {
    fetch('/api/carousel')
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const goTo = useCallback(
    (index: number, dir?: 'next' | 'prev') => {
      const len = photos.length;
      if (len === 0) return;
      const next = ((index % len) + len) % len;
      setDirection(dir || (next > current ? 'next' : 'prev'));
      setCurrent(next);
    },
    [photos.length, current]
  );

  const goNext = useCallback(() => goTo(current + 1, 'next'), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1, 'prev'), [current, goTo]);

  // Autoplay — pause when lightbox is open
  useEffect(() => {
    if (paused || lightboxIndex !== null || photos.length <= 1) return;
    timerRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, goNext, photos.length, lightboxIndex]);

  // Keyboard navigation (only when lightbox is closed — lightbox handles its own)
  useEffect(() => {
    if (lightboxIndex !== null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, lightboxIndex]);

  // Touch/swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const lightboxPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };
  const lightboxNext = () => {
    if (lightboxIndex !== null && lightboxIndex < photos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  // Loading state — skeleton
  if (loading) {
    return (
      <div className="carousel-skeleton">
        <div className="carousel-skeleton-inner" />
      </div>
    );
  }

  // Error or no photos — don't render the section at all
  if (error || photos.length === 0) return null;

  return (
    <>
      <div
        className="carousel-container"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Photo gallery from Citychurch"
      >
        {/* Slides */}
        <div className="carousel-viewport">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={`carousel-slide ${
                i === current ? 'carousel-slide-active' : ''
              } ${
                i === current
                  ? `carousel-enter-${direction}`
                  : ''
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${photos.length}: ${photo.alt}`}
              aria-hidden={i !== current}
              onClick={() => openLightbox(i)}
              style={{ cursor: 'pointer' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
                className="carousel-image"
              />
            </div>
          ))}
        </div>

        {/* Caption overlay */}
        {photos[current] && (
          <div className="carousel-caption">
            <span>{photos[current].alt}</span>
          </div>
        )}

        {/* Prev / Next arrows */}
        {photos.length > 1 && (
          <>
            <button
              className="carousel-arrow carousel-arrow-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className="carousel-arrow carousel-arrow-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {photos.length > 1 && (
          <div className="carousel-dots">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === current ? 'carousel-dot-active' : ''}`}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <PhotoLightbox
          photo={photos[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < photos.length - 1}
        />
      )}
    </>
  );
}
