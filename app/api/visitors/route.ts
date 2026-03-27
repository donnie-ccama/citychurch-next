import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { syncToGoogleSheets } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, visitType } = await request.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
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
    const { error: dbError } = await supabase.from('visitors').insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      visit_type: visitType || 'general',
      source: 'website',
    });

    if (dbError) {
      console.error('[Visitors DB Error]', dbError);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    // Non-blocking Google Sheets sync
    syncToGoogleSheets('Visitors', [
      firstName.trim(),
      lastName.trim(),
      email.trim().toLowerCase(),
      phone?.trim() || '',
      visitType || 'general',
      new Date().toISOString(),
    ]).catch((err) => console.error('[Sheets Sync Error - Visitors]', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Visitors API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
