'use client';

import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          padding: '2rem',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
