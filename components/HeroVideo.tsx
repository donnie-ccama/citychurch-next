'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Player from '@vimeo/player';

interface HeroVideoProps {
  videoId: string;
  children: React.ReactNode;
}

export default function HeroVideo({ videoId, children }: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous content
    container.innerHTML = '';

    const player = new Player(container, {
      id: parseInt(videoId),
      width: 1920,
      autoplay: true,
      loop: true,
      muted: true,
      controls: false,
      title: false,
      byline: false,
      portrait: false,
      background: false,
    });

    playerRef.current = player;

    player.ready().then(() => {
      // Make the generated iframe fill the container
      const iframe = container.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
      }
      player.setMuted(true);
      player.play().catch(() => {});
    });

    return () => {
      playerRef.current = null;
      player.destroy().catch(() => {});
    };
  }, [videoId, pathname]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    const next = !isMuted;
    playerRef.current.setMuted(next);
    setIsMuted(next);
  }, [isMuted]);

  return (
    <section
      className="hero-video"
      onClick={toggleMute}
      style={{
        position: 'relative',
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#000',
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      {/* Vimeo player container — contained in a clip wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '177.78vh',
            minWidth: '100%',
            height: '56.25vw',
            minHeight: '100%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Subtle bottom gradient for button readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content overlay */}
      {/* className for responsive targeting */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '2rem 1.5rem 4rem',
          color: '#fff',
          alignSelf: 'flex-end',
        }}
      >
        {children}
      </div>

      {/* Mute/unmute indicator */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 3,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          transition: 'all 0.2s ease',
        }}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {/* Hint text */}
      {isMuted && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            animation: 'hintFadeIn 1s ease 2s both',
          }}
        >
          Click anywhere to unmute
        </div>
      )}

      <style jsx>{`
        @keyframes hintFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
