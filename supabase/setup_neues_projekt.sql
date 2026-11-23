-- ═══════════════════════════════════════════════════════════════════════
-- ApeAround – komplettes Datenbank-Setup für ein NEUES Supabase-Projekt
-- Erzeugt aus supabase/migrations (Reihenfolge korrigiert, ohne
-- 20260613_clear_blog_articles.sql). Einmal im SQL-Editor ausführen.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────── 20240606000000_create_newsletter_subscribers.sql ─────────────────────────────
-- Newsletter Subscribers Table
-- Stores email addresses for the Traumreise newsletter

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  confirmed   BOOLEAN NOT NULL DEFAULT false,
  source      TEXT NOT NULL DEFAULT 'landing_page',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email
  ON newsletter_subscribers (email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE ON newsletter_subscribers TO authenticated;
GRANT ALL ON newsletter_subscribers TO service_role;

-- RLS Policies

-- authenticated users may only see their own row (by email match via JWT claim)
CREATE POLICY "Users can view own subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));

-- No anon reads
-- (anon role gets no grants by default — this enforces it explicitly)
REVOKE ALL ON newsletter_subscribers FROM anon;

-- service_role bypasses RLS and handles all writes from server actions
-- No INSERT policy for authenticated/anon; only service_role may insert (server-side only)

-- ───────────────────────────── 20250613_blog_articles.sql ─────────────────────────────
-- Blog Articles table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS blog_articles (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT        UNIQUE NOT NULL,
  title                TEXT        NOT NULL,
  excerpt              TEXT,
  category             TEXT,
  destination          TEXT,
  country              TEXT,
  -- media
  cover_image_url      TEXT,
  hero_image_url       TEXT,
  -- meta
  date                 DATE,
  last_updated         DATE,
  reading_time         TEXT,
  author               TEXT,
  author_bio           TEXT,
  tags                 TEXT[]      DEFAULT '{}',
  featured             BOOLEAN     DEFAULT FALSE,
  -- status workflow: draft → published → archived
  status               TEXT        DEFAULT 'draft'
                                   CHECK (status IN ('draft', 'published', 'archived')),
  published_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  -- content (JSONB)
  table_of_contents    JSONB       DEFAULT '[]',
  content_sections     JSONB       DEFAULT '[]',
  faq                  JSONB       DEFAULT '[]',
  key_takeaways        JSONB       DEFAULT '[]',
  related_articles     TEXT[]      DEFAULT '{}',
  internal_links       JSONB       DEFAULT '[]',
  -- SEO
  seo_title            TEXT,
  seo_description      TEXT,
  canonical_url        TEXT,
  open_graph_title     TEXT,
  open_graph_description TEXT,
  open_graph_image     TEXT,
  -- misc
  sort_order           INTEGER     DEFAULT 0
);

-- Index for public queries
CREATE INDEX IF NOT EXISTS blog_articles_status_published_at
  ON blog_articles (status, published_at DESC);

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Anon/public can read published articles
CREATE POLICY "Public can read published blog articles"
  ON blog_articles
  FOR SELECT
  USING (status = 'published');

-- service_role bypasses RLS by default — no write policy needed for admin API
-- (all admin mutations go through the service_role key in createServerClient())

-- ── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_blog_articles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW EXECUTE FUNCTION update_blog_articles_updated_at();

-- ───────────────────────────── 20260610_travel_funnel.sql ─────────────────────────────
-- ================================================================
--ApeAround Travel Funnel – Supabase Migration
-- ================================================================

-- 1. travel_funnel_sessions
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.travel_funnel_sessions (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at             timestamptz NOT NULL DEFAULT now(),
  mood_selection         text[]      NOT NULL DEFAULT '{}',
  season                 text,
  budget                 text,
  generated_destinations jsonb,
  user_agent             text,
  referrer               text
);

ALTER TABLE public.travel_funnel_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_sessions"
  ON public.travel_funnel_sessions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.travel_funnel_sessions TO authenticated;
GRANT ALL                     ON public.travel_funnel_sessions TO service_role;
REVOKE ALL                    ON public.travel_funnel_sessions FROM anon;


-- 2. travel_leads
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.travel_leads (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  email                 text        NOT NULL,
  consent               boolean     NOT NULL DEFAULT false,
  consent_text          text,
  session_id            uuid        REFERENCES public.travel_funnel_sessions(id) ON DELETE SET NULL,
  selected_destinations jsonb,
  mood_selection        text[],
  season                text,
  budget                text,
  source                text        NOT NULL DEFAULT 'reisemonkey_funnel'
);

ALTER TABLE public.travel_leads ENABLE ROW LEVEL SECURITY;

-- Leads: service_role only – no anon, no authenticated read
CREATE POLICY "service_role_all_leads"
  ON public.travel_leads FOR ALL TO service_role
  USING (true) WITH CHECK (true);

GRANT INSERT ON public.travel_leads TO authenticated;
GRANT ALL    ON public.travel_leads TO service_role;
REVOKE ALL   ON public.travel_leads FROM anon;


-- 3. destination_season_windows
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.destination_season_windows (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_name       text NOT NULL,
  country                text NOT NULL,
  best_months            text[] DEFAULT '{}',
  shoulder_season_months text[] DEFAULT '{}',
  low_season_months      text[] DEFAULT '{}',
  notes                  text
);

ALTER TABLE public.destination_season_windows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_season_windows"
  ON public.destination_season_windows FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_read_season_windows"
  ON public.destination_season_windows FOR SELECT TO authenticated
  USING (true);

GRANT SELECT ON public.destination_season_windows TO authenticated;
GRANT ALL    ON public.destination_season_windows TO service_role;
REVOKE ALL   ON public.destination_season_windows FROM anon;


-- 4. affiliate_clicks
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz NOT NULL DEFAULT now(),
  session_id       uuid        REFERENCES public.travel_funnel_sessions(id) ON DELETE SET NULL,
  lead_id          uuid        REFERENCES public.travel_leads(id) ON DELETE SET NULL,
  destination_name text        NOT NULL,
  provider         text        NOT NULL,
  affiliate_url    text        NOT NULL,
  referrer         text
);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_affiliate_clicks"
  ON public.affiliate_clicks FOR ALL TO service_role
  USING (true) WITH CHECK (true);

GRANT INSERT ON public.affiliate_clicks TO authenticated;
GRANT ALL    ON public.affiliate_clicks TO service_role;
REVOKE ALL   ON public.affiliate_clicks FROM anon;

-- ───────────────────────────── 20260610_add_duration_to_travel_funnel.sql ─────────────────────────────
-- Add duration column to travel_funnel_sessions
ALTER TABLE travel_funnel_sessions
  ADD COLUMN IF NOT EXISTS duration text;

-- Add duration column to travel_leads
ALTER TABLE travel_leads
  ADD COLUMN IF NOT EXISTS duration text;

-- ───────────────────────────── 20260611_add_destination_context_to_affiliate_clicks.sql ─────────────────────────────
-- Add destination context columns to affiliate_clicks.
-- These allow tracking which country/region was clicked and what search query was used.

ALTER TABLE affiliate_clicks
  ADD COLUMN IF NOT EXISTS destination_country text,
  ADD COLUMN IF NOT EXISTS destination_region  text,
  ADD COLUMN IF NOT EXISTS search_query        text;

-- ───────────────────────────── 20260611_add_personal_note_to_travel_funnel.sql ─────────────────────────────
-- Add optional personal_note field to funnel sessions and leads.
-- The field stores the user's free-text travel preferences from the funnel.

ALTER TABLE travel_funnel_sessions
  ADD COLUMN IF NOT EXISTS personal_note text;

ALTER TABLE travel_leads
  ADD COLUMN IF NOT EXISTS personal_note text;

-- ───────────────────────────── 20260612_create_destinations_cms.sql ─────────────────────────────
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

-- ───────────────────────────── 20260612_add_image_alt_texts.sql ─────────────────────────────
-- Add image_alt_texts column to destinations for SEO alt text storage.
-- Format: { "hero": "...", "og": "...", "twitter": "...", "gallery_0": "...", ... }

alter table public.destinations
  add column if not exists image_alt_texts jsonb not null default '{}'::jsonb;

-- ───────────────────────────── 20260612_add_similar_destinations_to_destinations.sql ─────────────────────────────
-- Add similar_destinations column for SEO internal linking and LLMO context.
-- Stored as a jsonb array of destination slugs, e.g. ["bali", "koh-samui"].

ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS similar_destinations jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ───────────────────────────── 20260612_add_social_meta_to_destinations.sql ─────────────────────────────
-- Add social meta columns (Open Graph + Twitter/X) to destinations
-- These can be auto-generated from seo_title / seo_description when empty.

alter table public.destinations
  add column if not exists open_graph_title        text,
  add column if not exists open_graph_description  text,
  add column if not exists twitter_image           text,
  add column if not exists twitter_title           text,
  add column if not exists twitter_description     text;

-- ───────────────────────────── 20260613_affiliate_clicks_improvements.sql ─────────────────────────────
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

-- ───────────────────────────── 20260613_affiliate_settings.sql ─────────────────────────────
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

-- ───────────────────────────── 20260613_blog_feedback.sql ─────────────────────────────
-- Blog Feedback: helpful/not-helpful vote counts per article
-- Run in Supabase SQL Editor → Dashboard → SQL Editor → New Query

-- 1. Add vote count columns
ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS helpful_count     integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS not_helpful_count integer NOT NULL DEFAULT 0;

-- 2. Atomic increment function (server-side only via service_role)
--    Validates vote type explicitly to prevent SQL injection.
--    Only increments when article is published (no phantom votes on drafts).
CREATE OR REPLACE FUNCTION increment_blog_feedback(p_slug text, p_vote text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_vote = 'helpful' THEN
    UPDATE blog_articles
    SET helpful_count = helpful_count + 1
    WHERE slug = p_slug AND status = 'published';
  ELSIF p_vote = 'not_helpful' THEN
    UPDATE blog_articles
    SET not_helpful_count = not_helpful_count + 1
    WHERE slug = p_slug AND status = 'published';
  END IF;
END;
$$;

-- ───────────────────────────── 20260613_blog_gallery_images.sql ─────────────────────────────
-- Add gallery_images column to blog_articles
-- Run in Supabase Dashboard → SQL Editor → New Query
--
-- Gallery item shape (per element in the JSONB array):
--   { url, fileName, alt, title, caption, order }
--
-- RLS is not changed: service_role bypasses it for admin writes;
-- anon can SELECT published articles (which may include galleryImages).

ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';

-- ───────────────────────────── 20260614_blog_article_views.sql ─────────────────────────────
-- ─────────────────────────────────────────────────────────────────────────────
-- Blog article view tracking
-- Stores each public page view (no IP address, DSGVO-sparsam).
-- Admin previews are NOT counted (controlled by the API route).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_article_views (
  id          bigint      generated always as identity primary key,
  article_id  uuid        not null references blog_articles(id) on delete cascade,
  slug        text        not null,
  viewed_at   timestamptz not null default now(),
  referrer    text,                                -- hostname only, no path
  created_at  timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS blog_article_views_article_id_idx
  ON blog_article_views (article_id);

CREATE INDEX IF NOT EXISTS blog_article_views_viewed_at_idx
  ON blog_article_views (viewed_at DESC);

-- Row-level security
ALTER TABLE blog_article_views ENABLE ROW LEVEL SECURITY;

-- Anyone (anon / service_role) can insert – the API route enforces business logic
CREATE POLICY "public_can_insert_views"
  ON blog_article_views FOR INSERT
  WITH CHECK (true);

-- Anyone can read – needed for the admin dashboard aggregation
CREATE POLICY "public_can_read_views"
  ON blog_article_views FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Aggregation function – returns one row per article with total + 30-day count.
-- Called from the admin list to avoid N+1 queries.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_blog_view_counts()
RETURNS TABLE (
  article_id  uuid,
  total_views bigint,
  views_30d   bigint
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    article_id,
    COUNT(*)                                                             AS total_views,
    COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '30 days')     AS views_30d
  FROM blog_article_views
  GROUP BY article_id;
$$;

-- ───────────────────────────── 20260618_contact_inquiries.sql ─────────────────────────────
-- Contact Inquiries: general contact form submissions from /kontakt
-- RLS: anon INSERT only; authenticated/admin full read+manage; service_role ALL

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  email        text        NOT NULL,
  subject      text        NOT NULL,
  inquiry_type text        NOT NULL,
  message      text        NOT NULL,
  status       text        NOT NULL DEFAULT 'new'
                           CHECK (status IN ('new', 'answered', 'closed')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger (reuses the shared function defined in earlier migrations)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_inquiries_updated_at ON public.contact_inquiries;
CREATE TRIGGER contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_inquiries_anon_insert" ON public.contact_inquiries;
CREATE POLICY "contact_inquiries_anon_insert"
  ON public.contact_inquiries FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "contact_inquiries_authenticated_select" ON public.contact_inquiries;
CREATE POLICY "contact_inquiries_authenticated_select"
  ON public.contact_inquiries FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "contact_inquiries_authenticated_update" ON public.contact_inquiries;
CREATE POLICY "contact_inquiries_authenticated_update"
  ON public.contact_inquiries FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "contact_inquiries_authenticated_delete" ON public.contact_inquiries;
CREATE POLICY "contact_inquiries_authenticated_delete"
  ON public.contact_inquiries FOR DELETE TO authenticated
  USING (true);

GRANT INSERT                            ON public.contact_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE    ON public.contact_inquiries TO authenticated;
GRANT ALL                               ON public.contact_inquiries TO service_role;

-- ───────────────────────────── 20260618_homepage_travel_suggestions.sql ─────────────────────────────
-- Table: homepage_travel_suggestions
-- Manages the travel suggestion cards shown on the homepage.
-- Each card supports three link modes: affiliate (/go/[provider]), internal (Next.js route), funnel (/#reiseplaner).

CREATE TABLE public.homepage_travel_suggestions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  country         text,
  badge           text,
  badge_tone      text        NOT NULL DEFAULT 'blue',
  description     text,
  image_url       text        NOT NULL,
  image_alt       text,
  href            text,
  sort_order      integer     NOT NULL DEFAULT 0,
  is_active       boolean     NOT NULL DEFAULT true,
  is_featured     boolean     NOT NULL DEFAULT false,

  -- Affiliate / link fields
  provider_key         text,
  affiliate_target_url text,
  search_query         text,
  link_mode            text        NOT NULL DEFAULT 'affiliate'
                       CHECK (link_mode IN ('affiliate', 'internal', 'funnel')),
  open_in_new_tab      boolean     NOT NULL DEFAULT true,

  -- Audit
  created_by  uuid,
  updated_by  uuid,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX homepage_suggestions_sort_idx      ON public.homepage_travel_suggestions (sort_order);
CREATE INDEX homepage_suggestions_active_idx    ON public.homepage_travel_suggestions (is_active);

-- updated_at trigger (function may already exist from other migrations)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS homepage_suggestions_set_updated_at ON public.homepage_travel_suggestions;
CREATE TRIGGER homepage_suggestions_set_updated_at
  BEFORE UPDATE ON public.homepage_travel_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.homepage_travel_suggestions ENABLE ROW LEVEL SECURITY;

-- anon: read only active rows (homepage uses service_role server-side, this is a safety net)
CREATE POLICY "anon_read_active"
  ON public.homepage_travel_suggestions FOR SELECT TO anon
  USING (is_active = true);

-- authenticated: read all rows (admin users)
CREATE POLICY "authenticated_read_all"
  ON public.homepage_travel_suggestions FOR SELECT TO authenticated
  USING (true);

-- GRANTS
GRANT SELECT            ON public.homepage_travel_suggestions TO anon;
GRANT SELECT            ON public.homepage_travel_suggestions TO authenticated;
GRANT ALL PRIVILEGES    ON public.homepage_travel_suggestions TO service_role;

-- Seed data
INSERT INTO public.homepage_travel_suggestions
  (title, country, badge, description, image_url, image_alt, sort_order, provider_key, search_query, link_mode, open_in_new_tab)
VALUES
  ('Bali',      'Indonesien',   'Beliebt',    'Entspannung, Kultur & tropische Strände',         'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', 'Bali, Indonesien',        0, 'booking', 'Bali Indonesien',        'affiliate', true),
  ('Santorini', 'Griechenland', 'Traumziel',  'Romantik, Sonnenuntergänge & mediterranes Flair', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', 'Santorini, Griechenland', 1, 'booking', 'Santorini Griechenland', 'affiliate', true),
  ('Banff',     'Kanada',       'Geheimtipp', 'Atemberaubende Natur & Abenteuer pur',            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', 'Banff, Kanada',           2, 'expedia', 'Kanada Rundreise',       'affiliate', true),
  ('Tokio',     'Japan',        'Trending',   'Moderne Kultur & einzigartige Erlebnisse',        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', 'Tokio, Japan',            3, 'expedia', 'Tokio Japan',            'affiliate', true);

-- ───────────────────────────── 20260618_inspiration_items.sql ─────────────────────────────
-- Inspiration Items: curated travel inspiration cards for /inspiration page
-- RLS: anon read-only for active items; authenticated manage all; service_role all

CREATE TABLE IF NOT EXISTS public.inspiration_items (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  title             text        NOT NULL,
  slug              text        NOT NULL UNIQUE,
  subtitle          text,
  description       text,
  category          text        NOT NULL DEFAULT 'Reiseidee',
  destination       text,
  country           text,
  region            text,

  badge             text,
  badge_tone        text        NOT NULL DEFAULT 'blue',

  image_url         text        NOT NULL,
  image_alt         text,

  provider_key      text,
  affiliate_target_url text,
  search_query      text,
  link_mode         text        NOT NULL DEFAULT 'affiliate'
                                CHECK (link_mode IN ('affiliate', 'internal', 'funnel')),
  open_in_new_tab   boolean     NOT NULL DEFAULT true,

  price_hint        text,
  duration_hint     text,
  travel_type       text,
  season_hint       text,

  sort_order        integer     NOT NULL DEFAULT 0,
  is_active         boolean     NOT NULL DEFAULT true,
  is_featured       boolean     NOT NULL DEFAULT false,

  seo_title         text,
  seo_description   text,
  llmo_summary      text,

  href              text,

  created_by        uuid,
  updated_by        uuid,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS inspiration_items_active_sort_idx
  ON public.inspiration_items (is_active, sort_order);

CREATE INDEX IF NOT EXISTS inspiration_items_category_idx
  ON public.inspiration_items (category);

CREATE INDEX IF NOT EXISTS inspiration_items_slug_idx
  ON public.inspiration_items (slug);

-- updated_at trigger (reuse or create the shared function)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inspiration_items_updated_at ON public.inspiration_items;
CREATE TRIGGER inspiration_items_updated_at
  BEFORE UPDATE ON public.inspiration_items
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- RLS
ALTER TABLE public.inspiration_items ENABLE ROW LEVEL SECURITY;

-- anon: read active items only
DROP POLICY IF EXISTS "inspiration_items_anon_select" ON public.inspiration_items;
CREATE POLICY "inspiration_items_anon_select"
  ON public.inspiration_items
  FOR SELECT
  TO anon
  USING (is_active = true);

-- authenticated: read all
DROP POLICY IF EXISTS "inspiration_items_auth_select" ON public.inspiration_items;
CREATE POLICY "inspiration_items_auth_select"
  ON public.inspiration_items
  FOR SELECT
  TO authenticated
  USING (true);

-- authenticated: insert/update/delete (admin role enforced at API layer)
DROP POLICY IF EXISTS "inspiration_items_auth_insert" ON public.inspiration_items;
CREATE POLICY "inspiration_items_auth_insert"
  ON public.inspiration_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "inspiration_items_auth_update" ON public.inspiration_items;
CREATE POLICY "inspiration_items_auth_update"
  ON public.inspiration_items
  FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "inspiration_items_auth_delete" ON public.inspiration_items;
CREATE POLICY "inspiration_items_auth_delete"
  ON public.inspiration_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Grants
GRANT SELECT ON public.inspiration_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspiration_items TO authenticated;
GRANT ALL ON public.inspiration_items TO service_role;

-- Seed data
INSERT INTO public.inspiration_items
  (title, slug, subtitle, category, destination, country, badge, image_url, image_alt,
   provider_key, search_query, link_mode, sort_order, is_active, is_featured,
   seo_title, seo_description, llmo_summary)
VALUES
  (
    'Santorini Pauschalreise',
    'santorini-pauschalreise',
    'Weißgetünchte Häuser, Vulkan-Panorama und Ägäisches Blau',
    'Pauschalreisen',
    'Santorini', 'Griechenland', 'Traumziel',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    'Santorini mit weißen Häusern und blauem Meer',
    'check24_urlaub', 'Santorini Griechenland Pauschalreise', 'affiliate',
    0, true, true,
    'Santorini Pauschalreise buchen | ApeAround',
    'Günstige Pauschalreisen nach Santorini mit Flug und Hotel. Jetzt Preise vergleichen.',
    'Santorini ist das bekannteste Reiseziel Griechenlands. Die Kykladen-Insel begeistert mit weißgetünchten Häusern, blauen Kirchenkuppeln, dem spektakulären Vulkan-Panorama und romantischen Sonnenuntergängen über der Caldera.'
  ),
  (
    'Bali Strandurlaub',
    'bali-strandurlaub',
    'Tropische Strände, Reisterrassen und spirituelle Tempel-Kultur',
    'Strandurlaub',
    'Bali', 'Indonesien', 'Beliebt',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    'Balinesischer Tempel mit Reisterrassen im Hintergrund',
    'booking', 'Bali Indonesien Hotel Strand', 'affiliate',
    1, true, false,
    'Bali Strandurlaub | Hotels & Tipps | ApeAround',
    'Die schönsten Hotels und Strände auf Bali. Buche deinen Traumurlaub in Indonesien.',
    'Bali kombiniert traumhafte Strände, üppige Reisterrassen, spirituelle Tempel und eine einzigartige Hindu-Kultur. Die Insel der Götter gilt als eines der romantischsten Reiseziele Asiens.'
  ),
  (
    'Kanada Nationalpark-Rundreise',
    'kanada-nationalpark-rundreise',
    'Banff, Jasper und die atemberaubenden Rocky Mountains',
    'Natur & Nationalparks',
    'Banff / Jasper', 'Kanada', 'Geheimtipp',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'Türkisfarbener Bergsee in den kanadischen Rockies',
    'expedia', 'Kanada Rocky Mountains Rundreise', 'affiliate',
    2, true, false,
    'Kanada Nationalpark Rundreise | Banff & Jasper | ApeAround',
    'Mietwagen-Rundreise durch Banff und Jasper — Kanadas schönste Nationalparks in den Rocky Mountains.',
    'Die kanadischen Nationalparks Banff und Jasper gehören zum UNESCO-Weltnaturerbe. Die Rocky Mountains bieten türkisblaue Gletscherseen, Grizzlybären, Elche und eine grandiose Berglandschaft — ideal für eine Mietwagen-Rundreise.'
  ),
  (
    'Tokio Städtereise',
    'tokio-staedtereise',
    'Neon-Lichter, Sushi und der einzigartige Kontrast aus Tradition und Moderne',
    'Städtereisen',
    'Tokio', 'Japan', 'Trending',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    'Tokio Skyline bei Nacht mit Kirschblüten',
    'booking', 'Tokio Japan Hotel Städtereise', 'affiliate',
    3, true, false,
    'Tokio Städtereise buchen | Hotels & Tipps | ApeAround',
    'Tokio Städtereise: Hotels und Reiseguide für Japans faszinierende Metropole.',
    'Tokio ist eine der aufregendsten Städte der Welt. Die japanische Hauptstadt vereint Hochhäuser neben Jahrhunderte alten Tempeln, Michelin-Sterne-Restaurants neben Sushi-Bars für 1 Euro und ruhige Zen-Gärten inmitten des urbanen Treibens.'
  ),
  (
    'Mallorca Familienurlaub',
    'mallorca-familienurlaub',
    'Sonne, Meer und familienfreundliche Resorts für unvergessliche Ferien',
    'Familienurlaub',
    'Mallorca', 'Spanien', 'Beliebt',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80',
    'Mallorca Strand mit türkisblauem Wasser und Palmen',
    'check24_hotel', 'Mallorca Spanien Familienhotel Resort', 'affiliate',
    4, true, false,
    'Mallorca Familienurlaub | Familienhotels & Resorts | ApeAround',
    'Mallorca Familienurlaub: Familienfreundliche Hotels und Resorts auf Mallorca buchen.',
    'Mallorca ist eines der beliebtesten Familienziele Europas. Die größte Baleareninsel bietet traumhafte Strände, zahlreiche Freizeitparks, familienfreundliche Resorts und mild-mediterranes Klima fast das ganze Jahr über.'
  ),
  (
    'Norwegen Roadtrip',
    'norwegen-roadtrip',
    'Fjorde, Mitternachtssonne und unvergessliche Naturkulissen',
    'Roadtrips',
    'Westfjorde / Lofoten', 'Norwegen', 'Geheimtipp',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Norwegischer Fjord mit schneebedeckten Bergen und kleinem Dorf',
    'expedia', 'Norwegen Fjorde Mietwagen Roadtrip', 'affiliate',
    5, true, false,
    'Norwegen Roadtrip Fjorde | Reiseguide | ApeAround',
    'Norwegen Roadtrip entlang der Fjorde: Tipps für Mietwagen, Strecken und Unterkünfte.',
    'Norwegen bietet mit seinen Fjorden, Bergen und der Mitternachtssonne eine der grandiosesten Naturkulissen Europas. Ein Roadtrip von Bergen nach Tromsø entlang der Fjordküste gehört zu den schönsten Reiseerlebnissen weltweit.'
  ),
  (
    'Dubai Luxusreise',
    'dubai-luxusreise',
    'Burj Khalifa, Wüsten-Safaris und Weltklasse-Hotels',
    'Luxus',
    'Dubai', 'Vereinigte Arabische Emirate', 'Luxus',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    'Dubai Skyline mit Burj Khalifa bei Nacht',
    'booking', 'Dubai Luxushotel Resort', 'affiliate',
    6, true, false,
    'Dubai Luxusreise | 5-Sterne Hotels & Resorts | ApeAround',
    'Dubai Luxusreise: 5-Sterne Hotels, Wüsten-Safaris und das Beste der arabischen Metropole.',
    'Dubai ist das Synonym für Luxusreisen im Nahen Osten. Die Emirate-Metropole bietet atemberaubende Wolkenkratzer, opulente Luxushotels mit privatem Strand, aufregende Wüsten-Safaris und ein einzigartiges Einkaufserlebnis in gigantischen Malls.'
  ),
  (
    'Island Naturabenteuer',
    'island-naturabenteuer',
    'Geysire, Nordlichter, Gletscher und Vulkan-Landschaften',
    'Natur & Nationalparks',
    'Reykjavik / Ring Road', 'Island', 'Trending',
    'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=800&q=80',
    'Nordlichter über isländischer Berglandschaft',
    'expedia', 'Island Rundreise Hotel Nordlichter', 'affiliate',
    7, true, false,
    'Island Naturabenteuer | Nordlichter & Geysire | ApeAround',
    'Island Reise planen: Nordlichter, Geysire, Gletscher und Vulkane. Hotels und Tipps für deine Island-Rundreise.',
    'Island fasziniert mit einzigartigen Naturphänomenen: sprudelnde Geysire, tanzende Nordlichter, dampfende Vulkane, türkisblaue Gletscherseen und heiße natürliche Quellen. Eine Rundreise auf dem Ring Road ist ein unvergessliches Abenteuer.'
  );

-- ───────────────────────────── 20260618_partner_inquiries.sql ─────────────────────────────
-- Partner Inquiries: contact form submissions from /partner-werden
-- RLS: anon INSERT only; authenticated/admin full read+manage; service_role ALL

CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  company          text,
  email            text        NOT NULL,
  website          text,
  partner_type     text,
  cooperation_type text,
  message          text,
  status           text        NOT NULL DEFAULT 'new'
                               CHECK (status IN ('new', 'contacted', 'closed')),
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;

-- anon may INSERT (submit a form) but NOT read
CREATE POLICY "anon_insert_partner_inquiries"
  ON public.partner_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- authenticated users (admin) may SELECT
CREATE POLICY "authenticated_select_partner_inquiries"
  ON public.partner_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- authenticated users may UPDATE (status changes)
CREATE POLICY "authenticated_update_partner_inquiries"
  ON public.partner_inquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- authenticated users may DELETE
CREATE POLICY "authenticated_delete_partner_inquiries"
  ON public.partner_inquiries
  FOR DELETE
  TO authenticated
  USING (true);

-- service_role bypasses RLS by design; explicit GRANTs for completeness
GRANT INSERT ON public.partner_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_inquiries TO authenticated;
GRANT ALL ON public.partner_inquiries TO service_role;

-- ───────────────────────────── 20260620_ferienpark_affiliate_providers.sql ─────────────────────────────
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

-- ───────────────────────────── 20260620_newsletter_subscribers_upgrade.sql ─────────────────────────────
-- Newsletter Subscribers: upgrade to full Double-Opt-In schema
-- Existing table from 20240606... had: id, email, confirmed, source, created_at, updated_at
-- This migration adds all DOI fields without breaking existing rows.

-- Add new columns (safe: IF NOT EXISTS equivalent via ALTER ADD IF NOT EXISTS not universal — use DO block)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='status') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='consent_text') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN consent_text text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='consent_given_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN consent_given_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='confirmed_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN confirmed_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='confirmation_token_hash') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN confirmation_token_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='confirmation_sent_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN confirmation_sent_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='unsubscribed_at') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN unsubscribed_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='unsubscribe_token_hash') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN unsubscribe_token_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='ip_hash') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN ip_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='user_agent') THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN user_agent text;
  END IF;
END $$;

-- Migrate existing confirmed=true rows to status='confirmed'
UPDATE public.newsletter_subscribers SET status = 'confirmed' WHERE confirmed = true AND status = 'pending';

-- CHECK constraint for status values (add if missing)
DO $$ BEGIN
  ALTER TABLE public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_status_check
    CHECK (status IN ('pending', 'confirmed', 'unsubscribed'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS: reset and apply correct policies
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Remove overly broad authenticated SELECT policy from original migration
DROP POLICY IF EXISTS "Users can view own subscription" ON public.newsletter_subscribers;

-- service_role bypasses RLS — no explicit policy needed; GRANT is sufficient
-- authenticated admins can manage (via service_role in API routes — already covered)
-- anon: no read, no write via RLS (all writes go through API → service_role)
REVOKE ALL ON public.newsletter_subscribers FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

-- Index on confirmation_token_hash for O(1) confirm lookup
CREATE INDEX IF NOT EXISTS newsletter_subscribers_confirm_token_idx
  ON public.newsletter_subscribers (confirmation_token_hash)
  WHERE confirmation_token_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS newsletter_subscribers_unsubscribe_token_idx
  ON public.newsletter_subscribers (unsubscribe_token_hash)
  WHERE unsubscribe_token_hash IS NOT NULL;

-- ───────────────────────────── 20260620_travel_funnel_email.sql ─────────────────────────────
-- Add email capture fields to travel_funnel_sessions
-- These are set when the user passes the EmailGate on /traumreise/[id]

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='travel_funnel_sessions' AND column_name='email') THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN email text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='travel_funnel_sessions' AND column_name='email_submitted_at') THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN email_submitted_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='travel_funnel_sessions' AND column_name='lead_source') THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN lead_source text DEFAULT 'travel_funnel';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='travel_funnel_sessions' AND column_name='privacy_notice_accepted') THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN privacy_notice_accepted boolean DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='travel_funnel_sessions' AND column_name='duration') THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN duration text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='travel_funnel_sessions' AND column_name='personal_note') THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN personal_note text;
  END IF;
END $$;

-- ───────────────────────────── 20260621_affiliate_settings_ferienparks.sql ─────────────────────────────
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

-- ───────────────────────────── 20260621_creator_applications.sql ─────────────────────────────
-- ── creator_applications: Creator-Bewerbungen ────────────────────────────────

CREATE TABLE IF NOT EXISTS public.creator_applications (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  email        text        NOT NULL,
  profile_url  text,
  creator_type text,
  topics       text[]      NOT NULL DEFAULT '{}',
  message      text,
  consent      boolean     NOT NULL DEFAULT false,
  status       text        NOT NULL DEFAULT 'new'
                           CHECK (status IN ('new', 'reviewed', 'accepted', 'rejected')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- RLS aktivieren
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- anon: nur INSERT (nur wenn consent = true)
DROP POLICY IF EXISTS "creator_applications_anon_insert" ON public.creator_applications;
CREATE POLICY "creator_applications_anon_insert"
  ON public.creator_applications FOR INSERT TO anon
  WITH CHECK (consent = true);

-- authenticated: voller Zugriff
DROP POLICY IF EXISTS "creator_applications_authenticated_all" ON public.creator_applications;
CREATE POLICY "creator_applications_authenticated_all"
  ON public.creator_applications FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Keine öffentliche Leseberechtigung für anon
REVOKE ALL ON public.creator_applications FROM anon;
REVOKE ALL ON public.creator_applications FROM authenticated;
GRANT INSERT                         ON public.creator_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creator_applications TO authenticated;
GRANT ALL                            ON public.creator_applications TO service_role;

-- updated_at Trigger (idempotent)
CREATE OR REPLACE FUNCTION public.set_creator_applications_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_creator_applications_updated_at ON public.creator_applications;
CREATE TRIGGER trg_creator_applications_updated_at
  BEFORE UPDATE ON public.creator_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_creator_applications_updated_at();

-- ───────────────────────────── 20260621_creator_profiles.sql ─────────────────────────────
-- creator_profiles
-- Öffentliche Creator-Profile, die aus angenommenen Bewerbungen entstehen.

CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id    uuid        REFERENCES public.creator_applications(id) ON DELETE SET NULL,
  slug              text        NOT NULL UNIQUE,
  display_name      text        NOT NULL,
  contact_email     text,
  bio               text,
  short_bio         text,
  profile_image_url text,
  hero_image_url    text,
  creator_type      text,
  topics            text[]      NOT NULL DEFAULT '{}',
  destinations      text[]      NOT NULL DEFAULT '{}',
  travel_styles     text[]      NOT NULL DEFAULT '{}',
  social_links      jsonb       NOT NULL DEFAULT '{}'::jsonb,
  website_url       text,
  gallery_images    text[]      NOT NULL DEFAULT '{}',
  featured_tips     jsonb       NOT NULL DEFAULT '[]'::jsonb,
  cta_label         text,
  cta_url           text,
  status            text        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'submitted', 'published', 'archived')),
  internal_notes    text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  published_at      timestamptz
);

-- Index für den häufigsten Public-Lookup (Slug + published)
CREATE INDEX IF NOT EXISTS idx_creator_profiles_slug    ON public.creator_profiles (slug);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_status  ON public.creator_profiles (status);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_app_id  ON public.creator_profiles (application_id);

-- updated_at-Trigger (idempotent)
CREATE OR REPLACE FUNCTION public.set_creator_profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_creator_profiles_updated_at ON public.creator_profiles;
CREATE TRIGGER trg_creator_profiles_updated_at
  BEFORE UPDATE ON public.creator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_creator_profiles_updated_at();

-- RLS aktivieren
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "creator_profiles_anon_select"  ON public.creator_profiles;
DROP POLICY IF EXISTS "creator_profiles_auth_all"     ON public.creator_profiles;
DROP POLICY IF EXISTS "creator_profiles_service_all"  ON public.creator_profiles;

-- anon: nur veröffentlichte Profile lesen
CREATE POLICY "creator_profiles_anon_select"
  ON public.creator_profiles
  FOR SELECT TO anon
  USING (status = 'published');

-- authenticated: vollen Zugriff (Admin)
CREATE POLICY "creator_profiles_auth_all"
  ON public.creator_profiles
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grants
REVOKE ALL ON public.creator_profiles FROM anon;
REVOKE ALL ON public.creator_profiles FROM authenticated;

GRANT SELECT                          ON public.creator_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE  ON public.creator_profiles TO authenticated;
GRANT ALL                             ON public.creator_profiles TO service_role;

-- ───────────────────────────── 20260621_travel_funnel_funnel_type.sql ─────────────────────────────
-- Add funnel_type and source to travel_funnel_sessions
-- Allows reliable identification of the originating funnel without parsing free text.
-- funnel_type: 'single_parent' | 'general_travel' | null (legacy)
-- source:      'urlaub-fuer-alleinerziehende' | null (legacy)

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'travel_funnel_sessions' AND column_name = 'funnel_type'
  ) THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN funnel_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'travel_funnel_sessions' AND column_name = 'source'
  ) THEN
    ALTER TABLE public.travel_funnel_sessions ADD COLUMN source text;
  END IF;
END $$;

-- Backfill existing alleinerziehende sessions identified via personal_note (legacy detection)
UPDATE public.travel_funnel_sessions
SET
  funnel_type = 'single_parent',
  source      = 'urlaub-fuer-alleinerziehende'
WHERE
  funnel_type IS NULL
  AND personal_note ILIKE '%alleinerziehend%';

-- RLS stays enabled; no changes to existing policies.
-- service_role already has ALL, authenticated has SELECT/INSERT/UPDATE.

-- ───────────────────────────── 20260622_creator_profiles_onboarding.sql ─────────────────────────────
-- Creator-Profile Onboarding-Token Erweiterung
-- Fügt sichere Token-Spalten für den Creator-Onboarding-Link hinzu.

ALTER TABLE public.creator_profiles
  ADD COLUMN IF NOT EXISTS onboarding_token             text UNIQUE,
  ADD COLUMN IF NOT EXISTS onboarding_token_expires_at  timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at      timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_at                 timestamptz,
  ADD COLUMN IF NOT EXISTS last_creator_edit_at         timestamptz;

-- Index für schnellen Token-Lookup
CREATE INDEX IF NOT EXISTS idx_creator_profiles_onboarding_token
  ON public.creator_profiles (onboarding_token)
  WHERE onboarding_token IS NOT NULL;

-- ───────────────────────────── 20260623_creator_submissions.sql ─────────────────────────────
-- Creator Submissions: Inhalte von Creator-Profilen
CREATE TABLE IF NOT EXISTS public.creator_submissions (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id   uuid        NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  type                 text        NOT NULL CHECK (type IN ('guide', 'tip', 'route')),
  title                text        NOT NULL,
  slug                 text        NOT NULL UNIQUE,
  excerpt              text,
  content              text,
  destination          text,
  country              text,
  category             text,
  tags                 text[]      NOT NULL DEFAULT '{}',
  images               text[]      NOT NULL DEFAULT '{}',
  route_data           jsonb       NOT NULL DEFAULT '{}'::jsonb,
  tip_data             jsonb       NOT NULL DEFAULT '{}'::jsonb,
  status               text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'published', 'rejected', 'archived')),
  rejection_reason     text,
  admin_notes          text,
  submitted_at         timestamptz,
  published_at         timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_submissions_profile_id ON public.creator_submissions (creator_profile_id);
CREATE INDEX IF NOT EXISTS idx_creator_submissions_status     ON public.creator_submissions (status);
CREATE INDEX IF NOT EXISTS idx_creator_submissions_type       ON public.creator_submissions (type);
CREATE INDEX IF NOT EXISTS idx_creator_submissions_slug       ON public.creator_submissions (slug);
CREATE INDEX IF NOT EXISTS idx_creator_submissions_published  ON public.creator_submissions (published_at DESC) WHERE status = 'published';

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_creator_submissions_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_creator_submissions_updated_at ON public.creator_submissions;
CREATE TRIGGER trg_creator_submissions_updated_at
  BEFORE UPDATE ON public.creator_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_creator_submissions_updated_at();

-- RLS
ALTER TABLE public.creator_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "creator_submissions_anon_select" ON public.creator_submissions;
DROP POLICY IF EXISTS "creator_submissions_auth_all"   ON public.creator_submissions;

CREATE POLICY "creator_submissions_anon_select"
  ON public.creator_submissions FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "creator_submissions_auth_all"
  ON public.creator_submissions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Grants
REVOKE ALL ON public.creator_submissions FROM anon;
REVOKE ALL ON public.creator_submissions FROM authenticated;

GRANT SELECT                         ON public.creator_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creator_submissions TO authenticated;
GRANT ALL                            ON public.creator_submissions TO service_role;

-- ───────────────────────────── 20260705_admin_audit_log.sql ─────────────────────────────
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

-- ───────────────────────────── 20260705_site_settings.sql ─────────────────────────────
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

-- ───────────────────────────── Storage-Bucket für Bilder ─────────────────────────────
-- Reiseziel-, Blog- und Creator-Bilder liegen im öffentlichen Bucket "destinations".
insert into storage.buckets (id, name, public)
values ('destinations', 'destinations', true)
on conflict (id) do nothing;

