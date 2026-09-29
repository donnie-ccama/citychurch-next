import type { DtkRequestInput } from '@/lib/dtk/request';

// Emails the admins about a new kit request. Never throws: a failed email
// must not lose the request, which is already saved.
export async function notifyAdminsOfDtkRequest(
  request: DtkRequestInput,
  adminEmails: string[]
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || adminEmails.length === 0) return;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Citychurch <onboarding@resend.dev>',
        to: adminEmails,
        subject: `Discipleship kit access request: ${request.name}${request.language === 'es' ? ' (Spanish)' : ''}`,
        text: [
          `${request.name} (${request.email}) asked for access to the Discipleship Training Kit in ${request.language === 'es' ? 'Spanish' : 'English'}.`,
          '',
          `Note: ${request.note ?? '(none)'}`,
          '',
          'Review it at https://www.citykid.me/admin/discipleship',
        ].join('\n'),
      }),
    });
    if (!res.ok) {
      console.error('[DTK Notify Error]', res.status, await res.text());
    }
  } catch (err) {
    console.error('[DTK Notify Error]', err);
  }
}
