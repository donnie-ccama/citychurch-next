-- Christmas banquet registration for the 2026 Citychurch family banquets.
-- Capacity is tracked as whole tables: one reservation = one table, up to 8 guests.

CREATE TABLE IF NOT EXISTS public.christmas_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  event_year integer NOT NULL CHECK (event_year BETWEEN 2026 AND 2100),
  location text NOT NULL,
  registration_open boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.christmas_banquets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.christmas_events(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  doors_open time NOT NULL,
  dinner_at time NOT NULL,
  ends_at time NOT NULL,
  display_order smallint NOT NULL,
  table_capacity smallint NOT NULL DEFAULT 15 CHECK (table_capacity BETWEEN 1 AND 500),
  tables_reserved smallint NOT NULL DEFAULT 0 CHECK (tables_reserved >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT christmas_banquets_capacity_check CHECK (tables_reserved <= table_capacity),
  CONSTRAINT christmas_banquets_event_date_key UNIQUE (event_id, event_date)
);

CREATE TABLE IF NOT EXISTS public.christmas_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.christmas_events(id) ON DELETE CASCADE,
  banquet_id uuid NOT NULL REFERENCES public.christmas_banquets(id) ON DELETE RESTRICT,
  confirmation_code text NOT NULL UNIQUE,
  contact_name text NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 40),
  guest_count smallint NOT NULL CHECK (guest_count BETWEEN 1 AND 8),
  attends_church_regularly boolean NOT NULL,
  church_name text CHECK (church_name IS NULL OR char_length(church_name) <= 160),
  dietary_notes text CHECK (dietary_notes IS NULL OR char_length(dietary_notes) <= 1000),
  accessibility_notes text CHECK (accessibility_notes IS NULL OR char_length(accessibility_notes) <= 1000),
  comments text CHECK (comments IS NULL OR char_length(comments) <= 2000),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  admin_notification_status text NOT NULL DEFAULT 'pending'
    CHECK (admin_notification_status IN ('pending', 'sent', 'failed', 'skipped')),
  guest_notification_status text NOT NULL DEFAULT 'pending'
    CHECK (guest_notification_status IN ('pending', 'sent', 'failed', 'skipped')),
  admin_notified_at timestamptz,
  guest_notified_at timestamptz,
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS christmas_banquets_event_id_idx
  ON public.christmas_banquets(event_id);

CREATE INDEX IF NOT EXISTS christmas_reservations_event_id_idx
  ON public.christmas_reservations(event_id);

CREATE INDEX IF NOT EXISTS christmas_reservations_banquet_id_idx
  ON public.christmas_reservations(banquet_id);

CREATE INDEX IF NOT EXISTS christmas_reservations_status_created_idx
  ON public.christmas_reservations(status, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS christmas_reservations_active_email_idx
  ON public.christmas_reservations(event_id, lower(email))
  WHERE status IN ('confirmed', 'waitlisted');

ALTER TABLE public.christmas_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.christmas_banquets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.christmas_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view open Christmas events" ON public.christmas_events;
CREATE POLICY "Public can view open Christmas events"
  ON public.christmas_events
  FOR SELECT
  TO anon, authenticated
  USING (registration_open = true OR (select public.is_admin()));

DROP POLICY IF EXISTS "Public can view active Christmas banquets" ON public.christmas_banquets;
CREATE POLICY "Public can view active Christmas banquets"
  ON public.christmas_banquets
  FOR SELECT
  TO anon, authenticated
  USING (active = true OR (select public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage Christmas events" ON public.christmas_events;
CREATE POLICY "Admins can manage Christmas events"
  ON public.christmas_events
  FOR ALL
  TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage Christmas banquets" ON public.christmas_banquets;
CREATE POLICY "Admins can manage Christmas banquets"
  ON public.christmas_banquets
  FOR ALL
  TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage Christmas reservations" ON public.christmas_reservations;
CREATE POLICY "Admins can manage Christmas reservations"
  ON public.christmas_reservations
  FOR ALL
  TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

-- Existing Supabase projects may still auto-grant table privileges in public.
-- Reset these tables to the minimum access required by the application.
REVOKE ALL ON public.christmas_events, public.christmas_banquets,
  public.christmas_reservations FROM anon, authenticated;

GRANT SELECT ON public.christmas_events, public.christmas_banquets TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.christmas_events,
  public.christmas_banquets, public.christmas_reservations TO authenticated;
GRANT ALL ON public.christmas_events, public.christmas_banquets,
  public.christmas_reservations TO service_role;

CREATE OR REPLACE FUNCTION public.reserve_christmas_table(
  p_event_slug text,
  p_banquet_id uuid,
  p_contact_name text,
  p_email text,
  p_phone text,
  p_guest_count smallint,
  p_attends_church_regularly boolean,
  p_church_name text DEFAULT NULL,
  p_dietary_notes text DEFAULT NULL,
  p_accessibility_notes text DEFAULT NULL,
  p_comments text DEFAULT NULL,
  p_join_waitlist boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_event public.christmas_events%ROWTYPE;
  v_banquet public.christmas_banquets%ROWTYPE;
  v_existing public.christmas_reservations%ROWTYPE;
  v_reservation public.christmas_reservations%ROWTYPE;
  v_status text;
  v_confirmation_code text;
BEGIN
  IF char_length(trim(p_contact_name)) NOT BETWEEN 2 AND 120
     OR char_length(trim(p_email)) NOT BETWEEN 5 AND 254
     OR char_length(trim(p_phone)) NOT BETWEEN 7 AND 40
     OR p_guest_count NOT BETWEEN 1 AND 8
     OR p_attends_church_regularly IS NULL THEN
    RETURN jsonb_build_object('outcome', 'invalid');
  END IF;

  SELECT * INTO v_event
  FROM public.christmas_events
  WHERE slug = p_event_slug
    AND registration_open = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('outcome', 'closed');
  END IF;

  SELECT * INTO v_existing
  FROM public.christmas_reservations
  WHERE event_id = v_event.id
    AND lower(email) = lower(trim(p_email))
    AND status IN ('confirmed', 'waitlisted')
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    IF regexp_replace(v_existing.phone, '[^0-9]', '', 'g') <>
       regexp_replace(trim(p_phone), '[^0-9]', '', 'g') THEN
      RETURN jsonb_build_object('outcome', 'duplicate');
    END IF;

    RETURN jsonb_build_object(
      'outcome', 'existing',
      'reservation_id', v_existing.id,
      'banquet_id', v_existing.banquet_id,
      'confirmation_code', v_existing.confirmation_code,
      'status', v_existing.status
    );
  END IF;

  -- Lock only the selected banquet row and keep the transaction short.
  SELECT * INTO v_banquet
  FROM public.christmas_banquets
  WHERE id = p_banquet_id
    AND event_id = v_event.id
    AND active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('outcome', 'invalid_banquet');
  END IF;

  IF v_banquet.tables_reserved >= v_banquet.table_capacity AND NOT p_join_waitlist THEN
    RETURN jsonb_build_object('outcome', 'full', 'banquet_id', v_banquet.id);
  END IF;

  v_status := CASE
    WHEN v_banquet.tables_reserved < v_banquet.table_capacity THEN 'confirmed'
    ELSE 'waitlisted'
  END;

  v_confirmation_code := 'CC26-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  BEGIN
    INSERT INTO public.christmas_reservations (
      event_id,
      banquet_id,
      confirmation_code,
      contact_name,
      email,
      phone,
      guest_count,
      attends_church_regularly,
      church_name,
      dietary_notes,
      accessibility_notes,
      comments,
      status
    ) VALUES (
      v_event.id,
      v_banquet.id,
      v_confirmation_code,
      trim(p_contact_name),
      lower(trim(p_email)),
      trim(p_phone),
      p_guest_count,
      p_attends_church_regularly,
      CASE
        WHEN p_attends_church_regularly THEN nullif(trim(p_church_name), '')
        ELSE NULL
      END,
      nullif(trim(p_dietary_notes), ''),
      nullif(trim(p_accessibility_notes), ''),
      nullif(trim(p_comments), ''),
      v_status
    )
    RETURNING * INTO v_reservation;
  EXCEPTION WHEN unique_violation THEN
    SELECT * INTO v_existing
    FROM public.christmas_reservations
    WHERE event_id = v_event.id
      AND lower(email) = lower(trim(p_email))
      AND status IN ('confirmed', 'waitlisted')
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND OR regexp_replace(v_existing.phone, '[^0-9]', '', 'g') <>
       regexp_replace(trim(p_phone), '[^0-9]', '', 'g') THEN
      RETURN jsonb_build_object('outcome', 'duplicate');
    END IF;

    RETURN jsonb_build_object(
      'outcome', 'existing',
      'reservation_id', v_existing.id,
      'banquet_id', v_existing.banquet_id,
      'confirmation_code', v_existing.confirmation_code,
      'status', v_existing.status
    );
  END;

  IF v_status = 'confirmed' THEN
    UPDATE public.christmas_banquets
    SET tables_reserved = tables_reserved + 1
    WHERE id = v_banquet.id;
  END IF;

  RETURN jsonb_build_object(
    'outcome', v_status,
    'reservation_id', v_reservation.id,
    'banquet_id', v_reservation.banquet_id,
    'confirmation_code', v_reservation.confirmation_code,
    'status', v_reservation.status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_christmas_table(
  text, uuid, text, text, text, smallint, boolean, text, text, text, text, boolean
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_christmas_table(
  text, uuid, text, text, text, smallint, boolean, text, text, text, text, boolean
) TO service_role;

CREATE OR REPLACE FUNCTION public.cancel_christmas_reservation(p_reservation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_reservation public.christmas_reservations%ROWTYPE;
BEGIN
  IF NOT (select public.is_admin()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT * INTO v_reservation
  FROM public.christmas_reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('outcome', 'not_found');
  END IF;

  IF v_reservation.status = 'cancelled' THEN
    RETURN jsonb_build_object('outcome', 'already_cancelled');
  END IF;

  IF v_reservation.status = 'confirmed' THEN
    UPDATE public.christmas_banquets
    SET tables_reserved = greatest(tables_reserved - 1, 0)
    WHERE id = v_reservation.banquet_id;
  END IF;

  UPDATE public.christmas_reservations
  SET status = 'cancelled', updated_at = now()
  WHERE id = v_reservation.id;

  RETURN jsonb_build_object('outcome', 'cancelled');
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_christmas_reservation(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_christmas_reservation(uuid) TO authenticated, service_role;

DROP TRIGGER IF EXISTS update_christmas_reservations_updated_at
  ON public.christmas_reservations;
CREATE TRIGGER update_christmas_reservations_updated_at
  BEFORE UPDATE ON public.christmas_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.christmas_events (slug, title, event_year, location, registration_open)
VALUES (
  'christmas-2026',
  'Citychurch Family Christmas Banquets',
  2026,
  'Citychurch Downtown, 205 S. Polk St, Amarillo, TX 79101',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = excluded.title,
  event_year = excluded.event_year,
  location = excluded.location;

INSERT INTO public.christmas_banquets (
  event_id,
  event_date,
  doors_open,
  dinner_at,
  ends_at,
  display_order,
  table_capacity
)
SELECT
  event.id,
  banquet.event_date,
  time '17:30',
  time '18:00',
  time '19:30',
  banquet.display_order,
  15
FROM public.christmas_events AS event
CROSS JOIN (
  VALUES
    (date '2026-12-14', 1::smallint),
    (date '2026-12-15', 2::smallint)
) AS banquet(event_date, display_order)
WHERE event.slug = 'christmas-2026'
ON CONFLICT (event_id, event_date) DO UPDATE SET
  doors_open = excluded.doors_open,
  dinner_at = excluded.dinner_at,
  ends_at = excluded.ends_at,
  display_order = excluded.display_order,
  table_capacity = excluded.table_capacity,
  active = true;
