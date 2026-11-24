// ─────────────────────────────────────────────────────────────────────────────
// Traumreise-Matching – regelbasiert.
//
// Bewertet jedes Ziel aus lib/traumreise/catalog.js anhand der Angaben aus dem
// Reisefinder und liefert dasselbe Ergebnis-Format, das die Ergebnisseite
// (/traumreise/[id]) erwartet:
//   { personality, destinations[3], surprise, packingList, matching }
//
// Gleiche Eingaben führen immer zum gleichen Ergebnis – nachvollziehbar und
// ohne externe Dienste.
// ─────────────────────────────────────────────────────────────────────────────

import { CATALOG } from './catalog.js';

// ── Konstanten ───────────────────────────────────────────────────────────────

// Budget-Obergrenzen p.P. – passend zu den Auswahlkarten im Reisefinder
// (Sparsam bis 500 €, Mittelklasse bis 1.500 €, Komfort bis 5.000 €, Luxus ab 5.000 €).
export const BUDGET_LIMITS = {
  low:    { label: 'Budget',       max: 500 },
  mid:    { label: 'Mittelklasse', max: 1500 },
  high:   { label: 'Komfort',      max: 5000 },
  luxury: { label: 'Luxus',        max: 12000 },
  open:   { label: 'Budget offen', max: null },
};

const NIGHTS = { weekend: 3, week: 7, twoweeks: 14, long: 21 };

// Preisfaktor für die Unterkunft je Budgetstufe
const NIGHT_FACTOR = { low: 0.75, mid: 1, high: 1.8, luxury: 3, open: 1 };

// Stimmungen aus dem Wizard → Katalog-Tags
const MOOD_TAGS = {
  relax: ['relax', 'wellness'], adventure: ['adventure', 'active'], luxury: ['luxury'],
  family: ['family'], romance: ['romance'], culture: ['culture'], nature: ['nature'],
  party: ['party'], beach: ['beach'], wellness: ['wellness', 'relax'], city: ['city'],
  active: ['active', 'adventure'], food: ['food'],
};

// Interessen-Labels (z. B. aus dem Alleinerziehenden-Funnel) → Tags
const INTEREST_TAGS = [
  [/strand|meer|baden/i, 'beach'], [/natur|wandern|outdoor|landleben/i, 'nature'],
  [/kultur|städte|stadt|museum/i, 'culture'], [/familie|kinder/i, 'family'],
  [/entspann|erholung|ruhe/i, 'relax'], [/wellness|spa/i, 'wellness'],
  [/abenteuer|action/i, 'adventure'], [/aktiv|sport/i, 'active'],
  [/romant|paar/i, 'romance'], [/luxus|komfort/i, 'luxury'],
  [/party|nightlife|feiern/i, 'party'], [/kulinar|essen|genuss|wein/i, 'food'],
  [/camping/i, 'nature'],
];

// Freitext-Stichworte → Tags (einfache Wortsuche, keine Auswertung durch Dritte)
const KEYWORD_TAGS = [
  [/strand|meer|baden|sonne|insel|bucht|schnorchel|tauch/i, 'beach'],
  [/wander|berg|alpen|natur|wald|see\b|seen|nationalpark|fjord/i, 'nature'],
  [/abenteuer|action|klettern|safari|rafting|vulkan/i, 'adventure'],
  [/sport|aktiv|rad|fahrrad|surf|kite|ski/i, 'active'],
  [/kultur|museum|geschichte|architektur|kunst|tempel|altstadt/i, 'culture'],
  [/stadt|städte|metropole|shopping/i, 'city'],
  [/ruhe|ruhig|entspann|abschalten|erholung|chillen/i, 'relax'],
  [/wellness|spa|therme|massage|yoga|sauna/i, 'wellness'],
  [/essen|kulinar|food|wein|kochen|restaurant|genuss/i, 'food'],
  [/party|feiern|club|nachtleben|bar/i, 'party'],
  [/romant|zweisam|flitter|hochzeit|paar|partner/i, 'romance'],
  [/kind|kinder|familie|baby/i, 'family'],
  [/luxus|luxuriös|5 sterne|fünf sterne|exklusiv/i, 'luxury'],
];

const TAG_LABELS = {
  beach: 'Strand', relax: 'Entspannung', adventure: 'Abenteuer', luxury: 'Luxus',
  family: 'Familie', romance: 'Romantik', culture: 'Kultur', nature: 'Natur',
  party: 'Nightlife', wellness: 'Wellness', city: 'Städtetrip', active: 'Aktivurlaub', food: 'Kulinarik',
};

const PROFILE_TYPES = {
  beach: '🏖️ Strandliebhaber', relax: '🌿 Erholungssucher', adventure: '🧭 Abenteurer',
  luxury: '✨ Genießer mit Stil', family: '👨‍👩‍👧 Familienmensch', romance: '💞 Romantiker',
  culture: '🏛️ Kulturentdecker', nature: '🏔️ Naturfreund', party: '🎉 Nachtschwärmer',
  wellness: '🧘 Wellness-Fan', city: '🏙️ Städteentdecker', active: '🚴 Aktivurlauber', food: '🍝 Feinschmecker',
};

const SEASON_LABELS = { spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' };

// ── Hilfsfunktionen ──────────────────────────────────────────────────────────

const fmt = n => Math.round(n).toLocaleString('de-DE');
const range = ([a, b]) => (a === b ? `${fmt(a)} €` : `${fmt(a)}–${fmt(b)} €`);
const roundTo = (n, step = 10) => Math.round(n / step) * step;

// Anreise mit Auto oder Bahn (Hin- und Rückweg p.P.), wenn kein Flug nötig ist
const GROUND_TRAVEL = { de: [40, 160], nah: [80, 240], mittel: [150, 350], fern: [300, 600] };

// Eingaben aus den Schnellauswahl-Chips des Wizards
const CHIP_RULES = {
  shortFlight:  /kurze flugzeit|kurze anreise|nicht so weit|nicht weit weg/i,
  fewTourists:  /wenig touristen|abseits|geheimtipp|ruhig gelegen/i,
  noCar:        /mietwagen vermeiden|ohne auto|ohne mietwagen|kein auto/i,
  budgetFriendly: /budgetfreundlich|günstig|preiswert|sparen/i,
};

// Konkrete Wünsche im Freitext, die zu einzelnen Zielen passen
const DEST_KEYWORDS = {
  tirol:       /ski|snowboard|piste|skifahr|rodel|alm|hütte/i,
  suedtirol:   /ski|snowboard|piste|skifahr|dolomiten|alm|hütte|wein/i,
  allgaeu:     /ski|langlauf|rodel|alm|schloss|neuschwanstein|bauernhof/i,
  schwarzwald: /kuckucksuhr|therme|wander|bauernhof|kirschtorte/i,
  lappland:    /polarlicht|nordlicht|husky|rentier|weihnachtsmann|schneeschuh|winterwunderland/i,
  island:      /polarlicht|nordlicht|vulkan|gletscher|geysir|wasserfall|wale?\b|walbeobachtung/i,
  norwegen:    /fjord|polarlicht|nordlicht|hurtigruten|wale?\b|walbeobachtung/i,
  hurghada:    /tauch|schnorchel|riff|korall|wüste/i,
  malediven:   /tauch|schnorchel|riff|überwasser|wasserbungalow|flitterwochen/i,
  mauritius:   /tauch|schnorchel|flitterwochen|lagune/i,
  kenia:       /safari|big five|löwe|elefant|savanne|tierwanderung/i,
  kapstadt:    /safari|pinguin|wale?\b|weingut|tafelberg|roadtrip/i,
  'costa-rica':/regenwald|dschungel|faultier|vulkan|surf|tiere/i,
  japan:       /sushi|anime|manga|kirschblüte|tokio|kyoto|onsen/i,
  thailand:    /street ?food|tempel|inselhopping|thai|massage|vollmond/i,
  bali:        /yoga|reisterrass|surf|tempel|digital nomad/i,
  vietnam:     /halong|street ?food|reisterrass|rundreise/i,
  'sri-lanka': /tee|ayurveda|elefant|rundreise|surf/i,
  'new-york':  /shopping|broadway|skyline|wolkenkratzer|musical/i,
  dubai:       /shopping|wüste|wolkenkratzer|skyline|luxushotel/i,
  marrakesch:  /wüste|souk|orient|riad/i,
  azoren:      /wale?\b|walbeobachtung|kratersee|heiße quellen|wander/i,
  madeira:     /levada|wander|blumen|ewiger frühling/i,
  fuerteventura: /surf|kite|düne|windsurf/i,
  teneriffa:   /vulkan|teide|wale?\b|wander/i,
  'gran-canaria': /düne|maspalomas|party/i,
  toskana:     /wein|olivenöl|agriturismo|landgut|florenz/i,
  paris:       /eiffel|louvre|museum|mode|croissant/i,
  rom:         /antike|kolosseum|vatikan|pizza|pasta/i,
  budapest:    /therme|thermal|ruinenbar/i,
  amsterdam:   /grachten|tulpen|fahrrad/i,
  schottland:  /whisky|burg|schloss|highlands|loch ness/i,
  kroatien:    /segeln|inselhopping|plitvice|bucht/i,
  gardasee:    /surf|segeln|radtour|mountainbike|klettern|see\b/i,
  zeeland:     /ferienhaus|düne|strandhaus/i,
  daenemark:   /ferienhaus|düne|legoland/i,
  nordsee:     /strandkorb|watt|insel|ferienhaus/i,
  ostsee:      /strandkorb|seebrücke|insel|ferienhaus/i,
  mallorca:    /ballermann|finca|radtour|party/i,
  santorini:   /flitterwochen|sonnenuntergang|hochzeit/i,
  prag:        /bier|altstadt|weihnachtsmarkt/i,
  wien:        /kaffeehaus|oper|weihnachtsmarkt|sisi/i,
  berlin:      /museum|clubs?\b|techno|mauer|weihnachtsmarkt/i,
  hamburg:     /hafen|musical|elbphilharmonie|reeperbahn/i,
  kopenhagen:  /design|tivoli|fahrrad|hygge/i,
  lissabon:    /tram|fado|surf|pastel/i,
  barcelona:   /gaudi|tapas|strand und stadt/i,
  yucatan:     /maya|pyramide|cenote|tauch|karibik/i,
  kanada:      /roadtrip|bär|rocky|camper|wohnmobil/i,
};

// Einfache, stabile Zahl aus einem Text – für eine faire Reihenfolge bei Gleichstand
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Kommt ein Ort/Land als ganzes Wort im Text vor? (kein Treffer bei „gebucht“ → „Bucht“)
function mentions(text, word) {
  const w = (word || '').toLowerCase().trim();
  if (w.length < 4) return false;
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-zäöüß])${esc}($|[^a-zäöüß])`, 'i').test(text.toLowerCase());
}

function nightsFor(duration) {
  return NIGHTS[duration] ?? NIGHTS.week;
}

function seasonScore(dest, season) {
  if (!season || season === 'flex') return Math.max(...Object.values(dest.seasons));
  return dest.seasons[season] ?? 1;
}

function bestSeason(dest) {
  const order = ['summer', 'spring', 'autumn', 'winter'];
  return order.reduce((best, s) => (dest.seasons[s] > dest.seasons[best] ? s : best), order[0]);
}

/** Kostenschätzung p.P. für die gesamte Reise. */
export function estimateCosts(dest, { budget = 'mid', duration = 'week' } = {}) {
  const nights   = nightsFor(duration);
  const factor   = NIGHT_FACTOR[budget] ?? 1;
  const byGround = dest.flight[1] === 0;
  const flight   = byGround ? (GROUND_TRAVEL[dest.zone] ?? GROUND_TRAVEL.de) : dest.flight;
  const hotel    = [roundTo(dest.night[0] * factor * nights), roundTo(dest.night[1] * factor * nights)];
  const activity = [roundTo(dest.daily[0] * nights), roundTo(dest.daily[1] * nights)];
  const car      = dest.carRental?.recommended ? [roundTo(12 * nights), roundTo(25 * nights)] : [0, 0];
  const total    = [0, 1].map(i => flight[i] + hotel[i] + activity[i] + car[i]);

  const max = budget in BUDGET_LIMITS ? BUDGET_LIMITS[budget].max : BUDGET_LIMITS.mid.max;
  let budgetStatus = 'passt';
  if (max === null)              budgetStatus = 'offen';
  else if (total[0] > max * 1.5) budgetStatus = 'nur_sparreise';
  else if (total[0] > max * 1.2) budgetStatus = 'ueber';
  else if (total[1] > max)       budgetStatus = 'knapp';

  return {
    flight:     `${range(flight)} p.P.`,
    travelType: byGround ? 'boden' : 'flug',
    hotel:      `${range(hotel)} p.P.`,
    carRental:  `${range(car)} p.P.`,
    activities: `${range(activity)} p.P.`,
    total:      `${range(total)} p.P.`,
    budgetStatus,
    _totalMin:  total[0],
    _totalMax:  total[1],
  };
}

function budgetPerDay(dest, budget) {
  const factor = NIGHT_FACTOR[budget] ?? 1;
  return `${range([roundTo(dest.night[0] * factor + dest.daily[0], 5), roundTo(dest.night[1] * factor + dest.daily[1], 5)])} p.P.`;
}

function weatherFor(dest, season) {
  const s = !season || season === 'flex' ? bestSeason(dest) : season;
  return dest.weather[s] || '';
}

// ── Eingaben normalisieren ───────────────────────────────────────────────────

/**
 * @param {object} input
 * @param {string[]} [input.moodIds]     Stimmungen aus dem Wizard (relax, beach …)
 * @param {string[]} [input.interests]   Freie Interessen-Labels (z. B. „Strandurlaub“)
 * @param {string}   [input.freeText]    Optionaler Freitext / gewählte Chips
 * @param {string}   [input.budget]      low | mid | high
 * @param {string}   [input.duration]    weekend | week | twoweeks | long
 * @param {string}   [input.season]      spring | summer | autumn | winter | flex
 * @param {object}   [input.singleParent] Antworten aus dem Alleinerziehenden-Funnel
 */
function collectWishes(input) {
  const weights = {};
  const add = (tag, w) => { weights[tag] = (weights[tag] ?? 0) + w; };

  for (const id of input.moodIds ?? []) for (const t of MOOD_TAGS[id] ?? []) add(t, 3);
  for (const label of input.interests ?? []) {
    for (const [rx, tag] of INTEREST_TAGS) if (rx.test(label)) add(tag, 2);
  }
  if (input.singleParent) add('family', 2);
  const text = (input.freeText ?? '').slice(0, 600);
  for (const [rx, tag] of KEYWORD_TAGS) if (rx.test(text)) add(tag, 2);

  return weights;
}

// ── Bewertung ────────────────────────────────────────────────────────────────

function scoreDestination(dest, input, wishes) {
  const reasons = [];
  let score = 0;

  // 1. Stimmungen / Interessen – vordere Tags im Katalog sind die Stärken des Ziels
  let tagHits = 0;
  for (const [tag, w] of Object.entries(wishes)) {
    const idx = dest.tags.indexOf(tag);
    if (idx !== -1) {
      score += w * (1 - Math.min(idx, 6) * 0.05);
      tagHits++;
      reasons.push(TAG_LABELS[tag]);
    }
  }
  // Passt keine einzige Stimmung, soll das Ziel nicht nur wegen Preis oder Nähe gewinnen
  if (Object.keys(wishes).length && tagHits === 0) score -= 7;

  // 1b. Konkrete Wünsche aus dem Freitext (z. B. „Safari“, „Skifahren“, „Polarlichter“)
  const text = (input.freeText ?? '').slice(0, 600);
  if (text) {
    const rx = DEST_KEYWORDS[dest.id];
    if (rx && rx.test(text)) { score += 4; reasons.unshift('Dein Wunsch'); }
    if (mentions(text, dest.country) || mentions(text, dest.destination.split(/[ (&]/)[0])) {
      score += 5; reasons.unshift('Dein Wunschziel');
    }
    if (CHIP_RULES.shortFlight.test(text)) score += { de: 1.5, nah: 1, mittel: -3, fern: -7 }[dest.zone] ?? 0;
    if (CHIP_RULES.fewTourists.test(text) && dest.geheimtipp) score += 2.5;
    if (CHIP_RULES.noCar.test(text) && dest.carRental?.recommended) score -= 2.5;
  }

  // 2. Reisezeit
  const sScore = seasonScore(dest, input.season);
  score += [-6, 1.5, 4][sScore];

  // 3. Reisedauer
  const duration = input.duration ?? 'week';
  if (duration === 'weekend') {
    if (dest.zone === 'fern') score -= 12;
    if (dest.zone === 'mittel') score -= 4;
    if (dest.zone === 'de' || dest.reach.includes('bahn')) score += 1.5;
  } else if (duration === 'week') {
    if (dest.zone === 'fern') score -= 3;
  } else if (duration === 'twoweeks') {
    if (dest.zone === 'fern') score += 0.5;
  } else if (duration === 'long') {
    if (dest.zone === 'fern') score += 2;
    if (dest.zone === 'de') score -= 1;
  }

  // 4. Budget
  const costs = estimateCosts(dest, { budget: input.budget, duration });
  score += { passt: 2, knapp: 0, ueber: -4, nur_sparreise: -9, offen: 1 }[costs.budgetStatus];
  const limit = BUDGET_LIMITS[input.budget]?.max;
  if ((input.budget === 'high' || input.budget === 'luxury') && limit && costs._totalMax < limit * 0.3) score -= 2;
  if (input.budget === 'high' && dest.tags.includes('luxury')) score += 1;
  if (input.budget === 'luxury' && dest.tags.includes('luxury')) score += 3;
  if (text && CHIP_RULES.budgetFriendly.test(text) && limit && costs._totalMax <= limit * 0.8) score += 1.5;

  // 5. Alleinerziehenden-Funnel
  const sp = input.singleParent;
  if (sp) {
    score += dest.family * 2;
    if (dest.family <= 1) score -= 4;

    const mode = sp.travelMode;
    if (mode === 'auto' || mode === 'kurz') {
      score += dest.reach.includes('auto') ? 5 : -5;
      if (mode === 'kurz' && dest.zone === 'de') score += 2;
    } else if (mode === 'bahn') {
      score += dest.reach.includes('bahn') ? 6 : -6;
    } else if (mode === 'flugzeug') {
      score += dest.reach.includes('flug') && dest.zone !== 'de' ? 3 : -2;
    }
    if (dest.zone === 'fern') score -= 6;

    const ht = sp.holidayType;
    if (ht && ht !== 'offen') score += dest.holidayTypes.includes(ht) ? 6 : -2;

    if (sp.childcareNeed === 'sehr' && dest.holidayTypes.includes('allinclusive')) score += 2;
    if (sp.childAge === '0-3' && (dest.zone === 'fern' || dest.zone === 'mittel')) score -= 3;
    if ((sp.priorities ?? []).includes('kurze_wege') && (dest.zone === 'de' || dest.zone === 'nah')) score += 1;
    if (sp.stressLevel === 'guenstig' || sp.budgetLevel === 'low') {
      if (costs.budgetStatus === 'passt') score += 1;
    }
  }

  return { score, reasons: [...new Set(reasons)], costs, sScore };
}

// ── Reiseprofil ──────────────────────────────────────────────────────────────

function buildPersonality(wishes, input) {
  const top = Object.entries(wishes).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  const tags = top.length ? top.slice(0, 3) : ['relax', 'culture', 'nature'];
  const types = tags.map(t => PROFILE_TYPES[t]).filter(Boolean);
  while (types.length < 3) {
    const extra = ['🌍 Weltentdecker', '☀️ Sonnenanbeter', '📸 Momentesammler'].find(x => !types.includes(x));
    types.push(extra);
  }

  const w = t => wishes[t] ?? 0;
  const clamp = v => Math.max(10, Math.min(95, Math.round(v)));
  const budgetBoost = { low: -10, mid: 0, high: 20 }[input.budget] ?? 0;
  const traits = [
    { label: 'Abenteuerlust', value: clamp(40 + (w('adventure') + w('active')) * 6 - w('relax') * 2) },
    { label: 'Komfort',       value: clamp(50 + budgetBoost + w('luxury') * 6 + w('wellness') * 3) },
    { label: 'Kultur',        value: clamp(35 + (w('culture') + w('city') + w('food')) * 5) },
    { label: 'Entspannung',   value: clamp(40 + (w('relax') + w('wellness') + w('beach')) * 5 - w('party') * 2) },
  ];

  const labels = tags.map(t => TAG_LABELS[t]).filter(Boolean);
  const summary = input.singleParent
    ? 'Ihr sucht eine entspannte Familienreise mit kurzen Wegen, sicherer Umgebung und Zeit für euch beide.'
    : labels.length >= 2
      ? `Du verbindest ${labels.slice(0, -1).join(', ')} und ${labels[labels.length - 1]} – deine Reise soll sich genau danach anfühlen.`
      : 'Du bist offen für Neues und suchst eine Reise, die dich überrascht.';

  return { types: types.slice(0, 3), summary, traits };
}

// ── Reiseplan & Packliste ────────────────────────────────────────────────────

function buildItinerary(dest, duration) {
  const nights = nightsFor(duration);
  const acts = dest.activities;
  const days = [
    { day: 1, title: 'Ankommen & ankommen lassen', activities: ['Anreise und Check-in', 'Erste Erkundung der Umgebung', 'Abendessen mit regionaler Küche'] },
  ];
  const planDays = Math.min(Math.max(nights - 1, 1), acts.length);
  for (let i = 0; i < planDays; i++) {
    days.push({ day: i + 2, title: acts[i].name, activities: [acts[i].name, acts[i].why].filter(Boolean) });
  }
  if (nights > planDays + 1) {
    const freeDays = nights - planDays - 1;
    days.push({
      day: freeDays > 1 ? `${planDays + 2}–${nights}` : planDays + 2,
      title: freeDays > 1 ? 'Freie Tage nach Lust und Laune' : 'Freier Tag',
      activities: [dest.highlights[0], 'Zeit zum Entspannen oder für spontane Ausflüge'].filter(Boolean),
    });
  }
  days.push({ day: nights + 1, title: 'Abreise', activities: ['Letzter Kaffee mit Aussicht', 'Heimreise'] });
  return days;
}

function buildPackingList(dests, input) {
  const zones = new Set(dests.map(d => d.zone));
  const tags  = new Set(dests.flatMap(d => d.tags));
  const season = input.season;

  const documents = ['Personalausweis', 'Krankenversicherungskarte', 'Buchungsbestätigungen'];
  if (zones.has('fern') || zones.has('mittel')) documents.push('Reisepass (Gültigkeit prüfen)', 'Auslandskrankenversicherung');
  if (dests.some(d => d.carRental?.recommended)) documents.push('Führerschein');
  if (input.singleParent) documents.push('Kinderreisepass bzw. Ausweis des Kindes', 'Ggf. Einverständniserklärung des anderen Elternteils');

  const clothes = ['Bequeme Schuhe', 'Leichte Jacke'];
  if (tags.has('beach')) clothes.push('Badesachen', 'Sonnenhut');
  if (tags.has('nature') || tags.has('active')) clothes.push('Wanderschuhe', 'Regenjacke');
  if (season === 'winter') clothes.push('Warme Schichten', 'Mütze & Handschuhe');
  if (tags.has('culture')) clothes.push('Kleidung, die Schultern bedeckt (für Kirchen & Tempel)');

  const tech = ['Handy & Ladekabel', 'Powerbank'];
  if (dests.some(d => ['Vereinigtes Königreich', 'Malta', 'Zypern', 'Mauritius', 'Japan', 'USA', 'Kanada', 'Südafrika', 'Thailand', 'Bali', 'Indonesien', 'Sri Lanka', 'Malediven', 'Vereinigte Arabische Emirate', 'Kap Verde', 'Mexiko', 'Costa Rica', 'Vietnam'].includes(d.country))) {
    tech.push('Reisestecker-Adapter (je nach Ziel prüfen)');
  }

  const health = ['Sonnencreme', 'Persönliche Medikamente', 'Pflaster & kleine Reiseapotheke'];
  if (tags.has('beach') || zones.has('fern')) health.push('Mückenschutz');
  if (zones.has('fern')) health.push('Impfstatus vorab prüfen');

  const misc = ['Wiederverwendbare Trinkflasche', 'Tagesrucksack'];
  if (input.singleParent) misc.push('Lieblingsspielzeug & Snacks für unterwegs');
  if (tags.has('beach')) misc.push('Schnorchelset (optional)');

  return { documents, clothes, tech, health, misc };
}

// ── Hauptfunktion ────────────────────────────────────────────────────────────

/**
 * Liefert drei passende Reiseziele, ein Überraschungsziel, ein Reiseprofil
 * und eine Packliste – im bisherigen Ergebnis-Format.
 */
export function matchTraumreise(input = {}) {
  const normalized = {
    ...input,
    budget:   input.budget in BUDGET_LIMITS ? input.budget : 'mid',
    duration: NIGHTS[input.duration] ? input.duration : 'week',
    season:   ['spring', 'summer', 'autumn', 'winter', 'flex'].includes(input.season) ? input.season : 'flex',
  };
  const wishes = collectWishes(normalized);

  // Bei Gleichstand entscheidet eine stabile, von den Eingaben abhängige Reihenfolge –
  // so landen nicht immer dieselben (alphabetisch ersten) Ziele vorne.
  const seed = JSON.stringify([normalized.moodIds, normalized.interests, normalized.freeText, normalized.budget, normalized.duration, normalized.season, normalized.singleParent]);
  const scored = CATALOG
    .map(dest => ({ dest, ...scoreDestination(dest, normalized, wishes), tie: hash(seed + dest.id) }))
    .sort((a, b) => b.score - a.score || b.sScore - a.sScore || a.tie - b.tie);

  // Top 3 – höchstens ein Ziel pro Land, damit die Auswahl abwechslungsreich bleibt
  const picks = [];
  const countries = new Set();
  for (const s of scored) {
    if (picks.length === 3) break;
    if (countries.has(s.dest.country)) continue;
    picks.push(s);
    countries.add(s.dest.country);
  }

  // Übereinstimmung in Prozent (relativ zur bestmöglichen Punktzahl)
  const maxPossible = Math.max(
    14,
    Object.values(wishes).reduce((a, b) => a + b, 0) + 4 + 2 + 1.5 + (normalized.singleParent ? 28 : 0),
  );
  const toPct = score => Math.max(60, Math.min(97, Math.round(58 + (score / maxPossible) * 39)));

  const destinations = picks.map(({ dest, costs, reasons, score }) => ({
    destination:  dest.destination,
    country:      dest.country,
    catalogId:    dest.id,
    tagline:      dest.tagline,
    tags:         dest.tags,
    highlights:   dest.highlights,
    skySearch:    dest.skySearch,
    iata:         dest.iata,
    reach:        dest.reach,
    zone:         dest.zone,
    weather:      weatherFor(dest, normalized.season),
    flightTime:   dest.flightTime,
    budgetPerDay: budgetPerDay(dest, normalized.budget),
    carRental:    dest.carRental,
    travelType:   costs.travelType,
    costEstimate: {
      flight: costs.flight, travelType: costs.travelType, hotel: costs.hotel, carRental: costs.carRental,
      activities: costs.activities, total: costs.total, budgetStatus: costs.budgetStatus,
    },
    activities:   dest.activities,
    itinerary:    buildItinerary(dest, normalized.duration),
    hotels:       [],
    matchScore:   toPct(score),
    matchReasons: reasons.slice(0, 4),
  }));

  // Überraschungsziel: bestes Geheimtipp-Ziel, das nicht schon gewählt ist
  // Überraschungsziel: ein Geheimtipp, der zur Reisezeit passt und mindestens
  // eine gewünschte Stimmung trifft – kein Ziel aus einem schon gewählten Land
  const chosen = new Set(picks.map(p => p.dest.id));
  const wishTags = Object.keys(wishes);
  const fitsWish = s => !wishTags.length || wishTags.some(t => s.dest.tags.includes(t));
  const minScore = (picks[picks.length - 1]?.score ?? 0) - 10;
  const free = s => !chosen.has(s.dest.id) && !countries.has(s.dest.country) && s.score >= minScore
    && !(normalized.singleParent && s.dest.zone === 'fern');
  const surprisePick =
    scored.find(s => s.dest.geheimtipp && free(s) && s.sScore > 0 && fitsWish(s)) ||
    scored.find(s => free(s) && s.sScore > 0 && fitsWish(s) && s.dest.zone !== picks[0]?.dest.zone) ||
    scored.find(s => free(s)) ||
    scored.find(s => !chosen.has(s.dest.id));
  const surprise = surprisePick && {
    destination:   surprisePick.dest.destination,
    country:       surprisePick.dest.country,
    tagline:       surprisePick.dest.tagline,
    whySurprising: surprisePick.dest.whySurprising || surprisePick.dest.highlights.join(' · '),
  };

  return {
    personality: buildPersonality(wishes, normalized),
    destinations,
    surprise,
    packingList: buildPackingList(picks.map(p => p.dest), normalized),
    matching: {
      method:  'regelbasiert',
      version: 2,
      season:  SEASON_LABELS[normalized.season] ?? 'flexibel',
    },
  };
}
