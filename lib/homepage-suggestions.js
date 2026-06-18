// Helper functions and fallback data for homepage travel suggestion cards.

export function normalizeImageUrl(value) {
  if (!value || typeof value !== 'string') return '';

  let url = value.trim();

  // Strip wrong Vercel origin prefixes (entered by copy-paste from browser address bar)
  url = url.replace(/^https?:\/\/traumreise-app\.vercel\.app\/traumreise-app\/public/i, '');
  url = url.replace(/^https?:\/\/traumreise-app\.vercel\.app\/public/i, '');
  url = url.replace(/^https?:\/\/traumreise-app\.vercel\.app/i, '');

  // Strip leading /public — Next.js serves public/ at root, /public/... is never correct
  url = url.replace(/^\/public/i, '');

  return url;
}

export function isValidImageUrl(value) {
  if (!value || typeof value !== 'string') return false;

  const trimmed = normalizeImageUrl(value);

  // Allow any root-relative path starting with /images/ or /
  if (trimmed.startsWith('/')) return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const FALLBACK_SUGGESTIONS = [
  {
    id: 'bali',
    title: 'Bali',
    country: 'Indonesien',
    badge: 'Beliebt',
    description: 'Entspannung, Kultur & tropische Strände',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    image_alt: 'Bali, Indonesien',
    sort_order: 0,
    is_active: true,
    provider_key: 'booking',
    search_query: 'Bali Indonesien',
    link_mode: 'affiliate',
    open_in_new_tab: true,
  },
  {
    id: 'santorini',
    title: 'Santorini',
    country: 'Griechenland',
    badge: 'Traumziel',
    description: 'Romantik, Sonnenuntergänge & mediterranes Flair',
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
    image_alt: 'Santorini, Griechenland',
    sort_order: 1,
    is_active: true,
    provider_key: 'booking',
    search_query: 'Santorini Griechenland',
    link_mode: 'affiliate',
    open_in_new_tab: true,
  },
  {
    id: 'banff',
    title: 'Banff',
    country: 'Kanada',
    badge: 'Geheimtipp',
    description: 'Atemberaubende Natur & Abenteuer pur',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    image_alt: 'Banff, Kanada',
    sort_order: 2,
    is_active: true,
    provider_key: 'expedia',
    search_query: 'Kanada Rundreise',
    link_mode: 'affiliate',
    open_in_new_tab: true,
  },
  {
    id: 'tokio',
    title: 'Tokio',
    country: 'Japan',
    badge: 'Trending',
    description: 'Moderne Kultur & einzigartige Erlebnisse',
    image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    image_alt: 'Tokio, Japan',
    sort_order: 3,
    is_active: true,
    provider_key: 'expedia',
    search_query: 'Tokio Japan',
    link_mode: 'affiliate',
    open_in_new_tab: true,
  },
];

// Booking: searchresults.de.html is the current working search entry point.
// Trivago / HolidayCheck / CHECK24: no confirmed deep-link format — use safe landing pages.
// check24_hotel / check24_urlaub / check24_mietwagen: separate provider keys per CHECK24 sub-area.
const PROVIDER_SEARCH_URLS = {
  booking:           (q) => `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(q)}&lang=de&selected_currency=EUR`,
  expedia:           (q) => `https://www.expedia.de/Hotel-Search?destination=${encodeURIComponent(q)}`,
  getyourguide:      (q) => `https://www.getyourguide.de/s/?q=${encodeURIComponent(q)}`,
  trivago:           ()  => `https://www.trivago.de/`,
  holidaycheck:      ()  => `https://www.holidaycheck.de/`,
  check24:           ()  => `https://urlaub.check24.de/`,
  check24_hotel:     ()  => `https://hotel.check24.de/`,
  check24_urlaub:    ()  => `https://urlaub.check24.de/`,
  check24_mietwagen: ()  => `https://mietwagen.check24.de/`,
};

export function buildProviderTargetUrl(providerKey, searchQuery) {
  if (!providerKey || !searchQuery) return null;
  const builder = PROVIDER_SEARCH_URLS[providerKey];
  if (!builder) return null;
  return builder(searchQuery);
}

export function buildHomepageSuggestionHref(item) {
  if (!item) return '/';

  const { link_mode, affiliate_target_url, provider_key, search_query, href } = item;

  if (link_mode === 'internal') {
    return href || '/';
  }

  if (link_mode === 'funnel') {
    return '/#reiseplaner';
  }

  // link_mode === 'affiliate' (default)
  const targetUrl = affiliate_target_url || buildProviderTargetUrl(provider_key, search_query);
  if (!targetUrl) return '/#reiseplaner';

  const provider = provider_key || 'booking';
  return `/go/${provider}?url=${encodeURIComponent(targetUrl)}`;
}
