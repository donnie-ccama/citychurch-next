'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Blog Posts', count: 12, color: '#4F46E5' },
    { label: 'Sermons', count: 24, color: '#7C3AED' },
    { label: 'Ministries', count: 8, color: '#EC4899' },
    { label: 'Media Items', count: 45, color: '#F59E0B' },
  ];

  const quickActions = [
    { label: 'New Blog Post', href: '/admin/blog', color: '#4F46E5' },
    { label: 'New Sermon', href: '/admin/sermons', color: '#7C3AED' },
    { label: 'New Ministry', href: '/admin/events', color: '#EC4899' },
    { label: 'New Media', href: '/admin/media', color: '#F59E0B' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '700' }}>
        Dashboard
      </h1>

      {/* Stats Grid */}
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
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '500',
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: stat.color,
              }}
            >
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            marginBottom: '1rem',
            fontWeight: '600',
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{
                display: 'block',
                padding: '1rem 1.5rem',
                backgroundColor: action.color,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
