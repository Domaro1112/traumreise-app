-- ── affiliate_settings: zentrale Affiliate-IDs pro Anbieter ─────────────────
-- Läuft einmalig im Supabase SQL-Editor.

CREATE TABLE IF NOT EXISTS affiliate_settings (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider      text        NOT NULL UNIQUE,
  affiliate_id  text        NOT NULL DEFAULT '',
  enabled       boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Seed: alle unterstützten Anbieter (IDs leer – im Admin-Panel befüllen)
INSERT INTO affiliate_settings (provider, affiliate_id, enabled) VALUES
  ('booking',       '', true),
  ('getyourguide',  '', true),
  ('check24',       '', true),
  ('holidaycheck',  '', true),
  ('amazon',        '', true),
  ('expedia',       '', true)
ON CONFLICT (provider) DO NOTHING;

-- RLS: nur service_role darf lesen/schreiben
ALTER TABLE affiliate_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "affiliate_settings_service_role_all"
  ON affiliate_settings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Kein Zugriff für anon/authenticated
REVOKE ALL ON affiliate_settings FROM anon;
REVOKE ALL ON affiliate_settings FROM authenticated;
GRANT  ALL ON affiliate_settings TO service_role;

-- Updated-At Trigger
CREATE OR REPLACE FUNCTION set_affiliate_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_affiliate_settings_updated_at ON affiliate_settings;
CREATE TRIGGER trg_affiliate_settings_updated_at
  BEFORE UPDATE ON affiliate_settings
  FOR EACH ROW EXECUTE FUNCTION set_affiliate_updated_at();
