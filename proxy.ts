import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_PREFIX = '/admin';
const LOGIN_PATH = '/admin/login';

function getAdminEmails(): string[] {
  const list = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '';
  return list
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session on every request so cookies stay valid.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Gate /admin/* (except the login page itself) on a valid admin session.
  if (path.startsWith(ADMIN_PREFIX) && path !== LOGIN_PATH) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
    const allowlist = getAdminEmails();
    const email = (user.email ?? '').toLowerCase();
    if (allowlist.length > 0 && !allowlist.includes(email)) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  // If a logged-in admin lands on the login page, send them straight to admin.
  if (path === LOGIN_PATH && user) {
    const allowlist = getAdminEmails();
    const email = (user.email ?? '').toLowerCase();
    if (allowlist.length === 0 || allowlist.includes(email)) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_PREFIX;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Run on all routes except static assets and image optimization, so cookies
  // get refreshed everywhere and the admin gate fires only on /admin/*.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
