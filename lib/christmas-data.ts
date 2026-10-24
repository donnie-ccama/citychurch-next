import 'server-only';

import { createServerClient } from '@/lib/supabase-server';
import {
  CHRISTMAS_EVENT_SLUG,
  type ChristmasBanquet,
  type ChristmasEvent,
  type ChristmasEventWithBanquets,
} from '@/lib/christmas';

const previewEvent: ChristmasEvent = {
  id: '00000000-0000-4000-8000-000000002026',
  slug: CHRISTMAS_EVENT_SLUG,
  title: 'Citychurch Family Christmas Banquets',
  event_year: 2026,
  location: 'Citychurch Downtown, 205 S. Polk St, Amarillo, TX 79101',
  registration_open: true,
};

const previewBanquets: ChristmasBanquet[] = [
  {
    id: '00000000-0000-4000-8000-000000000014',
    event_id: previewEvent.id,
    event_date: '2026-12-14',
    doors_open: '17:30:00',
    dinner_at: '18:00:00',
    ends_at: '19:30:00',
    display_order: 1,
    table_capacity: 15,
    tables_reserved: 0,
    active: true,
  },
  {
    id: '00000000-0000-4000-8000-000000000015',
    event_id: previewEvent.id,
    event_date: '2026-12-15',
    doors_open: '17:30:00',
    dinner_at: '18:00:00',
    ends_at: '19:30:00',
    display_order: 2,
    table_capacity: 15,
    tables_reserved: 0,
    active: true,
  },
];

export async function getChristmasEventWithBanquets(): Promise<ChristmasEventWithBanquets> {
  try {
    const supabase = createServerClient();
    const { data: event, error: eventError } = await supabase
      .from('christmas_events')
      .select('id, slug, title, event_year, location, registration_open')
      .eq('slug', CHRISTMAS_EVENT_SLUG)
      .maybeSingle();

    if (eventError || !event) {
      return { event: previewEvent, banquets: previewBanquets, usingPreviewData: true };
    }

    const { data: banquets, error: banquetError } = await supabase
      .from('christmas_banquets')
      .select(
        'id, event_id, event_date, doors_open, dinner_at, ends_at, display_order, table_capacity, tables_reserved, active'
      )
      .eq('event_id', event.id)
      .eq('active', true)
      .order('display_order');

    if (banquetError || !banquets || banquets.length === 0) {
      return { event: previewEvent, banquets: previewBanquets, usingPreviewData: true };
    }

    return {
      event: event as ChristmasEvent,
      banquets: banquets as ChristmasBanquet[],
      usingPreviewData: false,
    };
  } catch {
    return { event: previewEvent, banquets: previewBanquets, usingPreviewData: true };
  }
}
