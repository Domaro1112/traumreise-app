-- ── affiliate_settings: Ferienpark-Anbieter (AWIN) ──────────────────────────
-- Fügt die AWIN Ferienpark-Provider in affiliate_settings ein.
-- Affiliate-IDs werden später im Admin-Panel hinterlegt.

INSERT INTO affiliate_settings (provider, affiliate_id, enabled) VALUES
  ('centerparcs', '', true),
  ('landal',      '', true),
  ('roompot',     '', true),
  ('topparken',   '', true),
  ('sunparks',    '', true),
  ('eurocamp',    '', true),
  ('novasol',     '', true)
ON CONFLICT (provider) DO NOTHING;
