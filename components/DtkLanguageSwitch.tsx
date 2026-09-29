import Link from 'next/link';
import { DTK_COPY } from '@/lib/dtk/i18n';
import { dtkPath, type DtkLang, type DtkRouteName } from '@/lib/dtk/pages';

const linkStyle = (active: boolean): React.CSSProperties => ({
  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
  fontWeight: active ? 600 : 400,
  textDecoration: active ? 'none' : 'underline',
  textUnderlineOffset: '3px',
});

// "English | Español" link pair that opens the same kit page in the other language.
export default function DtkLanguageSwitch({ lang, page }: { lang: DtkLang; page: DtkRouteName }) {
  return (
    <nav
      aria-label={DTK_COPY[lang].switchLabel}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        maxWidth: '1100px',
        margin: '0 auto 1rem',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '0.875rem',
      }}
    >
      <Link href={dtkPath('en', page)} lang="en" aria-current={lang === 'en' ? 'true' : undefined} style={linkStyle(lang === 'en')}>
        English
      </Link>
      <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>|</span>
      <Link href={dtkPath('es', page)} lang="es" aria-current={lang === 'es' ? 'true' : undefined} style={linkStyle(lang === 'es')}>
        Español
      </Link>
    </nav>
  );
}
