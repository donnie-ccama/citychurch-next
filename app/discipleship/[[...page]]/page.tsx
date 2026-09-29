import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DtkRequestGate from '@/components/DtkRequestGate';
import { extractBody, resolveDtkPage } from '@/lib/dtk/pages';
import { getDtkViewer } from '@/lib/dtk/server';
import '../dtk.css';

export const metadata: Metadata = {
  title: 'Discipleship Training Kit | Citychurch',
  robots: { index: false, follow: false },
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'discipleship');

export default async function DiscipleshipPage({
  params,
}: {
  params: Promise<{ page?: string[] }>;
}) {
  const { page } = await params;
  const name = resolveDtkPage(page);
  if (!name) notFound();

  const viewer = await getDtkViewer();
  if (!viewer.allowed) {
    return <DtkRequestGate email={viewer.email} status={viewer.status} />;
  }

  const html = await readFile(path.join(CONTENT_DIR, `${name}.html`), 'utf8');
  return <div className="dtk" dangerouslySetInnerHTML={{ __html: extractBody(html) }} />;
}
