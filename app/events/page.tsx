import type { Metadata } from 'next';
import { WholeSeasonCalendar } from '@/components/SeasonalEventCalendar';
import SeasonalEventList from '@/components/SeasonalEventList';
import { getCitychurchTodayIso, ongoingSeasonOpportunity, seasonEvents } from '@/lib/seasonal-events';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'October–December Events — Citychurch Amarillo',
  description:
    'Explore worship, family gatherings, community celebrations, and Christmas events at Citychurch Amarillo from October through December 2026.',
};

export default function EventsPage() {
  const todayIso = getCitychurchTodayIso();

  return (
    <main
      className="whole-season-page"
      data-impeccable-contract="user-approved-2026-10-05"
    >
      {/*
        THESIS: The calendar is the opening experience, not a widget below a generic event-page hero.
        OWN-WORLD: Citychurch oatmeal surfaces, documentary photography, warm serif display type, red-pink action accents, and quiet editorial structure.
        STORY: Visitors see the whole season, discover photo-marked dates, then move into complete chronological details and registration.
        FIRST VIEWPORT: A concise heading leads directly into three equal October–December calendars; event photographs interrupt the neutral date field and reveal useful details.
        FORM: The approved Whole Season composition, paired with the approved Focus Month homepage concept; seed key user-approved-2026-10-05.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
      */}
      <section className="whole-season-opening" aria-labelledby="whole-season-title">
        <div className="whole-season-opening-copy">
          <h1 id="whole-season-title">Three months. One living calendar.</h1>
          <p>
            October through December at Citychurch—weekly gatherings, family rhythms, ways to serve, and Christmas around the table.
          </p>
        </div>

        <WholeSeasonCalendar events={seasonEvents} todayIso={todayIso} />
      </section>

      <SeasonalEventList
        events={seasonEvents}
        ongoingOpportunity={ongoingSeasonOpportunity}
        todayIso={todayIso}
      />
    </main>
  );
}
