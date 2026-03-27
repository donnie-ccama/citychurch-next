import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { syncToGoogleSheets } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { eventSlug, eventTitle, name, email, phone, numPeople, comments } =
      await request.json();

    if (!eventSlug || !name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { error: dbError } = await supabase.from('registrations').insert({
      event_slug: eventSlug,
      event_title: eventTitle || eventSlug,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      num_people: numPeople || 1,
      comments: comments?.trim() || null,
      source: 'website',
    });

    if (dbError) {
      console.error('[Registration DB Error]', dbError);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    // Non-blocking Google Sheets sync
    syncToGoogleSheets('Registrations', [
      eventTitle || eventSlug,
      name.trim(),
      email.trim().toLowerCase(),
      phone?.trim() || '',
      String(numPeople || 1),
      comments?.trim() || '',
      new Date().toISOString(),
    ]).catch((err) => console.error('[Sheets Sync Error - Registrations]', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Register API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
