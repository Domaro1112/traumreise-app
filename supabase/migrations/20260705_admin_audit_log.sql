-- admin_audit_log: Protokolliert Admin-Aktionen für Nachvollziehbarkeit.
-- Keine personenbezogenen Daten außer Admin-E-Mail und Aktions-Metadaten.
-- Nur service_role darf schreiben/lesen (über Admin-API).

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email   text        NOT NULL,
  action        text        NOT NULL,
  entity_type   text,
  entity_id     text,
  metadata      jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Index für effiziente Abfrage der neuesten Einträge
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx
  ON admin_audit_log (created_at DESC);

-- RLS
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON admin_audit_log FROM anon;
REVOKE ALL ON admin_audit_log FROM authenticated;
GRANT  ALL ON admin_audit_log TO service_role;
