-- site_settings: globale Site-Konfiguration, verwaltet über das Admin-Panel.
-- Single-row-Tabelle: immer id = 'default'.
-- Nur service_role darf lesen/schreiben (Admin-API nutzt Service-Role-Client).

CREATE TABLE IF NOT EXISTS site_settings (
  id                              text        PRIMARY KEY DEFAULT 'default',
  site_name                       text        NOT NULL DEFAULT 'ApeAround',
  site_url                        text        NOT NULL DEFAULT 'https://apearound.de',
  site_description                text,
  default_seo_title               text,
  default_seo_description         text,
  contact_email                   text,
  support_email                   text,
  maintenance_mode                boolean     NOT NULL DEFAULT false,
  maintenance_message             text,
  admin_notification_email        text,
  notify_on_contact_inquiry       boolean     NOT NULL DEFAULT false,
  notify_on_partner_inquiry       boolean     NOT NULL DEFAULT false,
  notify_on_creator_application   boolean     NOT NULL DEFAULT false,
  notify_on_newsletter_signup     boolean     NOT NULL DEFAULT false,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

-- Default-Zeile einfügen, falls noch nicht vorhanden
INSERT INTO site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- updated_at Trigger (shared function – safe to re-create)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- RLS: kein Zugriff für anon/authenticated – nur service_role via Admin-API
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON site_settings FROM anon;
REVOKE ALL ON site_settings FROM authenticated;
GRANT  ALL ON site_settings TO service_role;
