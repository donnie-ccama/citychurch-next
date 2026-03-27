-- =============================================
-- Citychurch Unified Form Tables
-- =============================================

-- 1. Visitors (first-time visitor sign-up)
CREATE TABLE IF NOT EXISTS visitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  visit_type text NOT NULL DEFAULT 'general',
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visitors_email ON visitors (email);
CREATE INDEX IF NOT EXISTS idx_visitors_created ON visitors (created_at DESC);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON visitors FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON visitors FOR SELECT TO authenticated USING (true);

-- 2. Contact submissions
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts (created_at DESC);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON contacts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON contacts FOR SELECT TO authenticated USING (true);

-- 3. Email subscribers (supplements Mailchimp — local record)
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  first_name text,
  tag text DEFAULT 'website-signup-2026',
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers (created_at DESC);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON subscribers FOR SELECT TO authenticated USING (true);
