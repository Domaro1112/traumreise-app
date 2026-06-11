/**
 * Affiliate-Konfiguration für Reisemonkey.
 *
 * URLs werden immer serverseitig erzeugt (via /api/travel-finder/affiliate-click).
 * Der Client nutzt diese Datei nur für Display-Daten (Name, Farbe, Label).
 */

// ── Provider definitions ──────────────────────────────────────────────────────
// buildUrl(searchQuery, destination) is called SERVER-SIDE only.
// searchQuery  = clean English search term (from affiliateSearchIntent or fallback)
// destination  = { name, country, region, affiliateSearchIntent }

export const AFFILIATE_PROVIDERS = {
  booking: {
    name:    'Booking.com',
    label:   'Hotels ansehen',
    color:   '#003580',
    bgColor: '#EEF3FB',
    // Combine name + country for the best hotel search match
    buildUrl: (searchQuery, destination) => {
      const q = destination?.country
        ? `${searchQuery}, ${destination.country}`
        : searchQuery;
      return `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(q)}&lang=de&selected_currency=EUR`;
    },
  },
  trivago: {
    name:    'trivago',
    label:   'Hotels vergleichen',
    color:   '#007DB8',
    bgColor: '#EEF7FB',
    buildUrl: (searchQuery) =>
      `https://www.trivago.de/?query=${encodeURIComponent(searchQuery)}&iPathCombination=am`,
  },
  skyscanner: {
    name:    'Skyscanner',
    label:   'Flüge & Hotels',
    color:   '#0770E3',
    bgColor: '#EEF4FF',
    buildUrl: (searchQuery) =>
      `https://www.skyscanner.de/hotels/search?place=${encodeURIComponent(searchQuery)}&locale=de-DE`,
  },
  getyourguide: {
    name:    'GetYourGuide',
    label:   'Aktivitäten',
    color:   '#FF5533',
    bgColor: '#FFF3F0',
    buildUrl: (searchQuery) =>
      `https://www.getyourguide.de/s/?q=${encodeURIComponent(searchQuery)}`,
  },
  check24: {
    name:    'CHECK24',
    label:   'Pauschalreisen',
    color:   '#E2001A',
    bgColor: '#FEF2F2',
    buildUrl: (searchQuery) =>
      `https://urlaub.check24.de/?where=${encodeURIComponent(searchQuery)}`,
  },
  // Not in RESULT_CARD_PROVIDERS — used only for car-rental clicks from TravelResultCard
  check24_car_rental: {
    name:    'CHECK24 Mietwagen',
    label:   'Mietwagen vergleichen',
    color:   '#E2001A',
    bgColor: '#FEF2F2',
    buildUrl: (_searchQuery, destination) => {
      const base = 'https://mietwagen.check24.de/';
      const loc  = destination?.name;
      if (!loc) return base;
      return `${base}?${new URLSearchParams({ where: loc }).toString()}`;
    },
  },
};

// Ordered list used for result cards
export const RESULT_CARD_PROVIDERS = ['booking', 'trivago', 'skyscanner', 'getyourguide', 'check24'];

// ── Search query builder ──────────────────────────────────────────────────────
/**
 * Derives a clean search query from a destination object.
 * Priority: affiliateSearchIntent (English, AI-generated) → name → name + country
 *
 * @param {{ affiliateSearchIntent?: string, name?: string, country?: string }} destination
 * @returns {string}
 */
export function buildDestinationSearchQuery(destination) {
  if (!destination) return 'travel';
  const { affiliateSearchIntent, name, country } = destination;
  if (affiliateSearchIntent && affiliateSearchIntent.trim()) {
    return affiliateSearchIntent.trim();
  }
  if (name && country) return `${name}, ${country}`;
  return name || country || 'travel';
}

// ── Server-side URL builder ───────────────────────────────────────────────────
/**
 * Builds the provider redirect URL for a specific destination.
 * Called SERVER-SIDE only (API route).
 *
 * @param {string} providerId
 * @param {{ affiliateSearchIntent?, name?, country?, region? }} destination
 * @returns {string|null}
 */
export function buildProviderUrl(providerId, destination) {
  const provider = AFFILIATE_PROVIDERS[providerId];
  if (!provider) return null;
  const searchQuery = buildDestinationSearchQuery(destination);
  return provider.buildUrl(searchQuery, destination);
}

// ── Client display list ───────────────────────────────────────────────────────
/**
 * Returns provider display metadata (name, colors, label) without any URLs.
 * Safe to use on the client – no URL logic here.
 *
 * @returns {{ id, name, label, color, bgColor }[]}
 */
export function getProviderDisplayList() {
  return RESULT_CARD_PROVIDERS.map(id => ({
    id,
    name:    AFFILIATE_PROVIDERS[id].name,
    label:   AFFILIATE_PROVIDERS[id].label,
    color:   AFFILIATE_PROVIDERS[id].color,
    bgColor: AFFILIATE_PROVIDERS[id].bgColor,
  }));
}

// ── Legacy helpers (server-side only) ────────────────────────────────────────
/**
 * Returns all providers with pre-built URLs for a given destination.
 * @deprecated Use buildProviderUrl() per provider in server routes.
 * @param {{ affiliateSearchIntent?, name?, country? }} destination
 */
export function getAllProviders(destination) {
  const searchQuery = buildDestinationSearchQuery(
    typeof destination === 'string'
      ? { affiliateSearchIntent: destination }
      : destination
  );
  return RESULT_CARD_PROVIDERS.map(id => ({
    id,
    ...AFFILIATE_PROVIDERS[id],
    url: AFFILIATE_PROVIDERS[id].buildUrl(searchQuery, destination),
  }));
}
