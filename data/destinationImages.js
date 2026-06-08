// Destination-specific hero images from Unsplash (w=1400&q=88 for full-screen quality).
// Keys are compact-lowercase: no spaces, no hyphens, no umlauts (ä→ae, ö→oe, ü→ue, ß→ss), no accents.
// Unknown destinations fall through to moodOptions fallback in getDestinationImage().

export const DESTINATION_IMAGES = {

  // ── Southeast Asia ───────────────────────────────────────────────────────
  bali:        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=88',
  thailand:    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=88',
  phuket:      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1400&q=88',
  kohsamui:    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1400&q=88',
  kosamui:     'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1400&q=88',
  vietnam:     'https://images.unsplash.com/photo-1528127269322-539801943592?w=1400&q=88',
  hoian:       'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=88',
  singapur:    'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1400&q=88',
  singapore:   'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1400&q=88',
  philippinen: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=88',
  palawan:     'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=88',

  // ── East Asia ────────────────────────────────────────────────────────────
  tokio:       'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=88',
  tokyo:       'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=88',
  japan:       'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1400&q=88',
  kyoto:       'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=88',
  osaka:       'https://images.unsplash.com/photo-1565128939181-5dcb7e3ed3fd?w=1400&q=88',
  hongkong:    'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1400&q=88',

  // ── South Asia ───────────────────────────────────────────────────────────
  srilanka:    'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=1400&q=88',
  nepal:       'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=88',
  kathmandu:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=88',

  // ── Indian Ocean ─────────────────────────────────────────────────────────
  malediven:   'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&q=88',
  maldives:    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&q=88',
  seychellen:  'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1400&q=88',
  seychelles:  'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1400&q=88',

  // ── Middle East ──────────────────────────────────────────────────────────
  dubai:       'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=88',
  istanbul:    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1400&q=88',

  // ── Africa ───────────────────────────────────────────────────────────────
  kapstadt:    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=88',
  capetown:    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=88',
  marrakesch:  'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1400&q=88',
  marrakech:   'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1400&q=88',

  // ── Americas ─────────────────────────────────────────────────────────────
  newyork:     'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=88',
  costarica:   'https://images.unsplash.com/photo-1553701879-1f2f0cd30b76?w=1400&q=88',
  cancun:      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1400&q=88',
  mexiko:      'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1400&q=88',
  mexico:      'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1400&q=88',
  peru:        'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1400&q=88',
  machupichu:  'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1400&q=88',

  // ── North Atlantic & Scandinavia ─────────────────────────────────────────
  island:      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1400&q=88',
  iceland:     'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1400&q=88',
  reykjavik:   'https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?w=1400&q=88',
  norwegen:    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=88',
  norway:      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=88',
  schweden:    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=88',
  sweden:      'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=88',
  stockholm:   'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=88',
  kopenhagen:  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1400&q=88',
  copenhagen:  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1400&q=88',

  // ── Iberia & Atlantic Islands ─────────────────────────────────────────────
  lissabon:    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=88',
  lisbon:      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=88',
  portugal:    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=88',
  porto:       'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1400&q=88',
  madeira:     'https://images.unsplash.com/photo-1548623328-7e03f7041c34?w=1400&q=88',
  azoren:      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=88',
  azores:      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=88',
  barcelona:   'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=88',
  madrid:      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1400&q=88',
  mallorca:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=88',
  ibiza:       'https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&q=88',
  teneriffa:   'https://images.unsplash.com/photo-1512100601213-7d87efe40c8a?w=1400&q=88',
  tenerife:    'https://images.unsplash.com/photo-1512100601213-7d87efe40c8a?w=1400&q=88',

  // ── France ───────────────────────────────────────────────────────────────
  paris:       'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&q=88',
  nizza:       'https://images.unsplash.com/photo-1491166617655-4effd3c0c398?w=1400&q=88',
  nice:        'https://images.unsplash.com/photo-1491166617655-4effd3c0c398?w=1400&q=88',

  // ── Italy ────────────────────────────────────────────────────────────────
  rom:         'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88',
  rome:        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88',
  venedig:     'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1400&q=88',
  venice:      'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1400&q=88',
  florenz:     'https://images.unsplash.com/photo-1543429258-ba6f07c6b91b?w=1400&q=88',
  florence:    'https://images.unsplash.com/photo-1543429258-ba6f07c6b91b?w=1400&q=88',
  amalfi:      'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1400&q=88',
  suedtirol:   'https://images.unsplash.com/photo-1467841036291-a1e0e6d44a8b?w=1400&q=88',
  sizilien:    'https://images.unsplash.com/photo-1523365837958-36c9dafd63c8?w=1400&q=88',
  sicily:      'https://images.unsplash.com/photo-1523365837958-36c9dafd63c8?w=1400&q=88',

  // ── UK ───────────────────────────────────────────────────────────────────
  london:      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=88',

  // ── DACH & Benelux ────────────────────────────────────────────────────────
  wien:        'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88',
  vienna:      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88',
  amsterdam:   'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1400&q=88',

  // ── Eastern Europe ────────────────────────────────────────────────────────
  prag:        'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1400&q=88',
  prague:      'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1400&q=88',
  kroatien:    'https://images.unsplash.com/photo-1555990538-97a36e22c7bf?w=1400&q=88',
  croatia:     'https://images.unsplash.com/photo-1555990538-97a36e22c7bf?w=1400&q=88',
  dubrovnik:   'https://images.unsplash.com/photo-1555990538-97a36e22c7bf?w=1400&q=88',
  albanien:    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1400&q=88',
  albania:     'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1400&q=88',

  // ── Greece & Greek Islands ────────────────────────────────────────────────
  santorini:   'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88',
  griechenland:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88',
  greece:      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88',
  kreta:       'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=88',
  crete:       'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=88',
  mykonos:     'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1400&q=88',
  rhodos:      'https://images.unsplash.com/photo-1555392375-3bf9e1bdf6b6?w=1400&q=88',
  rhodes:      'https://images.unsplash.com/photo-1555392375-3bf9e1bdf6b6?w=1400&q=88',

  // ── Canada ────────────────────────────────────────────────────────────────
  banff:       'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=88',
  vancouver:   'https://images.unsplash.com/photo-1559511260-b120a37d8fc9?w=1400&q=88',

};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function normalizeDestinationKey(value) {
  if (!value || typeof value !== 'string') return '';

  let s = value.toLowerCase().trim();

  // German umlauts before Unicode normalization
  s = s
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');

  // Strip all remaining diacritical marks (é → e, ñ → n, etc.)
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Keep only a-z, 0-9, spaces, hyphens
  s = s.replace(/[^a-z0-9\s-]/g, '').trim();

  return s;
}

export function getDestinationImage(destination, fallbackUrl) {
  if (!destination) return fallbackUrl || '';

  const base = normalizeDestinationKey(destination);
  // Compact form: "New York" → "newyork", "Costa Rica" → "costarica"
  const compact = base.replace(/[\s-]+/g, '');
  // Hyphenated form: "New York" → "new-york"
  const hyphenated = base.replace(/\s+/g, '-');

  for (const key of [compact, base, hyphenated]) {
    if (key && DESTINATION_IMAGES[key]) return DESTINATION_IMAGES[key];
  }

  return fallbackUrl || '';
}
