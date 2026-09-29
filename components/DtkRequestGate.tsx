import Link from 'next/link';
import DtkRequestForm from '@/components/DtkRequestForm';
import type { DtkRequestStatus } from '@/lib/dtk/access';

export default function DtkRequestGate({
  email,
  status,
}: {
  email: string | null;
  status: DtkRequestStatus | null;
}) {
  return (
    <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Discipleship Training Kit</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Training for launching discipleship groups among our staff and volunteers: common
        pitfalls, a six-session training plan, and a weekly group toolkit. Access is by approval.
      </p>

      {email && (
        <p style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {status === 'pending'
            ? `You're signed in as ${email}. Your request is waiting for approval.`
            : `You're signed in as ${email}, but this account doesn't have access yet.`}
        </p>
      )}

      {status !== 'pending' && <DtkRequestForm defaultEmail={email ?? ''} />}

      <p style={{ marginTop: '1.5rem' }}>
        Already approved?{' '}
        <Link href="/discipleship/login" style={{ color: 'var(--accent)' }}>
          Log in
        </Link>
      </p>
    </main>
  );
}
