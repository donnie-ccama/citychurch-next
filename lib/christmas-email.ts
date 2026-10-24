import 'server-only';

import { Resend } from 'resend';
import { formatBanquetDate, formatBanquetTime } from '@/lib/christmas';

interface ReservationEmailInput {
  reservationId: string;
  confirmationCode: string;
  status: 'confirmed' | 'waitlisted';
  contactName: string;
  email: string;
  phone: string;
  guestCount: number;
  attendsChurchRegularly: boolean;
  churchName: string | null;
  dietaryNotes: string | null;
  accessibilityNotes: string | null;
  comments: string | null;
  eventDate: string;
  doorsOpen: string;
  dinnerAt: string;
  endsAt: string;
  location: string;
}

export interface ReservationEmailResult {
  admin: 'sent' | 'failed' | 'skipped';
  guest: 'sent' | 'failed' | 'skipped';
}

function escapeHtml(value: string | null | undefined): string {
  return (value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function detailRow(label: string, value: string): string {
  return `<tr><td style="padding:7px 12px 7px 0;color:#786d68;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:7px 0;color:#241f1d;font-size:14px;font-weight:600;">${escapeHtml(value)}</td></tr>`;
}

export async function sendChristmasReservationEmails(
  input: ReservationEmailInput
): Promise<ReservationEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESERVATION_FROM_EMAIL;
  const adminEmail = process.env.RESERVATION_ADMIN_EMAIL ?? 'donnie@citykid.me';

  if (!apiKey || !from) {
    console.warn('[Christmas Email] RESEND_API_KEY or RESERVATION_FROM_EMAIL is not configured.');
    return { admin: 'skipped', guest: 'skipped' };
  }

  const resend = new Resend(apiKey);
  const banquetDate = formatBanquetDate(input.eventDate);
  const schedule = `Doors ${formatBanquetTime(input.doorsOpen)} · Dinner ${formatBanquetTime(input.dinnerAt)} · Ends ${formatBanquetTime(input.endsAt)}`;
  const isWaitlisted = input.status === 'waitlisted';
  const statusLabel = isWaitlisted ? 'Waitlist request' : 'Table reservation';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.citykid.me';

  const notes = [
    input.dietaryNotes ? `Dietary: ${input.dietaryNotes}` : '',
    input.accessibilityNotes ? `Accessibility: ${input.accessibilityNotes}` : '',
    input.comments ? `Comments: ${input.comments}` : '',
  ].filter(Boolean).join('\n');

  const adminHtml = `
    <div style="background:#f8f6f5;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:620px;margin:0 auto;background:white;border:1px solid #e7e2df;border-radius:12px;padding:28px;">
        <p style="margin:0 0 8px;color:#d44b83;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${statusLabel}</p>
        <h1 style="margin:0 0 22px;color:#241f1d;font-size:24px;">${escapeHtml(input.contactName)} · ${escapeHtml(banquetDate)}</h1>
        <table style="border-collapse:collapse;width:100%;">
          ${detailRow('Confirmation', input.confirmationCode)}
          ${detailRow('Status', isWaitlisted ? 'Waitlisted' : 'Confirmed')}
          ${detailRow('Banquet', banquetDate)}
          ${detailRow('Schedule', schedule)}
          ${detailRow('Guests', String(input.guestCount))}
          ${detailRow('Email', input.email)}
          ${detailRow('Phone', input.phone)}
          ${detailRow(
            'Regular church attendance',
            input.attendsChurchRegularly
              ? `Yes${input.churchName ? ` — ${input.churchName}` : ''}`
              : 'No'
          )}
          ${detailRow('Notes', notes || 'None')}
        </table>
        <p style="margin:24px 0 0;"><a href="${siteUrl}/admin/christmas" style="color:#d44b83;font-weight:700;">Open Christmas reservations →</a></p>
      </div>
    </div>`;

  const guestHtml = `
    <div style="background:#f8f6f5;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:620px;margin:0 auto;background:white;border:1px solid #e7e2df;border-radius:12px;padding:28px;">
        <p style="margin:0 0 8px;color:#d44b83;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Citychurch Christmas Banquets</p>
        <h1 style="margin:0 0 14px;color:#241f1d;font-size:26px;">${isWaitlisted ? 'You’re on the waitlist' : 'Your family table is reserved'}</h1>
        <p style="margin:0 0 22px;color:#655c58;line-height:1.6;">${isWaitlisted
          ? 'We’ll contact you if a table becomes available for your selected banquet.'
          : 'We’re looking forward to celebrating Christmas with your family.'}</p>
        <table style="border-collapse:collapse;width:100%;">
          ${detailRow('Confirmation', input.confirmationCode)}
          ${detailRow('Date', banquetDate)}
          ${detailRow('Schedule', schedule)}
          ${detailRow('Location', input.location)}
          ${detailRow('Guests', String(input.guestCount))}
        </table>
        <p style="margin:24px 0 0;color:#786d68;font-size:13px;line-height:1.6;">Questions or changes? Reply to this email or contact Citychurch.</p>
      </div>
    </div>`;

  const [adminResult, guestResult] = await Promise.allSettled([
    resend.emails.send(
      {
        from,
        to: adminEmail,
        replyTo: input.email,
        subject: `${statusLabel}: ${input.contactName} · ${banquetDate}`,
        html: adminHtml,
      },
      { idempotencyKey: `christmas-admin-${input.reservationId}` }
    ),
    resend.emails.send(
      {
        from,
        to: input.email,
        replyTo: adminEmail,
        subject: isWaitlisted
          ? `Christmas banquet waitlist · ${banquetDate}`
          : `Your Citychurch Christmas table · ${banquetDate}`,
        html: guestHtml,
      },
      { idempotencyKey: `christmas-guest-${input.reservationId}` }
    ),
  ]);

  const admin = adminResult.status === 'fulfilled' && !adminResult.value.error ? 'sent' : 'failed';
  const guest = guestResult.status === 'fulfilled' && !guestResult.value.error ? 'sent' : 'failed';

  if (admin === 'failed') console.error('[Christmas Email] Admin email failed', adminResult);
  if (guest === 'failed') console.error('[Christmas Email] Guest email failed', guestResult);

  return { admin, guest };
}
