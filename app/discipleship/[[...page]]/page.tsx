import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import DtkRequestGate from '@/components/DtkRequestGate';
import { extractBody, resolveDtkPage, type DtkPage } from '@/lib/dtk/pages';
import { getDtkViewer } from '@/lib/dtk/server';
import '../dtk.css';

export const metadata: Metadata = {
  title: 'Discipleship Training Kit | Citychurch',
  robots: { index: false, follow: false },
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'discipleship');

// Hero image descriptions, one per kit page. Images live in
// public/images/discipleship/<page>.webp.
const HERO_ALT: Record<DtkPage, string> = {
  index: 'A small group of adults sitting in a circle with open Bibles, listening as one woman speaks',
  pitfalls: 'A small group around a table listening closely as one man shares, a friend’s hand on his shoulder',
  training: 'Group leaders around a table with Bibles and notebooks as one woman leads the discussion',
  toolkit: 'Three women praying together with joined hands beside an open Bible',
  sources: 'Hands resting on open Bibles and notebooks across a wooden table',
};

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
  return (
    <div className="dtk">
      <div className="dtk-hero">
        <Image
          src={`/images/discipleship/${name}.webp`}
          alt={HERO_ALT[name]}
          width={2000}
          height={858}
          priority
          sizes="(max-width: 1100px) 100vw, 1100px"
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
