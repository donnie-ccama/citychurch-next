'use client';

import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { buildVimeoEmbedUrl } from '@/lib/vimeo';

interface SermonPlayerProps {
  vimeoId: string;
  vimeoHash?: string | null;
  title: string;
}

export default function SermonPlayer({
  vimeoId,
  vimeoHash,
  title,
}: SermonPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);
    playerRef.current = player;

    const handleVolumeChange = async () => {
      try {
        const muted = await player.getMuted();
        setIsMuted(muted);
      } catch {
        /* player may have been destroyed */
      }
    };

    player.on('volumechange', handleVolumeChange);

    return () => {
      player.off('volumechange', handleVolumeChange);
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
  }, []);

  const handleUnmute = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.setMuted(false);
      await player.setVolume(1);
      setIsMuted(false);
    } catch (e) {
      console.error('Vimeo unmute failed:', e);
    }
  };

  const embedUrl = buildVimeoEmbedUrl(vimeoId, {
    autoplay: true,
    muted: true,
    hash: vimeoHash,
  });

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-muted)',
        aspectRatio: '16 / 9',
      }}
    >
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 'none' }}
      />

      {isMuted && (
        <button
          type="button"
          onClick={handleUnmute}
          aria-label="Unmute sermon audio"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 2,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
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
            aria-hidden="true"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          Tap to unmute
        </button>
      )}
    </div>
  );
}
