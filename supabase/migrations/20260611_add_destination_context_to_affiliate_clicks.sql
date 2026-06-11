-- Add destination context columns to affiliate_clicks.
-- These allow tracking which country/region was clicked and what search query was used.

ALTER TABLE affiliate_clicks
  ADD COLUMN IF NOT EXISTS destination_country text,
  ADD COLUMN IF NOT EXISTS destination_region  text,
  ADD COLUMN IF NOT EXISTS search_query        text;
