-- ─────────────────────────────────────────────────────────────────────────────
-- Blog article view tracking
-- Stores each public page view (no IP address, DSGVO-sparsam).
-- Admin previews are NOT counted (controlled by the API route).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_article_views (
  id          bigint      generated always as identity primary key,
  article_id  uuid        not null references blog_articles(id) on delete cascade,
  slug        text        not null,
  viewed_at   timestamptz not null default now(),
  referrer    text,                                -- hostname only, no path
  created_at  timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS blog_article_views_article_id_idx
  ON blog_article_views (article_id);

CREATE INDEX IF NOT EXISTS blog_article_views_viewed_at_idx
  ON blog_article_views (viewed_at DESC);

-- Row-level security
ALTER TABLE blog_article_views ENABLE ROW LEVEL SECURITY;

-- Anyone (anon / service_role) can insert – the API route enforces business logic
CREATE POLICY "public_can_insert_views"
  ON blog_article_views FOR INSERT
  WITH CHECK (true);

-- Anyone can read – needed for the admin dashboard aggregation
CREATE POLICY "public_can_read_views"
  ON blog_article_views FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Aggregation function – returns one row per article with total + 30-day count.
-- Called from the admin list to avoid N+1 queries.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_blog_view_counts()
RETURNS TABLE (
  article_id  uuid,
  total_views bigint,
  views_30d   bigint
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    article_id,
    COUNT(*)                                                             AS total_views,
    COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '30 days')     AS views_30d
  FROM blog_article_views
  GROUP BY article_id;
$$;
