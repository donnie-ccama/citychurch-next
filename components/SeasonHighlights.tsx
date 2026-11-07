import Link from 'next/link';
import { formatSeasonDate, type SeasonEvent } from '@/lib/seasonal-events';

interface SeasonHighlightsProps {
  events: SeasonEvent[];
}

/**
 * SeasonHighlights — the short strip of upcoming one-time events under the hero.
 * Each row links to the page where the visitor acts: visit or reserve.
 */
export default function SeasonHighlights({ events }: SeasonHighlightsProps) {
  if (events.length === 0) return null;

  return (
    <section className="season-highlights" aria-label="This season at Citychurch">
      <ol className="season-highlights-list">
        {events.map((event) => (
          <li key={event.id} className="season-highlight">
            <time className="season-highlight-date" dateTime={event.date}>
              <span className="season-highlight-month">
                {formatSeasonDate(event.date, { month: 'short', day: undefined, year: undefined })}
              </span>
              <span className="season-highlight-day">
                {formatSeasonDate(event.date, { month: undefined, day: 'numeric', year: undefined })}
              </span>
            </time>
            <div className="season-highlight-copy">
              <p className="season-highlight-title">{event.title}</p>
              <p className="season-highlight-meta">
                {formatSeasonDate(event.date, { weekday: 'long', month: undefined, day: undefined, year: undefined })} · {event.time}
              </p>
            </div>
            <Link href={event.href ?? '/events'} className="season-highlight-link">
              {event.actionLabel ?? 'Details'} <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
