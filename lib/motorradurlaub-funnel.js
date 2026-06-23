// Rule-based logic for the motorcycle travel planning funnel.
// Pure JS — no framework imports.

export const QUESTIONS = [
  {
    id: 'duration',
    title: 'Wie lange möchtest du unterwegs sein?',
    subtitle: 'Deine Reisedauer bestimmt, wie viele Regionen du entdecken kannst.',
    options: [
      { value: 'short',    label: '3–5 Tage',    hint: 'Kurztrip' },
      { value: 'week',     label: '1 Woche',      hint: 'Klassische Tour' },
      { value: 'twoweeks', label: '2 Wochen',     hint: 'Ausgedehnte Reise' },
      { value: 'long',     label: 'Länger',       hint: 'Große Motorradreise' },
    ],
  },
  {
    id: 'dailyKm',
    title: 'Wie viele Kilometer möchtest du pro Tag fahren?',
    subtitle: 'Dein Tagesrhythmus prägt die Streckenplanung.',
    options: [
      { value: 'low',   label: 'Bis 150 km',  hint: 'Gemütlich' },
      { value: 'mid',   label: '150–300 km',  hint: 'Ausgewogen' },
      { value: 'high',  label: '300–500 km',  hint: 'Sportlich' },
      { value: 'ultra', label: '500+ km',     hint: 'Ausdauer' },
    ],
  },
  {
    id: 'style',
    title: 'Was macht dir am meisten Spaß?',
    subtitle: 'Dein Fahrstil zeigt, welche Regionen am besten zu dir passen.',
    options: [
      { value: 'curves',    label: 'Kurvenreiche Strecken', hint: 'Fahrdynamik' },
      { value: 'passes',    label: 'Bergpässe',             hint: 'Höhenrausch' },
      { value: 'coast',     label: 'Küstenstraßen',         hint: 'Meerblick' },
      { value: 'landscape', label: 'Landschaft genießen',   hint: 'Natur pur' },
      { value: 'cruising',  label: 'Entspanntes Cruisen',   hint: 'Ohne Eile' },
    ],
  },
  {
    id: 'destination',
    title: 'Wo möchtest du fahren?',
    subtitle: 'Wähle deine Wunschregion oder lass dich überraschen.',
    options: [
      { value: 'germany',     label: 'Deutschland',   hint: 'Heimat entdecken' },
      { value: 'alps',        label: 'Alpen',         hint: 'Pässe & Kulisse' },
      { value: 'italy',       label: 'Italien',       hint: 'Dolce Vita' },
      { value: 'france',      label: 'Frankreich',    hint: 'Savoir-vivre' },
      { value: 'scandinavia', label: 'Skandinavien',  hint: 'Fjorde & Weite' },
      { value: 'open',        label: 'Ich bin offen', hint: 'Überrasch mich' },
    ],
  },
  {
    id: 'accommodation',
    title: 'Welche Unterkunft bevorzugst du?',
    subtitle: 'Deine Unterkunftswahl beeinflusst Komfort und Flexibilität.',
    options: [
      { value: 'hotel',   label: 'Hotel',   hint: 'Komfort & Service' },
      { value: 'pension', label: 'Pension', hint: 'Persönlich & günstig' },
      { value: 'camping', label: 'Camping', hint: 'Freiheit & Natur' },
      { value: 'any',     label: 'Egal',    hint: 'Je nach Lage' },
    ],
  },
  {
    id: 'parking',
    title: 'Ist ein sicherer Motorrad-Stellplatz wichtig?',
    subtitle: 'Besonders nach langen Touren macht ein gesicherter Abstellplatz den Unterschied.',
    options: [
      { value: 'veryImportant', label: 'Sehr wichtig',          hint: 'Immer prüfen' },
      { value: 'niceToHave',    label: 'Schön wenn vorhanden',  hint: 'Wäre gut' },
      { value: 'notImportant',  label: 'Nicht wichtig',         hint: 'Kein Thema' },
    ],
  },
];

// ─── Region data ──────────────────────────────────────────────────────────────

const REGION_DATA = {
  dolomiten: {
    name: 'Dolomiten',
    country: 'Italien',
    description: 'Spektakuläre Felsmassive, legendäre Pässe und kristallklare Bergseen. Die Dolomiten gelten als beeindruckendste Motorradregion Europas.',
    highlights: ['Sella Ronda', 'Karerpass', 'Grödner Joch'],
    bestTime: 'Juni–September',
  },
  grossglockner: {
    name: 'Großglockner',
    country: 'Österreich',
    description: 'Die Großglockner Hochalpenstraße ist Österreichs berühmteste Panoramaroute und ein Muss für jeden Passfahrer.',
    highlights: ['Hochalpenstraße', 'Kaiser-Franz-Josefs-Höhe', 'Fuschertörl'],
    bestTime: 'Juni–Oktober',
  },
  tirol: {
    name: 'Tirol',
    country: 'Österreich',
    description: 'Endlose Alpenpässe, malerische Täler und eine der größten Passdichten Europas machen Tirol zum Motorradparadies.',
    highlights: ['Arlbergpass', 'Silvretta Hochalpenstraße', 'Reschenpass'],
    bestTime: 'Mai–Oktober',
  },
  schwarzwald: {
    name: 'Schwarzwald',
    country: 'Deutschland',
    description: 'Kurvenreiche Höhenstraßen durch dichte Wälder, malerische Täler und gemütliche Gasthöfe. Das Motorradparadies Südwestdeutschlands.',
    highlights: ['Schwarzwaldhochstraße', 'Kinzigtal', 'Titisee'],
    bestTime: 'April–Oktober',
  },
  mosel: {
    name: 'Moseltal',
    country: 'Deutschland',
    description: 'Sanfte Kurven entlang der Mosel, Weinberge soweit das Auge reicht und mittelalterliche Burgen an jedem Biegung.',
    highlights: ['Moselschleife Bremm', 'Burg Cochem', 'Deutsche Weinstraße'],
    bestTime: 'April–Oktober',
  },
  harz: {
    name: 'Harz',
    country: 'Deutschland',
    description: 'Enge Kurven durch urwüchsige Mischwälder und über weitläufige Hochflächen. Der Harz begeistert mit Wildheit und Ursprünglichkeit.',
    highlights: ['Brockenstraße', 'Hexentanzplatz', 'Selketal'],
    bestTime: 'April–Oktober',
  },
  eifel: {
    name: 'Eifel & Nürburgring',
    country: 'Deutschland',
    description: 'Vulkanlandschaft, geheimnisvolle Maare und die legendäre Nürburgring-Nordschleife – die Eifel ist Pflicht für jeden Motorradfan.',
    highlights: ['Nürburgring Nordschleife', 'Laacher See', 'Mandelbachtal'],
    bestTime: 'April–Oktober',
  },
  ostsee: {
    name: 'Ostseeküste & Rügen',
    country: 'Deutschland',
    description: 'Weite Alleen durch Felder, Ostseebäder im Jugendstil und die Insel Rügen mit ihren Kreidefelsen – entspanntes Küstenfahren im Norden.',
    highlights: ['Rügen & Kreidefelsen', 'Usedom', 'Flensburger Förde'],
    bestTime: 'Mai–September',
  },
  cotedazur: {
    name: "Côte d'Azur",
    country: 'Frankreich',
    description: "Meeresrauschen, Mittelmeersonne und das Glitzern des Meeres. Die Küstenstraßen der Côte d'Azur zählen zu den schönsten Europas.",
    highlights: ["Corniche de l'Estérel", 'Monaco', 'Cassis'],
    bestTime: 'April–Oktober',
  },
  provence: {
    name: 'Provence & Ardèche',
    country: 'Frankreich',
    description: 'Lavendelfelder, Olivenhaine und die spektakulären Gorges du Verdon. Die Provence verführt mit Farben, Düften und Stille.',
    highlights: ['Gorges du Verdon', 'Mont Ventoux', 'Gordes'],
    bestTime: 'Mai–September',
  },
  normandie: {
    name: 'Normandie & Bretagne',
    country: 'Frankreich',
    description: 'Wilde Atlantikküste, Steilklippen und das mystische Mont-Saint-Michel. Nordfrankreich auf zwei Rädern – rau, weit und unvergesslich.',
    highlights: ['Mont-Saint-Michel', 'Kap Fréhel', 'D-Day Strände'],
    bestTime: 'Mai–September',
  },
  amalfi: {
    name: 'Amalfiküste',
    country: 'Italien',
    description: 'Die kurvenreichste Küstenstraße Italiens über türkisblaues Meer und weiße Dörfer auf Felsen. Spektakulär und anspruchsvoll.',
    highlights: ['Positano', 'Ravello', 'SS163 Costiera Amalfitana'],
    bestTime: 'April–Oktober',
  },
  gardasee: {
    name: 'Gardasee & Umgebung',
    country: 'Italien',
    description: 'Milde Luft, spektakuläre Bergkurven und der größte See Italiens. Ideal für die Kombination aus Bergfahrt und Seegenuss.',
    highlights: ['Tremosine sul Garda', 'Valvestino', 'Gardesana Occidentale'],
    bestTime: 'April–Oktober',
  },
  norwegen: {
    name: 'Norwegische Fjorde',
    country: 'Norwegen',
    description: 'Atemberaubende Fjordlandschaften, halsbrecherische Serpentinen hinab ans Wasser und Mitternachtssonne. Das ultimative Abenteuer auf zwei Rädern.',
    highlights: ['Trollstigen', 'Geiranger', 'Atlanterhavsveien'],
    bestTime: 'Juni–August',
  },
  lofoten: {
    name: 'Lofoten',
    country: 'Norwegen',
    description: 'Dramatische Bergkulisse, rote Fischerhütten und endlose Weite. Die Lofoten gehören zu den eindrucksvollsten Reisezielen Europas.',
    highlights: ['Henningsvær', 'Reine', 'Nusfjord'],
    bestTime: 'Juni–August',
  },
  schweden: {
    name: 'Schweden',
    country: 'Schweden',
    description: 'Endlose Wälder, glasklare Seen und kaum Verkehr. Schweden ist ein Motorradtraum für alle, die Einsamkeit und ursprüngliche Natur suchen.',
    highlights: ['Kattegattleden', 'Dalarna', 'Gotland'],
    bestTime: 'Juni–August',
  },
};

// ─── Profile ──────────────────────────────────────────────────────────────────

const PROFILE_MAP = {
  passes:    { label: 'Passjäger',        description: 'Du liebst die Herausforderung hoher Pässe, weite Panoramen und das Gefühl oben angekommen zu sein.' },
  curves:    { label: 'Kurvenliebhaber',  description: 'Kurvenreiche Strecken sind dein Zuhause auf dem Motorrad – je kurviger, desto besser.' },
  coast:     { label: 'Küstenentdecker',  description: 'Meeresrauschen, Salzluft und der Blick aufs Wasser machen für dich den perfekten Motorradtag aus.' },
  cruising:  { label: 'Genussfahrer',     description: 'Du genießt die Fahrt ohne Zeitdruck, entdeckst die Region in deinem Tempo und hältst wo es dir gefällt.' },
  landscape: { label: 'Tourenfahrer',     description: 'Abwechslungsreiche Landschaften, Stille auf der Strecke und das Erleben der Natur stehen für dich im Vordergrund.' },
};

function getProfile(style) {
  return PROFILE_MAP[style] || PROFILE_MAP.landscape;
}

// ─── Regions ──────────────────────────────────────────────────────────────────

function getRegionKeys(style, destination) {
  if (destination === 'alps') {
    if (style === 'coast') return ['gardasee', 'tirol', 'dolomiten'];
    return ['dolomiten', 'grossglockner', 'tirol'];
  }
  if (destination === 'germany') {
    if (style === 'coast') return ['ostsee', 'harz', 'eifel'];
    if (style === 'passes' || style === 'curves') return ['schwarzwald', 'harz', 'eifel'];
    return ['schwarzwald', 'mosel', 'eifel'];
  }
  if (destination === 'italy') {
    if (style === 'coast') return ['amalfi', 'gardasee', 'cotedazur'];
    if (style === 'passes') return ['dolomiten', 'gardasee', 'grossglockner'];
    return ['dolomiten', 'gardasee', 'amalfi'];
  }
  if (destination === 'france') {
    if (style === 'coast') return ['cotedazur', 'normandie', 'provence'];
    if (style === 'passes' || style === 'curves') return ['cotedazur', 'provence', 'schwarzwald'];
    return ['provence', 'cotedazur', 'normandie'];
  }
  if (destination === 'scandinavia') {
    return ['norwegen', 'lofoten', 'schweden'];
  }
  // open / fallback — based purely on style
  if (style === 'passes')    return ['dolomiten', 'grossglockner', 'tirol'];
  if (style === 'coast')     return ['amalfi', 'cotedazur', 'ostsee'];
  if (style === 'curves')    return ['dolomiten', 'schwarzwald', 'tirol'];
  if (style === 'cruising')  return ['schwarzwald', 'mosel', 'provence'];
  if (style === 'landscape') return ['tirol', 'provence', 'schwarzwald'];
  return ['dolomiten', 'schwarzwald', 'cotedazur'];
}

// ─── Best travel time ─────────────────────────────────────────────────────────

function getBestTime(destination, style) {
  if (destination === 'scandinavia') return 'Juni bis August – für Mitternachtssonne und angenehme Temperaturen.';
  if (destination === 'alps' || style === 'passes') return 'Juni bis September – Pässe sind schneefrei und das Wetter stabil.';
  if (destination === 'italy') return 'April bis Oktober – Frühjahr und Herbst für angenehmere Temperaturen, besonders an der Küste.';
  if (destination === 'france') return 'Mai bis September – Südfrankreich früher starten, Atlantikküste bis Oktober möglich.';
  if (destination === 'germany') return 'April bis Oktober – Frühjahr und Herbst mit wenig Verkehr ideal.';
  return 'Mai bis September – der klassische Motorradsommer.';
}

// ─── Accommodation ────────────────────────────────────────────────────────────

function getAccommodation(accommodationType, parking) {
  const needsParking = parking === 'veryImportant';
  const descriptions = {
    hotel: needsParking
      ? 'Motorradhotels mit ausgewiesenem Stellplatz – idealerweise überdacht oder in der Tiefgarage. Viele bieten Waschmöglichkeiten und Werkzeugbänke.'
      : 'Motorradfreundliche Hotels und Pensionen mit speziellen Leistungen: Trockenräume, Routentipps, früher Frühstück.',
    pension: 'Kleine Pensionen bieten persönlichen Service und sind häufig motorradfreundlich. Frag bei Buchung nach einem abgetrennten Stellplatz.',
    camping: 'Camping auf dem Motorrad braucht leichtes Gepäck. Viele Campingplätze bieten spezielle Bikerzonen – Flexibilität ist der größte Vorteil.',
    any: needsParking
      ? 'Priorisiere Unterkünfte mit gesichertem, möglichst überdachtem Stellplatz. Immer vor der Buchung anfragen.'
      : 'Bleib flexibel – entscheide täglich je nach Streckenverlauf und Wetter. Mix aus Vorabbuchung und Spontanübernachtungen.',
  };
  const labels = {
    hotel: needsParking ? 'Motorradhotel mit gesichertem Stellplatz' : 'Motorradfreundliches Hotel',
    pension: 'Pension mit Motorrad-Stellplatz',
    camping: 'Motorrad-Campingplatz',
    any: needsParking ? 'Unterkunft mit sicherem Stellplatz' : 'Flexible Übernachtung',
  };
  const tips = {
    hotel: 'Auf Booking.com nach „Motorradhotel" oder „Biker Hotel" filtern.',
    pension: 'HolidayCheck-Bewertungen nach Motorradreisenden filtern.',
    camping: 'Viele Campingplätze in der Nähe von Motorradrouten haben spezielle Bikerzonen.',
    any: 'Kombination aus vorgebuchten Stopps + spontanen Nächten für maximale Flexibilität.',
  };
  const key = accommodationType || 'any';
  return {
    label: labels[key] || labels.any,
    description: descriptions[key] || descriptions.any,
    tip: tips[key] || tips.any,
  };
}

// ─── Daily stages ─────────────────────────────────────────────────────────────

function getEtappen(dailyKm, duration) {
  const stages = {
    low: [
      'Entspannte Halbtagesetappe mit Zeit für Kaffeepausen und Fotostopps',
      'Rundstrecke ab Unterkunft – abends zurückkehren und Gepäck lassen',
      'Abstecher zu lokalen Sehenswürdigkeiten ohne Zeitdruck',
    ],
    mid: [
      'Klassische Tagesetappe mit 2–3 Stopps an Aussichtspunkten oder Pässen',
      'Küsten- oder Passroute mit Mittagspause im Bergdorf',
      'Ankunft am Abend – genug Zeit für Sightseeing unterwegs',
    ],
    high: [
      'Früh starten – mehrere Pässe oder längere Küstenabschnitte in einem Tag',
      'Durchfahrt durch unterschiedliche Landschaften und Regionen',
      'Großzügige Pufferzeit für spontane Umwege und Pässe',
    ],
    ultra: [
      'Iron-Butt-Stil: früher Start, tankbedingte Stops, maximale Kilometer',
      'Mehrere Regionen in einer Tagesetappe – Fokus auf Distanz',
      'Unterkunft nach Kilometerstand wählen, nicht nach Plan',
    ],
  };
  return (stages[dailyKm] || stages.mid);
}

// ─── Static data ──────────────────────────────────────────────────────────────

export const PACKING_LIST = [
  {
    category: 'Schutzausrüstung',
    items: ['Helm (ECE 22.06 zertifiziert)', 'Motorradjacke mit CE-Protektoren', 'Motorradhose (Textil/Leder)', 'Motorradhandschuhe', 'Motorradstiefel (knöchelschützend)'],
  },
  {
    category: 'Wetterschutz',
    items: ['Regenkombi (wasserdicht)', 'Unterziehfleece oder Thermoschicht', 'Sturmhaube / Balaclava', 'Heated Grips oder Handschuhheizung bei Kälte'],
  },
  {
    category: 'Navigation & Technik',
    items: ['Motorrad-Navi oder Smartphone-Halterung (RAM Mount)', 'Powerbank (mind. 10.000 mAh)', 'USB-Ladekabel + Ladeadapter', 'Ersatzsicherungen', 'Ladegerät für Batterie (bei Standzeiten)'],
  },
  {
    category: 'Werkzeug & Pannenhilfe',
    items: ['Reifenreparaturset (Schlauchlos-Pilze + Mini-Kompressor)', 'Multitool', 'Kabelbinder + Panzertape', 'Ersatzsicherungen', 'Abschleppseil (kurz)'],
  },
  {
    category: 'Dokumente',
    items: ['Führerschein (Klasse A)', 'Kfz-Zulassungsschein', 'Versicherungsnachweis (Grüne Karte)', 'Europäische Unfallmeldung', 'EHIC-Krankenversicherungskarte', 'Reisepass / Personalausweis'],
  },
  {
    category: 'Erste Hilfe & Gesundheit',
    items: ['Kompaktes Erste-Hilfe-Set', 'Persönliche Medikamente', 'Sonnencreme (mind. LSF 30)', 'Pflaster und Verbandsmaterial', 'Schmerzmittel und Magentabletten'],
  },
  {
    category: 'Sonstiges',
    items: ['Motorradschloss oder Bremsscheibenschloss', 'Gepäcknetz oder Spanngurte', 'Mikrofaser-Reinigungstuch', 'Kettenspray und -reiniger', 'Sicherheitsweste (Pflicht einiger Länder)'],
  },
];

export const SAFETY_TIPS = [
  'Fahre nie ohne vollständige Schutzausrüstung – auch bei Hitze. Textil atmet besser als Leder.',
  'Plane alle 1,5–2 Stunden eine Pause ein. Konzentration lässt schneller nach als erwartet.',
  'Überprüfe vor jeder Etappe Reifendruck, Ölstand und Beleuchtung.',
  'Bergpässe früh morgens fahren: weniger Gegenverkehr, bessere Sicht, kühleres Wetter.',
  'Bei Regen: Geschwindigkeit deutlich reduzieren – besonders in Kurven und auf weißen Fahrbahnmarkierungen.',
  'Informiere jemanden über deine geplante Route und voraussichtliche Ankunftszeit.',
  'Lade Smartphone vollständig auf. Notiere Notfallnummern (ADAC, lokaler Notruf) auf Papier.',
  'Auf Langstrecken ausreichend trinken – auch ohne Durstgefühl, mindestens 0,5 l pro Stunde.',
];

// ─── Main export ──────────────────────────────────────────────────────────────

export function computeResult(answers) {
  const {
    duration = 'week',
    dailyKm = 'mid',
    style = 'landscape',
    destination = 'open',
    accommodation = 'any',
    parking = 'niceToHave',
  } = answers || {};

  const regionKeys = getRegionKeys(style, destination);
  const regions = regionKeys.map(k => REGION_DATA[k]).filter(Boolean);

  return {
    profile:        getProfile(style),
    regions,
    bestTime:       getBestTime(destination, style),
    accommodation:  getAccommodation(accommodation, parking),
    etappen:        getEtappen(dailyKm, duration),
    kmPerDay:       { low: 'bis 150 km', mid: '150–300 km', high: '300–500 km', ultra: '500+ km' }[dailyKm] || '150–300 km',
    duration:       { short: '3–5 Tage', week: '1 Woche', twoweeks: '2 Wochen', long: 'Länger als 2 Wochen' }[duration] || '1 Woche',
  };
}
