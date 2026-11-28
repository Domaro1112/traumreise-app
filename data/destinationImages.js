// ─────────────────────────────────────────────────────────────────────────────
// Destination hero images — 5-step cascade:
//   1. Exact destination key
//   2. Country key
//   3. Country → Region mapping
//   4. Interest / Vibe → safe region override (prevents wrong mood fallback)
//   5. Passed fallbackUrl (mood / vibe image)
//
// All keys are compact-lowercase (normalizeDestinationKey output with spaces/hyphens removed).
// ─────────────────────────────────────────────────────────────────────────────

// Nur eigene Bilder (public/images/) – keine Bilder mehr von fremden Servern.
const REGION_IMAGES = {
  alps:         '/images/reisearten/natur.jpg',
  mediterranean:'/images/jahreszeiten/sommer.jpg',
  atlantic:     '/images/reisearten/staedte.jpg',
  nordics:      '/images/jahreszeiten/winter.jpg',
  tropical:     '/images/reisearten/luxus.jpg',
  beach:        '/images/reisearten/strand.jpg',
  cityeurope:   '/images/reisearten/staedte.jpg',
  cityusa:      '/images/reisearten/staedte.jpg',
  cityasia:     '/images/reisearten/staedte.jpg',
  island:       '/images/reisearten/luxus.jpg',
  desert:       '/images/reisearten/abenteuer.jpg',
  nature:       '/images/reisearten/natur.jpg',
  mountains:    '/images/jahreszeiten/herbst.jpg',
};

// ── Step 3b: Country → Region (used when country is not in DESTINATION_IMAGES) ─
const COUNTRY_TO_REGION = {
  // DACH
  schweiz: 'alps',      switzerland: 'alps',
  oesterreich: 'alps',  austria: 'alps',
  deutschland: 'cityeurope', germany: 'cityeurope',
  liechtenstein: 'alps',

  // South/Mediterranean Europe
  italien: 'mediterranean', italy: 'mediterranean',
  spanien: 'mediterranean', spain: 'mediterranean',
  griechenland: 'mediterranean', greece: 'mediterranean',
  kroatien: 'mediterranean', croatia: 'mediterranean',
  slowenien: 'alps',     slovenia: 'alps',
  montenegroregion: 'mediterranean',
  albanien: 'mediterranean', albania: 'mediterranean',
  zypern: 'mediterranean', cyprus: 'mediterranean',
  malta: 'mediterranean',

  // France
  frankreich: 'mediterranean', france: 'mediterranean',

  // Iberia & Atlantic Islands
  portugal: 'atlantic',

  // North/West Europe
  grossbritannien: 'cityeurope', unitedkingdom: 'cityeurope',
  england: 'cityeurope',
  schottland: 'nature', scotland: 'nature',
  irland: 'nature', ireland: 'nature',
  niederlande: 'cityeurope', netherlands: 'cityeurope', holland: 'cityeurope',
  belgien: 'cityeurope', belgium: 'cityeurope',

  // Scandinavia
  norwegen: 'nordics', norway: 'nordics',
  schweden: 'nordics', sweden: 'nordics',
  finnland: 'nordics', finland: 'nordics',
  daenemark: 'nordics', denmark: 'nordics',
  island: 'nordics', iceland: 'nordics',

  // CEE
  tschechien: 'cityeurope', czechrepublic: 'cityeurope',
  ungarn: 'cityeurope', hungary: 'cityeurope',
  slowakei: 'cityeurope', slovakia: 'cityeurope',
  polen: 'cityeurope', poland: 'cityeurope',
  rumaenien: 'nature', romania: 'nature',
  bulgarien: 'mediterranean', bulgaria: 'mediterranean',

  // Turkey / Middle East
  tuerkei: 'mediterranean', turkey: 'mediterranean',
  uae: 'desert', arabischeemir: 'desert',
  oman: 'desert',
  jordanien: 'desert', jordan: 'desert',
  aegypten: 'desert', egypt: 'desert',
  israel: 'desert',

  // Africa
  marokko: 'desert', morocco: 'desert',
  tunesien: 'mediterranean', tunisia: 'mediterranean',
  suedafrika: 'nature', southafrica: 'nature',
  tansania: 'nature', tanzania: 'nature',
  kenia: 'nature', kenya: 'nature',
  ruanda: 'nature', rwanda: 'nature',

  // Americas
  usa: 'cityusa', unitedstates: 'cityusa',
  kanada: 'mountains', canada: 'mountains',
  mexiko: 'tropical', mexico: 'tropical',
  costarica: 'tropical',
  brasilien: 'tropical', brazil: 'tropical',
  kolumbien: 'tropical', colombia: 'tropical',
  peru: 'mountains',
  argentinien: 'nature', argentina: 'nature',
  chile: 'nature',

  // Asia
  japan: 'cityasia',
  china: 'cityasia',
  suedkorea: 'cityasia', southkorea: 'cityasia', korea: 'cityasia',
  thailand: 'tropical',
  vietnam: 'tropical',
  indonesien: 'tropical', indonesia: 'tropical',
  philippinen: 'tropical', philippines: 'tropical',
  singapur: 'cityasia', singapore: 'cityasia',
  malaysia: 'tropical',
  indien: 'cityasia', india: 'cityasia',
  srilanka: 'tropical',
  nepal: 'mountains',
  cambodia: 'tropical', kambodscha: 'tropical',
  myanmar: 'tropical',

  // Oceania
  australien: 'nature', australia: 'nature',
  neuseeland: 'nature', newzealand: 'nature',

  // Indian Ocean islands
  malediven: 'island', maldives: 'island',
  seychellen: 'island', seychelles: 'island',
  mauritius: 'island',
  reunion: 'island',
};

// ── Step 4: Interest/Vibe → safe region (last resort before mood fallback) ────
// Prevents wrong mood images: e.g. 'city' interest → Amsterdam, NOT US skyline
const INTEREST_TO_REGION = {
  city:      'cityeurope',  // European city is the safe default, not US skyline
  food:      'cityeurope',
  culture:   'cityeurope',
  beach:     'beach',
  mountains: 'mountains',
  adventure: 'nature',
  wellness:  'nature',
  nature:    'nature',
  relax:     'beach',
  party:     'cityeurope',
};

// ── Destination lookup table ──────────────────────────────────────────────────
// Früher Unsplash-Fotos je Reiseziel. Die Ergebnisseite nutzt jetzt das Titelbild
// des Reiseziels aus dem Admin (falls vorhanden), sonst die Bilder je Region oben.
export const DESTINATION_IMAGES = {};

// ── Normalizer ────────────────────────────────────────────────────────────────

export function normalizeDestinationKey(value) {
  if (!value || typeof value !== 'string') return '';

  let s = value.toLowerCase().trim();

  // German umlauts BEFORE NFD normalization (they're precomposed in imported data)
  s = s
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');

  // Strip all remaining diacritical combining marks (é→e, ñ→n, ø→o, etc.)
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Keep only a-z, 0-9, spaces, hyphens
  s = s.replace(/[^a-z0-9\s-]/g, '').trim();

  return s;
}

// ── Mediterranean guard terms ─────────────────────────────────────────────────
// Any compound country string containing one of these must never fall through
// to cityeurope (Amsterdam) — always use Mediterranean or island fallback.
const MEDITERRANEAN_GUARD_TERMS = new Set([
  'kreta', 'crete', 'griechenland', 'greece', 'greek',
  'santorini', 'mykonos', 'rhodos', 'rhodes', 'korfu', 'corfu',
  'athen', 'athens', 'heraklion', 'iraklio', 'iraklion',
  'chania', 'rethymno', 'zakynthos', 'zante', 'paros', 'naxos',
  'kefalonia', 'zypern', 'cyprus', 'malta',
  'sizilien', 'sicily', 'sardinien', 'sardinia',
  'mallorca', 'ibiza', 'menorca',
  'malediven', 'maldives', 'seychellen', 'seychelles',
  'bali', 'phuket', 'mediterranean',
]);

function hasMediterraneanTerm(raw) {
  if (!raw) return false;
  const n = normalizeDestinationKey(raw).replace(/[\s-]+/g, '');
  for (const term of MEDITERRANEAN_GUARD_TERMS) {
    if (n.includes(term)) return true;
  }
  return false;
}

// ── Main lookup ───────────────────────────────────────────────────────────────

export function getDestinationImage(destination, fallbackUrl, country = null, options = {}) {
  let selectedKey = null;
  let selectedSource = null;

  function lookup(raw) {
    if (!raw) return null;
    const base = normalizeDestinationKey(raw);
    const compact = base.replace(/[\s-]+/g, '');
    const hyphenated = base.replace(/\s+/g, '-');
    for (const key of [compact, base, hyphenated]) {
      if (key && DESTINATION_IMAGES[key]) return { img: DESTINATION_IMAGES[key], key };
    }
    return null;
  }

  // Splits on em dash, en dash, hyphen, comma, slash and tries each part
  // in reverse order (most-specific last segment first, e.g. "Kreta" from "Griechenland – Kreta")
  function lookupWithSplit(raw) {
    const direct = lookup(raw);
    if (direct) return direct;
    if (!raw) return null;
    const parts = raw.split(/\s*[–—\-,\/]\s*/).map(p => p.trim()).filter(Boolean);
    if (parts.length <= 1) return null;
    for (let i = parts.length - 1; i >= 0; i--) {
      const result = lookup(parts[i]);
      if (result) return result;
    }
    return null;
  }

  function getRegionKey(raw) {
    if (!raw) return null;
    // Try each split part (most specific last)
    const parts = raw.split(/\s*[–—\-,\/]\s*/).map(p => p.trim()).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) {
      const compact = normalizeDestinationKey(parts[i]).replace(/[\s-]+/g, '');
      const region = COUNTRY_TO_REGION[compact];
      if (region) return region;
    }
    return null;
  }

  // 1. Exact destination lookup (with compound splitting)
  const destResult = lookupWithSplit(destination);
  if (destResult) {
    selectedKey = destResult.key;
    selectedSource = 'destination';
    if (process.env.NODE_ENV !== 'production') {
      console.info('[image-lookup]', { destination, country, selectedKey, selectedSource });
    }
    return destResult.img;
  }

  // 2. Country lookup (with compound splitting)
  const countryResult = country ? lookupWithSplit(country) : null;
  if (countryResult) {
    selectedKey = countryResult.key;
    selectedSource = 'country';
    if (process.env.NODE_ENV !== 'production') {
      console.info('[image-lookup]', { destination, country, selectedKey, selectedSource });
    }
    return countryResult.img;
  }

  // 3. Country → Region cascade
  const region = getRegionKey(country) || getRegionKey(destination);
  if (region && REGION_IMAGES[region]) {
    selectedKey = region;
    selectedSource = 'region';
    if (process.env.NODE_ENV !== 'production') {
      console.info('[image-lookup]', { destination, country, selectedKey, selectedSource });
    }
    return REGION_IMAGES[region];
  }

  // 4. Interest / Vibe override — but Mediterranean guard prevents cityeurope for Greek/island destinations
  const interestKey = options.interest || options.vibe;
  const isMediterranean = hasMediterraneanTerm(destination) || hasMediterraneanTerm(country);
  if (interestKey) {
    let interestRegion = INTEREST_TO_REGION[interestKey];
    if (isMediterranean && interestRegion === 'cityeurope') {
      interestRegion = 'mediterranean';
    }
    if (interestRegion && REGION_IMAGES[interestRegion]) {
      selectedKey = interestRegion;
      selectedSource = `interest(${interestKey})${isMediterranean ? '+med-guard' : ''}`;
      if (process.env.NODE_ENV !== 'production') {
        console.info('[image-lookup]', { destination, country, selectedKey, selectedSource });
      }
      return REGION_IMAGES[interestRegion];
    }
  }

  // 5. Mediterranean guard on final fallback
  if (isMediterranean) {
    selectedKey = 'mediterranean';
    selectedSource = 'med-guard-final';
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[image-lookup] Mediterranean guard triggered for unmatched destination', {
        destination, country, selectedKey, selectedSource,
      });
    }
    return REGION_IMAGES.mediterranean;
  }

  // 6. Dev warning, then passed fallback
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[image-lookup] No image found — using mood fallback', {
      destination,
      country,
      normalizedDestination: normalizeDestinationKey(destination || ''),
      normalizedCountry: normalizeDestinationKey(country || ''),
      selectedKey,
      selectedSource,
    });
  }

  return fallbackUrl || REGION_IMAGES.nature;
}
