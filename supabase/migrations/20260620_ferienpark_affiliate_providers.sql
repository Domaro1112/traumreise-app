-- ── Ferienpark & Familienurlaub AWIN-Anbieter ────────────────────────────────
-- Fügt 7 neue Affiliate-Provider in affiliate_settings ein.
-- Erweitert affiliate_clicks um category und network Spalten.
-- Idempotent: ON CONFLICT DO NOTHING + ADD COLUMN IF NOT EXISTS.
--
-- Provider:
--   centerparcs  (AWIN Merchant ID: 13639) — Ferienparks & Familienurlaub
--   landal       (AWIN Merchant ID: 9118)  — Ferienparks & Familienurlaub
--   roompot      (AWIN Merchant ID: 84299) — Ferienparks & Familienurlaub
--   topparken    (AWIN Merchant ID: 117131)— Ferienparks & Familienurlaub
--   sunparks     (AWIN Merchant ID: 14749) — Ferienparks & Familienurlaub
--   eurocamp     (AWIN Merchant ID: 14888) — Camping & Mobilheime
--   novasol      (AWIN Merchant ID: 118655)— Ferienhäuser

-- 1. Neue Provider in affiliate_settings eintragen (IDs im Admin-Panel befüllen)
INSERT INTO affiliate_settings (provider, affiliate_id, enabled) VALUES
  ('centerparcs', '', false),
  ('landal',      '', false),
  ('roompot',     '', false),
  ('topparken',   '', false),
  ('sunparks',    '', false),
  ('eurocamp',    '', false),
  ('novasol',     '', false)
ON CONFLICT (provider) DO NOTHING;

-- 2. affiliate_clicks um category und network erweitern
ALTER TABLE affiliate_clicks
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS network  text;

-- Index auf category für Aggregationsqueries
CREATE INDEX IF NOT EXISTS idx_aff_clicks_category
  ON affiliate_clicks (category);

-- RLS und GRANTs: unverändert aus 20260613_affiliate_settings.sql.
-- affiliate_settings: service_role only (anon/authenticated REVOKE gesetzt).
-- affiliate_clicks:   service_role full, authenticated INSERT.
-- Keine Änderungen nötig.
