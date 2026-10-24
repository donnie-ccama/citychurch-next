import Link from 'next/link';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export const dynamic = 'force-dynamic';

async function countRows(
  supabase: Awaited<ReturnType<typeof createSupabaseSSR>>,
  table: 'blog_posts' | 'sermons' | 'events' | 'media_items'
): Promise<number | null> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (error) {
    console.warn(`admin dashboard: failed to count ${table}:`, error.message);
    return null;
  }
  return count ?? 0;
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseSSR();

  const [blogCount, sermonCount, eventCount, mediaCount] = await Promise.all([
    countRows(supabase, 'blog_posts'),
    countRows(supabase, 'sermons'),
    countRows(supabase, 'events'),
    countRows(supabase, 'media_items'),
  ]);

  const stats: { label: string; count: number | null; color: string }[] = [
    { label: 'Blog Posts', count: blogCount, color: '#4F46E5' },
    { label: 'Sermons', count: sermonCount, color: '#7C3AED' },
    { label: 'Ministries', count: eventCount, color: '#EC4899' },
    { label: 'Media Items', count: mediaCount, color: '#F59E0B' },
  ];

  const quickActions = [
    { label: 'New Blog Post', href: '/admin/blog', color: '#4F46E5' },
    { label: 'New Sermon', href: '/admin/sermons', color: '#7C3AED' },
    { label: 'New Ministry', href: '/admin/ministries', color: '#EC4899' },
    { label: 'New Media', href: '/admin/media', color: '#F59E0B' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 700 }}>
        Dashboard
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                margin: 0,
                marginBottom: '0.5rem',
                fontWeight: 500,
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                margin: 0,
                color: stat.color,
              }}
            >
              {stat.count === null ? '—' : stat.count}
            </p>
          </div>
        ))}
      </div>

      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: '1rem',
        }}
      >
        Quick Actions
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            style={{
              display: 'block',
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontSize: '0.9375rem',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ color: action.color, marginRight: '0.5rem' }}>+</span>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
