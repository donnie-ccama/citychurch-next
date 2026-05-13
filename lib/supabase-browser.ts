import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client — used in Client Components.
// Cookie-aware: hands user JWTs to the SSR client + middleware via cookies.
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
