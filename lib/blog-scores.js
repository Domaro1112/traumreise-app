/**
 * Pure score calculation functions for blog articles.
 * Operate on raw DB rows (snake_case fields).
 * No imports required – safe to use on server and client.
 */

/**
 * Classic SEO score 0–100.
 * Weights sum to 105 before normalization so individual criteria
 * can carry different importance without awkward round numbers.
 */
export function calculateSeoScore(article) {
  if (!article) return 0;

  const cs      = Array.isArray(article.content_sections) ? article.content_sections : [];
  const il      = Array.isArray(article.internal_links)   ? article.internal_links   : [];
  const faq     = Array.isArray(article.faq)              ? article.faq              : [];
  const kt      = Array.isArray(article.key_takeaways)    ? article.key_takeaways    : [];
  const bodyLen = cs.reduce((acc, s) => acc + (s?.body?.length ?? 0), 0);

  const checks = [
    // SEO-title
    { pass: !!article.seo_title,                                                        weight: 10 },
    { pass: (article.seo_title?.length ?? 0) >= 30 && (article.seo_title?.length ?? 0) <= 60, weight: 5 },
    // Meta description
    { pass: !!article.seo_description,                                                  weight: 10 },
    { pass: (article.seo_description?.length ?? 0) >= 100 && (article.seo_description?.length ?? 0) <= 160, weight: 5 },
    // Slug
    { pass: !!article.slug && /^[a-z0-9-]+$/.test(article.slug),                       weight: 5 },
    // Title & excerpt
    { pass: !!article.title,                                                            weight: 8 },
    { pass: (article.excerpt?.length ?? 0) >= 100,                                     weight: 7 },
    // Media
    { pass: !!(article.hero_image_url || article.cover_image_url),                     weight: 8 },
    // Content structure
    { pass: cs.length >= 2,                                                             weight: 8 },
    { pass: bodyLen >= 500,                                                             weight: 7 },
    // Enrichment
    { pass: il.length > 0,                                                             weight: 8 },
    { pass: faq.length > 0,                                                            weight: 8 },
    { pass: kt.length > 0,                                                             weight: 7 },
    // Publication signals
    { pass: !!article.date,                                                             weight: 4 },
    { pass: !!article.reading_time,                                                     weight: 5 },
  ];

  const totalWeight = checks.reduce((a, c) => a + c.weight, 0); // 105
  const earned      = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  return Math.round((earned / totalWeight) * 100);
}

/**
 * LLMO (Large Language Model Optimization) score 0–100.
 * Measures how well an AI system can understand, summarise and recommend
 * this article. Weights sum to exactly 100.
 */
export function calculateLlmoScore(article) {
  if (!article) return 0;

  const cs      = Array.isArray(article.content_sections) ? article.content_sections : [];
  const il      = Array.isArray(article.internal_links)   ? article.internal_links   : [];
  const faq     = Array.isArray(article.faq)              ? article.faq              : [];
  const kt      = Array.isArray(article.key_takeaways)    ? article.key_takeaways    : [];
  const tags    = Array.isArray(article.tags)             ? article.tags             : [];
  const bodyLen = cs.reduce((acc, s) => acc + (s?.body?.length ?? 0), 0);

  const checks = [
    // Clear search intent in title
    { pass: (article.title?.length ?? 0) >= 20,                      weight: 8 },
    // Concise introduction / excerpt
    { pass: (article.excerpt?.length ?? 0) >= 150,                   weight: 8 },
    // Structured sections (min 3 for proper LLM segmentation)
    { pass: cs.length >= 3,                                           weight: 8 },
    // Every section has a heading (LLM reads headings as context)
    { pass: cs.length >= 2 && cs.every(s => !!s?.title),             weight: 7 },
    // FAQ – direct answers to user questions (highest LLMO signal)
    { pass: faq.length >= 3,                                          weight: 10 },
    // Key takeaways – summary / list format LLMs reference heavily
    { pass: kt.length >= 3,                                           weight: 8 },
    // Topic clarity: destination or country named
    { pass: !!(article.destination || article.country),               weight: 7 },
    // Category defined (topical signal)
    { pass: !!article.category,                                       weight: 5 },
    // Sufficient depth (>= 800 chars body)
    { pass: bodyLen >= 800,                                           weight: 8 },
    // Internal links to related topics (semantic graph signal)
    { pass: il.length >= 2,                                           weight: 7 },
    // Semantic tag vocabulary
    { pass: tags.length >= 3,                                         weight: 6 },
    // Publication date present (freshness signal)
    { pass: !!article.date,                                           weight: 5 },
    // Named author (E-E-A-T / trustworthiness)
    { pass: !!article.author,                                         weight: 5 },
    // Structured takeaways list (= direct recommendations LLMs cite)
    { pass: kt.length > 0,                                            weight: 8 },
  ];
  // Weights: 8+8+8+7+10+8+7+5+8+7+6+5+5+8 = 100

  const totalWeight = checks.reduce((a, c) => a + c.weight, 0); // 100
  const earned      = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  return Math.round((earned / totalWeight) * 100);
}

/**
 * Returns the badge colour tokens for a score.
 * @param {number} score 0–100
 * @returns {{ bg: string, color: string, label: string }}
 */
export function scoreBadgeStyle(score) {
  if (score >= 80) return { bg: '#ECFDF5', color: '#059669', label: 'Gut' };
  if (score >= 50) return { bg: '#FEF9C3', color: '#92400E', label: 'Mittel' };
  return               { bg: '#FEF2F2', color: '#DC2626', label: 'Schwach' };
}
