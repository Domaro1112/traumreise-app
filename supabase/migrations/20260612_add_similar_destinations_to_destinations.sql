-- Add similar_destinations column for SEO internal linking and LLMO context.
-- Stored as a jsonb array of destination slugs, e.g. ["bali", "koh-samui"].

ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS similar_destinations jsonb NOT NULL DEFAULT '[]'::jsonb;
