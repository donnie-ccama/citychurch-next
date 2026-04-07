import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

const ADMIN_EMAIL = 'donnie@citykid.me';

// This route now receives only metadata (photo_url + description).
// The actual file upload happens client-side directly to Supabase Storage,
// bypassing Vercel's 4.5MB serverless body size limit.

export async function POST(request: NextRequest) {
  try {
    const { photo_url, description } = await request.json();

    if (!photo_url || typeof photo_url !== 'string') {
      return NextResponse.json({ error: 'A photo URL is required' }, { status: 400 });
    }

    const trimmedDesc = description?.trim() || null;

    if (trimmedDesc && trimmedDesc.length > 300) {
      return NextResponse.json(
        { error: 'Description must be 300 characters or fewer' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Insert submission row
    const { data: submission, error: dbError } = await supabaseAdmin
      .from('proof_of_life')
      .insert({
        photo_url,
        description: trimmedDesc,
      })
      .select('approval_token')
      .single();

    if (dbError) {
      console.error('[DB Error]', dbError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    // Build approval + rejection links
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.citykid.online';
    const approveUrl = `${baseUrl}/api/proof-of-life/approve?token=${submission.approval_token}`;
    const rejectUrl = `${baseUrl}/api/proof-of-life/reject?token=${submission.approval_token}`;

    // Send approval email via Resend REST API
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Citychurch <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: 'New Proof of Life Submission — Approval Needed',
            html: `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
                <h2 style="color: #333;">New Photo Submission</h2>
                <p>A new photo has been submitted to the Proof of Life bulletin board.</p>
                ${trimmedDesc ? `<p><strong>Description:</strong> ${trimmedDesc}</p>` : ''}
                <p><a href="${photo_url}" target="_blank">View Photo</a></p>
                <br />
                <div style="display: flex; gap: 12px;">
                  <a href="${approveUrl}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Approve
                  </a>
                  <a href="${rejectUrl}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Reject &amp; Delete
                  </a>
                </div>
                <br />
                <p style="font-size: 13px; color: #888;">If you didn't expect this, you can ignore this email.</p>
              </div>
            `,
          }),
        });
        if (!emailRes.ok) {
          const emailErr = await emailRes.text();
          console.error('[Resend Error]', emailRes.status, emailErr);
        }
      } catch (err) {
        console.error('[Resend Error]', err);
      }
    } else {
      console.warn('[Resend] RESEND_API_KEY not set — skipping approval email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Proof of Life API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
