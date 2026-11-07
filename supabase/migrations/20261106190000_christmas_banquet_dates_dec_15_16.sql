-- The 2026 Christmas Banquets take place on December 15 and 16, not 14 and 15.
-- Move the two banquet rows to the right dates. Reservations point at banquet ids,
-- so every existing reservation stays with its banquet.
--
-- Order matters: (event_id, event_date) is unique, so move the later row first.

UPDATE public.christmas_banquets AS banquet
SET event_date = date '2026-12-16'
FROM public.christmas_events AS event
WHERE banquet.event_id = event.id
  AND event.slug = 'christmas-2026'
  AND banquet.event_date = date '2026-12-15';

UPDATE public.christmas_banquets AS banquet
SET event_date = date '2026-12-15'
FROM public.christmas_events AS event
WHERE banquet.event_id = event.id
  AND event.slug = 'christmas-2026'
  AND banquet.event_date = date '2026-12-14';
