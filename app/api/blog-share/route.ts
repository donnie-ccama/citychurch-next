import { NextRequest, NextResponse } from 'next/server';
import { syncToGoogleSheets } from '@/lib/google-sheets';

export async function POST(req: NextRequest) {
  try {
    const { title, slug, platform, handle } = await req.json();

    if (!title || !slug || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Sync to "Blog Shares" tab in the Citychurch Forms spreadsheet
    await syncToGoogleSheets('Blog Shares', [
      title,
      slug,
      platform,
      handle || '',
      now,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[blog-share] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
