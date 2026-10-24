export const CHRISTMAS_EVENT_SLUG = 'christmas-2026';

export interface ChristmasEvent {
  id: string;
  slug: string;
  title: string;
  event_year: number;
  location: string;
  registration_open: boolean;
}

export interface ChristmasBanquet {
  id: string;
  event_id: string;
  event_date: string;
  doors_open: string;
  dinner_at: string;
  ends_at: string;
  display_order: number;
  table_capacity: number;
  tables_reserved: number;
  active: boolean;
}

export interface ChristmasReservation {
  id: string;
  event_id: string;
  banquet_id: string;
  confirmation_code: string;
  contact_name: string;
  email: string;
  phone: string;
  guest_count: number;
  dietary_notes: string | null;
  accessibility_notes: string | null;
  comments: string | null;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  admin_notification_status: 'pending' | 'sent' | 'failed' | 'skipped';
  guest_notification_status: 'pending' | 'sent' | 'failed' | 'skipped';
  created_at: string;
  updated_at: string;
}

export interface ChristmasEventWithBanquets {
  event: ChristmasEvent;
  banquets: ChristmasBanquet[];
  usingPreviewData: boolean;
}

export function tablesAvailable(banquet: ChristmasBanquet): number {
  return Math.max(banquet.table_capacity - banquet.tables_reserved, 0);
}

export function formatBanquetDate(date: string, includeYear = true): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

export function formatBanquetTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(Date.UTC(2026, 0, 1, hours, minutes));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}
