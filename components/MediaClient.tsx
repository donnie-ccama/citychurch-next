'use client';

import { useState } from 'react';
import { MediaItem } from '@/lib/types';
import VideoEmbed from './VideoEmbed';

interface MediaClientProps {
  mediaItems: MediaItem[];
}

export default function MediaClient({ mediaItems }: MediaClientProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'training_video' | 'podcast'>('photo');

  const filteredItems = mediaItems.filter((item) => item.media_type === activeTab);

  const tabs = [
    { id: 'photo' as const, label: 'Photos' },
    { id: 'training_video' as const, label: 'Training Videos' },
    { id: 'podcast' as const, label: 'Podcasts' },
  ];

  return (
    <div>
      {/* TAB NAVIGATION */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}
        className="reveal"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-card)',
              color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
              border: activeTab === tab.id ? 'none' : '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              if (activeTab !== tab.id) {
                target.style.borderColor = 'var(--accent)';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              if (activeTab !== tab.id) {
                target.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="reveal">
        {activeTab === 'photo' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    aspectRatio: '1/1',
                    backgroundColor: 'var(--bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Photo Placeholder</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: '1rem',
                      letterSpacing: '-0.01em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'training_video' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredItems.map((item) => (
              <div key={item.id}>
                <VideoEmbed url={item.url} title={item.title} />
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    letterSpacing: '-0.01em',
                    marginBottom: '0.5rem',
                    marginTop: '1rem',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'podcast' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '2rem',
                }}
              >
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    letterSpacing: '-0.01em',
                    marginBottom: '1rem',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {item.description}
                </p>
                <div
                  style={{
                    height: '100px',
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Podcast Player Placeholder</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              No items available in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
