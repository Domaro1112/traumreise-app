// Destination-aware search URLs for Ferienpark / Ferienhaus providers.
// supportsOccupancy: false for all providers — no stable URL-param standard exists.
// Links point to search/category pages, not homepages. When AWIN affiliate IDs are
// configured in the admin panel, /go/[provider] uses these URLs as the AWIN ued= value.

const HOLIDAY_PARK_URL_CONFIG = {
  centerparcs: {
    supportsOccupancy: false,
    buildSearchUrl: (dest) => {
      const c = (dest.country || '').toLowerCase();
      if (c.includes('deutschland'))                       return 'https://www.centerparcs.de/ferienparks/deutschland/';
      if (c.includes('nieder') || c.includes('holland'))  return 'https://www.centerparcs.de/ferienparks/niederlande/';
      if (c.includes('belgi'))                             return 'https://www.centerparcs.de/ferienparks/belgien/';
      if (c.includes('frankreich') || c.includes('franc')) return 'https://www.centerparcs.de/ferienparks/frankreich/';
      return 'https://www.centerparcs.de/ferienparks/';
    },
  },
  landal: {
    supportsOccupancy: false,
    buildSearchUrl: (dest) => {
      const c = (dest.country || '').toLowerCase();
      if (c.includes('deutschland'))                       return 'https://www.landal.de/ferienparks/deutschland/';
      if (c.includes('nieder') || c.includes('holland'))  return 'https://www.landal.de/ferienparks/niederlande/';
      if (c.includes('österreich') || c.includes('austria')) return 'https://www.landal.de/ferienparks/oesterreich/';
      if (c.includes('belgi'))                             return 'https://www.landal.de/ferienparks/belgien/';
      return 'https://www.landal.de/ferienparks/';
    },
  },
  roompot: {
    supportsOccupancy: false,
    buildSearchUrl: () => 'https://www.roompot.de/ferienwohnungen/',
  },
  topparken: {
    supportsOccupancy: false,
    buildSearchUrl: () => 'https://www.topparken.de/',
  },
  sunparks: {
    supportsOccupancy: false,
    buildSearchUrl: () => 'https://www.sunparks.de/ferienparks/',
  },
  eurocamp: {
    supportsOccupancy: false,
    buildSearchUrl: (dest) => {
      const d = dest.destination || '';
      if (d) return `https://www.eurocamp.de/campingplatze/?s=${encodeURIComponent(d)}`;
      return 'https://www.eurocamp.de/campingplatze/';
    },
  },
  novasol: {
    supportsOccupancy: false,
    buildSearchUrl: (dest) => {
      const d = dest.destination || '';
      if (d) return `https://www.novasol.de/ferienhaeuser?destination=${encodeURIComponent(d)}`;
      return 'https://www.novasol.de/ferienhaeuser';
    },
  },
};

/**
 * Builds search/category page URLs for all holiday park providers.
 * Adults/children are accepted for future use (currently not applied to any provider).
 *
 * @param {object} dest — destination object with .destination, .country
 * @param {{ adults?: number, children?: number, childAge?: number|null, ci?: string, co?: string }} opts
 * @returns {{ [providerKey: string]: string }} — URL per provider key
 */
export function buildHolidayParkUrls(dest, { adults = 2, children = 0, childAge = null, ci = null, co = null } = {}) {
  if (!dest) return {};
  const urls = {};
  for (const [key, config] of Object.entries(HOLIDAY_PARK_URL_CONFIG)) {
    try {
      urls[key] = config.supportsOccupancy
        ? config.buildSearchUrl(dest, { adults, children, childAge, ci, co })
        : config.buildSearchUrl(dest);
    } catch {
      urls[key] = null;
    }
  }
  return urls;
}
