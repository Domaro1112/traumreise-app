// Runs in both client and server contexts — no 'server-only' import.

const ALIAS_MAP = {
  shortDescription:      'short_description',
  longDescription:       'long_description',
  aiSummary:             'ai_summary',
  bestTravelTime:        'best_travel_time',
  idealDuration:         'ideal_duration',
  travelType:            'travel_type',
  quickFacts:            'quick_facts',
  insiderTips:           'insider_tips',
  heroImage:             'hero_image',
  galleryImages:         'gallery_images',
  openGraphImage:        'open_graph_image',
  canonicalUrl:          'canonical_url',
  seoTitle:              'seo_title',
  seoDescription:        'seo_description',
  affiliateSearchIntent: 'affiliate_search_intent',
  carRentalRecommended:  'car_rental_recommended',
  llmoEntities:          'llmo_entities',
  llmoAnswerBlock:       'llmo_answer_block',
  llmoQuickAnswer:       'llmo_quick_answer',
  similarDestinations:   'similar_destinations',
};

const REQUIRED = [
  'name', 'slug', 'country',
  'short_description', 'long_description', 'ai_summary',
  'quick_facts', 'best_travel_time', 'ideal_duration',
  'highlights', 'insider_tips', 'faq',
  'seo_title', 'seo_description', 'affiliate_search_intent',
  'llmo_entities', 'llmo_answer_block', 'llmo_quick_answer',
];

const QF_REQUIRED = ['currency', 'language', 'flightTime', 'timezone', 'visa', 'bestMonths'];

function normalizeKeys(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[ALIAS_MAP[k] ?? k] = v;
  }
  return out;
}

function trimTop(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === 'string' ? v.trim() : v;
  }
  return out;
}

function normalizeStringArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => (typeof item === 'string' ? item : item?.text ?? ''));
}

/**
 * Parse raw JSON string or object, normalize camelCase aliases to snake_case,
 * validate required fields + structural rules.
 *
 * Returns { valid, errors, warnings, normalized }
 *   normalized = snake_case DB-ready object (null when invalid)
 */
export function validateDestinationImport(rawJson) {
  const errors = [];
  const warnings = [];

  // 1. Parse
  let parsed;
  if (typeof rawJson === 'string') {
    try {
      parsed = JSON.parse(rawJson);
    } catch (e) {
      return { valid: false, errors: [`Ungültiges JSON: ${e.message}`], warnings: [], normalized: null };
    }
  } else {
    parsed = rawJson;
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, errors: ['JSON muss ein Objekt sein, kein Array.'], warnings: [], normalized: null };
  }

  // 2. Normalize keys + trim strings
  let d = trimTop(normalizeKeys(parsed));

  // 3. Parse quick_facts if it came as a JSON string
  if (typeof d.quick_facts === 'string') {
    try { d.quick_facts = JSON.parse(d.quick_facts); } catch { /* leave as-is, will fail below */ }
  }

  // 4. Required fields
  for (const field of REQUIRED) {
    const v = d[field];
    if (v === undefined || v === null || v === '') {
      errors.push(`Pflichtfeld fehlt: "${field}"`);
    }
  }

  // 5. Slug format
  if (d.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) {
    errors.push('Slug: nur Kleinbuchstaben, Ziffern und Bindestriche erlaubt (z. B. "kap-verde").');
  }

  // 6. quick_facts sub-keys
  if (d.quick_facts && typeof d.quick_facts === 'object') {
    for (const f of QF_REQUIRED) {
      if (!d.quick_facts[f]) errors.push(`quick_facts.${f} fehlt.`);
    }
  }

  // 7. highlights
  if (Array.isArray(d.highlights)) {
    if (d.highlights.length < 4)
      errors.push(`highlights: mindestens 4 Einträge erforderlich (aktuell: ${d.highlights.length}).`);
    d.highlights = normalizeStringArray(d.highlights);
  }

  // 8. insider_tips
  if (Array.isArray(d.insider_tips)) {
    if (d.insider_tips.length < 3)
      errors.push(`insider_tips: mindestens 3 Einträge erforderlich (aktuell: ${d.insider_tips.length}).`);
    d.insider_tips = normalizeStringArray(d.insider_tips);
  }

  // 9. faq
  if (Array.isArray(d.faq)) {
    if (d.faq.length < 5)
      errors.push(`faq: mindestens 5 Einträge erforderlich (aktuell: ${d.faq.length}).`);
    d.faq.forEach((item, i) => {
      if (!item?.question || !item?.answer)
        errors.push(`faq[${i}]: "question" und "answer" sind Pflichtfelder.`);
    });
  }

  // 10. llmo_entities must be array
  if (d.llmo_entities && !Array.isArray(d.llmo_entities)) {
    errors.push('llmo_entities muss ein Array von Strings sein.');
  }

  // ── Warnings (non-blocking) ────────────────────────────────────────────────
  if (!d.hero_image)        warnings.push('Hero-Bild fehlt (hero_image).');
  if (!d.open_graph_image)  warnings.push('OpenGraph-Bild fehlt (open_graph_image).');
  if (!d.canonical_url)     warnings.push('Canonical URL fehlt (canonical_url).');
  if (Array.isArray(d.faq) && d.faq.length < 10)
    warnings.push(`Weniger als 10 FAQ vorhanden (aktuell: ${d.faq.length}).`);
  if (!d.similar_destinations || (Array.isArray(d.similar_destinations) && d.similar_destinations.length === 0))
    warnings.push('Keine ähnlichen Ziele verlinkt (similar_destinations).');

  if (errors.length > 0) return { valid: false, errors, warnings, normalized: null };
  return { valid: true, errors: [], warnings, normalized: d };
}
