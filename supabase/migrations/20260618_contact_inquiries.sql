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
