import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ADMIN_EMAIL = 'donnie@citykid.me';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File | null;
    const description = (formData.get('description') as string)?.trim() || null;

    // Validate photo
    if (!photo || !(photo instanceof File)) {
      return NextResponse.json({ error: 'A photo is required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: JPEG, PNG, WebP, HEIC' },
        { status: 400 }
      );
    }

    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 20MB.' },
        { status: 400 }
      );
    }

    // Validate description
    if (description && description.length > 300) {
      return NextResponse.json(
        { error: 'Description must be 300 characters or fewer' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Generate unique filename
    const ext = photo.name.split('.').pop() || 'jpg';
    const filename = `${crypto.randomUUID()}.${ext}`;

    // Upload to Supabase Storage
    const buffer = Buffer.from(await photo.arrayBuffer());
    const { error: uploadError } = await supabaseAdmin.storage
      .from('proof-of-life-photos')
      .upload(filename, buffer, {
        contentType: photo.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('[Upload Error]', uploadError);
      return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('proof-of-life-photos')
      .getPublicUrl(filename);

    const photoUrl = urlData.publicUrl;

    // Insert submission row
    const { data: submission, error: dbError } = await supabaseAdmin
      .from('proof_of_life')
      .insert({
        photo_url: photoUrl,
        description,
      })
      .select('approval_token')
      .single();

    if (dbError) {
      console.error('[DB Error]', dbError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    // Build approval link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citychurch.com';
    const approveUrl = `${baseUrl}/api/proof-of-life/approve?token=${submission.approval_token}`;

    // Send approval email via Resend REST API
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      fetch('https://api.resend.com/emails', {
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
              ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
              <p><a href="${photoUrl}" target="_blank">View Photo</a></p>
              <br />
              <a href="${approveUrl}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Approve Submission
              </a>
              <br /><br />
              <p style="font-size: 13px; color: #888;">If you didn't expect this, you can ignore this email.</p>
            </div>
          `,
        }),
      }).catch((err) => console.error('[Resend Error]', err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Proof of Life API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
