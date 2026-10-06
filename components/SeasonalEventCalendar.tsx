'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  SEASON_MONTHS,
  SEASON_YEAR,
  formatSeasonDate,
  monthName,
  type SeasonEvent,
  type SeasonMonth,
} from '@/lib/seasonal-events';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarProps {
  events: SeasonEvent[];
  todayIso: string;
}

interface FocusMonthHeroProps extends CalendarProps {
  initialMonth: SeasonMonth;
}

interface MonthCalendarProps extends CalendarProps {
  month: SeasonMonth;
  compact?: boolean;
  activeEventId: string | null;
  selectedEventId: string | null;
  onPreview: (eventId: string | null) => void;
  onSelect: (eventId: string) => void;
}

function MonthCalendar({
  events,
  month,
  todayIso,
  compact = false,
  activeEventId,
  selectedEventId,
  onPreview,
  onSelect,
}: MonthCalendarProps) {
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, SeasonEvent[]>();
    for (const event of events) {
      const existing = grouped.get(event.date) ?? [];
      existing.push(event);
      grouped.set(event.date, existing);
    }
    return grouped;
  }, [events]);

  const firstWeekday = new Date(Date.UTC(SEASON_YEAR, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(SEASON_YEAR, month + 1, 0)).getUTCDate();
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    if (index < firstWeekday) return null;
    return index - firstWeekday + 1;
  });

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className={compact ? 'season-calendar season-calendar-compact' : 'season-calendar'}>
      <div className="season-weekdays" aria-hidden="true">
        {weekdays.map((day) => (
          <span key={day}>{compact ? day.charAt(0) : day}</span>
        ))}
      </div>
      <div className="season-calendar-grid" aria-label={`${monthName(month)} ${SEASON_YEAR} event calendar`}>
        {cells.map((day, index) => {
          if (day === null) {
            return <span className="season-day season-day-empty" key={`empty-${index}`} aria-hidden="true" />;
          }

          const date = `${SEASON_YEAR}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = eventsByDate.get(date) ?? [];
          const primaryEvent = dayEvents[0];
          const isPast = date < todayIso;
          const isToday = date === todayIso;

          if (!primaryEvent) {
            return (
              <span
                className={`season-day${isPast ? ' is-past' : ''}${isToday ? ' is-today' : ''}`}
                key={date}
                aria-label={isToday ? `${day}, today` : String(day)}
              >
                {day}
              </span>
            );
          }

          const active = activeEventId === primaryEvent.id;
          const selected = selectedEventId === primaryEvent.id;
          const column = index % 7;
          const row = Math.floor(index / 7);
          const horizontalClass = column < 2 ? 'align-left' : column > 4 ? 'align-right' : 'align-center';
          const verticalClass = row < 2 ? 'open-below' : 'open-above';
          const eventSummary = dayEvents
            .map((event) => `${event.title}, ${event.time}`)
            .join('; ');

          return (
            <div
              className={`season-event-cell ${horizontalClass} ${verticalClass}${isPast ? ' is-past' : ''}${active || selected ? ' is-open' : ''}`}
              key={date}
              onPointerEnter={() => onPreview(primaryEvent.id)}
              onPointerLeave={() => onPreview(null)}
              onFocusCapture={() => onPreview(primaryEvent.id)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) onPreview(null);
              }}
            >
              <button
                type="button"
                className="season-event-day"
                aria-expanded={active || selected}
                aria-label={`${formatSeasonDate(primaryEvent.date)}: ${eventSummary}`}
                onClick={() => onSelect(primaryEvent.id)}
              >
                <Image
                  src={primaryEvent.image}
                  alt=""
                  fill
                  sizes={compact ? '(max-width: 720px) 12vw, 4vw' : '(max-width: 720px) 13vw, 7vw'}
                />
                <span className="season-event-shade" aria-hidden="true" />
                <span className="season-event-day-copy">
                  <strong>{day}</strong>
                  <span>{compact ? primaryEvent.title.split(' ')[0] : primaryEvent.title}</span>
                </span>
                {dayEvents.length > 1 ? <span className="season-event-count">+{dayEvents.length - 1}</span> : null}
              </button>

              {active || selected ? (
                <div className="season-event-popover" role="status">
                  <p className="season-event-popover-date">{formatSeasonDate(primaryEvent.date)}</p>
                  <div className="season-event-popover-events">
                    {dayEvents.map((event) => (
                      <div className="season-event-popover-event" key={event.id}>
                        <h3>{event.title}</h3>
                        <p>{event.time}</p>
                        <p>{event.location}</p>
                        {event.href && event.actionLabel ? (
                          <Link href={event.href} onClick={(clickEvent) => clickEvent.stopPropagation()}>
                            {event.actionLabel} <span aria-hidden="true">→</span>
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FocusMonthHero({ events, initialMonth, todayIso }: FocusMonthHeroProps) {
  const [month, setMonth] = useState<SeasonMonth>(initialMonth);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const activeEventId = hoveredEventId ?? selectedEventId;

  function selectMonth(nextMonth: SeasonMonth) {
    setMonth(nextMonth);
    setHoveredEventId(null);
    setSelectedEventId(null);
  }

  function selectEvent(eventId: string) {
    setSelectedEventId((current) => (current === eventId ? null : eventId));
  }

  return (
    <section
      className="season-focus-hero"
      aria-labelledby="season-focus-title"
      data-impeccable-contract="user-approved-2026-10-05"
    >
      <Image
        className="season-focus-background"
        src="/images/web-hero-3-27-26.png"
        alt="A smiling child at Citychurch Amarillo"
        fill
        loading="eager"
        sizes="100vw"
      />
      <div className="season-focus-scrim" aria-hidden="true" />

      <div className="season-focus-layout">
        <div className="season-focus-copy">
          <h1 id="season-focus-title">A season to gather.</h1>
          <p>
            Explore what is happening at Citychurch from October through December. Every photograph marks a day worth showing up for.
          </p>
          <Link href="/events" className="season-focus-link">
            View the whole season <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="season-focus-calendar-panel">
          <div className="season-month-tabs" aria-label="Choose a month">
            {SEASON_MONTHS.map((seasonMonth) => (
              <button
                type="button"
                key={seasonMonth}
                aria-pressed={month === seasonMonth}
                onClick={() => selectMonth(seasonMonth)}
              >
                {monthName(seasonMonth)}
              </button>
            ))}
          </div>
          <MonthCalendar
            events={events}
            month={month}
            todayIso={todayIso}
            activeEventId={activeEventId}
            selectedEventId={selectedEventId}
            onPreview={setHoveredEventId}
            onSelect={selectEvent}
          />
          <p className="season-calendar-instruction">Hover, focus, or tap a photograph to see the event.</p>
        </div>
      </div>
    </section>
  );
}

export function WholeSeasonCalendar({ events, todayIso }: CalendarProps) {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const activeEventId = hoveredEventId ?? selectedEventId;

  function selectEvent(eventId: string) {
    setSelectedEventId((current) => (current === eventId ? null : eventId));
  }

  return (
    <div className="whole-season-calendar-shell">
      <div className="whole-season-months">
        {SEASON_MONTHS.map((month) => (
          <section className="whole-season-month" key={month} aria-labelledby={`whole-season-${month}`}>
            <div className="whole-season-month-heading">
              <h2 id={`whole-season-${month}`}>{monthName(month)}</h2>
              <span>{SEASON_YEAR}</span>
            </div>
            <MonthCalendar
              compact
              events={events}
              month={month}
              todayIso={todayIso}
              activeEventId={activeEventId}
              selectedEventId={selectedEventId}
              onPreview={setHoveredEventId}
              onSelect={selectEvent}
            />
          </section>
        ))}
      </div>
      <p className="whole-season-instruction">Photo dates open event details. Select a date again to close it.</p>
    </div>
  );
}
