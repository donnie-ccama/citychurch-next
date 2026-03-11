import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import BlogCard from '@/components/BlogCard';
import BlogClient from '@/components/BlogClient';
import { demoBlogPosts } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Blog — Citychurch',
  description: 'Stories from the field. Articles about outreach, documentary work, leadership, and community from Citychurch Amarillo.',
};

export default function Blog() {
  const featuredPost = demoBlogPosts[0];
  const remainingPosts = demoBlogPosts.slice(1);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>


      {/* HERO */}
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className="reveal">
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            From the Field
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            Stories of transformation, service, and community from our work in Amarillo.
          </p>
        </div>
      </section>

      {/* FEATURED POST */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '2rem' }}>
              Featured Story
            </h2>
          </div>

          <div className="reveal">
            <BlogCard {...featuredPost} />
          </div>
        </div>
      </section>

      {/* BLOG CLIENT WITH FILTER */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <BlogClient posts={remainingPosts} />
        </div>
      </section>



    </div>
  );
}
