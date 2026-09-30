import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import DtkLanguageSwitch from '@/components/DtkLanguageSwitch';
import DtkRequestGate from '@/components/DtkRequestGate';
import { DTK_COPY } from '@/lib/dtk/i18n';
import { dtkPath, extractBody, resolveDtkRoute } from '@/lib/dtk/pages';
import { getDtkViewer } from '@/lib/dtk/server';
import '../dtk.css';

type Params = Promise<{ page?: string[] }>;

const CONTENT_DIR = path.join(process.cwd(), 'content', 'discipleship');

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveDtkRoute((await params).page);
  return {
    title: DTK_COPY[route?.lang ?? 'en'].pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function DiscipleshipPage({ params }: { params: Params }) {
  const route = resolveDtkRoute((await params).page);
  if (!route) notFound();
  const { lang, page } = route;

  const viewer = await getDtkViewer();
  if (!viewer.allowed) {
    return <DtkRequestGate lang={lang} page={page} email={viewer.email} status={viewer.status} />;
  }

  const file =
    lang === 'es'
      ? path.join(CONTENT_DIR, 'es', `${page}.html`)
      : path.join(CONTENT_DIR, `${page}.html`);
  const html = await readFile(file, 'utf8');
  // The kit menu comes before any other kit link in the page, so the first
  // match is the menu tab for this page.
  const href = dtkPath(lang, page);
  const body = extractBody(html).replace(
    `<a href="${href}">`,
    `<a href="${href}" aria-current="page">`
  );
  return (
    <div className="dtk" lang={lang}>
      <DtkLanguageSwitch lang={lang} page={page} />
      <p style={{ maxWidth: '1100px', margin: '0 auto 1rem', textAlign: 'right', fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.875rem' }}>
        <a href={`/api/discipleship/booklet?lang=${lang}`} download>
          {DTK_COPY[lang].downloadPdf}
        </a>
      </p>
      <div className="dtk-hero">
        <Image
          src={`/images/discipleship/${page}.webp`}
          alt={DTK_COPY[lang].heroAlt[page]}
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
