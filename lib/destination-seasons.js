// Ermittelt für jedes Reiseziel, in welchen Jahreszeiten es ideal ist.
// Wird von den Jahreszeiten-Kacheln auf /reiseziele zum Filtern genutzt.
//
// Reihenfolge:
//   1. Eintrag im Traumreise-Katalog (gleicher Slug oder Name) → seasons === 2
//   2. sonst „Beste Reisezeit“ des Reiseziels (z. B. "Mai bis Oktober")
import { CATALOG } from '@/lib/traumreise/catalog';

const SEASON_KEYS = ['spring', 'summer', 'autumn', 'winter'];

function norm(str) {
  return String(str ?? '')
    .toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Monat (0–11) → Jahreszeit
const MONTH_SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
const MONTHS = [
  ['januar', 'jan', 'janner'], ['februar', 'feb'], ['marz', 'mar', 'maerz'], ['april', 'apr'], ['mai'],
  ['juni', 'jun'], ['juli', 'jul'], ['august', 'aug'], ['september', 'sep', 'sept'], ['oktober', 'okt'],
  ['november', 'nov'], ['dezember', 'dez'],
];
const WORD_SEASON = {
  fruhling: 'spring', fruhjahr: 'spring', sommer: 'summer', herbst: 'autumn', winter: 'winter',
  ganzjahrig: 'all', ganzjahrlich: 'all', ganze: null,
};

function monthIndex(word) {
  return MONTHS.findIndex(names => names.includes(word));
}

// "Mai bis Oktober", "April – Juni, September", "Frühling und Herbst", "ganzjährig"
export function seasonsFromText(text) {
  const words = norm(text).split(' ').filter(Boolean);
  if (words.length === 0) return [];
  const found = new Set();
  const count = new Map(); // Monate je Jahreszeit
  const addMonth = (m) => { const s = MONTH_SEASON[m]; count.set(s, (count.get(s) || 0) + 1); };

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (WORD_SEASON[w] === 'all' || (w === 'ganze' && words[i + 1] === 'jahr')) return [...SEASON_KEYS];
    if (WORD_SEASON[w]) { found.add(WORD_SEASON[w]); continue; }
    const m = monthIndex(w);
    if (m < 0) continue;
    // Bereich: "<Monat> bis <Monat>" oder "<Monat> <Monat>" (Bindestrich wird zu Leerzeichen)
    let j = i + 1;
    if (words[j] === 'bis') j++;
    const m2 = j < words.length ? monthIndex(words[j]) : -1;
    if (m2 >= 0 && j > i) {
      for (let k = m; ; k = (k + 1) % 12) { addMonth(k); if (k === m2) break; }
      i = j;
    } else {
      addMonth(m);
    }
  }
  // Eine Jahreszeit zählt, wenn mindestens 2 ihrer 3 Monate genannt sind
  // (oder wenn insgesamt nur ein einzelner Monat genannt ist).
  const total = [...count.values()].reduce((a, b) => a + b, 0);
  for (const [s, n] of count) if (n >= 2 || total === 1) found.add(s);
  return SEASON_KEYS.filter(s => found.has(s));
}

const catalogIndex = (() => {
  const map = new Map();
  for (const c of CATALOG) {
    map.set(norm(c.id), c);
    map.set(norm(c.destination), c);
    // "Ostsee (Usedom & Rügen)" → auch unter "Ostsee" finden
    map.set(norm(String(c.destination).replace(/\(.*\)/, '')), c);
  }
  return map;
})();

export function idealSeasonsFor(dest) {
  const entry = catalogIndex.get(norm(dest.slug)) || catalogIndex.get(norm(dest.name));
  if (entry?.seasons) {
    const ideal = SEASON_KEYS.filter(s => entry.seasons[s] === 2);
    if (ideal.length) return ideal;
  }
  return seasonsFromText([dest.bestTravelTime, dest.quickFacts?.bestMonths].filter(Boolean).join(', '));
}

export function withIdealSeasons(destinations = []) {
  return destinations.map(d => ({ ...d, idealSeasons: idealSeasonsFor(d) }));
}
