-- ═══════════════════════════════════════════════════════════════════════════
-- ApeAround – automatische Löschfristen (Datenschutzerklärung Abschnitte 7, 8,
-- 11 und 15). Einmal im Supabase SQL-Editor ausführen.
--
-- Legt die Funktion public.apply_retention() an und plant sie über pg_cron
-- täglich um 03:15 Uhr (UTC) ein. Mehrfaches Ausführen dieses Skripts ist
-- unbedenklich – der Job wird dann einfach neu angelegt.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Erweiterung für zeitgesteuerte Jobs aktivieren
create extension if not exists pg_cron with schema pg_catalog;

-- 2. Löschfunktion
create or replace function public.apply_retention()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  n_sessions     int;
  n_leads        int;
  n_contact      int;
  n_partner      int;
  n_clicks       int;
  n_views        int;
  n_nl_pending   int;
  n_nl_unsub     int;
  n_creator_apps int;
  n_audit        int;
begin
  -- Reisefinder-Ergebnisse inkl. Freitext und E-Mail: 12 Monate
  delete from travel_funnel_sessions where created_at < now() - interval '12 months';
  get diagnostics n_sessions = row_count;

  delete from travel_leads where created_at < now() - interval '12 months';
  get diagnostics n_leads = row_count;

  -- Kontakt- und Partneranfragen: spätestens 12 Monate
  delete from contact_inquiries where created_at < now() - interval '12 months';
  get diagnostics n_contact = row_count;

  delete from partner_inquiries where created_at < now() - interval '12 months';
  get diagnostics n_partner = row_count;

  -- Klick- und Aufrufstatistiken: 24 Monate
  delete from affiliate_clicks where created_at < now() - interval '24 months';
  get diagnostics n_clicks = row_count;

  delete from blog_article_views where viewed_at < now() - interval '24 months';
  get diagnostics n_views = row_count;

  -- Newsletter: unbestätigte Anmeldungen nach 30 Tagen,
  -- Einwilligungsnachweis abgemeldeter Adressen nach 3 Jahren
  delete from newsletter_subscribers
   where status = 'pending' and created_at < now() - interval '30 days';
  get diagnostics n_nl_pending = row_count;

  delete from newsletter_subscribers
   where status = 'unsubscribed'
     and coalesce(unsubscribed_at, created_at) < now() - interval '3 years';
  get diagnostics n_nl_unsub = row_count;

  -- Abgelehnte Creator-Bewerbungen: 6 Monate nach der Entscheidung
  delete from creator_applications
   where status = 'rejected'
     and coalesce(updated_at, created_at) < now() - interval '6 months';
  get diagnostics n_creator_apps = row_count;

  -- Internes Admin-Protokoll: 24 Monate
  delete from admin_audit_log where created_at < now() - interval '24 months';
  get diagnostics n_audit = row_count;

  return jsonb_build_object(
    'ausgefuehrt_am',            now(),
    'reisefinder_ergebnisse',    n_sessions,
    'reisefinder_leads',         n_leads,
    'kontaktanfragen',           n_contact,
    'partneranfragen',           n_partner,
    'affiliate_klicks',          n_clicks,
    'blog_aufrufe',              n_views,
    'newsletter_unbestaetigt',   n_nl_pending,
    'newsletter_abgemeldet',     n_nl_unsub,
    'creator_bewerbungen',       n_creator_apps,
    'admin_protokoll',           n_audit
  );
end;
$$;

-- Nur für den Datenbank-Eigentümer und den Server ausführbar, nicht für Besucher
revoke all on function public.apply_retention() from public, anon, authenticated;

-- 3. Täglichen Job einplanen (alten Job gleichen Namens vorher entfernen)
select cron.unschedule(jobid) from cron.job where jobname = 'apearound-loeschfristen';
select cron.schedule('apearound-loeschfristen', '15 3 * * *', $$select public.apply_retention()$$);

-- 4. Einmal sofort ausführen und Ergebnis anzeigen
select public.apply_retention() as ergebnis;
