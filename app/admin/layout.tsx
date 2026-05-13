import AdminSidebar from '@/components/AdminSidebar';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseSSR();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session means the user is on /admin/login (the middleware would have
  // redirected anywhere else). Render bare so the login page owns the layout.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar userEmail={user.email ?? ''} />
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
