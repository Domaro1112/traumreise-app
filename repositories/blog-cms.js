import 'server-only';
import { createServerClient } from '@/lib/supabase/server';

// ─────────────────────────────────────────────────────────────────────────────
// Shape mapper: DB row (snake_case) → public article shape (camelCase)
// Must match the shape consumed by BlogPageClient, ArticleSidebar, etc.
// ─────────────────────────────────────────────────────────────────────────────
function dbToPublic(row) {
  if (!row) return null;
  return {
    // identity
    id:           row.id,
    slug:         row.slug,
    title:        row.title         ?? '',
    excerpt:      row.excerpt       ?? '',
    category:     row.category      ?? '',
    destination:  row.destination   ?? '',
    country:      row.country       ?? '',
    // media
    imageUrl:        row.cover_image_url ?? row.hero_image_url ?? '',
    coverImageUrl:   row.cover_image_url ?? '',
    heroImageUrl:    row.hero_image_url  ?? '',
    // meta
    date:          row.date          ?? '',
    lastUpdated:   row.last_updated  ?? row.updated_at ?? '',
    readingTime:   row.reading_time  ?? '',
    author:        row.author        ?? '',
    authorBio:     row.author_bio    ?? '',
    tags:          Array.isArray(row.tags) ? row.tags : [],
    featured:      row.featured      ?? false,
    // status
    status:        row.status        ?? 'draft',
    publishedAt:   row.published_at  ?? null,
    createdAt:     row.created_at    ?? null,
    updatedAt:     row.updated_at    ?? null,
    // content
    keyTakeaways:    row.key_takeaways    ?? [],
    tableOfContents: row.table_of_contents ?? [],
    contentSections: row.content_sections  ?? [],
    faq:             row.faq              ?? [],
    relatedArticles: row.related_articles  ?? [],
    internalLinks:   row.internal_links    ?? [],
    // SEO
    seoTitle:       row.seo_title       ?? null,
    seoDescription: row.seo_description ?? null,
    canonicalUrl:   row.canonical_url   ?? null,
    openGraphTitle: row.open_graph_title ?? null,
    openGraphDescription: row.open_graph_description ?? null,
    openGraphImage: row.open_graph_image ?? row.cover_image_url ?? null,
    // gallery
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    // feedback
    helpfulCount:    row.helpful_count    ?? 0,
    notHelpfulCount: row.not_helpful_count ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin operations – full access via service_role
// ─────────────────────────────────────────────────────────────────────────────

/** All articles for the admin list (all statuses). */
export async function listBlogAdmin() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_articles')
    .select('id, slug, title, category, status, featured, published_at, created_at, updated_at, helpful_count, not_helpful_count')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Full article row for the admin editor. */
export async function getBlogAdmin(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Create a new article. Returns the inserted row. */
export async function createBlogArticle(fields) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_articles')
    .insert(sanitise(fields))
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Partial update of an article. Returns the updated row. */
export async function updateBlogArticle(id, fields) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_articles')
    .update({ ...sanitise(fields), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Set status = 'published' and record published_at timestamp. */
export async function publishBlogArticle(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_articles')
    .update({ status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, slug, status, published_at')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Set status = 'archived'. */
export async function archiveBlogArticle(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_articles')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Hard-delete an article by id. Works for any status. */
export async function deleteBlogArticle(id) {
  const supabase = createServerClient();
  const { data: existing } = await supabase
    .from('blog_articles')
    .select('id, status')
    .eq('id', id)
    .single();
  if (!existing) throw new Error('Artikel nicht gefunden.');
  const { error } = await supabase
    .from('blog_articles')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public operations – always filter status = 'published'
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load a published article by slug.
 * Returns the camelCase public shape, or null if not found / not published.
 */
export async function getBlogArticleBySlugPublic(slug) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (error || !data) return null;
    return dbToPublic(data);
  } catch {
    return null;
  }
}

/**
 * Load all published articles for the /reiseblog overview.
 * Returns camelCase public shapes sorted by published_at desc.
 */
export async function listPublishedBlogArticles({ limit } = {}) {
  try {
    const supabase = createServerClient();
    let query = supabase
      .from('blog_articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error || !data?.length) return [];
    return data.map(dbToPublic);
  } catch {
    return [];
  }
}

/**
 * Returns slug strings of all published articles.
 * Used by generateStaticParams.
 */
export async function listPublishedBlogSlugs() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_articles')
      .select('slug')
      .eq('status', 'published');
    if (error || !data?.length) return [];
    return data.map(d => d.slug);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const DB_COLUMNS = new Set([
  'slug', 'title', 'excerpt', 'category', 'destination', 'country',
  'cover_image_url', 'hero_image_url', 'gallery_images',
  'date', 'last_updated', 'reading_time', 'author', 'author_bio',
  'tags', 'featured',
  'seo_title', 'seo_description', 'canonical_url',
  'open_graph_title', 'open_graph_description', 'open_graph_image',
  'key_takeaways', 'table_of_contents', 'content_sections',
  'faq', 'related_articles', 'internal_links',
  'status', 'published_at', 'updated_at', 'sort_order',
]);

function sanitise(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([k, v]) => DB_COLUMNS.has(k) && v !== undefined)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public feedback – atomic vote increment via Postgres RPC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Atomically increments helpful_count or not_helpful_count for a published article.
 * Uses a SECURITY DEFINER Postgres function so no RLS bypass is needed at the
 * application layer; the function itself validates the vote string.
 */
export async function incrementBlogFeedback(slug, vote) {
  const supabase = createServerClient();
  const { error } = await supabase.rpc('increment_blog_feedback', {
    p_slug: slug,
    p_vote: vote,
  });
  if (error) throw new Error(error.message);
}
