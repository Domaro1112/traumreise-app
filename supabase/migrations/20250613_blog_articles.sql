-- Blog Articles table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS blog_articles (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT        UNIQUE NOT NULL,
  title                TEXT        NOT NULL,
  excerpt              TEXT,
  category             TEXT,
  destination          TEXT,
  country              TEXT,
  -- media
  cover_image_url      TEXT,
  hero_image_url       TEXT,
  -- meta
  date                 DATE,
  last_updated         DATE,
  reading_time         TEXT,
  author               TEXT,
  author_bio           TEXT,
  tags                 TEXT[]      DEFAULT '{}',
  featured             BOOLEAN     DEFAULT FALSE,
  -- status workflow: draft → published → archived
  status               TEXT        DEFAULT 'draft'
                                   CHECK (status IN ('draft', 'published', 'archived')),
  published_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  -- content (JSONB)
  table_of_contents    JSONB       DEFAULT '[]',
  content_sections     JSONB       DEFAULT '[]',
  faq                  JSONB       DEFAULT '[]',
  key_takeaways        JSONB       DEFAULT '[]',
  related_articles     TEXT[]      DEFAULT '{}',
  internal_links       JSONB       DEFAULT '[]',
  -- SEO
  seo_title            TEXT,
  seo_description      TEXT,
  canonical_url        TEXT,
  open_graph_title     TEXT,
  open_graph_description TEXT,
  open_graph_image     TEXT,
  -- misc
  sort_order           INTEGER     DEFAULT 0
);

-- Index for public queries
CREATE INDEX IF NOT EXISTS blog_articles_status_published_at
  ON blog_articles (status, published_at DESC);

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Anon/public can read published articles
CREATE POLICY "Public can read published blog articles"
  ON blog_articles
  FOR SELECT
  USING (status = 'published');

-- service_role bypasses RLS by default — no write policy needed for admin API
-- (all admin mutations go through the service_role key in createServerClient())

-- ── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_blog_articles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW EXECUTE FUNCTION update_blog_articles_updated_at();
