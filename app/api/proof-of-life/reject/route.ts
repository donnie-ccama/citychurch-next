import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(renderHTML('Missing Token', 'No token was provided.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const supabaseAdmin = createAdminClient();

  // Look up submission by token
  const { data: submission, error: fetchError } = await supabaseAdmin
    .from('proof_of_life')
    .select('id, photo_url, status')
    .eq('approval_token', token)
    .single();

  if (fetchError || !submission) {
    return new NextResponse(
      renderHTML('Not Found', 'This link is invalid or the submission has already been removed.'),
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (submission.status === 'rejected') {
    return new NextResponse(
      renderHTML('Already Rejected', 'This submission was already rejected and removed.'),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Extract the filename from the photo URL to delete from storage
  const filename = extractFilename(submission.photo_url);

  // Delete the photo from Supabase Storage
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
    return new NextResponse(
      renderHTML('Error', 'Something went wrong while rejecting this submission. Please try again.'),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }

  return new NextResponse(
    renderHTML('Rejected', 'The submission has been rejected and the photo has been permanently deleted.'),
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}

function extractFilename(photoUrl: string): string | null {
  try {
    const url = new URL(photoUrl);
    const parts = url.pathname.split('/');
    // The filename is the last segment of the path
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

function renderHTML(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Citychurch</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #faf9f6; color: #2a2520; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; }
    .card { background: white; border: 1px solid #e8e4de; border-radius: 12px; padding: 3rem 2rem; max-width: 440px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
    p { color: #6b6560; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
