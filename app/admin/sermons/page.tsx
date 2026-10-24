import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { Sermon } from '@/lib/types';
import SermonsAdminClient from './SermonsAdminClient';

export const dynamic = 'force-dynamic';

export default async function SermonsAdminPage() {
  // The middleware has already verified the caller is an admin. The SSR client
  // uses their session cookies, so RLS lets us read every sermon (including
  // drafts).
  const supabase = await createSupabaseSSR();
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .order('sermon_date', { ascending: false });

  if (error) {
    console.error('admin/sermons load failed:', error);
  }

  const sermons = (data ?? []) as Sermon[];

  return <SermonsAdminClient sermons={sermons} />;
}
