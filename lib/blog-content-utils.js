// Shared helpers — no 'server-only', runs in both client and server contexts.

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
 * Calculate a simple SEO score from the editor's form state (f).
 *
 * Returns:
 *   {
 *     score: number,          // 0–100
 *     checks: [{
 *       key: string,
 *       label: string,
 *       status: 'ok' | 'warn' | 'error',
 *       hint: string | null,
 *     }]
 *   }
 *
 * Scoring:
 *   ok   → full points
 *   warn → half points (improvable but not blocking)
 *   error→ 0 points   (missing / broken)
 *
 * Total max = 90 pts → normalised to 0–100.
 */
export function calcSeoScore(f) {
  const checks = [];
  let earned = 0;
  const MAX = 90;

  function add(key, label, status, hint, pts) {
    checks.push({ key, label, status, hint: status === 'ok' ? null : (hint ?? null) });
    earned += status === 'ok' ? pts : status === 'warn' ? Math.floor(pts / 2) : 0;
  }

  // ── SEO title ──────────────────────────────────────────────────────────────
  const stLen = (f.seo_title ?? '').length;
  if (!stLen) {
    add('seo_title_present', 'SEO-Titel', 'error', 'SEO-Titel fehlt – Artikel-Titel wird als Fallback verwendet.', 10);
  } else {
    add('seo_title_present', 'SEO-Titel vorhanden', 'ok', null, 10);
    if (stLen < 45) {
      add('seo_title_len', `SEO-Titel Länge (${stLen} Zeichen)`, 'warn', `Zu kurz. Empfohlen: 45–60 Zeichen.`, 8);
    } else if (stLen > 60) {
      add('seo_title_len', `SEO-Titel Länge (${stLen} Zeichen)`, 'warn', `Zu lang. Empfohlen: max. 60 Zeichen.`, 8);
    } else {
      add('seo_title_len', `SEO-Titel Länge (${stLen} Zeichen) ✓`, 'ok', null, 8);
    }
  }

  // ── SEO description ────────────────────────────────────────────────────────
  const sdLen = (f.seo_description ?? '').length;
  if (!sdLen) {
    add('seo_desc_present', 'Meta-Beschreibung', 'error', 'Meta-Beschreibung fehlt.', 10);
  } else {
    add('seo_desc_present', 'Meta-Beschreibung vorhanden', 'ok', null, 10);
    if (sdLen < 120) {
      add('seo_desc_len', `Meta-Beschreibung Länge (${sdLen} Zeichen)`, 'warn', `Zu kurz. Empfohlen: 120–160 Zeichen.`, 8);
    } else if (sdLen > 160) {
      add('seo_desc_len', `Meta-Beschreibung Länge (${sdLen} Zeichen)`, 'warn', `Zu lang. Empfohlen: max. 160 Zeichen.`, 8);
    } else {
      add('seo_desc_len', `Meta-Beschreibung Länge (${sdLen} Zeichen) ✓`, 'ok', null, 8);
    }
  }

  // ── Slug ──────────────────────────────────────────────────────────────────
  if (!(f.slug ?? '').trim()) {
    add('slug', 'URL-Slug', 'error', 'Slug fehlt.', 5);
  } else {
    add('slug', `Slug: /${f.slug}`, 'ok', null, 5);
  }

  // ── Excerpt ───────────────────────────────────────────────────────────────
  if (!(f.excerpt ?? '').trim()) {
    add('excerpt', 'Kurzbeschreibung (Excerpt)', 'error', 'Excerpt fehlt – wichtig für Listen und Social Sharing.', 8);
  } else {
    add('excerpt', 'Excerpt vorhanden', 'ok', null, 8);
  }

  // ── Bild ──────────────────────────────────────────────────────────────────
  if (!(f.cover_image_url ?? '').trim() && !(f.hero_image_url ?? '').trim()) {
    add('image', 'Bild', 'error', 'Kein Cover- oder Hero-Bild vorhanden.', 8);
  } else {
    add('image', 'Bild vorhanden', 'ok', null, 8);
  }

  // ── Content sections ──────────────────────────────────────────────────────
  let sectionCount = 0;
  try { sectionCount = JSON.parse(f.content_sections || '[]').length; } catch {}
  if (sectionCount >= 3) {
    add('sections', `${sectionCount} Inhaltsbereiche`, 'ok', null, 10);
  } else {
    add('sections', `Inhaltsbereiche (${sectionCount})`, 'warn', `Mindestens 3 Abschnitte empfohlen.`, 10);
  }

  // ── FAQ ───────────────────────────────────────────────────────────────────
  let faqCount = 0;
  try { faqCount = JSON.parse(f.faq || '[]').length; } catch {}
  if (faqCount) {
    add('faq', `FAQ (${faqCount} Fragen)`, 'ok', null, 8);
  } else {
    add('faq', 'FAQ', 'warn', 'FAQ fehlt – verbessert Rich Snippets in der Suche.', 8);
  }

  // ── Kategorie ─────────────────────────────────────────────────────────────
  if ((f.category ?? '').trim()) {
    add('category', `Kategorie: ${f.category}`, 'ok', null, 5);
  } else {
    add('category', 'Kategorie', 'warn', 'Keine Kategorie ausgewählt.', 5);
  }

  // ── Tags ──────────────────────────────────────────────────────────────────
  const tagCount = (f.tags ?? '').split(',').map(t => t.trim()).filter(Boolean).length;
  if (tagCount) {
    add('tags', `Tags (${tagCount})`, 'ok', null, 5);
  } else {
    add('tags', 'Tags', 'warn', 'Keine Tags vergeben.', 5);
  }

  // ── Inhaltsverzeichnis ────────────────────────────────────────────────────
  let tocCount = 0;
  try { tocCount = JSON.parse(f.table_of_contents || '[]').length; } catch {}
  if (tocCount) {
    add('toc', `Inhaltsverzeichnis (${tocCount} Einträge)`, 'ok', null, 5);
  } else {
    add('toc', 'Inhaltsverzeichnis', 'warn', 'Kein Inhaltsverzeichnis vorhanden.', 5);
  }

  const score = Math.min(100, Math.max(0, Math.round((earned / MAX) * 100)));
  return { score, checks };
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
