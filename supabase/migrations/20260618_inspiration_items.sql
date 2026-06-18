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
