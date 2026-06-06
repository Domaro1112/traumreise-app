-- Newsletter Subscribers Table
-- Stores email addresses for the Traumreise newsletter

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  confirmed   BOOLEAN NOT NULL DEFAULT false,
  source      TEXT NOT NULL DEFAULT 'landing_page',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email
  ON newsletter_subscribers (email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE ON newsletter_subscribers TO authenticated;
GRANT ALL ON newsletter_subscribers TO service_role;

-- RLS Policies

-- authenticated users may only see their own row (by email match via JWT claim)
CREATE POLICY "Users can view own subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));

-- No anon reads
-- (anon role gets no grants by default — this enforces it explicitly)
REVOKE ALL ON newsletter_subscribers FROM anon;

-- service_role bypasses RLS and handles all writes from server actions
-- No INSERT policy for authenticated/anon; only service_role may insert (server-side only)
