import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(renderHTML('Missing Token', 'No approval token was provided.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const supabaseAdmin = createAdminClient();

  // Look up submission by token
  const { data: submission, error: fetchError } = await supabaseAdmin
    .from('proof_of_life')
    .select('id, status')
    .eq('approval_token', token)
    .single();

  if (fetchError || !submission) {
    return new NextResponse(
      renderHTML('Not Found', 'This approval link is invalid or has expired.'),
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (submission.status === 'approved') {
    return new NextResponse(
      renderHTML('Already Approved', 'This submission has already been approved. It should be visible on the bulletin board.', true),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Approve
  const { error: updateError } = await supabaseAdmin
    .from('proof_of_life')
    .update({ status: 'approved' })
    .eq('id', submission.id);

  if (updateError) {
    console.error('[Approval Error]', updateError);
    return new NextResponse(
      renderHTML('Error', 'Something went wrong while approving this submission. Please try again.'),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }

  return new NextResponse(
    renderHTML('Approved!', 'The photo has been approved and is now visible on the Proof of Life bulletin board.', true),
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}

function renderHTML(title: string, message: string, showLink = false): string {
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
    a.btn { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #c9302c; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    ${showLink ? '<a class="btn" href="/proof-of-life">View Bulletin Board</a>' : ''}
  </div>
</body>
</html>`;
}
