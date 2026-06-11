/**
 * Zentrales Affiliate-Konfigurationsmodul für Reisemonkey.
 * Alle Partner-URLs werden hier gebaut – niemals hart kodiert.
 * Echte Affiliate-IDs können später pro Provider in buildUrl() eingebettet werden.
 */

export const AFFILIATE_PROVIDERS = {
  booking: {
    name: 'Booking.com',
    label: 'Hotels ansehen',
    color: '#003580',
    bgColor: '#EEF3FB',
    buildUrl: (q, country) => {
      const search = country ? `${q}, ${country}` : q;
      return `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(search)}&lang=de&selected_currency=EUR`;
    },
  },
  trivago: {
    name: 'trivago',
    label: 'Hotels vergleichen',
    color: '#007DB8',
    bgColor: '#EEF7FB',
    buildUrl: (q) =>
      `https://www.trivago.de/?query=${encodeURIComponent(q)}&iPathCombination=am`,
  },
  skyscanner: {
    name: 'Skyscanner',
    label: 'Flüge & Hotels',
    color: '#0770E3',
    bgColor: '#EEF4FF',
    buildUrl: (q) =>
      `https://www.skyscanner.de/hotels/search?place=${encodeURIComponent(q)}&locale=de-DE`,
  },
  getyourguide: {
    name: 'GetYourGuide',
    label: 'Aktivitäten',
    color: '#FF5533',
    bgColor: '#FFF3F0',
    buildUrl: (q) =>
      `https://www.getyourguide.de/s/?q=${encodeURIComponent(q)}`,
  },
  check24: {
    name: 'CHECK24',
    label: 'Pauschalreisen',
    color: '#E2001A',
    bgColor: '#FEF2F2',
    buildUrl: (q) =>
      `https://urlaub.check24.de/?where=${encodeURIComponent(q)}`,
  },
  holidaycheck: {
    name: 'HolidayCheck',
    label: 'Bewertungen lesen',
    color: '#FF6B00',
    bgColor: '#FFF7EE',
    buildUrl: (q) =>
      `https://www.holidaycheck.de/search#q=${encodeURIComponent(q)}`,
  },
};

// The 5 providers displayed in every result card — order matches PartnerTrustSection
const RESULT_CARD_PROVIDERS = ['booking', 'trivago', 'skyscanner', 'getyourguide', 'check24'];

/**
 * Alle 5 Haupt-Anbieter für eine Ergebniskarte.
 * @param {string} searchIntent  – englischer Suchbegriff aus der KI
 * @param {string} country       – Zielland
 */
export function getAllProviders(searchIntent, country) {
  const q = searchIntent || country || 'travel';
  return RESULT_CARD_PROVIDERS.map(id => ({
    id,
    ...AFFILIATE_PROVIDERS[id],
    url: AFFILIATE_PROVIDERS[id].buildUrl(q, country),
  }));
}

/**
 * Rückwärtskompatibel: nur Booking + Skyscanner.
 * @deprecated Bitte getAllProviders() verwenden.
 */
export function getPrimaryProviders(searchIntent, country) {
  const q = searchIntent || country || 'travel';
  return ['booking', 'skyscanner'].map(id => ({
    id,
    ...AFFILIATE_PROVIDERS[id],
    url: AFFILIATE_PROVIDERS[id].buildUrl(q, country),
  }));
}
