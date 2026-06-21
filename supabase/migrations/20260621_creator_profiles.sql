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
