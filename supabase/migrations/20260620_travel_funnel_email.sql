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
