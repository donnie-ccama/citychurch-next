import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { createAdminClient } from '@/lib/supabase-admin';
import {
  canViewDtk,
  normalizeEmail,
  parseAdminEmails,
  type DtkRequestStatus,
} from '@/lib/dtk/access';

export function getAdminEmails(): string[] {
  return parseAdminEmails(process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL);
}

async function getSessionEmail(): Promise<string | null> {
  const supabase = await createSupabaseSSR();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ? normalizeEmail(user.email) : null;
}

// Who is looking at /discipleship, and may they see the kit?
export async function getDtkViewer(): Promise<{
  email: string | null;
  status: DtkRequestStatus | null;
  allowed: boolean;
}> {
  const email = await getSessionEmail();
  if (!email) return { email: null, status: null, allowed: false };

  const { data } = await createAdminClient()
    .from('dtk_access_requests')
    .select('status')
    .eq('email', email)
    .maybeSingle();
  const status = (data?.status ?? null) as DtkRequestStatus | null;

  return { email, status, allowed: canViewDtk(email, getAdminEmails(), status) };
}

// Server actions run as POSTs, so they check admin rights themselves
// rather than trusting the page gate.
export async function requireAdmin(): Promise<string> {
  const email = await getSessionEmail();
  if (!email || !getAdminEmails().includes(email)) {
    throw new Error('Not authorized');
  }
  return email;
}
