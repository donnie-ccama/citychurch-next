import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { getDtkViewer } from '@/lib/dtk/server';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'discipleship');

// Serves the printable kit booklet to viewers who may see the kit.
// ?lang=es returns the Spanish booklet.
export async function GET(request: NextRequest) {
  const viewer = await getDtkViewer();
  if (!viewer.allowed) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const es = request.nextUrl.searchParams.get('lang') === 'es';
  const file = es
    ? path.join(CONTENT_DIR, 'es', 'booklet.pdf')
    : path.join(CONTENT_DIR, 'booklet.pdf');
  const name = es ? 'Kit de Discipulado Citychurch.pdf' : 'Citychurch Discipleship Kit.pdf';

  return new NextResponse(await readFile(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
