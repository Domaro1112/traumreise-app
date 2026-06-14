// Shared helpers — no 'server-only', runs in both client and server contexts.
import { calcSeoScoreDetail } from '@/lib/blog-scores';

const WORDS_PER_MIN = 200;

// ── ID/slug helper ─────────────────────────────────────────────────────────────
function toId(str) {
  return String(str)
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── 1. TOC generation ─────────────────────────────────────────────────────────

/**
 * Generate a tableOfContents array from a contentSections array.
 *
 * Supports the heading/title/label patterns Claude typically produces.
 * Returns an array of { id: string, label: string } objects.
 * Duplicate IDs are deduplicated with a numeric suffix (-2, -3, …).
 */
export function generateTocFromSections(sections) {
  if (!Array.isArray(sections) || !sections.length) return [];

  const seen = new Map();
  const toc = [];

  for (const section of sections) {
    // Accept multiple naming conventions
    const rawLabel =
      section.heading ?? section.title ?? section.label ?? '';
    if (!rawLabel || typeof rawLabel !== 'string') continue;

    const label = rawLabel.trim();
    const baseId = section.id ? toId(section.id) : toId(label);
    if (!baseId) continue;

    // Deduplicate
    let id = baseId;
    if (seen.has(baseId)) {
      const n = seen.get(baseId) + 1;
      seen.set(baseId, n);
      id = `${baseId}-${n}`;
    } else {
      seen.set(baseId, 1);
    }

    toc.push({ id, label });
  }

  return toc;
}

// ── 2. Reading time ───────────────────────────────────────────────────────────

function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate reading time from the editor's form state (f).
 * Reads: f.excerpt, f.content_sections (JSON string), f.faq (JSON string).
 * Returns a string like "6 Min. Lesezeit" (minimum 1 minute).
 */
export function calcReadingTime(f) {
  let words = 0;

  words += countWords(f?.excerpt);

  try {
    const sections = JSON.parse(f?.content_sections || '[]');
    if (Array.isArray(sections)) {
      for (const s of sections) {
        words += countWords(s.content);
        words += countWords(s.heading);
        words += countWords(s.title);
        if (Array.isArray(s.highlights)) {
          for (const h of s.highlights) {
            words += countWords(typeof h === 'string' ? h : h?.text ?? '');
          }
        }
      }
    }
  } catch {}

  try {
    const faq = JSON.parse(f?.faq || '[]');
    if (Array.isArray(faq)) {
      for (const q of faq) {
        words += countWords(q.answer);
      }
    }
  } catch {}

  const minutes = Math.max(1, Math.round(words / WORDS_PER_MIN));
  return `${minutes} Min. Lesezeit`;
}

// ── 3. SEO score ──────────────────────────────────────────────────────────────

/**
 * Normaliser wrapper around the canonical calcSeoScoreDetail() from lib/blog-scores.
 *
 * Accepts the editor's form state (f) where arrays are stored as JSON strings,
 * plus an optional extraData object supplying fields not tracked in the form
 * (key_takeaways, internal_links).
 *
 * Returns the same { score, checks } shape so BlogSeoScore.jsx needs no changes
 * beyond receiving extraData through a new prop.
 */
export function calcSeoScore(f, extraData = {}) {
  function parseJson(str, fallback = []) {
    try { return JSON.parse(str || '[]'); } catch { return fallback; }
  }

  // Normalise form state: JSON strings → parsed arrays, tags string → array
  const article = {
    title:           f?.title           ?? '',
    slug:            f?.slug            ?? '',
    excerpt:         f?.excerpt         ?? '',
    seo_title:       f?.seo_title       ?? '',
    seo_description: f?.seo_description ?? '',
    category:        f?.category        ?? '',
    destination:     f?.destination     ?? '',
    country:         f?.country         ?? '',
    author:          f?.author          ?? '',
    date:            f?.date            ?? '',
    reading_time:    f?.reading_time    ?? '',
    hero_image_url:  f?.hero_image_url  ?? '',
    cover_image_url: f?.cover_image_url ?? '',
    // JSON string fields → parsed arrays
    content_sections: typeof f?.content_sections === 'string'
      ? parseJson(f.content_sections)  : (f?.content_sections  ?? []),
    faq: typeof f?.faq === 'string'
      ? parseJson(f.faq)               : (f?.faq               ?? []),
    // Tags: comma-separated string → array
    tags: Array.isArray(f?.tags)
      ? f.tags
      : (f?.tags ?? '').split(',').map(t => t.trim()).filter(Boolean),
    // key_takeaways: prefer live form state (JSON string), fall back to saved DB value
    key_takeaways: (() => {
      const fVal = f?.key_takeaways;
      if (typeof fVal === 'string' && fVal.trim()) return parseJson(fVal);
      if (Array.isArray(fVal)) return fVal;
      return extraData?.key_takeaways ?? [];
    })(),
    internal_links: extraData?.internal_links ?? [],
  };

  return calcSeoScoreDetail(article);
}

// ── 4. Export JSON builder ────────────────────────────────────────────────────

/**
 * Build the export JSON object from the editor's form state (f) and
 * any extra fields from initialData (related_articles, key_takeaways).
 * Produces the same camelCase format that validateBlogImport() accepts.
 */
export function buildExportJson(f, initialData) {
  function parseJson(str, fallback = []) {
    try { return JSON.parse(str || '[]'); } catch { return fallback; }
  }

  return {
    title:          (f.title ?? '').trim(),
    slug:           (f.slug  ?? '').trim(),
    excerpt:        (f.excerpt ?? '').trim(),
    category:       f.category ?? '',
    tags:           (f.tags ?? '').split(',').map(t => t.trim()).filter(Boolean),
    author:         (f.author ?? '').trim(),
    status:         f.status ?? 'draft',
    featured:       f.featured ?? false,
    readingTime:    (f.reading_time ?? '').trim(),
    date:           f.date ?? '',
    destination:    (f.destination ?? '').trim(),
    country:        (f.country ?? '').trim(),
    seoTitle:       (f.seo_title ?? '').trim(),
    seoDescription: (f.seo_description ?? '').trim(),
    canonicalUrl:   (f.canonical_url ?? '').trim(),
    coverImageUrl:  (f.cover_image_url ?? '').trim(),
    heroImageUrl:   (f.hero_image_url ?? '').trim(),
    tableOfContents: parseJson(f.table_of_contents),
    contentSections: parseJson(f.content_sections),
    faq:             parseJson(f.faq),
    // Gallery images from editor state
    galleryImages: (f.gallery_items ?? []).map((item, i) => ({
      url:      item.url,
      fileName: item.url.split('/').pop() ?? `gallery-${String(i + 1).padStart(2, '0')}.jpg`,
      alt:      item.alt ?? '',
      title:    item.title ?? '',
      caption:  item.caption ?? '',
      order:    i,
    })),
    // These aren't in the editor form but may be in initialData
    relatedDestinations: initialData?.related_articles ?? [],
    keyTakeaways:        initialData?.key_takeaways    ?? [],
  };
}
