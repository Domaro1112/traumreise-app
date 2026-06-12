-- ─────────────────────────────────────────────────────────────────────────────
-- destinations: CMS-managed destination pages (SEO / AEO / LLMO)
-- ─────────────────────────────────────────────────────────────────────────────

-- Create table
create table if not exists public.destinations (

  -- Identity
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  updated_at  timestamptz not null    default now(),

  -- Status: draft | published | archived
  status      text        not null    default 'draft'
              check (status in ('draft', 'published', 'archived')),

  -- ── Base data ──────────────────────────────────────────────────────────────
  name        text        not null,
  slug        text        not null unique,
  country     text,
  region      text,
  continent   text,
  hero_image  text,
  gallery_images  jsonb   not null default '[]'::jsonb,

  -- ── Content ────────────────────────────────────────────────────────────────
  short_description   text,
  long_description    text,
  ai_summary          text,
  quick_facts         jsonb   not null default '{}'::jsonb,
  best_travel_time    text,
  ideal_duration      text,
  travel_type         text[],
  suitable_for        text[],
  not_suitable_for    text[],
  highlights          jsonb   not null default '[]'::jsonb,
  insider_tips        jsonb   not null default '[]'::jsonb,
  faq                 jsonb   not null default '[]'::jsonb,

  -- ── Affiliate / Travel planning ────────────────────────────────────────────
  car_rental_recommended  boolean not null default false,
  car_rental_reason       text,
  affiliate_search_intent text,

  -- ── SEO / AEO / LLMO ──────────────────────────────────────────────────────
  seo_title         text,
  seo_description   text,
  canonical_url     text,
  open_graph_image  text,
  llmo_entities     text[],
  llmo_answer_block text,
  llmo_quick_answer text,
  internal_links    jsonb   not null default '[]'::jsonb,

  -- ── Publication tracking ───────────────────────────────────────────────────
  published_at  timestamptz,
  created_by    uuid,   -- FK to auth.users when Supabase Auth is wired up
  updated_by    uuid    -- FK to auth.users when Supabase Auth is wired up
);

-- ── Indexes ────────────────────────────────────────────────────────────────────
create index if not exists destinations_slug_idx    on public.destinations (slug);
create index if not exists destinations_status_idx  on public.destinations (status);

-- ── updated_at trigger ─────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists destinations_set_updated_at on public.destinations;
create trigger destinations_set_updated_at
  before update on public.destinations
  for each row execute function public.set_updated_at();

-- ── Row Level Security ─────────────────────────────────────────────────────────
alter table public.destinations enable row level security;

-- anon: read only published
create policy "anon_read_published"
  on public.destinations
  for select
  to anon
  using (status = 'published');

-- authenticated: read all (admin UI uses service_role for writes)
create policy "authenticated_read_all"
  on public.destinations
  for select
  to authenticated
  using (true);

-- No INSERT / UPDATE / DELETE policies for anon or authenticated.
-- All writes go through service_role (server-side only, bypasses RLS).

-- ── Explicit GRANTS ────────────────────────────────────────────────────────────
grant select            on public.destinations to anon;
grant select            on public.destinations to authenticated;
grant all privileges    on public.destinations to service_role;
