-- Add optional personal_note field to funnel sessions and leads.
-- The field stores the user's free-text travel preferences from the funnel.

ALTER TABLE travel_funnel_sessions
  ADD COLUMN IF NOT EXISTS personal_note text;

ALTER TABLE travel_leads
  ADD COLUMN IF NOT EXISTS personal_note text;
