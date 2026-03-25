import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscribe
 * Adds a subscriber to the Mailchimp audience list.
 *
 * Required environment variables:
 *   MAILCHIMP_API_KEY     — Your Mailchimp API key (e.g., xxxxxxx-us21)
 *   MAILCHIMP_AUDIENCE_ID — Your Mailchimp audience/list ID
 *   MAILCHIMP_SERVER      — Your Mailchimp server prefix (e.g., us21)
 */

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, tag } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const SERVER = process.env.MAILCHIMP_SERVER; // e.g., 'us21'

    if (!API_KEY || !AUDIENCE_ID || !SERVER) {
      // If Mailchimp isn't configured yet, log and return success
      // so the form still works during development
      console.log('[Email Signup] Mailchimp not configured. Received:', { email, firstName, tag });
      return NextResponse.json({ success: true, message: 'Logged (Mailchimp not configured)' });
    }

    const url = `https://${SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    const data: any = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {},
      tags: [tag || 'website-signup-2026'],
    };

    if (firstName) {
      data.merge_fields.FNAME = firstName;
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

    if (response.ok) {
      return NextResponse.json({ success: true });
    }

    // Handle "already subscribed" gracefully
    if (result.title === 'Member Exists') {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    console.error('[Mailchimp Error]', result);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  } catch (error) {
    console.error('[Subscribe API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
