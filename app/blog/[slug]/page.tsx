import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BlogCard from '@/components/BlogCard';
import SocialShare from '@/components/SocialShare';
import { createServerClient } from '@/lib/supabase-server';
import { BlogPost } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const revalidate = 3600; // ISR: revalidate every hour

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found — Citychurch',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  return {
    title: `${post.title} — Citychurch Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  const supabase = createServerClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true);

  return (posts ?? []).map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single<BlogPost>();

  if (!post) {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

        <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Post Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            The blog post you're looking for doesn't exist.
          </p>
          <Link href="/blog" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Back to Blog
          </Link>
        </section>

      </div>
    );
  }

  // Related posts: same category, excluding current post
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('category', post.category)
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fallback: if no same-category posts, show other recent posts
  let postsToShow: BlogPost[] = relatedPosts ?? [];
  if (postsToShow.length === 0) {
    const { data: otherPosts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .neq('id', post.id)
      .order('created_at', { ascending: false })
      .limit(3);
    postsToShow = otherPosts ?? [];
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>


      {/* ARTICLE HEADER */}
      <header style={{ padding: '3rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }} className="reveal">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}
          >
            {post.category}
          </p>

          <h1
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Author</span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{post.author}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
              {post.reading_time} minute read
            </p>
          </div>
        </div>
      </header>

      {/* FEATURED IMAGE */}
      <section style={{ padding: 0 }}>
        <div
          style={{
            aspectRatio: '16/9',
            backgroundColor: 'var(--bg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              width={1200}
              height={675}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              priority
            />
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Article Feature Image</span>
          )}
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }} className="reveal">
          <div
            className="blog-prose"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1.125rem',
              lineHeight: 1.85,
              color: 'var(--text-primary)',
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p style={{ marginBottom: '1.5rem', lineHeight: 1.85 }}>{children}</p>
                ),
                h2: ({ children }) => (
                  <h2
                    style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: '1.75rem',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      margin: '2.5rem 0 1.25rem 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {children}
                  </h2>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      borderLeft: '4px solid var(--accent)',
                      paddingLeft: '1.75rem',
                      margin: '2.5rem 0',
                      fontSize: '1.25rem',
                      fontStyle: 'italic',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.8,
                    }}
                  >
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* AUTHOR BIO */}
      <section
        style={{
          padding: '3rem 1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Photo</span>
            </div>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>{post.author}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                {post.author} has been documenting community stories at Citychurch. They believe authentic storytelling creates space for transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL SHARE */}
      <section style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <SocialShare title={post.title} slug={post.slug} />
        </div>
      </section>

      {/* RELATED ARTICLES */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Related Articles</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {postsToShow.map((relatedPost) => (
              <BlogCard key={relatedPost.id} {...relatedPost} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/blog"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              View All Articles
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>



    </div>
  );
}
