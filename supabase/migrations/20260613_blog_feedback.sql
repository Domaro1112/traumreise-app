-- Blog Feedback: helpful/not-helpful vote counts per article
-- Run in Supabase SQL Editor → Dashboard → SQL Editor → New Query

-- 1. Add vote count columns
ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS helpful_count     integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS not_helpful_count integer NOT NULL DEFAULT 0;

-- 2. Atomic increment function (server-side only via service_role)
--    Validates vote type explicitly to prevent SQL injection.
--    Only increments when article is published (no phantom votes on drafts).
CREATE OR REPLACE FUNCTION increment_blog_feedback(p_slug text, p_vote text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_vote = 'helpful' THEN
    UPDATE blog_articles
    SET helpful_count = helpful_count + 1
    WHERE slug = p_slug AND status = 'published';
  ELSIF p_vote = 'not_helpful' THEN
    UPDATE blog_articles
    SET not_helpful_count = not_helpful_count + 1
    WHERE slug = p_slug AND status = 'published';
  END IF;
END;
$$;
