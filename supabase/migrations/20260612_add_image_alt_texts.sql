-- Add image_alt_texts column to destinations for SEO alt text storage.
-- Format: { "hero": "...", "og": "...", "twitter": "...", "gallery_0": "...", ... }

alter table public.destinations
  add column if not exists image_alt_texts jsonb not null default '{}'::jsonb;
