-- Reset blog: delete all blog articles
-- Run this in Supabase Dashboard → SQL Editor → New Query
--
-- Tables checked:
--   blog_articles        ✓ exists — cleared below
--   blog_categories      ✗ does not exist (no separate table)
--   blog_tags            ✗ does not exist (tags stored as TEXT[] in blog_articles)
--   blog_media           ✗ does not exist (image URLs stored in blog_articles)
--   blog_faq             ✗ does not exist (FAQ stored as JSONB in blog_articles)
--   blog_related_destinations ✗ does not exist
--
-- NOTE: Supabase Storage (blog images) is NOT touched by this migration.
--       Reiseziele, admin users, and all other tables are NOT touched.

DELETE FROM blog_articles;
