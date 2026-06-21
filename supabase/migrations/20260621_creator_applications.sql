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
