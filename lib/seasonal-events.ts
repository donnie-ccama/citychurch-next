export const SEASON_YEAR = 2026;
export const SEASON_MONTHS = [9, 10, 11] as const;

export type SeasonMonth = (typeof SEASON_MONTHS)[number];
export type SeasonEventCategory =
  | 'Gathering'
  | 'Family'
  | 'Christmas'
  | 'Volunteer'
  | 'Outreach'
  | 'Children'
  | 'Youth'
  | 'Other';

export interface SeasonEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  sortTime: string;
  description: string;
  details?: string;
  location: string;
  image: string;
  imageAlt: string;
  href?: string;
  actionLabel?: string;
  category: SeasonEventCategory;
  recurring: boolean;
  featured: boolean;
}

export interface OngoingSeasonOpportunity {
  title: string;
  schedule: string;
  description: string;
  location: string;
  image: string;
  imageAlt: string;
  href: string;
  actionLabel: string;
}

interface SourceEvent {
  sourceId: string;
  title: string;
  firstDate: string;
  time: string;
  sortTime: string;
  description: string;
  details: string;
  location: string;
  image: string;
  imageAlt: string;
  href?: string;
  actionLabel?: string;
  excludedDates?: string[];
  category: SeasonEventCategory;
  recurrence: 'Weekly' | 'One-time';
  featured: boolean;
}

const CITYCHURCH_DOWNTOWN = 'Citychurch Downtown, 205 S. Polk St, Amarillo, TX 79101';
const SEASON_END = '2026-12-31';

// Synced from the Ready rows in Citychurch Calendar — Source of Truth on October 6, 2026.
// Spreadsheet: https://docs.google.com/spreadsheets/d/1WCHC3N-ICVZCvcKa9UALrfFy5_y8T0IrUuEfJR3cUGA
const sourceEvents: SourceEvent[] = [
  {
    sourceId: 'sunday-morning-worship',
    title: 'Worship at Citychurch',
    firstDate: '2026-10-04',
    time: '10:30 AM–12:00 PM',
    sortTime: '10:30',
    description: 'Sincere worship and relevant preaching in a warm, welcoming atmosphere.',
    details:
      "Every Sunday morning at Citychurch, we gather to worship the Lord and grow spiritually through fellowship, sincere worship, and preaching that is relevant and anchored in the grace and authority of God's Word. Everyone is welcome, and dress is casual.",
    location: CITYCHURCH_DOWNTOWN,
    image: '/images/event-sunday-mornings.jpg',
    imageAlt: 'Musicians leading worship at Citychurch',
    category: 'Gathering',
    recurrence: 'Weekly',
    featured: true,
  },
  {
    sourceId: 'sunday-morning-prayer-breakfast',
    title: 'Weekly Prayer Breakfast',
    firstDate: '2026-10-04',
    time: '9:30 AM–10:15 AM',
    sortTime: '09:30',
    description: "Breakfast is special at Citychurch. It's freshly prepared, tasty, and free.",
    details:
      'Sunday mornings at Citychurch start with a freshly prepared breakfast in the café. Friends gather around tables and enjoy the warm atmosphere and sweet spirit of one of the most unique and historic buildings in downtown Amarillo.',
    location: CITYCHURCH_DOWNTOWN,
    image: '/images/ministry-01.jpg',
    imageAlt: 'A child seated at a decorated table at Citychurch',
    category: 'Gathering',
    recurrence: 'Weekly',
    featured: true,
  },
  {
    sourceId: 'wednesday-family-night',
    title: 'Family Night at Citychurch',
    firstDate: '2026-10-07',
    time: '5:30 PM–7:30 PM',
    sortTime: '17:30',
    description: 'Citychurch gathers on Wednesday nights for dinner, worship, and small groups.',
    details:
      'Wednesday nights are when we gather to grow. We begin at 5:30 with a great dinner in the café and then enjoy worship and small groups. No matter your age or interests, there is a place for you to meet friends and grow spiritually together.',
    location: CITYCHURCH_DOWNTOWN,
    image: '/images/event-family-night.jpg',
    imageAlt: 'Children and families gathering together at Citychurch',
    excludedDates: ['2026-11-25', '2026-12-16', '2026-12-23', '2026-12-30'],
    category: 'Gathering',
    recurrence: 'Weekly',
    featured: true,
  },
  {
    sourceId: 'childrens-day-celebration',
    title: "Citychurch Children's Day Celebration",
    firstDate: '2026-10-17',
    time: '2:00 PM–5:00 PM',
    sortTime: '14:00',
    description: 'An incredible opportunity for your family to enjoy the fall weather in the Park at Citychurch.',
    details:
      "Children's Day is a fun afternoon of play, great food, and live music at Citychurch Park. Make a s'more with your little one around the fire pit, enjoy the cotton candy and kettle corn, and enjoy the peaceful atmosphere with your family. Everyone is welcome, and everything is free.",
    location: CITYCHURCH_DOWNTOWN,
    image: '/images/web-hero-3-27-26.png',
    imageAlt: 'A smiling child playing at Citychurch Park',
    category: 'Outreach',
    recurrence: 'One-time',
    featured: true,
  },
  {
    sourceId: 'thanksgiving-worship-and-banquet',
    title: 'Thanksgiving Worship and Banquet',
    firstDate: '2026-11-22',
    time: '10:30 AM–1:00 PM',
    sortTime: '10:30',
    description: 'Thanksgiving is better with friends and family at Citychurch.',
    details:
      "Thanksgiving is special at Citychurch. We will begin the morning with worship at 10:30 and then enjoy Thanksgiving dinner together in the café. Citychurch will provide a multicultural menu that celebrates the best of our families' different cultures and traditions.",
    location: CITYCHURCH_DOWNTOWN,
    image: '/images/ministry-02.jpg',
    imageAlt: 'A family spending time together at a Citychurch holiday table',
    category: 'Gathering',
    recurrence: 'One-time',
    featured: true,
  },
  {
    sourceId: 'citychurch-christmas-banquet-tuesday',
    title: 'Tuesday Night Christmas Banquet',
    firstDate: '2026-12-15',
    time: '5:30 PM–7:30 PM',
    sortTime: '17:30',
    description: 'A wonderful evening of great food, live music, and heartfelt Christmas celebration.',
    details:
      'The Christmas banquets at Citychurch are special. Families gather from all over the city to enjoy dinner, live Christmas music, and a celebration of Jesus. This is a great opportunity for you and your loved ones to make a special Christmas memory.',
    location: CITYCHURCH_DOWNTOWN,
    image: '/images/web-hero-3-27-26.png',
    imageAlt: 'A smiling child at Citychurch Amarillo',
    category: 'Outreach',
    recurrence: 'One-time',
    featured: true,
  },
  {
    sourceId: 'citychurch-christmas-banquet-wednesday',
    title: 'Wednesday Night Christmas Banquet',
    firstDate: '2026-12-16',
    time: '5:30 PM–7:30 PM',
    sortTime: '17:30',
    description: 'A wonderful evening of great food, live music, and heartfelt Christmas celebration.',
    details:
      'The Christmas banquets at Citychurch are special. Families gather from all over the city to enjoy dinner, live Christmas music, and a celebration of Jesus. This is a great opportunity for you and your loved ones to make a special Christmas memory.',
    location: CITYCHURCH_DOWNTOWN,
    image: '/images/web-hero-3-27-26.png',
    imageAlt: 'A smiling child at Citychurch Amarillo',
    category: 'Outreach',
    recurrence: 'One-time',
    featured: true,
  },
];

function addDays(date: string, days: number) {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function expandSourceEvent(event: SourceEvent): SeasonEvent[] {
  const dates = [event.firstDate];

  if (event.recurrence === 'Weekly') {
    let nextDate = addDays(event.firstDate, 7);
    while (nextDate <= SEASON_END) {
      dates.push(nextDate);
      nextDate = addDays(nextDate, 7);
    }
  }

  return dates.filter((date) => !event.excludedDates?.includes(date)).map((date) => ({
    id: `${event.sourceId}-${date}`,
    title: event.title,
    date,
    time: event.time,
    sortTime: event.sortTime,
    description: event.description,
    details: event.details,
    location: event.location,
    image: event.image,
    imageAlt: event.imageAlt,
    href: event.href,
    actionLabel: event.actionLabel,
    category: event.category,
    recurring: event.recurrence === 'Weekly',
    featured: event.featured,
  }));
}

export const seasonEvents = sourceEvents
  .flatMap(expandSourceEvent)
  .sort((a, b) => a.date.localeCompare(b.date) || a.sortTime.localeCompare(b.sortTime));

export const ongoingSeasonOpportunity: OngoingSeasonOpportunity = {
  title: 'Volunteer with Citychurch',
  schedule: 'Monday–Thursday · 9:00 AM–5:00 PM',
  description:
    'Serve alongside friends, family, or coworkers through emergency groceries, ministry preparation, and other practical work for Amarillo families.',
  location: CITYCHURCH_DOWNTOWN,
  image: '/images/event-volunteer.jpg',
  imageAlt: 'Citychurch volunteers serving together',
  href: '/register/volunteer',
  actionLabel: 'Find a time to serve',
};

export function monthName(month: SeasonMonth) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(SEASON_YEAR, month, 1))
  );
}

export function formatSeasonDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  }).format(new Date(`${date}T12:00:00Z`));
}

export function getInitialSeasonMonth(todayIso: string): SeasonMonth {
  const seasonStart = `${SEASON_YEAR}-10-01`;
  const seasonEnd = `${SEASON_YEAR}-12-31`;

  if (todayIso < seasonStart) return SEASON_MONTHS[0];
  if (todayIso > seasonEnd) return SEASON_MONTHS[SEASON_MONTHS.length - 1];

  const month = Number(todayIso.slice(5, 7)) - 1;
  return month as SeasonMonth;
}

export function getCitychurchTodayIso(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Chicago',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
