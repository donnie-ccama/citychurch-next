import { createClient } from '@supabase/supabase-js';

// Service role Supabase client — bypasses RLS, used only in server-side API routes
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey);
}
