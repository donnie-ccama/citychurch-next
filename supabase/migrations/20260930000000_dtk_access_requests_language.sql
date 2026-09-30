-- Language each kit access request was made in. Existing rows are English.
ALTER TABLE public.dtk_access_requests
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en'
  CHECK (language IN ('en', 'es'));
