'use client';

import { cancelChristmasReservation } from '@/app/admin/christmas/actions';

export default function CancelChristmasReservationButton({
  reservationId,
  contactName,
}: {
  reservationId: string;
  contactName: string;
}) {
  return (
    <form
      action={cancelChristmasReservation}
      onSubmit={(event) => {
        if (!window.confirm(`Cancel ${contactName}’s Christmas reservation and reopen the table?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="reservationId" value={reservationId} />
      <button
        type="submit"
        style={{
          padding: '0.45rem 0.7rem',
          backgroundColor: 'transparent',
          border: '1px solid rgba(220, 38, 38, 0.35)',
          borderRadius: '6px',
          color: '#b91c1c',
          fontSize: '0.75rem',
          fontWeight: 650,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Cancel
      </button>
    </form>
  );
}
