-- ================================================================
-- Reisemonkey Travel Funnel – Supabase Migration
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
