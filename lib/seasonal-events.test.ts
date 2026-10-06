import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getCitychurchTodayIso,
  getInitialSeasonMonth,
  seasonEvents,
} from './seasonal-events.ts';

test('the season calendar expands Ready events while honoring date exceptions', () => {
  const counts = seasonEvents.reduce<Record<string, number>>((result, event) => {
    const month = event.date.slice(0, 7);
    result[month] = (result[month] ?? 0) + 1;
    return result;
  }, {});

  assert.deepEqual(counts, {
    '2026-10': 13,
    '2026-11': 14,
    '2026-12': 12,
  });
  assert.equal(seasonEvents.length, 39);
});

test('Family Night does not appear during the Christmas banquet or holiday weeks', () => {
  const december16Events = seasonEvents
    .filter((event) => event.date === '2026-12-16')
    .map((event) => event.title);
  const familyNightDates = seasonEvents
    .filter((event) => event.title === 'Family Night at Citychurch')
    .map((event) => event.date);

  assert.deepEqual(december16Events, ['Wednesday Night Christmas Banquet']);
  assert.equal(familyNightDates.includes('2026-11-25'), false);
  assert.equal(familyNightDates.includes('2026-12-23'), false);
  assert.equal(familyNightDates.includes('2026-12-30'), false);
});

test('both completed Christmas banquet dates appear in the season', () => {
  const christmasBanquets = seasonEvents
    .filter((event) => event.title.endsWith('Night Christmas Banquet'))
    .map((event) => [event.title, event.date]);

  assert.deepEqual(christmasBanquets, [
    ['Tuesday Night Christmas Banquet', '2026-12-15'],
    ['Wednesday Night Christmas Banquet', '2026-12-16'],
  ]);
});

test('one-time celebrations remain distinct from expanded weekly gatherings', () => {
  const oneTimeEvents = seasonEvents
    .filter((event) => !event.recurring)
    .map((event) => [event.title, event.date]);

  assert.deepEqual(oneTimeEvents, [
    ["Citychurch Children's Day Celebration", '2026-10-17'],
    ['Thanksgiving Worship and Banquet', '2026-11-22'],
    ['Tuesday Night Christmas Banquet', '2026-12-15'],
    ['Wednesday Night Christmas Banquet', '2026-12-16'],
  ]);
});

test('Citychurch dates use America/Chicago instead of the server timezone', () => {
  assert.equal(getCitychurchTodayIso(new Date('2026-10-06T00:30:00Z')), '2026-10-05');
});

test('the focus month stays inside the October through December season', () => {
  assert.equal(getInitialSeasonMonth('2026-09-30'), 9);
  assert.equal(getInitialSeasonMonth('2026-11-12'), 10);
  assert.equal(getInitialSeasonMonth('2027-01-01'), 11);
});
