import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// POST /api/proof-of-life/approve-by-id
// Body: { id: string }
// Used by the admin page to approve a pending submission.

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from('proof_of_life')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.error('[Approve Error]', error);
      return NextResponse.json({ error: 'Failed to approve submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Approve API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
