/**
 * Central JSON-LD / Schema.org builder helpers for ApeAround.
 *
 * Design rules:
 * - Every builder returns null when required fields are missing (never outputs an empty schema).
 * - All string values are cleaned (null / undefined / empty string → omitted).
 * - Relative image paths are converted to absolute URLs using SITE_URL.
 * - No invented data: prices, ratings, availability, offers are intentionally absent.
 * - Builders are pure functions — no side effects, no DB calls.
 */

import { SITE_URL } from '@/lib/site-config';

export const SITE_NAME = 'ApeAround';
export const SITE_LOGO = `${SITE_URL}/images/logo/reisemonkey-logo.png`;

// ─── Internal utilities ────────────────────────────────────────────────────────

/** Remove null / undefined / empty-string values from a plain value. */
function clean(v) {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'string' && v.trim() === '') return undefined;
  return v;
}

/** Convert a relative or absolute path to a full URL. Returns undefined if falsy. */
function absUrl(path) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Omit undefined keys from an object so the JSON-LD stays clean. */
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
}

// ─── Validation ────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = {
  WebPage:       ['name', 'url'],
  BlogPosting:   ['headline'],
  Article:       ['headline'],
  FAQPage:       ['mainEntity'],
  BreadcrumbList:['itemListElement'],
  Organization:  ['name', 'url'],
  WebSite:       ['name', 'url'],
  TouristDestination: ['name', 'url'],
  CollectionPage:['name', 'url'],
  ProfilePage:   ['name'],
};

/**
 * Validates a JSON-LD object structurally.
 * Returns { valid: boolean, errors: string[] }.
 */
export function validateJsonLd(jsonLd) {
  if (!jsonLd || typeof jsonLd !== 'object') {
    return { valid: false, errors: ['Not an object'] };
  }

  const errors = [];

  if (!jsonLd['@context']) errors.push('Missing @context');

  const type = jsonLd['@type'];
  const graph = jsonLd['@graph'];

  if (!type && !graph) {
    errors.push('Missing @type or @graph');
  }

  const required = type ? (REQUIRED_FIELDS[type] ?? []) : [];
  for (const field of required) {
    const v = jsonLd[field];
    if (!v || (Array.isArray(v) && v.length === 0)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Organization ──────────────────────────────────────────────────────────────

export function buildOrganizationJsonLd() {
  return {
    '@context':   'https://schema.org',
    '@type':      'Organization',
    '@id':        `${SITE_URL}/#organization`,
    name:         SITE_NAME,
    url:          SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url:     SITE_LOGO,
    },
    description:
      'KI-gestützte Reiseberatungsplattform — persönliche Reiseempfehlungen für Hotels, Flüge, Mietwagen und Aktivitäten. Kostenlos & ohne Anmeldung.',
    sameAs: [SITE_URL],
  };
}

// ─── WebSite ───────────────────────────────────────────────────────────────────

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':      `${SITE_URL}/#website`,
    name:       SITE_NAME,
    url:        SITE_URL,
    description:
      'Persönliche Reiseempfehlungen durch KI. Kostenlos & sofort verfügbar.',
    inLanguage: 'de-DE',
    publisher:  { '@id': `${SITE_URL}/#organization` },
  };
}

// ─── WebPage ───────────────────────────────────────────────────────────────────

/**
 * @param {{ title, description, url, image, breadcrumbs }} opts
 * breadcrumbs: Array<{ name, url }>
 */
export function buildWebPageJsonLd({ title, description, url, image, breadcrumbs } = {}) {
  const pageUrl = clean(url);
  const name    = clean(title);
  if (!pageUrl || !name) return null;

  return compact({
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    '@id':        `${pageUrl}#webpage`,
    url:          pageUrl,
    name,
    description:  clean(description),
    inLanguage:   'de-DE',
    isPartOf:     { '@id': `${SITE_URL}/#website` },
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: absUrl(image) } : undefined,
    breadcrumb:   breadcrumbs?.length ? buildBreadcrumbJsonLd(breadcrumbs) : undefined,
  });
}

// ─── BreadcrumbList ─────────────────────────────────────────────────────────────

/**
 * @param {Array<{ name: string, url: string }>} items
 */
export function buildBreadcrumbJsonLd(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const clean_items = items.filter(i => i?.name && i?.url);
  if (clean_items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: clean_items.map((item, i) => ({
      '@type':  'ListItem',
      position: i + 1,
      name:     item.name,
      item:     item.url,
    })),
  };
}

// ─── Article ───────────────────────────────────────────────────────────────────

/**
 * @param {{ title, description, url, image, authorName, datePublished, dateModified, keywords }} opts
 */
export function buildArticleJsonLd({
  title, description, url, image,
  authorName, datePublished, dateModified, keywords,
} = {}) {
  const headline = clean(title);
  const pageUrl  = clean(url);
  if (!headline || !pageUrl) return null;

  const publisher = {
    '@type': 'Organization',
    name:    SITE_NAME,
    url:     SITE_URL,
    logo:    { '@type': 'ImageObject', url: SITE_LOGO },
  };

  return compact({
    '@context':    'https://schema.org',
    '@type':       'Article',
    '@id':         `${pageUrl}#article`,
    headline,
    description:   clean(description),
    url:           pageUrl,
    inLanguage:    'de-DE',
    publisher,
    author:        authorName ? { '@type': 'Person', name: authorName } : publisher,
    image:         image ? { '@type': 'ImageObject', url: absUrl(image) } : undefined,
    datePublished: clean(datePublished),
    dateModified:  clean(dateModified),
    keywords:      keywords
      ? (Array.isArray(keywords) ? keywords.join(', ') : keywords)
      : undefined,
  });
}

// ─── BlogPosting ───────────────────────────────────────────────────────────────

export function buildBlogPostingJsonLd(opts = {}) {
  const article = buildArticleJsonLd(opts);
  if (!article) return null;
  return { ...article, '@type': 'BlogPosting' };
}

// ─── FAQPage ───────────────────────────────────────────────────────────────────

/**
 * @param {Array<{ question: string, answer: string }>} faqItems
 * @param {string} [url]   Optional page URL for @id
 */
export function buildFAQPageJsonLd(faqItems, url) {
  if (!Array.isArray(faqItems) || faqItems.length === 0) return null;
  const valid = faqItems.filter(i => i?.question?.trim() && i?.answer?.trim());
  if (valid.length === 0) return null;

  return compact({
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    '@id':      url ? `${url}#faq` : undefined,
    mainEntity: valid.map(item => ({
      '@type': 'Question',
      name:    item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  });
}

// ─── TouristDestination ────────────────────────────────────────────────────────

/**
 * @param {{ name, description, url, image, country, region }} opts
 */
export function buildTravelDestinationJsonLd({ name, description, url, image, country, region } = {}) {
  const destName = clean(name);
  const pageUrl  = clean(url);
  if (!destName || !pageUrl) return null;

  const obj = compact({
    '@context':   'https://schema.org',
    '@type':      'TouristDestination',
    '@id':        `${pageUrl}#destination`,
    name:         destName,
    url:          pageUrl,
    description:  clean(description),
    inLanguage:   'de-DE',
    image:        image ? { '@type': 'ImageObject', url: absUrl(image) } : undefined,
  });

  if (country) {
    obj.containedInPlace = compact({
      '@type': 'Country',
      name:    country,
      containedInPlace: region ? { '@type': 'Place', name: region } : undefined,
    });
  }

  return obj;
}

// ─── CollectionPage ────────────────────────────────────────────────────────────

/**
 * @param {{ title, description, url }} opts
 */
export function buildCollectionPageJsonLd({ title, description, url } = {}) {
  const pageUrl = clean(url);
  const name    = clean(title);
  if (!pageUrl || !name) return null;

  return compact({
    '@context':  'https://schema.org',
    '@type':     'CollectionPage',
    '@id':       `${pageUrl}#collectionpage`,
    url:         pageUrl,
    name,
    description: clean(description),
    inLanguage:  'de-DE',
    isPartOf:    { '@id': `${SITE_URL}/#website` },
    publisher:   { '@id': `${SITE_URL}/#organization` },
  });
}
