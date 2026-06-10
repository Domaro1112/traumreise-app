/**
 * Zentrales Affiliate-Konfigurationsmodul für Reisemonkey.
 * Alle Partner-URLs werden hier gebaut – niemals hart kodiert.
 */

export const AFFILIATE_PROVIDERS = {
  booking: {
    name: 'Booking.com',
    label: 'Hotels ansehen',
    color: '#003580',
    bgColor: '#EEF3FB',
    buildUrl: (searchIntent, country) => {
      const q = country ? `${searchIntent}, ${country}` : searchIntent;
      return `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(q)}&lang=de&selected_currency=EUR`;
    },
  },
  skyscanner: {
    name: 'Skyscanner',
    label: 'Flüge suchen',
    color: '#0770E3',
    bgColor: '#EEF4FF',
    buildUrl: (searchIntent) =>
      `https://www.skyscanner.de/hotels/search?place=${encodeURIComponent(searchIntent)}&locale=de-DE`,
  },
  check24: {
    name: 'CHECK24',
    label: 'Pauschalreisen',
    color: '#E2001A',
    bgColor: '#FEF2F2',
    buildUrl: (searchIntent) =>
      `https://urlaub.check24.de/?where=${encodeURIComponent(searchIntent)}`,
  },
  holidaycheck: {
    name: 'HolidayCheck',
    label: 'Bewertungen lesen',
    color: '#FF6B00',
    bgColor: '#FFF7EE',
    buildUrl: (searchIntent) =>
      `https://www.holidaycheck.de/search#q=${encodeURIComponent(searchIntent)}`,
  },
  getyourguide: {
    name: 'GetYourGuide',
    label: 'Aktivitäten buchen',
    color: '#FF5533',
    bgColor: '#FFF3F0',
    buildUrl: (searchIntent) =>
      `https://www.getyourguide.de/s/?q=${encodeURIComponent(searchIntent)}`,
  },
};

/**
 * Gibt die zwei primären CTAs pro Reisekarte zurück.
 * @param {string} searchIntent  – englischer Suchbegriff aus der KI
 * @param {string} country       – Zielland
 */
export function getPrimaryProviders(searchIntent, country) {
  const q = searchIntent || country || 'travel';
  return [
    {
      id: 'booking',
      ...AFFILIATE_PROVIDERS.booking,
      url: AFFILIATE_PROVIDERS.booking.buildUrl(q, country),
    },
    {
      id: 'skyscanner',
      ...AFFILIATE_PROVIDERS.skyscanner,
      url: AFFILIATE_PROVIDERS.skyscanner.buildUrl(q),
    },
  ];
}
