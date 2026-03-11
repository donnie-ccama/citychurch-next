'use client';

import { useState } from 'react';
import { BlogPost } from '@/lib/types';
import BlogCard from './BlogCard';

interface BlogClientProps {
  posts: BlogPost[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Outreach' | 'Documentary' | 'Leadership' | 'Community'>('All');

  const categories: Array<'All' | 'Outreach' | 'Documentary' | 'Leadership' | 'Community'> = [
    'All',
    'Outreach',
    'Documentary',
    'Leadership',
    'Community',
  ];

  const filteredPosts = activeCategory === 'All' ? posts : posts.filter((post) => post.category === activeCategory);

  return (
    <div>
      {/* CATEGORY FILTER */}
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
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeCategory === category ? 'var(--accent)' : 'var(--bg-card)',
              color: activeCategory === category ? 'white' : 'var(--text-primary)',
              border: activeCategory === category ? 'none' : '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              if (activeCategory !== category) {
                target.style.borderColor = 'var(--accent)';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              if (activeCategory !== category) {
                target.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* POSTS GRID */}
      <div className="reveal">
        {filteredPosts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              No articles in the {activeCategory} category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
