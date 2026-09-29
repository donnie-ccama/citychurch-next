import { approveDtkRequest, denyDtkRequest } from '@/app/admin/actions';
import DtkAdminSubmitButton from '@/components/DtkAdminSubmitButton';
import { createAdminClient } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/dtk/server';
import type { DtkRequestStatus } from '@/lib/dtk/access';

type DtkRequestRow = {
  id: string;
  name: string;
  email: string;
  note: string | null;
  status: DtkRequestStatus;
  created_at: string;
};

const SECTIONS: { status: DtkRequestStatus; title: string }[] = [
  { status: 'pending', title: 'Pending' },
  { status: 'approved', title: 'Approved' },
  { status: 'denied', title: 'Denied' },
];

const cell: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid var(--border-color)',
  textAlign: 'left',
  verticalAlign: 'top',
};

export default async function AdminDiscipleshipPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;

  const { data } = await createAdminClient()
    .from('dtk_access_requests')
    .select('id, name, email, note, status, created_at')
    .order('created_at', { ascending: false });
  const rows = (data ?? []) as DtkRequestRow[];

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Discipleship Kit Access</h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Approving sends a set-password email to people without an account.
      </p>
      {error && (
        <p role="alert" style={{ color: '#b3261e', marginTop: '1rem' }}>
          {error}
        </p>
      )}

      {SECTIONS.map(({ status, title }) => {
        const list = rows.filter((r) => r.status === status);
        return (
          <section key={status} style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              {title} ({list.length})
            </h2>
            {list.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>None.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={cell}>Name</th>
                      <th style={cell}>Email</th>
                      <th style={cell}>Note</th>
                      <th style={cell}>Requested</th>
                      <th style={cell} aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((r) => (
                      <tr key={r.id}>
                        <td style={cell}>{r.name}</td>
                        <td style={cell}>{r.email}</td>
                        <td style={cell}>{r.note ?? ''}</td>
                        <td style={cell}>{new Date(r.created_at).toLocaleDateString('en-US')}</td>
                        <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                          {status !== 'approved' && (
                            <form action={approveDtkRequest} style={{ display: 'inline' }}>
                              <input type="hidden" name="id" value={r.id} />
                              <DtkAdminSubmitButton label="Approve" pendingLabel="Approving…" />
                            </form>
                          )}
                          {status !== 'denied' && (
                            <form action={denyDtkRequest} style={{ display: 'inline', marginLeft: '0.5rem' }}>
                              <input type="hidden" name="id" value={r.id} />
                              {status === 'approved' ? (
                                <DtkAdminSubmitButton label="Revoke" pendingLabel="Revoking…" />
                              ) : (
                                <DtkAdminSubmitButton label="Deny" pendingLabel="Denying…" />
                              )}
                            </form>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
