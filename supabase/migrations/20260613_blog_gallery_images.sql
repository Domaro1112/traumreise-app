-- Add gallery_images column to blog_articles
-- Run in Supabase Dashboard → SQL Editor → New Query
--
-- Gallery item shape (per element in the JSONB array):
--   { url, fileName, alt, title, caption, order }
--
-- RLS is not changed: service_role bypasses it for admin writes;
-- anon can SELECT published articles (which may include galleryImages).

ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';
