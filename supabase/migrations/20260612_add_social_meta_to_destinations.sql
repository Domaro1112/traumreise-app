-- Add social meta columns (Open Graph + Twitter/X) to destinations
-- These can be auto-generated from seo_title / seo_description when empty.

alter table public.destinations
  add column if not exists open_graph_title        text,
  add column if not exists open_graph_description  text,
  add column if not exists twitter_image           text,
  add column if not exists twitter_title           text,
  add column if not exists twitter_description     text;
