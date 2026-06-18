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
