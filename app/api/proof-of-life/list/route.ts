import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// GET /api/proof-of-life/list
// Returns ALL submissions (pending + approved) for admin management.
// Uses the service role client to bypass RLS.

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('proof_of_life')
      .select('id, photo_url, description, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[List Error]', error);
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    return NextResponse.json({ submissions: data || [] });
  } catch (error) {
    console.error('[List API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
