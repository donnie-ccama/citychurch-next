/**
 * GET /api/carousel
 *
 * Fetches image files from a specific Google Drive folder and returns
 * publicly-accessible thumbnail URLs. Uses the same Google service account
 * credentials as the Sheets integration.
 *
 * Environment variables (already set in Vercel for Sheets):
 *   GOOGLE_SHEETS_PRIVATE_KEY   — service account private key
 *   GOOGLE_SHEETS_CLIENT_EMAIL  — service account email
 *
 * Additional env var:
 *   GOOGLE_DRIVE_CAROUSEL_FOLDER_ID — the Drive folder to pull photos from
 */

import { NextResponse } from 'next/server';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
  };
}

export async function GET() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const folderId =
    process.env.GOOGLE_DRIVE_CAROUSEL_FOLDER_ID ||
    '10mpnGFSKI0GDdAt4Gcgtk5vVVQN3qNNI';

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

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields:
        'files(id, name, mimeType, thumbnailLink, imageMediaMetadata)',
      orderBy: 'createdTime desc',
      pageSize: 50,
    });

    const files: DriveFile[] = (response.data.files as DriveFile[]) || [];

    const photos = files.map((file) => ({
      id: file.id,
      name: file.name,
      // Use the Drive thumbnail URL with a larger size parameter
      src: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`,
      alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      width: file.imageMediaMetadata?.width || 1200,
      height: file.imageMediaMetadata?.height || 800,
    }));

    return NextResponse.json(
      { photos },
      {
        headers: {
          // Cache for 5 minutes so the page stays snappy but new photos
          // show up fairly quickly after being added to the Drive folder.
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[Carousel API] Error fetching Drive photos:', err);
    return NextResponse.json(
      { error: 'Failed to fetch photos from Google Drive' },
      { status: 500 }
    );
  }
}
