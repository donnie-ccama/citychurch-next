import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// POST /api/proof-of-life/remove
// Body: { id: string }
// Used by the admin page to permanently delete a submission.

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Fetch the submission to get the photo URL
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from('proof_of_life')
      .select('id, photo_url')
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Extract filename and delete from storage
    const filename = extractFilename(submission.photo_url);
    if (filename) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('proof-of-life-photos')
        .remove([filename]);

      if (storageError) {
        console.error('[Storage Delete Error]', storageError);
      }
    }

    // Delete the database row
    const { error: deleteError } = await supabaseAdmin
      .from('proof_of_life')
      .delete()
      .eq('id', submission.id);

    if (deleteError) {
      console.error('[DB Delete Error]', deleteError);
      return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Remove API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function extractFilename(photoUrl: string): string | null {
  try {
    const url = new URL(photoUrl);
    const parts = url.pathname.split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}
