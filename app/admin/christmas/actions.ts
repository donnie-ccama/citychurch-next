'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function cancelChristmasReservation(formData: FormData) {
  const reservationId = formData.get('reservationId');
  if (typeof reservationId !== 'string' || !reservationId) return;

  const supabase = await createSupabaseSSR();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowlist = getAdminEmails();
  const email = (user?.email ?? '').toLowerCase();
  if (!user || (allowlist.length > 0 && !allowlist.includes(email))) {
    throw new Error('Not authorized');
  }

  const { error } = await supabase.rpc('cancel_christmas_reservation', {
    p_reservation_id: reservationId,
  });

  if (error) {
    console.error('[Christmas Admin Cancel Error]', error);
    throw new Error('Unable to cancel this reservation.');
  }

  revalidatePath('/admin/christmas');
  revalidatePath('/christmas');
}
