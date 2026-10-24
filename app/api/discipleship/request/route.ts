import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { validateDtkRequest } from '@/lib/dtk/request';
import { notifyAdminsOfDtkRequest } from '@/lib/dtk/notify';
import { getAdminEmails } from '@/lib/dtk/server';

export async function POST(request: NextRequest) {
  try {
    const result = validateDtkRequest(await request.json());
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Bots get the same answer as people, but nothing is saved.
    if (result.spam) {
      return NextResponse.json({ success: true });
    }

    const { data, error } = await createAdminClient()
      .from('dtk_access_requests')
      .upsert(result.value, { onConflict: 'email', ignoreDuplicates: true })
      .select('id');

    if (error) {
      console.error('[DTK Request DB Error]', error);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    // Only a brand-new row comes back. Repeats change nothing and email no one.
    if (data && data.length > 0) {
      await notifyAdminsOfDtkRequest(result.value, getAdminEmails());
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DTK Request API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
