-- Newsletter Subscribers: upgrade to full Double-Opt-In schema
-- Existing table from 20240606... had: id, email, confirmed, source, created_at, updated_at
-- This migration adds all DOI fields without breaking existing rows.

-- Add new columns (safe: IF NOT EXISTS equivalent via ALTER ADD IF NOT EXISTS not universal — use DO block)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='status') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='consent_text') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN consent_text text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='consent_given_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN consent_given_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='confirmed_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN confirmed_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='confirmation_token_hash') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN confirmation_token_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='confirmation_sent_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN confirmation_sent_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='unsubscribed_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN unsubscribed_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='unsubscribe_token_hash') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN unsubscribe_token_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='ip_hash') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN ip_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='user_agent') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN user_agent text;
  END IF;
END $$;

-- Migrate existing confirmed=true rows to status='confirmed'
UPDATE public.newsletter_subscribers SET status = 'confirmed' WHERE confirmed = true AND status = 'pending';

-- CHECK constraint for status values (add if missing)
DO $$ BEGIN
  ALTER TABLE public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_status_check
    CHECK (status IN ('pending', 'confirmed', 'unsubscribed'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS: reset and apply correct policies
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Remove overly broad authenticated SELECT policy from original migration
DROP POLICY IF EXISTS "Users can view own subscription" ON public.newsletter_subscribers;

-- service_role bypasses RLS — no explicit policy needed; GRANT is sufficient
-- authenticated admins can manage (via service_role in API routes — already covered)
-- anon: no read, no write via RLS (all writes go through API → service_role)
REVOKE ALL ON public.newsletter_subscribers FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

-- Index on confirmation_token_hash for O(1) confirm lookup
CREATE INDEX IF NOT EXISTS newsletter_subscribers_confirm_token_idx
  ON public.newsletter_subscribers (confirmation_token_hash)
  WHERE confirmation_token_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS newsletter_subscribers_unsubscribe_token_idx
  ON public.newsletter_subscribers (unsubscribe_token_hash)
  WHERE unsubscribe_token_hash IS NOT NULL;
