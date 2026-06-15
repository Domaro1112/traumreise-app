// Shared affiliate URL building logic — used by HomeTravelWizard and the result page.

export const BUDGET_MAP = {
  budget:  'low',
  mid:     'mid',
  comfort: 'high',
  luxury:  'high',
  open:    'mid',
};

export const DURATION_MAP = {
  short_trip: 'weekend',
  one_week:   'week',
  two_weeks:  'twoweeks',
  long_trip:  'long',
  flexible:   'week',
};

// Returns check-in / check-out date strings for affiliate links.
// Accepts raw funnel values (e.g. 'one_week', 'flex') or already-mapped API values.
export function getDefaultDates({ season, duration }) {
  const apiDuration = DURATION_MAP[duration] ?? duration;
  const apiSeason   = season === 'flex' ? 'spring' : season;
  const now  = new Date();
  const year = now.getFullYear();
  const nights = { weekend: 4, week: 7, twoweeks: 14, long: 21 }[apiDuration] ?? 7;
  const seasonStart = {
    spring: new Date(year, 3, 15),
    summer: new Date(year, 6, 10),
    autumn: new Date(year, 9, 10),
    winter: new Date(year, 11, 20),
  }[apiSeason] ?? new Date(now.getTime() + 30 * 86400000);
  if (seasonStart < now) seasonStart.setFullYear(year + 1);
  const end = new Date(seasonStart.getTime() + nights * 86400000);
  const fmt = d => d.toISOString().split('T')[0];
  return { ci: fmt(seasonStart), co: fmt(end) };
}

// Builds all affiliate URLs for a single destination.
// budget / season / duration accept raw funnel values or already-mapped API values.
export function buildAffiliateUrls(dest, { budget, season, duration }) {
  const apiBudget  = BUDGET_MAP[budget] ?? budget ?? 'mid';
  const { ci, co } = getDefaultDates({ season, duration });
  const searchCity = dest.skySearch || dest.destination;
  const iata       = (dest.iata || '').toUpperCase().trim();
  const skyClass   = apiBudget === 'high' ? 'business' : 'economy';
  const BOOKING_ORDER = { low: 'price', mid: 'popularity', high: 'class_asc' };
  const toSlug = s =>
    s.toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const trivagoUrl = `https://www.trivago.de/?sQuery=${encodeURIComponent(searchCity)}&aDateRange%5Barr%5D=${ci}&aDateRange%5Bdep%5D=${co}&adults=2&children=0&iRoomType=7`;
  const bookingUrl = `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(searchCity)}&checkin=${ci}&checkout=${co}&group_adults=2&group_children=0&no_rooms=1&order=${BOOKING_ORDER[apiBudget] ?? 'popularity'}&lang=de`;
  const skyUrl = iata
    ? `https://www.skyscanner.de/fluge-nach/${iata}/?adults=2&children=0&cabinclass=${skyClass}`
    : `https://www.skyscanner.de/fluge-nach/${toSlug(searchCity)}/?adults=2&children=0&cabinclass=${skyClass}`;
  const gygUrl     = `https://www.getyourguide.de/s/?q=${encodeURIComponent(dest.destination)}&date_from=${ci}&date_to=${co}`;
  const check24Url = `https://www.check24.de/urlaub/ergebnisse/?reiseziel=${encodeURIComponent(dest.destination)}&abreise=${ci}&rueckreise=${co}&erwachsene=2&kinder=0`;

  return { trivagoUrl, bookingUrl, skyUrl, gygUrl, check24Url };
}
