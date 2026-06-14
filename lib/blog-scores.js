/**
 * Canonical blog article scoring.
 * Single source of truth – all score displays (list AND editor) derive from here.
 *
 * Both functions accept a normalised article object with parsed JS arrays
 * (not JSON strings). Use the normaliser in lib/blog-content-utils.js when
 * passing editor form state (which stores arrays as JSON strings).
 */

// ─── SEO Score ────────────────────────────────────────────────────────────────

/**
 * Calculates the SEO score and returns both the numeric score AND a detailed
 * checks array suitable for the editor's check-list UI.
 *
 * Scoring model:
 *   ok    → full weight points
 *   warn  → 0 points  (needs improvement, shown yellow in editor)
 *   error → 0 points  (missing / broken, shown red in editor)
 *
 * Using warn/error both at 0 keeps the score identical to a simple binary
 * pass/fail, while still giving the editor three meaningful colour states.
 *
 * @param {object} article  Normalised article (parsed arrays, snake_case fields)
 * @returns {{ score: number, checks: Array }}
 */
export function calcSeoScoreDetail(article) {
  if (!article) return { score: 0, checks: [] };

  const cs      = Array.isArray(article.content_sections) ? article.content_sections : [];
  const il      = Array.isArray(article.internal_links)   ? article.internal_links   : [];
  const faq     = Array.isArray(article.faq)              ? article.faq              : [];
  const kt      = Array.isArray(article.key_takeaways)    ? article.key_takeaways    : [];
  const bodyLen = cs.reduce((acc, s) => {
    const text = s?.content ?? s?.body ?? '';
    return acc + (typeof text === 'string' ? text.length : 0);
  }, 0);
  const stLen   = (article.seo_title      ?? '').length;
  const sdLen   = (article.seo_description ?? '').length;
  const excLen  = (article.excerpt         ?? '').length;

  // Each item: key, label, status ('ok'|'warn'|'error'), hint, weight
  const items = [
    // ── SEO title ──────────────────────────────────────────────────────────
    {
      key:    'seo_title_present',
      label:  stLen ? 'SEO-Titel vorhanden' : 'SEO-Titel',
      status: stLen ? 'ok' : 'error',
      hint:   'SEO-Titel fehlt – Artikel-Titel wird als Fallback verwendet.',
      weight: 10,
    },
    {
      key:    'seo_title_len',
      label:  stLen
        ? `SEO-Titel Länge (${stLen} Zeichen)${stLen >= 30 && stLen <= 60 ? ' ✓' : ''}`
        : 'SEO-Titel Länge',
      status: !stLen ? 'error' : (stLen >= 30 && stLen <= 60 ? 'ok' : 'warn'),
      hint:   stLen < 30 ? 'Zu kurz. Empfohlen: 30–60 Zeichen.' : 'Zu lang. Empfohlen: max. 60 Zeichen.',
      weight: 5,
    },
    // ── Meta description ───────────────────────────────────────────────────
    {
      key:    'seo_desc_present',
      label:  sdLen ? 'Meta-Beschreibung vorhanden' : 'Meta-Beschreibung',
      status: sdLen ? 'ok' : 'error',
      hint:   'Meta-Beschreibung fehlt.',
      weight: 10,
    },
    {
      key:    'seo_desc_len',
      label:  sdLen
        ? `Meta-Beschreibung Länge (${sdLen} Zeichen)${sdLen >= 100 && sdLen <= 160 ? ' ✓' : ''}`
        : 'Meta-Beschreibung Länge',
      status: !sdLen ? 'error' : (sdLen >= 100 && sdLen <= 160 ? 'ok' : 'warn'),
      hint:   sdLen < 100 ? 'Zu kurz. Empfohlen: 100–160 Zeichen.' : 'Zu lang. Empfohlen: max. 160 Zeichen.',
      weight: 5,
    },
    // ── Slug ───────────────────────────────────────────────────────────────
    {
      key:    'slug',
      label:  article.slug ? `Slug: /${article.slug}` : 'URL-Slug',
      status: (article.slug && /^[a-z0-9-]+$/.test(article.slug)) ? 'ok' : 'error',
      hint:   !article.slug ? 'Slug fehlt.' : 'Slug enthält ungültige Zeichen (nur a-z, 0-9, - erlaubt).',
      weight: 5,
    },
    // ── Title ──────────────────────────────────────────────────────────────
    {
      key:    'title',
      label:  article.title ? 'Seitentitel (H1) vorhanden' : 'Seitentitel (H1)',
      status: article.title ? 'ok' : 'error',
      hint:   'Kein Seitentitel vorhanden.',
      weight: 8,
    },
    // ── Excerpt ────────────────────────────────────────────────────────────
    {
      key:    'excerpt',
      label:  excLen >= 100
        ? 'Excerpt vorhanden ✓'
        : excLen > 0 ? `Excerpt (${excLen} Zeichen)` : 'Kurzbeschreibung (Excerpt)',
      status: excLen >= 100 ? 'ok' : excLen > 0 ? 'warn' : 'error',
      hint:   excLen > 0
        ? `Zu kurz (${excLen} Zeichen). Empfohlen: mind. 100 Zeichen.`
        : 'Excerpt fehlt – wichtig für Listen und Social Sharing.',
      weight: 7,
    },
    // ── Hero / cover image ─────────────────────────────────────────────────
    {
      key:    'image',
      label:  (article.hero_image_url || article.cover_image_url) ? 'Bild vorhanden' : 'Hero- / Cover-Bild',
      status: (article.hero_image_url || article.cover_image_url) ? 'ok' : 'error',
      hint:   'Kein Cover- oder Hero-Bild vorhanden.',
      weight: 8,
    },
    // ── Content sections ───────────────────────────────────────────────────
    {
      key:    'sections',
      label:  cs.length >= 2 ? `${cs.length} Inhaltsbereiche ✓` : `Inhaltsbereiche (${cs.length})`,
      status: cs.length >= 2 ? 'ok' : cs.length === 1 ? 'warn' : 'error',
      hint:   'Mindestens 2 Inhaltsbereiche erforderlich.',
      weight: 8,
    },
    // ── Content body length ────────────────────────────────────────────────
    {
      key:    'body_len',
      label:  bodyLen >= 500
        ? `Textlänge (${bodyLen} Zeichen) ✓`
        : `Textlänge (${bodyLen} Zeichen)`,
      status: bodyLen >= 500 ? 'ok' : bodyLen > 0 ? 'warn' : 'error',
      hint:   'Zu kurz. Empfohlen: mind. 500 Zeichen Fließtext.',
      weight: 7,
    },
    // ── Internal links ─────────────────────────────────────────────────────
    {
      key:    'internal_links',
      label:  il.length > 0 ? `Interne Links (${il.length})` : 'Interne Links',
      status: il.length > 0 ? 'ok' : 'warn',
      hint:   'Keine internen Links angegeben. Verbessert Crawlability.',
      weight: 8,
    },
    // ── FAQ ────────────────────────────────────────────────────────────────
    {
      key:    'faq',
      label:  faq.length > 0 ? `FAQ (${faq.length} Fragen)` : 'FAQ',
      status: faq.length > 0 ? 'ok' : 'warn',
      hint:   'FAQ fehlt – verbessert Rich Snippets in der Suche.',
      weight: 8,
    },
    // ── Key takeaways ──────────────────────────────────────────────────────
    {
      key:    'key_takeaways',
      label:  kt.length > 0 ? `Key Takeaways (${kt.length})` : 'Key Takeaways',
      status: kt.length > 0 ? 'ok' : 'warn',
      hint:   'Keine Key Takeaways vorhanden.',
      weight: 7,
    },
    // ── Date ───────────────────────────────────────────────────────────────
    {
      key:    'date',
      label:  article.date ? `Datum: ${article.date}` : 'Veröffentlichungsdatum',
      status: article.date ? 'ok' : 'warn',
      hint:   'Kein Datum gesetzt.',
      weight: 4,
    },
    // ── Reading time ───────────────────────────────────────────────────────
    {
      key:    'reading_time',
      label:  article.reading_time ? `Lesezeit: ${article.reading_time}` : 'Lesezeit',
      status: article.reading_time ? 'ok' : 'warn',
      hint:   'Keine Lesezeit angegeben.',
      weight: 5,
    },
  ];
  // Total weight: 10+5+10+5+5+8+7+8+8+7+8+8+7+4+5 = 105

  const totalWeight = items.reduce((a, c) => a + c.weight, 0);
  // Only 'ok' items earn points (warn + error = 0 pts each, but different UX colour)
  const earned = items.reduce((a, c) => a + (c.status === 'ok' ? c.weight : 0), 0);
  const score  = Math.round((earned / totalWeight) * 100);

  const checks = items.map(({ key, label, status, hint }) => ({
    key,
    label,
    status,
    hint: status === 'ok' ? null : hint,
  }));

  return { score, checks };
}

/**
 * Returns just the SEO score number (0–100).
 * Used by listBlogAdminWithStats and anywhere a plain number is needed.
 */
export function calculateSeoScore(article) {
  return calcSeoScoreDetail(article).score;
}

// ─── LLMO Score ───────────────────────────────────────────────────────────────

/**
 * LLMO (Large Language Model Optimization) score 0–100.
 * Weights sum to exactly 100.
 */
export function calculateLlmoScore(article) {
  if (!article) return 0;

  const cs      = Array.isArray(article.content_sections) ? article.content_sections : [];
  const il      = Array.isArray(article.internal_links)   ? article.internal_links   : [];
  const faq     = Array.isArray(article.faq)              ? article.faq              : [];
  const kt      = Array.isArray(article.key_takeaways)    ? article.key_takeaways    : [];
  const tags    = Array.isArray(article.tags)             ? article.tags             : [];
  const bodyLen = cs.reduce((acc, s) => {
    const text = s?.content ?? s?.body ?? '';
    return acc + (typeof text === 'string' ? text.length : 0);
  }, 0);

  const checks = [
    { pass: (article.title?.length ?? 0) >= 20,                     weight: 8  },
    { pass: (article.excerpt?.length ?? 0) >= 150,                  weight: 8  },
    { pass: cs.length >= 3,                                          weight: 8  },
    { pass: cs.length >= 2 && cs.every(s => !!s?.title),            weight: 7  },
    { pass: faq.length >= 3,                                         weight: 10 },
    { pass: kt.length >= 3,                                          weight: 8  },
    { pass: !!(article.destination || article.country),              weight: 7  },
    { pass: !!article.category,                                      weight: 5  },
    { pass: bodyLen >= 800,                                          weight: 8  },
    { pass: il.length >= 2,                                          weight: 7  },
    { pass: tags.length >= 3,                                        weight: 6  },
    { pass: !!article.date,                                          weight: 5  },
    { pass: !!article.author,                                        weight: 5  },
    { pass: kt.length > 0,                                           weight: 8  },
  ];
  // 8+8+8+7+10+8+7+5+8+7+6+5+5+8 = 100

  const totalWeight = checks.reduce((a, c) => a + c.weight, 0);
  const earned      = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  return Math.round((earned / totalWeight) * 100);
}

// ─── Badge style helper ───────────────────────────────────────────────────────

/**
 * Returns colour tokens for a score value.
 * @param {number} score 0–100
 * @returns {{ bg: string, color: string, label: string }}
 */
export function scoreBadgeStyle(score) {
  if (score >= 80) return { bg: '#ECFDF5', color: '#059669', label: 'Gut' };
  if (score >= 50) return { bg: '#FEF9C3', color: '#92400E', label: 'Mittel' };
  return               { bg: '#FEF2F2', color: '#DC2626', label: 'Schwach' };
}
