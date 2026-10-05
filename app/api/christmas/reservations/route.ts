import { after, NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { sendChristmasReservationEmails } from '@/lib/christmas-email';
import { syncToGoogleSheets } from '@/lib/google-sheets';
import { CHRISTMAS_EVENT_SLUG, formatBanquetDate } from '@/lib/christmas';

interface ReservationRequest {
  banquetId?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  guestCount?: unknown;
  attendsChurchRegularly?: unknown;
  churchName?: unknown;
  dietaryNotes?: unknown;
  accessibilityNotes?: unknown;
  comments?: unknown;
  joinWaitlist?: unknown;
  website?: unknown;
}

interface RpcResult {
  outcome: 'confirmed' | 'waitlisted' | 'existing' | 'duplicate' | 'full' | 'invalid' | 'closed' | 'invalid_banquet';
  reservation_id?: string;
  banquet_id?: string;
  confirmation_code?: string;
  status?: 'confirmed' | 'waitlisted';
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: NextRequest) {
  let body: ReservationRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 });
  }

  // Honeypot: bots often fill fields hidden from people.
  if (cleanText(body.website, 200)) {
    return NextResponse.json({ success: true });
  }

  const banquetId = cleanText(body.banquetId, 36);
  const contactName = cleanText(body.contactName, 120);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 40);
  const guestCount = Number(body.guestCount);
  const attendsChurchRegularly = body.attendsChurchRegularly;
  const churchName = cleanText(body.churchName, 160);
  const dietaryNotes = cleanText(body.dietaryNotes, 1000);
  const accessibilityNotes = cleanText(body.accessibilityNotes, 1000);
  const comments = cleanText(body.comments, 2000);
  const joinWaitlist = body.joinWaitlist === true;

  if (
    !isUuid(banquetId) ||
    contactName.length < 2 ||
    !isEmail(email) ||
    phone.length < 7 ||
    !Number.isInteger(guestCount) ||
    guestCount < 1 ||
    guestCount > 8 ||
    typeof attendsChurchRegularly !== 'boolean'
  ) {
    return NextResponse.json(
      { error: 'Please complete every required field. Tables seat up to eight guests.' },
      { status: 400 }
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      const eventDate = banquetId.endsWith('14') ? '2026-12-14' : '2026-12-15';
      return NextResponse.json({
        success: true,
        preview: true,
        outcome: joinWaitlist ? 'waitlisted' : 'confirmed',
        reservation: {
          confirmationCode: 'CC26-PREVIEW',
          status: joinWaitlist ? 'waitlisted' : 'confirmed',
          contactName,
          guestCount,
          eventDate,
          doorsOpen: '17:30:00',
          dinnerAt: '18:00:00',
          endsAt: '19:30:00',
          location: 'Citychurch Downtown, 205 S. Polk St, Amarillo, TX 79101',
        },
      });
    }

    return NextResponse.json(
      { error: 'Registration is temporarily unavailable. Please try again shortly.' },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();
  const { data: rpcData, error: rpcError } = await supabase.rpc('reserve_christmas_table', {
    p_event_slug: CHRISTMAS_EVENT_SLUG,
    p_banquet_id: banquetId,
    p_contact_name: contactName,
    p_email: email,
    p_phone: phone,
    p_guest_count: guestCount,
    p_attends_church_regularly: attendsChurchRegularly,
    p_church_name: attendsChurchRegularly ? churchName || null : null,
    p_dietary_notes: dietaryNotes || null,
    p_accessibility_notes: accessibilityNotes || null,
    p_comments: comments || null,
    p_join_waitlist: joinWaitlist,
  });

  if (rpcError) {
    console.error('[Christmas Reservation RPC Error]', rpcError);
    return NextResponse.json(
      { error: 'We could not save your reservation. Please try again.' },
      { status: 500 }
    );
  }

  const result = rpcData as RpcResult;

  if (result.outcome === 'full') {
    const { data: banquets } = await supabase
      .from('christmas_banquets')
      .select('id, table_capacity, tables_reserved, active')
      .eq('active', true);

    return NextResponse.json(
      {
        error: 'That banquet just filled. Your information is still here—please choose the other date.',
        code: 'BANQUET_FULL',
        banquets: banquets ?? [],
      },
      { status: 409 }
    );
  }

  if (result.outcome === 'closed') {
    return NextResponse.json({ error: 'Registration is currently closed.' }, { status: 409 });
  }

  if (result.outcome === 'duplicate') {
    return NextResponse.json(
      {
        error:
          'A reservation already exists for this email. Please check your confirmation email or contact Citychurch for help.',
      },
      { status: 409 }
    );
  }

  if (result.outcome === 'invalid' || result.outcome === 'invalid_banquet' || !result.reservation_id) {
    return NextResponse.json({ error: 'Please check your banquet selection and try again.' }, { status: 400 });
  }

  const { data: reservation, error: reservationError } = await supabase
    .from('christmas_reservations')
    .select(
      'id, confirmation_code, contact_name, email, phone, guest_count, attends_church_regularly, church_name, dietary_notes, accessibility_notes, comments, status, banquet_id'
    )
    .eq('id', result.reservation_id)
    .single();

  if (reservationError || !reservation) {
    console.error('[Christmas Reservation Read Error]', reservationError);
    return NextResponse.json({ error: 'Your table was saved, but confirmation could not be loaded.' }, { status: 500 });
  }

  const [{ data: banquet }, { data: event }] = await Promise.all([
    supabase
      .from('christmas_banquets')
      .select('event_date, doors_open, dinner_at, ends_at')
      .eq('id', reservation.banquet_id)
      .single(),
    supabase
      .from('christmas_events')
      .select('title, location')
      .eq('slug', CHRISTMAS_EVENT_SLUG)
      .single(),
  ]);

  if (!banquet || !event) {
    return NextResponse.json({ error: 'Your table was saved, but event details could not be loaded.' }, { status: 500 });
  }

  if (result.outcome !== 'existing') {
    const emailResult = await sendChristmasReservationEmails({
      reservationId: reservation.id,
      confirmationCode: reservation.confirmation_code,
      status: reservation.status,
      contactName: reservation.contact_name,
      email: reservation.email,
      phone: reservation.phone,
      guestCount: reservation.guest_count,
      attendsChurchRegularly: reservation.attends_church_regularly,
      churchName: reservation.church_name,
      dietaryNotes: reservation.dietary_notes,
      accessibilityNotes: reservation.accessibility_notes,
      comments: reservation.comments,
      eventDate: banquet.event_date,
      doorsOpen: banquet.doors_open,
      dinnerAt: banquet.dinner_at,
      endsAt: banquet.ends_at,
      location: event.location,
    });

    const now = new Date().toISOString();
    await supabase
      .from('christmas_reservations')
      .update({
        admin_notification_status: emailResult.admin,
        guest_notification_status: emailResult.guest,
        admin_notified_at: emailResult.admin === 'sent' ? now : null,
        guest_notified_at: emailResult.guest === 'sent' ? now : null,
      })
      .eq('id', reservation.id);

    after(() =>
      syncToGoogleSheets('Registrations', [
        `${event.title} — ${formatBanquetDate(banquet.event_date, false)} — ${reservation.status} — ${reservation.confirmation_code}`,
        reservation.contact_name,
        reservation.email,
        reservation.phone,
        String(reservation.guest_count),
        [
          `Regular church attendance: ${reservation.attends_church_regularly ? `Yes${reservation.church_name ? ` — ${reservation.church_name}` : ''}` : 'No'}`,
          reservation.dietary_notes,
          reservation.accessibility_notes,
          reservation.comments,
        ]
          .filter(Boolean)
          .join(' | '),
        new Date().toISOString(),
      ]).catch((error) => console.error('[Sheets Sync Error - Christmas]', error))
    );
  }

  return NextResponse.json({
    success: true,
    outcome: result.outcome,
    reservation: {
      confirmationCode: reservation.confirmation_code,
      status: reservation.status,
      contactName: reservation.contact_name,
      guestCount: reservation.guest_count,
      eventDate: banquet.event_date,
      doorsOpen: banquet.doors_open,
      dinnerAt: banquet.dinner_at,
      endsAt: banquet.ends_at,
      location: event.location,
    },
  });
}
