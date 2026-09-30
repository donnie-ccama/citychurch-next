import Link from 'next/link';
import DtkLanguageSwitch from '@/components/DtkLanguageSwitch';
import DtkRequestForm from '@/components/DtkRequestForm';
import type { DtkRequestStatus } from '@/lib/dtk/access';
import { DTK_COPY } from '@/lib/dtk/i18n';
import { dtkPath, type DtkLang, type DtkPage } from '@/lib/dtk/pages';

export default function DtkRequestGate({
  lang,
  page,
  email,
  status,
}: {
  lang: DtkLang;
  page: DtkPage;
  email: string | null;
  status: DtkRequestStatus | null;
}) {
  const copy = DTK_COPY[lang];
  return (
    <main lang={lang} style={{ maxWidth: '40rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <DtkLanguageSwitch lang={lang} page={page} />
      <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{copy.gateTitle}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{copy.gateIntro}</p>

      {email && (
        <p style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {status === 'pending' ? copy.gatePending(email) : copy.gateNoAccess(email)}
        </p>
      )}

      {status !== 'pending' && <DtkRequestForm lang={lang} defaultEmail={email ?? ''} />}

      <p style={{ marginTop: '1.5rem' }}>
        {copy.alreadyApproved}{' '}
        <Link href={dtkPath(lang, 'login')} style={{ color: 'var(--accent)' }}>
          {copy.logIn}
        </Link>
      </p>
    </main>
  );
}
