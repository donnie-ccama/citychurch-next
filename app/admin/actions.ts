'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { createAdminClient } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/dtk/server';
import { dtkPath, type DtkLang } from '@/lib/dtk/pages';

export async function signOut() {
  const supabase = await createSupabaseSSR();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

const DTK_ADMIN_PATH = '/admin/discipleship';

function dtkAdminError(message: string): never {
  redirect(`${DTK_ADMIN_PATH}?error=${encodeURIComponent(message)}`);
}

export async function approveDtkRequest(formData: FormData) {
  const adminEmail = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const supabase = createAdminClient();

  const { data: row } = await supabase
    .from('dtk_access_requests')
    .select('email, status, decided_at, decided_by, language')
    .eq('id', id)
    .maybeSingle();
  if (!row) dtkAdminError('Request not found.');

  // Claim the request in one step before inviting. A second click (or a
  // stale page) finds nothing to claim and sends no invite, because a repeat
  // invite would invalidate the link in the first email.
  const { data: claimed, error: claimError } = await supabase
    .from('dtk_access_requests')
    .update({ status: 'approved', decided_at: new Date().toISOString(), decided_by: adminEmail })
    .eq('id', id)
    .neq('status', 'approved')
    .select('id');
  if (claimError) dtkAdminError(`Could not save approval: ${claimError.message}`);
  if (!claimed || claimed.length === 0) {
    revalidatePath(DTK_ADMIN_PATH);
    redirect(DTK_ADMIN_PATH);
  }

  const origin = (await headers()).get('origin') ?? 'https://www.citykid.me';
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(row.email, {
    redirectTo: `${origin}${dtkPath((row.language as DtkLang) === 'es' ? 'es' : 'en', 'set-password')}`,
  });
  // An existing account can't be invited again. That's fine: they log in
  // with the password they already have.
  if (inviteError && inviteError.code !== 'email_exists') {
    // Put the request back the way it was so the admin can retry.
    await supabase
      .from('dtk_access_requests')
      .update({ status: row.status, decided_at: row.decided_at, decided_by: row.decided_by })
      .eq('id', id);
    dtkAdminError(`Invite failed: ${inviteError.message}`);
  }

  revalidatePath(DTK_ADMIN_PATH);
  redirect(DTK_ADMIN_PATH);
}

export async function denyDtkRequest(formData: FormData) {
  const adminEmail = await requireAdmin();
  const id = String(formData.get('id') ?? '');

  const { error } = await createAdminClient()
    .from('dtk_access_requests')
    .update({ status: 'denied', decided_at: new Date().toISOString(), decided_by: adminEmail })
    .eq('id', id);
  if (error) dtkAdminError(`Could not save: ${error.message}`);

  revalidatePath(DTK_ADMIN_PATH);
  redirect(DTK_ADMIN_PATH);
}
