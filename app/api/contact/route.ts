import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { syncToGoogleSheets } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
    const { error: dbError } = await supabase.from('contacts').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      source: 'website',
    });

    if (dbError) {
      console.error('[Contact DB Error]', dbError);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    // Non-blocking Google Sheets sync
    syncToGoogleSheets('Contacts', [
      name.trim(),
      email.trim().toLowerCase(),
      message.trim(),
      new Date().toISOString(),
    ]).catch((err) => console.error('[Sheets Sync Error - Contacts]', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
