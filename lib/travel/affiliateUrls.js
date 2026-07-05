// Shared affiliate URL building logic — used by HomeTravelWizard and the result page.
import { buildHolidayParkUrls } from './holidayParkUrls.js';

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
// adults / children default to 2 / 0 (main funnel). Pass 1 / 1 for alleinerziehende.
// childAge: mapped integer age (e.g. 8) used by providers that support it; null = omit.
// isSingleParent: only true for 'single_parent' funnel sessions — gates holidayParkUrls.
export function buildAffiliateUrls(dest, { budget, season, duration, adults = 2, children = 0, childAge = null, isSingleParent = false }) {
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

  // Child-age suffixes for providers that support the parameter
  const bookingAgeParam      = children > 0 && childAge !== null ? `&age=${childAge}` : '';
  const check24AgeParam      = children > 0 && childAge !== null ? `&kinderalter=${childAge}` : '';
  const expediaChildAgeParam = children > 0 && childAge !== null ? `&child-ages=${childAge}` : '';
  const hcChildAgeParam      = children > 0 && childAge !== null ? `&age_1=${childAge}` : '';

  const encodedCity    = encodeURIComponent(searchCity);
  const encodedDestHC  = encodeURIComponent(dest.destination);
  const encodedDestExp = encodeURIComponent(`${dest.destination}, ${dest.country || ''}`);

  const trivagoUrl     = `https://www.trivago.de/?sQuery=${encodedCity}&aDateRange%5Barr%5D=${ci}&aDateRange%5Bdep%5D=${co}&adults=${adults}&children=${children}&iRoomType=7`;
  const bookingUrl     = `https://www.booking.com/searchresults.de.html?ss=${encodedCity}&checkin=${ci}&checkout=${co}&group_adults=${adults}&group_children=${children}&no_rooms=1${bookingAgeParam}&order=${BOOKING_ORDER[apiBudget] ?? 'popularity'}&lang=de`;
  const skyUrl = iata
    ? `https://www.skyscanner.de/fluge-nach/${iata}/?adults=${adults}&children=${children}&cabinclass=${skyClass}`
    : `https://www.skyscanner.de/fluge-nach/${toSlug(searchCity)}/?adults=${adults}&children=${children}&cabinclass=${skyClass}`;
  const gygUrl         = `https://www.getyourguide.de/s/?q=${encodeURIComponent(dest.destination)}&date_from=${ci}&date_to=${co}`;
  const check24Url     = `https://www.check24.de/urlaub/ergebnisse/?reiseziel=${encodeURIComponent(dest.destination)}&abreise=${ci}&rueckreise=${co}&erwachsene=${adults}&kinder=${children}${check24AgeParam}`;
  const expediaUrl     = `https://www.expedia.de/Hotel-Search?destination=${encodedDestExp}&adults=${adults}&children=${children}&rooms=1&startDate=${ci}&endDate=${co}${expediaChildAgeParam}`;
  const holidaycheckUrl = `https://www.holidaycheck.de/hotel-search?countryId=0&terms=${encodedDestHC}&adults=${adults}&kids=${children}${hcChildAgeParam}`;

  // holidayParkUrls are only generated for single-parent funnel sessions.
  // Regular travel sessions always receive null here so FerienparkSection never renders.
  const holidayParkUrls = isSingleParent
    ? buildHolidayParkUrls(dest, { adults, children, childAge, ci, co })
    : null;

  return { trivagoUrl, bookingUrl, skyUrl, gygUrl, check24Url, expediaUrl, holidaycheckUrl, holidayParkUrls };
}
