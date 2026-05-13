-- Sermons: add fields needed for the public detail page (transcript, PDF, thumbnails)
-- and tighten RLS so unpublished drafts stay private.

ALTER TABLE sermons
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS vimeo_id TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS transcript_markdown TEXT,
  ADD COLUMN IF NOT EXISTS scripture_reference TEXT,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sermons_slug ON sermons(slug);
CREATE INDEX IF NOT EXISTS idx_sermons_published ON sermons(published);

DROP POLICY IF EXISTS "Public can view all sermons" ON sermons;
DROP POLICY IF EXISTS "Public can view published sermons" ON sermons;

CREATE POLICY "Public can view published sermons"
  ON sermons
  FOR SELECT
  USING (published = TRUE);
