'use server';

import { redirect } from 'next/navigation';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export async function signOut() {
  const supabase = await createSupabaseSSR();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
