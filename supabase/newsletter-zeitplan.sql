-- ─────────────────────────────────────────────────────────────────────────────
-- Zeitplan für geplante Newsletter
--
-- Ruft alle 5 Minuten https://apearound.de/api/cron/newsletter auf. Dadurch
-- gehen geplante Kampagnen spätestens 5 Minuten nach ihrem Zeitpunkt raus.
--
-- VOR DEM AUSFÜHREN:
--   1. In Vercel die Umgebungsvariable CRON_SECRET anlegen (langer Zufallswert).
--   2. Unten DEIN_CRON_SECRET durch genau diesen Wert ersetzen.
--   3. In Supabase unter Database → Extensions „pg_cron“ und „pg_net“ aktivieren.
-- Dann dieses Skript im SQL-Editor ausführen. Erneutes Ausführen ersetzt den Job.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pg_cron;
create extension if not exists pg_net;

do $$ begin
  perform cron.unschedule('apearound-newsletter');
exception when others then null; end $$;

select cron.schedule(
  'apearound-newsletter',
  '*/5 * * * *',
  $$
  select net.http_post(
    url     := 'https://apearound.de/api/cron/newsletter',
    headers := jsonb_build_object('Authorization', 'Bearer NHjyiNBASCN36ehJIJg<ztdfk*+9084hHGctawgvd-oeru8Gteg??'),
    body    := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);

-- Kontrolle: letzte Läufe ansehen
-- select * from cron.job_run_details order by start_time desc limit 10;
