/**
 * GET /api/carousel/image?id=DRIVE_FILE_ID
 *
 * Proxies a Google Drive image through the server using the service account.
 * This ensures images load reliably on all devices (mobile, desktop, etc.)
 * regardless of the user's Google auth state.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get('id');
  const download = request.nextUrl.searchParams.get('download') === '1';
  const filename = request.nextUrl.searchParams.get('name') || 'citychurch-photo';

  if (!fileId) {
    return NextResponse.json({ error: 'Missing file id' }, { status: 400 });
  }

  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const clientEmail = (process.env.GOOGLE_SHEETS_CLIENT_EMAIL || '')
    .replace(/\n/g, '')
    .trim();

  if (!privateKey || !clientEmail) {
    return NextResponse.json(
      { error: 'Google service account not configured' },
      { status: 500 }
    );
  }

  try {
    const { google } = await import('googleapis');

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const buffer = Buffer.from(response.data as ArrayBuffer);
    const contentType =
      response.headers['content-type'] || 'image/jpeg';

    const ext = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : '.jpg';
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    };

    if (download) {
      headers['Content-Disposition'] = `attachment; filename="${filename}${ext}"`;
    }

    return new NextResponse(buffer, { headers });
  } catch (err) {
    console.error('[Carousel Image Proxy] Error:', err);
    return NextResponse.json(
      { error: 'Failed to load image' },
      { status: 500 }
    );
  }
}
