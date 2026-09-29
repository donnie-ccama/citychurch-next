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
  // The kit menu comes before any other kit link in the page, so the first
  // match is the menu tab for this page.
  const href = name === 'index' ? '/discipleship' : `/discipleship/${name}`;
  const body = extractBody(html).replace(
    `<a href="${href}">`,
    `<a href="${href}" aria-current="page">`
  );
  return <div className="dtk" dangerouslySetInnerHTML={{ __html: body }} />;
}
