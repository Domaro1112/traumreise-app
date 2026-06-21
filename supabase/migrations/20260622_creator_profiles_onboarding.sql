-- Creator-Profile Onboarding-Token Erweiterung
-- Fügt sichere Token-Spalten für den Creator-Onboarding-Link hinzu.

ALTER TABLE public.creator_profiles
  ADD COLUMN IF NOT EXISTS onboarding_token             text UNIQUE,
  ADD COLUMN IF NOT EXISTS onboarding_token_expires_at  timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at      timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_at                 timestamptz,
  ADD COLUMN IF NOT EXISTS last_creator_edit_at         timestamptz;

-- Index für schnellen Token-Lookup
CREATE INDEX IF NOT EXISTS idx_creator_profiles_onboarding_token
  ON public.creator_profiles (onboarding_token)
  WHERE onboarding_token IS NOT NULL;
