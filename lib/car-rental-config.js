export const CHECK24_CAR_RENTAL_AFFILIATE_URL = 'https://mietwagen.check24.de/';

export const CAR_RENTAL_FAQ = [
  {
    question: 'Wann sind Mietwagen am günstigsten zu buchen?',
    answer: '3–6 Monate vor der Reise buchst du oft 30–50% günstiger. Außerhalb der Hauptsaison und unter der Woche sind die Preise deutlich niedriger. Flughafenstationen sind meist teurer als Stationen in der Stadtmitte.',
  },
  {
    question: 'Welche Versicherung sollte ich beim Mietwagen wählen?',
    answer: 'Empfehlenswert ist eine Vollkaskoversicherung ohne Selbstbeteiligung (CDW/LDW ohne Franchise). Diese schützt dich vor hohen Kosten bei Unfällen oder Schäden. Prüfe vorab, ob deine Kreditkarte bereits eine Mietwagen-Kaskoversicherung einschließt.',
  },
  {
    question: 'Brauche ich eine Kreditkarte für den Mietwagen?',
    answer: 'Ja, fast alle Mietwagenunternehmen weltweit verlangen eine echte Kreditkarte (kein Debit-/EC-Card) als Sicherheitsleistung. Der blockierte Betrag liegt je nach Fahrzeugklasse zwischen 200 und 2.000 Euro und muss auf den Hauptfahrer ausgestellt sein.',
  },
  {
    question: 'Ab welchem Alter kann ich einen Mietwagen mieten?',
    answer: 'Das Mindestalter liegt in den meisten Ländern bei 21 Jahren. Für Fahrer unter 25 Jahren fällt oft ein "Young Driver Surcharge" an – ein täglicher Aufpreis. In einigen Ländern wie den USA sind auch 18-Jährige buchungsberechtigt, zahlen aber höhere Gebühren.',
  },
  {
    question: 'Lohnt sich ein Mietwagen im Urlaub wirklich?',
    answer: 'Absolut – besonders wenn du flexibel sein und abseits der touristischen Hauptwege erkunden möchtest. Auf Inseln wie Mallorca, Kreta oder Teneriffa erschließt sich die schönste Landschaft nur mit eigenem Fahrzeug. Für Familien mit Gepäck ist ein Mietwagen ohnehin kaum wegzudenken.',
  },
  {
    question: 'Was sind die häufigsten Fallen bei Mietwagen-Buchungen?',
    answer: 'Achte besonders auf: die Tankregelung ("Full to Full" ist am fairsten), versteckte Zusatzversicherungen direkt an der Station, teure Zusatzfahrer-Gebühren (vorab online deutlich günstiger) sowie Einschränkungen bei Auslandsfahrten. Dokumentiere immer den Fahrzeugzustand mit Fotos vor der Abfahrt.',
  },
];

// Top 10 destinations displayed on /mietwagen page
export const CAR_RENTAL_DESTINATIONS = [
  {
    id: 'mallorca',
    name: 'Mallorca',
    country: 'Spanien',
    flag: '🇪🇸',
    description: 'Strände, Bergdörfer und versteckte Buchten – Mallorca ist das ideale Ziel für eine Inselrundfahrt auf eigene Faust.',
    searchQuery: 'Mallorca',
  },
  {
    id: 'kreta',
    name: 'Kreta',
    country: 'Griechenland',
    flag: '🇬🇷',
    description: 'Schluchtenwanderungen, antike Stätten und einsame Strände im Süden – Kreta begeistert Entdecker.',
    searchQuery: 'Heraklion Kreta',
  },
  {
    id: 'teneriffa',
    name: 'Teneriffa',
    country: 'Spanien',
    flag: '🇪🇸',
    description: 'Der Teide, schwarze Strände und tropische Wälder – perfekt für eine abwechslungsreiche Inselrundreise.',
    searchQuery: 'Teneriffa',
  },
  {
    id: 'algarve',
    name: 'Algarve',
    country: 'Portugal',
    flag: '🇵🇹',
    description: 'Spektakuläre Felsenküsten, goldene Strände und charmante Fischerdörfer entlang der portugiesischen Südküste.',
    searchQuery: 'Faro Algarve',
  },
  {
    id: 'sardinien',
    name: 'Sardinien',
    country: 'Italien',
    flag: '🇮🇹',
    description: 'Türkisfarbenes Wasser, Nuraghen-Ruinen und unberührte Küstenstraßen – Sardinien wartet auf Entdecker.',
    searchQuery: 'Cagliari Sardinien',
  },
  {
    id: 'island',
    name: 'Island',
    country: 'Island',
    flag: '🇮🇸',
    description: 'Die Ringstraße, Gletscher, Wasserfälle und Geysire – Island ist der ultimative Roadtrip-Traum.',
    searchQuery: 'Reykjavik Island',
  },
  {
    id: 'madeira',
    name: 'Madeira',
    country: 'Portugal',
    flag: '🇵🇹',
    description: 'Levada-Wanderwege, Vulkanlandschaften und subtropische Gärten – Madeira erkundet man am besten per Mietwagen.',
    searchQuery: 'Funchal Madeira',
  },
  {
    id: 'florida',
    name: 'Florida',
    country: 'USA',
    flag: '🇺🇸',
    description: 'Keys, Everglades, Miami Beach und Orlando – Florida bietet endlose Roadtrip-Möglichkeiten.',
    searchQuery: 'Miami Florida',
  },
  {
    id: 'andalusien',
    name: 'Andalusien',
    country: 'Spanien',
    flag: '🇪🇸',
    description: 'Sevilla, Ronda, Granada und weiße Dörfer in den Bergen – Andalusien ist Spaniens schönste Roadtrip-Region.',
    searchQuery: 'Sevilla Andalusien',
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    country: 'Costa Rica',
    flag: '🇨🇷',
    description: 'Regenwald, Vulkane, Pazifik- und Karibikküste – Costa Rica lässt sich am besten selbst fahrend erkunden.',
    searchQuery: 'San José Costa Rica',
  },
];

// Full list of destinations eligible for car rental hints in result cards
export const CAR_RENTAL_ELIGIBLE_DESTINATIONS = [
  'Mallorca', 'Kreta', 'Fuerteventura', 'Teneriffa', 'Lanzarote', 'Gran Canaria',
  'Ibiza', 'Zypern', 'Sizilien', 'Sardinien', 'Korsika',
  'Algarve', 'Portugal', 'Madeira', 'Lissabon', 'Azoren',
  'Andalusien', 'Spanien',
  'Italien', 'Toskana', 'Amalfi',
  'Island',
  'USA', 'Florida', 'Kanada',
  'Australien', 'Neuseeland',
  'Südafrika',
  'Thailand', 'Phuket',
  'Marokko',
  'Costa Rica',
  'Schottland', 'Irland', 'Norwegen',
];

export function buildCheck24CarRentalUrl({ pickupLocation, pickupDate, returnDate, driverAge } = {}) {
  const base = CHECK24_CAR_RENTAL_AFFILIATE_URL;
  const params = new URLSearchParams();
  if (pickupLocation) params.set('where', pickupLocation);
  if (pickupDate)     params.set('pickup_date', pickupDate);
  if (returnDate)     params.set('return_date', returnDate);
  if (driverAge)      params.set('driver_age', String(driverAge));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function isCarRentalEligible(destinationName) {
  if (!destinationName) return false;
  const norm = destinationName.trim().toLowerCase();
  return CAR_RENTAL_ELIGIBLE_DESTINATIONS.some(
    d => norm.includes(d.toLowerCase()) || d.toLowerCase().includes(norm)
  );
}
