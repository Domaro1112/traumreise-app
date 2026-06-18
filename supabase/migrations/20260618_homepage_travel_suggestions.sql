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
