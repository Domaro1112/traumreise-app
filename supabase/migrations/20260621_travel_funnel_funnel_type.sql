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
