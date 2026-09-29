'use client';

import { useFormStatus } from 'react-dom';

const button: React.CSSProperties = {
  padding: '0.375rem 0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
};

// Submit button for the kit admin forms. Disabled while its form is working,
// so a slow invite email can't be sent twice by a second click.
export default function DtkAdminSubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      style={{ ...button, opacity: pending ? 0.6 : 1, cursor: pending ? 'wait' : 'pointer' }}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
