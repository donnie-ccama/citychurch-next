import Image from 'next/image';
import Link from 'next/link';
import {
  SEASON_MONTHS,
  SEASON_YEAR,
  monthName,
  type OngoingSeasonOpportunity,
  type SeasonEvent,
} from '@/lib/seasonal-events';

interface SeasonalEventListProps {
  events: SeasonEvent[];
  ongoingOpportunity: OngoingSeasonOpportunity;
  todayIso: string;
}

export default function SeasonalEventList({
  events,
  ongoingOpportunity,
  todayIso,
}: SeasonalEventListProps) {
  return (
    <section className="season-event-list-section" aria-labelledby="season-event-list-title">
      <div className="season-event-list-intro">
        <h2 id="season-event-list-title">Every date, in order.</h2>
        <p>Choose a gathering, read the details, and make your next step before you arrive.</p>
      </div>

      <div className="season-event-month-groups">
        {SEASON_MONTHS.map((month) => {
          const monthKey = `${SEASON_YEAR}-${String(month + 1).padStart(2, '0')}`;
          const monthEvents = events.filter((event) => event.date.startsWith(monthKey));

          return (
            <section className="season-event-month-group" key={month} aria-labelledby={`event-list-${month}`}>
              <div className="season-event-month-label">
                <h3 id={`event-list-${month}`}>{monthName(month)}</h3>
                <span>{monthEvents.length} events</span>
              </div>

              <div className="season-event-rows">
                {monthEvents.map((event) => {
                  const isPast = event.date < todayIso;
                  const hasAction = Boolean(event.href && event.actionLabel);
                  return (
                    <article
                      className={`season-event-row${isPast ? ' is-past' : ''}${hasAction ? '' : ' has-no-action'}`}
                      key={event.id}
                    >
                      <div className="season-event-row-image">
                        <Image
                          src={event.image}
                          alt={event.imageAlt}
                          fill
                          sizes="(max-width: 700px) 92vw, 180px"
                        />
                      </div>

                      <time dateTime={event.date} className="season-event-row-date">
                        <strong>{event.date.slice(-2)}</strong>
                        <span>{new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${event.date}T12:00:00Z`))}</span>
                      </time>

                      <div className="season-event-row-copy">
                        <div className="season-event-row-heading">
                          <h4>{event.title}</h4>
                          <span>{event.recurring ? 'Weekly gathering' : event.category}</span>
                        </div>
                        <p className="season-event-row-time">{event.time}</p>
                        <p>{event.details ?? event.description}</p>
                        <p className="season-event-row-location">{event.location}</p>
                      </div>

                      {event.href && event.actionLabel ? (
                        <Link href={event.href} className="season-event-row-link">
                          {isPast ? 'See gathering details' : event.actionLabel}
                          <span aria-hidden="true">→</span>
                        </Link>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <article className="season-ongoing-opportunity">
        <div className="season-ongoing-image">
          <Image
            src={ongoingOpportunity.image}
            alt={ongoingOpportunity.imageAlt}
            fill
            sizes="(max-width: 760px) 100vw, 44vw"
          />
        </div>
        <div className="season-ongoing-copy">
          <h3>{ongoingOpportunity.title}</h3>
          <p className="season-ongoing-schedule">{ongoingOpportunity.schedule}</p>
          <p>{ongoingOpportunity.description}</p>
          <p className="season-event-row-location">{ongoingOpportunity.location}</p>
          <Link href={ongoingOpportunity.href}>
            {ongoingOpportunity.actionLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
