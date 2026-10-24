-- Discipleship Training Kit access requests.
-- No RLS policies: only server code using the service role key reads or
-- writes this table, so anon and authenticated clients get nothing.

CREATE TABLE IF NOT EXISTS public.dtk_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE CHECK (email = lower(btrim(email))),
  note text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'denied')),
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by text
);

ALTER TABLE public.dtk_access_requests ENABLE ROW LEVEL SECURITY;
