-- Proof of Life submissions table
CREATE TABLE IF NOT EXISTS proof_of_life (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  description TEXT CHECK (char_length(description) <= 300),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_proof_of_life_status ON proof_of_life(status);
CREATE INDEX IF NOT EXISTS idx_proof_of_life_created_at ON proof_of_life(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proof_of_life_token ON proof_of_life(approval_token);

-- RLS
ALTER TABLE proof_of_life ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved submissions
CREATE POLICY "Public can view approved submissions"
  ON proof_of_life FOR SELECT
  USING (status = 'approved');

-- Anyone can submit (insert) — they only set photo_url and description
CREATE POLICY "Anyone can submit photos"
  ON proof_of_life FOR INSERT
  WITH CHECK (true);

-- Only service role can update (approve/reject) — handled by service role key which bypasses RLS
