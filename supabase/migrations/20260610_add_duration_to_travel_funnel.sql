-- Add duration column to travel_funnel_sessions
ALTER TABLE travel_funnel_sessions
  ADD COLUMN IF NOT EXISTS duration text;

-- Add duration column to travel_leads
ALTER TABLE travel_leads
  ADD COLUMN IF NOT EXISTS duration text;
