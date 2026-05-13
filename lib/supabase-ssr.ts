import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Auth-aware server Supabase client for use in:
//  - Server Components inside authenticated routes (e.g. /admin/*)
//  - Server Actions
//  - Route Handlers that need to know who the user is
//
// Reads + writes the Supabase auth cookies on the incoming Next request, so
// RLS policies that check auth.jwt() apply automatically.
//
// For public reads with no auth context, use createServerClient() from
// `lib/supabase-server.ts` instead — that one uses the bare anon client.
export async function createSupabaseSSR() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies can only be set in a
            // route handler, middleware, or server action. Middleware handles
            // session refresh, so this is safe to ignore here.
          }
        },
      },
    }
  );
}
