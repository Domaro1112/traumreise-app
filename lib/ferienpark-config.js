/**
 * Ferienpark & Familienurlaub — Provider-Konfiguration und Matching-Logik.
 *
 * Wird client-seitig im Funnel-Ergebnis verwendet, um 2–3 passende Anbieter
 * basierend auf Interessen, Reiseziel und Budget auszuspielen.
 */

export const FERIENPARK_PROVIDERS = [
  {
    key:         'centerparcs',
    name:        'Center Parcs',
    description: 'Ferien-Resorts mit Aqua Mundo, Kinderanimation und allem auf einem Gelände',
    reason:      'Ideal für Familien und Alleinerziehende — alles direkt vor der Tür',
    color:       '#005EB8',
    bgColor:     '#EBF4FF',
    category:    'Ferienparks & Familienurlaub',
    // Interesse-IDs aus finderOptions.js die Punkte geben
    interestScores: { relax: 3, wellness: 3, nature: 2, beach: 1, weekend: 2, mountains: 1 },
    // Zielland-Bonus
    countries:   ['Deutschland', 'Niederlande', 'Belgien', 'Frankreich'],
    // Niedrige Budgets ausschließen
    budgetExclude: [],
  },
  {
    key:         'landal',
    name:        'Landal GreenParks',
    description: 'Naturnahe Ferienparks in ganz Europa — auch für Hunde geeignet',
    reason:      'Perfekt für Natururlaub, Familien und Hundeurlaub',
    color:       '#00843D',
    bgColor:     '#ECFDF5',
    category:    'Ferienparks & Familienurlaub',
    interestScores: { nature: 3, relax: 2, wellness: 1, mountains: 2, weekend: 1, adventure: 1 },
    countries:   ['Deutschland', 'Niederlande', 'Österreich', 'Belgien'],
    budgetExclude: [],
  },
  {
    key:         'roompot',
    name:        'Roompot',
    description: 'Ferienparks an der niederländischen Küste — Strand, Natur und Familienspaß',
    reason:      'Top-Wahl für Küstenurlaub in den Niederlanden',
    color:       '#E87722',
    bgColor:     '#FFF7ED',
    category:    'Ferienparks & Familienurlaub',
    interestScores: { beach: 3, relax: 2, nature: 2, weekend: 1, wellness: 1 },
    countries:   ['Niederlande'],
    budgetExclude: [],
  },
  {
    key:         'topparken',
    name:        'TopParken',
    description: 'Niederländische Ferienparks inmitten der Natur — ruhig und familienfreundlich',
    reason:      'Ideal für Natururlaub und Hundeurlaub in den Niederlanden',
    color:       '#1D6FA4',
    bgColor:     '#EFF6FF',
    category:    'Ferienparks & Familienurlaub',
    interestScores: { nature: 3, relax: 2, mountains: 1, weekend: 1, wellness: 1 },
    countries:   ['Niederlande'],
    budgetExclude: [],
  },
  {
    key:         'sunparks',
    name:        'Sunparks',
    description: 'Belgische Ferienresorts mit Wasserpark, Animation und Komfort',
    reason:      'Perfekt für Familienurlaub und Kurzurlaub in Belgien',
    color:       '#F5A623',
    bgColor:     '#FFFBEB',
    category:    'Ferienparks & Familienurlaub',
    interestScores: { beach: 2, relax: 2, wellness: 2, weekend: 2, nature: 1 },
    countries:   ['Belgien'],
    budgetExclude: [],
  },
  {
    key:         'eurocamp',
    name:        'Eurocamp',
    description: 'Mobilheim-Urlaub auf Top-Campingplätzen quer durch Europa',
    reason:      'Die beste Wahl für Campingurlaub und Roadtrip-Familien',
    color:       '#2E7D32',
    bgColor:     '#F0FDF4',
    category:    'Camping & Mobilheime',
    interestScores: { nature: 3, adventure: 3, mountains: 2, relax: 1, food: 1 },
    countries:   ['Italien', 'Frankreich', 'Spanien', 'Kroatien', 'Deutschland'],
    budgetExclude: ['high'],
  },
  {
    key:         'novasol',
    name:        'NOVASOL',
    description: 'Ferienhäuser in ganz Europa — für Familien, Gruppen und Hundeurlaub',
    reason:      'Mehr Platz, mehr Freiheit: Ferienhaus statt Hotelzimmer',
    color:       '#C0392B',
    bgColor:     '#FEF2F2',
    category:    'Ferienhäuser',
    interestScores: { relax: 3, nature: 2, culture: 1, food: 1, wellness: 1, mountains: 1 },
    countries:   [], // Europa-weit
    budgetExclude: [],
  },
];

/**
 * Wählt 2–3 passende Ferienpark-Anbieter basierend auf Funnel-Antworten aus.
 *
 * @param {string[]} interests  - Array von Mood-IDs aus finderOptions.js
 * @param {{ name?: string, country?: string, region?: string }} destination
 * @param {string|null} budget  - 'low' | 'mid' | 'high' | null
 * @returns {{ key, name, description, reason, color, bgColor, category, url }[]}
 */
export function matchFerienparkProviders(interests = [], destination = {}, budget = null) {
  const country = destination?.country ?? '';

  const scored = FERIENPARK_PROVIDERS
    .filter(p => !budget || !p.budgetExclude.includes(budget))
    .map(p => {
      let score = 0;

      // Interesse-Score
      for (const id of interests) {
        score += p.interestScores[id] ?? 0;
      }

      // Länder-Bonus (+2 wenn Zielland passt)
      if (p.countries.length === 0) {
        score += 1; // Europa-weit: leichter Bonus
      } else if (p.countries.some(c => country.toLowerCase().includes(c.toLowerCase()))) {
        score += 2;
      }

      return { ...p, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored;
}
