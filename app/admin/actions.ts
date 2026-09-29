'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { createAdminClient } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/dtk/server';

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
    .select('email')
    .eq('id', id)
    .maybeSingle();
  if (!row) dtkAdminError('Request not found.');

  const origin = (await headers()).get('origin') ?? 'https://www.citykid.me';
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(row.email, {
    redirectTo: `${origin}/discipleship/set-password`,
  });
  // An existing account can't be invited again. That's fine: they log in
  // with the password they already have.
  if (inviteError && inviteError.code !== 'email_exists') {
    dtkAdminError(`Invite failed: ${inviteError.message}`);
  }

  const { error: updateError } = await supabase
    .from('dtk_access_requests')
    .update({ status: 'approved', decided_at: new Date().toISOString(), decided_by: adminEmail })
    .eq('id', id);
  if (updateError) dtkAdminError(`Could not save approval: ${updateError.message}`);

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
