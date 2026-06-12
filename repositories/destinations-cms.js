import 'server-only';
import { createServerClient } from '@/lib/supabase/server';

// ─────────────────────────────────────────────────────────────────────────────
// Shape mapper: DB row (snake_case) → public destination shape (camelCase)
// Must match the shape expected by /reiseziele/[slug]/page.jsx and components.
// ─────────────────────────────────────────────────────────────────────────────
function dbToPublic(row) {
  if (!row) return null;
  return {
    // identity
    id:           row.id,
    name:         row.name,
    slug:         row.slug,
    country:      row.country      ?? '',
    region:       row.region       ?? '',
    continent:    row.continent    ?? '',
    // media
    heroImage:    row.hero_image   ?? `/images/destinations/${row.slug}.jpg`,
    heroGradient: 'linear-gradient(160deg, #0C1A3A 0%, #0B3D6B 50%, #0EA5E9 100%)',
    // content
    shortDescription: row.short_description ?? '',
    longDescription:  row.long_description  ?? '',
    aiSummary:        row.ai_summary        ?? '',
    bestTravelTime:   row.best_travel_time  ?? '',
    idealDuration:    row.ideal_duration    ?? '',
    travelType:       row.travel_type       ?? [],
    quickFacts:       row.quick_facts       ?? {},
    // array fields – stored as jsonb arrays of strings or objects
    highlights:  normaliseStringArray(row.highlights),
    insiderTips: normaliseStringArray(row.insider_tips),
    faq:         row.faq ?? [],
    // affiliate
    similarDestinations:   [],
    carRentalRecommended:  row.car_rental_recommended  ?? false,
    affiliateSearchIntent: row.affiliate_search_intent ?? row.name,
    // status / cms
    isPlaceholder:  false,
    status:         row.status,
    // SEO extras (used by metadata generator)
    seoTitle:             row.seo_title              ?? null,
    seoDescription:       row.seo_description        ?? null,
    canonicalUrl:         row.canonical_url          ?? null,
    // Open Graph — fall back chain: explicit → hero_image
    openGraphImage:       row.open_graph_image       ?? row.hero_image ?? null,
    openGraphTitle:       row.open_graph_title       ?? row.seo_title  ?? null,
    openGraphDescription: row.open_graph_description ?? row.seo_description ?? null,
    // Twitter / X — fall back chain: explicit → OG → SEO
    twitterImage:         row.twitter_image          ?? row.open_graph_image ?? row.hero_image ?? null,
    twitterTitle:         row.twitter_title          ?? row.open_graph_title ?? row.seo_title  ?? null,
    twitterDescription:   row.twitter_description    ?? row.open_graph_description ?? row.seo_description ?? null,
    // LLMO
    llmoQuickAnswer:      row.llmo_quick_answer      ?? null,
    llmoAnswerBlock:      row.llmo_answer_block       ?? null,
    // media gallery
    galleryImages:        Array.isArray(row.gallery_images)  ? row.gallery_images  : [],
    imageAltTexts:        row.image_alt_texts ?? {},
  };
}

/** Handles both jsonb string[] and legacy object[] with a .text field */
function normaliseStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => (typeof item === 'string' ? item : item?.text ?? ''));
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin operations – full access via service_role
// ─────────────────────────────────────────────────────────────────────────────

/** All destinations for the admin list (all statuses). */
export async function listDestinationsAdmin() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('destinations')
    .select('id, name, slug, country, continent, status, created_at, updated_at, published_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Full destination row for the admin editor. */
export async function getDestinationAdmin(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Create a new destination. Returns the inserted row. */
export async function createDestination(fields) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('destinations')
    .insert(sanitise(fields))
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Partial update of a destination. Returns the updated row. */
export async function updateDestination(id, fields) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('destinations')
    .update(sanitise(fields))
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Set status = 'published' and record published_at timestamp. */
export async function publishDestination(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('destinations')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status, published_at')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Set status = 'archived'. */
export async function archiveDestination(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('destinations')
    .update({ status: 'archived' })
    .eq('id', id)
    .select('id, status')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Hard-delete only draft destinations. Refuses to delete published/archived. */
export async function deleteDestination(id) {
  const supabase = createServerClient();
  // Safety check: only drafts can be deleted
  const { data: existing } = await supabase
    .from('destinations')
    .select('id, status')
    .eq('id', id)
    .single();
  if (!existing) throw new Error('Reiseziel nicht gefunden.');
  if (existing.status !== 'draft') {
    throw new Error('Nur Entwürfe können gelöscht werden. Bitte zuerst archivieren.');
  }
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public operations – always filter status = 'published'
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load a published destination by slug.
 * Returns the camelCase public shape, or null if not found / not published.
 */
export async function getDestinationBySlugPublic(slug) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('destinations')
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
 * Load all published destinations for the /reiseziele overview.
 * Returns camelCase public shapes sorted by name.
 */
export async function listPublishedDestinations() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('status', 'published')
      .order('name');
    if (error || !data?.length) return [];
    return data.map(dbToPublic);
  } catch {
    return [];
  }
}

/**
 * Returns slug strings of all published destinations.
 * Used by generateStaticParams to extend the static slug list.
 */
export async function listPublishedSlugs() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('destinations')
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

/** Strip undefined fields so Supabase doesn't write null over existing data. */
function sanitise(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined)
  );
}
