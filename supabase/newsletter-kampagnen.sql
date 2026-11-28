-- ─────────────────────────────────────────────────────────────────────────────
-- Newsletter-Kampagnen: Entwürfe, geplanter Versand, Versandprotokoll,
-- Willkommensmail.
--
-- Einmal im Supabase SQL-Editor ausführen. Das Skript kann gefahrlos mehrfach
-- laufen (legt nur an, was noch fehlt).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Kampagnen ─────────────────────────────────────────────────────────────
create table if not exists public.newsletter_campaigns (
  id            uuid primary key default gen_random_uuid(),
  -- 'campaign' = normaler Newsletter, 'welcome' = Willkommensmail (genau eine)
  kind          text not null default 'campaign',
  title         text not null default '',          -- interner Name
  subject       text not null default '',
  preheader     text not null default '',          -- Vorschauzeile im Postfach
  blocks        jsonb not null default '[]'::jsonb, -- Bausteine des Inhalts
  -- draft | scheduled | sending | sent | failed  (Willkommensmail: active | inactive)
  status        text not null default 'draft',
  scheduled_at  timestamptz,
  started_at    timestamptz,
  sent_at       timestamptz,
  -- beim Versandstart eingefrorenes HTML, damit alle Empfänger dieselbe Mail bekommen
  html_snapshot text,
  locked_until  timestamptz,
  last_error    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

do $$ begin
  alter table public.newsletter_campaigns
    add constraint newsletter_campaigns_kind_check check (kind in ('campaign', 'welcome'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.newsletter_campaigns
    add constraint newsletter_campaigns_status_check
    check (status in ('draft', 'scheduled', 'sending', 'sent', 'failed', 'active', 'inactive'));
exception when duplicate_object then null; end $$;

-- Höchstens eine Willkommensmail
create unique index if not exists newsletter_campaigns_one_welcome
  on public.newsletter_campaigns (kind) where kind = 'welcome';

create index if not exists newsletter_campaigns_due_idx
  on public.newsletter_campaigns (status, scheduled_at);

-- ── 2. Versandprotokoll (eine Zeile je Kampagne und Empfänger) ───────────────
create table if not exists public.newsletter_sends (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.newsletter_campaigns(id) on delete cascade,
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  status        text not null default 'queued',   -- queued | sent | failed
  resend_id     text,
  error         text,
  created_at    timestamptz not null default now(),
  sent_at       timestamptz,
  unique (campaign_id, subscriber_id)
);

create index if not exists newsletter_sends_campaign_idx
  on public.newsletter_sends (campaign_id, status);

-- ── 3. Abonnenten: Willkommensmail-Zeitpunkt ─────────────────────────────────
alter table public.newsletter_subscribers
  add column if not exists welcome_sent_at timestamptz;

-- ── 4. Nächste Empfänger einer Kampagne (bestätigt, noch nicht im Protokoll) ─
create or replace function public.newsletter_next_recipients(p_campaign uuid, p_limit int)
returns table (id uuid, email text)
language sql stable security definer set search_path = public as $$
  select s.id, s.email
  from public.newsletter_subscribers s
  where s.status = 'confirmed'
    and not exists (
      select 1 from public.newsletter_sends ns
      where ns.campaign_id = p_campaign and ns.subscriber_id = s.id
    )
  order by s.confirmed_at nulls last, s.id
  limit greatest(1, least(p_limit, 500));
$$;

-- Sperre für einen Versandlauf: verhindert, dass zwei Läufe dieselbe Kampagne
-- gleichzeitig bearbeiten. Gibt true zurück, wenn die Sperre geholt wurde.
create or replace function public.newsletter_claim(p_campaign uuid, p_seconds int)
returns boolean
language sql volatile security definer set search_path = public as $$
  with u as (
    update public.newsletter_campaigns
       set locked_until = now() + make_interval(secs => p_seconds)
     where id = p_campaign
       and (locked_until is null or locked_until < now())
    returning 1
  )
  select exists (select 1 from u);
$$;

-- ── 5. Zugriff: nur über den Server (service_role) ───────────────────────────
alter table public.newsletter_campaigns enable row level security;
alter table public.newsletter_sends     enable row level security;

revoke all on public.newsletter_campaigns from anon, authenticated;
revoke all on public.newsletter_sends     from anon, authenticated;
grant all on public.newsletter_campaigns to service_role;
grant all on public.newsletter_sends     to service_role;

revoke all on function public.newsletter_next_recipients(uuid, int) from public, anon, authenticated;
grant execute on function public.newsletter_next_recipients(uuid, int) to service_role;
revoke all on function public.newsletter_claim(uuid, int) from public, anon, authenticated;
grant execute on function public.newsletter_claim(uuid, int) to service_role;

-- ── 6. Willkommensmail anlegen (inaktiv, bis du sie im Admin einschaltest) ───
insert into public.newsletter_campaigns (kind, title, subject, preheader, status, blocks)
select 'welcome', 'Willkommensmail', 'Willkommen bei ApeAround 🐒',
       'Schön, dass du dabei bist – hier geht''s los.', 'inactive',
       jsonb_build_array(
         jsonb_build_object('type', 'text', 'heading', 'Schön, dass du dabei bist!',
           'body', 'Ab jetzt bekommst du von uns Reiseideen, ehrliche Tipps und die schönsten Ziele für jede Jahreszeit – ohne Spam, versprochen.'),
         jsonb_build_object('type', 'button', 'label', 'Reisefinder starten', 'url', '/finder'),
         jsonb_build_object('type', 'articles', 'heading', 'Zum Einstieg', 'slugs', jsonb_build_array())
       )
where not exists (select 1 from public.newsletter_campaigns where kind = 'welcome');
