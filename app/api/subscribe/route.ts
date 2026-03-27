import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { syncToGoogleSheets } from '@/lib/google-sheets';

/**
 * POST /api/subscribe
 * Adds a subscriber to:
 *   1. Supabase `subscribers` table (primary store)
 *   2. Mailchimp "Citychurch Website Subscribers" audience
 *   3. Google Sheets "Subscribers" tab (sync)
 *
 * Required environment variables (set in Vercel):
 *   MAILCHIMP_API_KEY — Your Mailchimp API key (e.g., xxxxxxx-us21)
 *   GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_SPREADSHEET_ID
 *
 * Audience: Citychurch Website Subscribers
 * Audience ID: 4fed0cb6a0
 * Server: us21
 */

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, tag } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // --- 1. Save to Supabase ---
    const supabase = createServerClient();
    const { error: dbError } = await supabase.from('subscribers').upsert(
      {
        email: email.trim().toLowerCase(),
        first_name: firstName?.trim() || null,
        tag: tag || 'website-signup-2026',
        source: 'website',
      },
      { onConflict: 'email' }
    );

    if (dbError) {
      console.error('[Subscribers DB Error]', dbError);
      // Don't fail — continue to Mailchimp
    }

    // --- 2. Send to Mailchimp ---
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID || '4fed0cb6a0';
    const SERVER = process.env.MAILCHIMP_SERVER || 'us21';

    if (!API_KEY) {
      console.log('[Email Signup] MAILCHIMP_API_KEY not set. Received:', { email, firstName, tag });
    } else {
      const url = `https://${SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

      const data: Record<string, unknown> = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {} as Record<string, string>,
        tags: [tag || 'website-signup-2026'],
      };

      if (firstName) {
        (data.merge_fields as Record<string, string>).FNAME = firstName;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok && result.title !== 'Member Exists') {
        console.error('[Mailchimp Error]', result);
        return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
      }
    }

    // --- 3. Sync to Google Sheets (non-blocking) ---
    syncToGoogleSheets('Subscribers', [
      email.trim().toLowerCase(),
      firstName?.trim() || '',
      tag || 'website-signup-2026',
      new Date().toISOString(),
    ]).catch((err) => console.error('[Sheets Sync Error - Subscribers]', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Subscribe API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
