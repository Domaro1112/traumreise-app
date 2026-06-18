// Helper functions for inspiration items.
// Provider URL building and image normalization are re-exported from lib/homepage-suggestions.js
// to avoid duplicating that logic across the two CMS modules.

import {
  buildProviderTargetUrl,
  normalizeImageUrl,
  isValidImageUrl,
} from '@/lib/homepage-suggestions';

export { buildProviderTargetUrl, normalizeImageUrl, isValidImageUrl };

export const INSPIRATION_CATEGORIES = [
  'Pauschalreisen',
  'Hotels',
  'Strandurlaub',
  'Städtereisen',
  'Natur & Nationalparks',
  'Familienurlaub',
  'Roadtrips',
  'Aktivitäten',
  'Luxus',
  'Wellness',
  'Romantik',
  'Abenteuer',
];

export const PROVIDER_LABELS = {
  booking:           'Booking.com',
  expedia:           'Expedia',
  check24_hotel:     'CHECK24 Hotel',
  check24_urlaub:    'CHECK24 Urlaub',
  check24_mietwagen: 'CHECK24 Mietwagen',
  trivago:           'Trivago',
  holidaycheck:      'HolidayCheck',
  getyourguide:      'GetYourGuide',
};

export function getCtaLabel(item) {
  const { provider_key, category } = item;
  if (provider_key === 'getyourguide') return 'Aktivitäten entdecken';
  if (provider_key === 'check24_mietwagen') return 'Mietwagen suchen';
  if (provider_key === 'check24_urlaub') return 'Angebot ansehen';
  if (category === 'Pauschalreisen') return 'Angebot ansehen';
  if (category === 'Roadtrips') return 'Reise entdecken';
  if (category === 'Aktivitäten') return 'Aktivitäten entdecken';
  if (category === 'Luxus') return 'Luxushotel suchen';
  if (category === 'Wellness') return 'Wellnesshotel suchen';
  return 'Hotels vergleichen';
}

export function buildInspirationHref(item) {
  if (!item) return '/';

  const { link_mode, affiliate_target_url, provider_key, search_query, href } = item;

  if (link_mode === 'internal') {
    return href || '/';
  }

  if (link_mode === 'funnel') {
    return '/#reiseplaner';
  }

  // affiliate (default)
  const targetUrl = affiliate_target_url || buildProviderTargetUrl(provider_key, search_query);
  if (!targetUrl) return '/#reiseplaner';

  const provider = provider_key || 'booking';
  return `/go/${provider}?url=${encodeURIComponent(targetUrl)}`;
}

export const FALLBACK_INSPIRATION_ITEMS = [
  {
    id: 'fallback-santorini',
    title: 'Santorini Pauschalreise',
    slug: 'santorini-pauschalreise',
    subtitle: 'Weißgetünchte Häuser, Vulkan-Panorama und Ägäisches Blau',
    category: 'Pauschalreisen',
    destination: 'Santorini',
    country: 'Griechenland',
    badge: 'Traumziel',
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    image_alt: 'Santorini mit weißen Häusern und blauem Meer',
    provider_key: 'check24_urlaub',
    search_query: 'Santorini Griechenland Pauschalreise',
    link_mode: 'affiliate',
    sort_order: 0,
    is_active: true,
    is_featured: true,
    open_in_new_tab: true,
  },
  {
    id: 'fallback-bali',
    title: 'Bali Strandurlaub',
    slug: 'bali-strandurlaub',
    subtitle: 'Tropische Strände, Reisterrassen und spirituelle Tempel-Kultur',
    category: 'Strandurlaub',
    destination: 'Bali',
    country: 'Indonesien',
    badge: 'Beliebt',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    image_alt: 'Balinesischer Tempel mit Reisterrassen',
    provider_key: 'booking',
    search_query: 'Bali Indonesien Hotel Strand',
    link_mode: 'affiliate',
    sort_order: 1,
    is_active: true,
    is_featured: false,
    open_in_new_tab: true,
  },
  {
    id: 'fallback-kanada',
    title: 'Kanada Nationalpark-Rundreise',
    slug: 'kanada-nationalpark-rundreise',
    subtitle: 'Banff, Jasper und die atemberaubenden Rocky Mountains',
    category: 'Natur & Nationalparks',
    destination: 'Banff / Jasper',
    country: 'Kanada',
    badge: 'Geheimtipp',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    image_alt: 'Türkisfarbener Bergsee in den kanadischen Rockies',
    provider_key: 'expedia',
    search_query: 'Kanada Rocky Mountains Rundreise',
    link_mode: 'affiliate',
    sort_order: 2,
    is_active: true,
    is_featured: false,
    open_in_new_tab: true,
  },
  {
    id: 'fallback-tokio',
    title: 'Tokio Städtereise',
    slug: 'tokio-staedtereise',
    subtitle: 'Neon-Lichter, Sushi und der Kontrast aus Tradition und Moderne',
    category: 'Städtereisen',
    destination: 'Tokio',
    country: 'Japan',
    badge: 'Trending',
    image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    image_alt: 'Tokio Skyline bei Nacht',
    provider_key: 'booking',
    search_query: 'Tokio Japan Hotel Städtereise',
    link_mode: 'affiliate',
    sort_order: 3,
    is_active: true,
    is_featured: false,
    open_in_new_tab: true,
  },
  {
    id: 'fallback-mallorca',
    title: 'Mallorca Familienurlaub',
    slug: 'mallorca-familienurlaub',
    subtitle: 'Sonne, Meer und familienfreundliche Resorts',
    category: 'Familienurlaub',
    destination: 'Mallorca',
    country: 'Spanien',
    badge: 'Beliebt',
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80',
    image_alt: 'Mallorca Strand mit Palmen',
    provider_key: 'check24_hotel',
    search_query: 'Mallorca Spanien Familienhotel',
    link_mode: 'affiliate',
    sort_order: 4,
    is_active: true,
    is_featured: false,
    open_in_new_tab: true,
  },
  {
    id: 'fallback-norwegen',
    title: 'Norwegen Roadtrip',
    slug: 'norwegen-roadtrip',
    subtitle: 'Fjorde, Mitternachtssonne und unvergessliche Naturkulissen',
    category: 'Roadtrips',
    destination: 'Westfjorde / Lofoten',
    country: 'Norwegen',
    badge: 'Geheimtipp',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    image_alt: 'Norwegischer Fjord mit Bergpanorama',
    provider_key: 'expedia',
    search_query: 'Norwegen Fjorde Mietwagen Roadtrip',
    link_mode: 'affiliate',
    sort_order: 5,
    is_active: true,
    is_featured: false,
    open_in_new_tab: true,
  },
  {
    id: 'fallback-dubai',
    title: 'Dubai Luxusreise',
    slug: 'dubai-luxusreise',
    subtitle: 'Burj Khalifa, Wüsten-Safaris und Weltklasse-Hotels',
    category: 'Luxus',
    destination: 'Dubai',
    country: 'Vereinigte Arabische Emirate',
    badge: 'Luxus',
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    image_alt: 'Dubai Skyline mit Burj Khalifa bei Nacht',
    provider_key: 'booking',
    search_query: 'Dubai Luxushotel Resort',
    link_mode: 'affiliate',
    sort_order: 6,
    is_active: true,
    is_featured: false,
    open_in_new_tab: true,
  },
  {
    id: 'fallback-island',
    title: 'Island Naturabenteuer',
    slug: 'island-naturabenteuer',
    subtitle: 'Geysire, Nordlichter, Gletscher und Vulkan-Landschaften',
    category: 'Natur & Nationalparks',
    destination: 'Reykjavik / Ring Road',
    country: 'Island',
    badge: 'Trending',
    image_url: 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=800&q=80',
    image_alt: 'Nordlichter über isländischer Berglandschaft',
    provider_key: 'expedia',
    search_query: 'Island Rundreise Hotel Nordlichter',
    link_mode: 'affiliate',
    sort_order: 7,
    is_active: true,
    is_featured: false,
    open_in_new_tab: true,
  },
];
