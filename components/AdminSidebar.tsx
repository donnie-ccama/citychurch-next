'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const linkStyle = (href: string) => ({
    display: 'block',
    padding: '0.75rem 1.5rem',
    margin: '0.25rem 0',
    textDecoration: 'none',
    color: isActive(href) ? 'var(--accent)' : 'var(--text-primary)',
    borderLeft: isActive(href) ? '4px solid var(--accent)' : '4px solid transparent',
    paddingLeft: '1.25rem',
    transition: 'all 0.2s ease',
    fontWeight: isActive(href) ? '600' : '400',
  });

  return (
    <aside
      style={{
        width: '250px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo/Title */}
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--accent)',
          }}
        >
          Citychurch
        </h2>
        <p
          style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          Admin Panel
        </p>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1 }}>
        <Link href="/admin" style={linkStyle('/admin')}>
          Dashboard
        </Link>
        <Link href="/admin/blog" style={linkStyle('/admin/blog')}>
          Blog Posts
        </Link>
        <Link href="/admin/sermons" style={linkStyle('/admin/sermons')}>
          Sermons
        </Link>
        <Link href="/admin/ministries" style={linkStyle('/admin/ministries')}>
          Ministries
        </Link>
        <Link href="/admin/media" style={linkStyle('/admin/media')}>
          Media
        </Link>
        <Link href="/admin/proof-of-life" style={linkStyle('/admin/proof-of-life')}>
          Proof of Life
        </Link>
      </nav>

      {/* Back to Site Link */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'block',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          ← Back to Site
        </Link>
      </div>
    </aside>
  );
}
