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
