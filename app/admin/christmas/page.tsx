import CancelChristmasReservationButton from '@/components/CancelChristmasReservationButton';
import { createSupabaseSSR } from '@/lib/supabase-ssr';
import { CHRISTMAS_EVENT_SLUG, formatBanquetDate, formatBanquetTime } from '@/lib/christmas';

export const dynamic = 'force-dynamic';

interface AdminBanquet {
  id: string;
  event_date: string;
  doors_open: string;
  dinner_at: string;
  ends_at: string;
  table_capacity: number;
  tables_reserved: number;
  display_order: number;
}

interface AdminReservation {
  id: string;
  banquet_id: string;
  confirmation_code: string;
  contact_name: string;
  email: string;
  phone: string;
  guest_count: number;
  attends_church_regularly: boolean;
  church_name: string | null;
  dietary_notes: string | null;
  accessibility_notes: string | null;
  comments: string | null;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  admin_notification_status: 'pending' | 'sent' | 'failed' | 'skipped';
  guest_notification_status: 'pending' | 'sent' | 'failed' | 'skipped';
  created_at: string;
}

function statusColor(status: AdminReservation['status']): string {
  if (status === 'confirmed') return '#15803d';
  if (status === 'waitlisted') return '#a16207';
  return '#6b7280';
}

function notificationLabel(status: AdminReservation['admin_notification_status']): string {
  if (status === 'sent') return 'Admin emailed';
  if (status === 'skipped') return 'Email not configured';
  if (status === 'failed') return 'Email failed';
  return 'Email pending';
}

export default async function ChristmasAdminPage() {
  const supabase = await createSupabaseSSR();
  const { data: event, error: eventError } = await supabase
    .from('christmas_events')
    .select('id, title, location, registration_open')
    .eq('slug', CHRISTMAS_EVENT_SLUG)
    .maybeSingle();

  if (eventError || !event) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 750, marginBottom: '1rem' }}>Christmas Banquets</h1>
        <div
          style={{
            maxWidth: '680px',
            padding: '1.25rem',
            border: '1px solid rgba(202, 138, 4, 0.35)',
            borderRadius: '10px',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
          }}
        >
          The Christmas banquet database migration has not been applied to this Supabase project yet.
          The public page can be previewed, but live reservations will begin after the migration is deployed.
        </div>
      </div>
    );
  }

  const [{ data: banquetData }, { data: reservationData }] = await Promise.all([
    supabase
      .from('christmas_banquets')
      .select('id, event_date, doors_open, dinner_at, ends_at, table_capacity, tables_reserved, display_order')
      .eq('event_id', event.id)
      .order('display_order'),
    supabase
      .from('christmas_reservations')
      .select(
        'id, banquet_id, confirmation_code, contact_name, email, phone, guest_count, attends_church_regularly, church_name, dietary_notes, accessibility_notes, comments, status, admin_notification_status, guest_notification_status, created_at'
      )
      .eq('event_id', event.id)
      .order('created_at', { ascending: false }),
  ]);

  const banquets = (banquetData ?? []) as AdminBanquet[];
  const reservations = (reservationData ?? []) as AdminReservation[];
  const confirmed = reservations.filter((reservation) => reservation.status === 'confirmed');
  const waitlisted = reservations.filter((reservation) => reservation.status === 'waitlisted');
  const totalGuests = confirmed.reduce((sum, reservation) => sum + reservation.guest_count, 0);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          December 14 &amp; 15, 2026
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 750, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>
          Christmas Banquets
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {event.location} · {event.registration_open ? 'Registration open' : 'Registration closed'}
        </p>
      </div>

      <div className="admin-christmas-stats" style={{ marginBottom: '2.25rem' }}>
        {banquets.map((banquet) => {
          const remaining = Math.max(banquet.table_capacity - banquet.tables_reserved, 0);
          return (
            <div
              key={banquet.id}
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>
                Banquet {banquet.display_order}
              </p>
              <h2 style={{ fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
                {formatBanquetDate(banquet.event_date, false)}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Doors {formatBanquetTime(banquet.doors_open)} · Dinner {formatBanquetTime(banquet.dinner_at)}
              </p>
              <p style={{ fontSize: '2.15rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                {banquet.tables_reserved}/{banquet.table_capacity}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                tables reserved · {remaining} remaining
              </p>
            </div>
          );
        })}

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>
            Across both evenings
          </p>
          <p style={{ fontSize: '2.15rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginTop: '2.3rem' }}>
            {totalGuests}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
            confirmed guests · {waitlisted.length} waitlisted families
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Family reservations</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {confirmed.length} confirmed · {waitlisted.length} waitlisted · {reservations.length} total records
          </p>
        </div>

        {reservations.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No families have registered yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1080px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-muted)', textAlign: 'left' }}>
                  {['Family', 'Banquet', 'Guests', 'Contact', 'Church', 'Needs & notes', 'Notification', 'Status', ''].map((heading) => (
                    <th key={heading} style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 750 }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  const banquet = banquets.find((item) => item.id === reservation.banquet_id);
                  const notes = [reservation.dietary_notes, reservation.accessibility_notes, reservation.comments].filter(Boolean);
                  return (
                    <tr key={reservation.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                        <p style={{ fontWeight: 700 }}>{reservation.contact_name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{reservation.confirmation_code}</p>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', fontSize: '0.85rem' }}>
                        {banquet ? formatBanquetDate(banquet.event_date, false) : '—'}
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', fontWeight: 700 }}>{reservation.guest_count}</td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', fontSize: '0.82rem', lineHeight: 1.55 }}>
                        <a href={`mailto:${reservation.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{reservation.email}</a><br />
                        <a href={`tel:${reservation.phone}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{reservation.phone}</a>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, maxWidth: '180px' }}>
                        {reservation.attends_church_regularly
                          ? reservation.church_name || 'Yes — church not specified'
                          : 'No'}
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, maxWidth: '240px' }}>
                        {notes.length ? notes.join(' · ') : '—'}
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', color: reservation.admin_notification_status === 'failed' ? '#b91c1c' : 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {notificationLabel(reservation.admin_notification_status)}
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                        <span style={{ color: statusColor(reservation.status), fontSize: '0.78rem', fontWeight: 750, textTransform: 'capitalize' }}>
                          {reservation.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                        {reservation.status !== 'cancelled' && (
                          <CancelChristmasReservationButton
                            reservationId={reservation.id}
                            contactName={reservation.contact_name}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
