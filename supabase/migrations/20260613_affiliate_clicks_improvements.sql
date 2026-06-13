-- ── affiliate_clicks: Fixes & Performance-Verbesserungen ────────────────────
-- Läuft einmalig im Supabase SQL-Editor.
--
-- PROBLEM 1: destination_name war NOT NULL, aber /go/[provider] kennt keinen
--            Destination-Kontext → alle Redirect-Tracking-Inserts schlugen still fehl.
-- PROBLEM 2: Keine Indizes → Vollscans bei Stats-Queries über created_at.
-- PROBLEM 3: user_agent + country fehlten als Spalten.

-- 1. destination_name auf nullable setzen
--    (Funnel-Clicks liefern weiterhin destination_name; Redirect-Clicks haben null)
ALTER TABLE affiliate_clicks
  ALTER COLUMN destination_name DROP NOT NULL;

-- 2. Fehlende Tracking-Spalten ergänzen
ALTER TABLE affiliate_clicks
  ADD COLUMN IF NOT EXISTS user_agent text,
  ADD COLUMN IF NOT EXISTS country    text;

-- 3. Performance-Indizes für Stats-Queries und Aggregationen
CREATE INDEX IF NOT EXISTS idx_aff_clicks_provider
  ON affiliate_clicks (provider);

CREATE INDEX IF NOT EXISTS idx_aff_clicks_created_at
  ON affiliate_clicks (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_aff_clicks_provider_created_at
  ON affiliate_clicks (provider, created_at DESC);

-- Sicherheitscheck: RLS und GRANTs unverändert korrekt (aus 20260610_travel_funnel.sql).
-- Service_role: Vollzugriff via Policy.
-- anon: kein Zugriff (REVOKE gesetzt).
-- authenticated: GRANT INSERT vorhanden, aber ohne RLS-Policy effektiv blockiert.
-- Keine Änderungen an Policies nötig.
