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

export const CAR_RENTAL_ELIGIBLE_DESTINATIONS = [
  'Mallorca', 'Kreta', 'Fuerteventura', 'Teneriffa', 'Lanzarote', 'Gran Canaria',
  'Ibiza', 'Zypern', 'Sizilien', 'Sardinien', 'Korsika',
  'Portugal', 'Algarve', 'Lissabon',
  'Italien', 'Toskana',
  'Spanien',
  'USA', 'Florida', 'Kanada',
  'Australien', 'Neuseeland',
  'Südafrika',
  'Thailand', 'Phuket',
  'Marokko',
];

export const CAR_RENTAL_DESTINATIONS = [
  {
    id: 'mallorca',
    name: 'Mallorca',
    country: 'Spanien',
    flag: '🇪🇸',
    description: 'Strände, Berge und malerische Buchten – Mallorca ist ideal für eine Inselrundfahrt auf eigene Faust.',
    searchQuery: 'Mallorca',
  },
  {
    id: 'kreta',
    name: 'Kreta',
    country: 'Griechenland',
    flag: '🇬🇷',
    description: 'Schluchtenwanderungen, antike Stätten und einsame Strände im Süden – perfekt für Entdecker.',
    searchQuery: 'Heraklion Kreta',
  },
  {
    id: 'fuerteventura',
    name: 'Fuerteventura',
    country: 'Spanien',
    flag: '🇪🇸',
    description: 'Weitläufige Dünenlandschaften und endlose Strände auf den Kanaren.',
    searchQuery: 'Fuerteventura',
  },
  {
    id: 'teneriffa',
    name: 'Teneriffa',
    country: 'Spanien',
    flag: '🇪🇸',
    description: 'Der Teide, schwarze Strände und tropische Wälder – perfekt für eine abwechslungsreiche Rundreise.',
    searchQuery: 'Teneriffa',
  },
  {
    id: 'portugal',
    name: 'Portugal',
    country: 'Portugal',
    flag: '🇵🇹',
    description: 'Von der Algarve bis Porto – Portugal lädt zu einem der schönsten Roadtrips Europas ein.',
    searchQuery: 'Lissabon Portugal',
  },
  {
    id: 'italien',
    name: 'Italien',
    country: 'Italien',
    flag: '🇮🇹',
    description: 'Toskana, Sizilien oder Amalfiküste – Italiens Schönheit erschließt sich am besten mit dem Auto.',
    searchQuery: 'Rom Italien',
  },
  {
    id: 'usa',
    name: 'USA',
    country: 'USA',
    flag: '🇺🇸',
    description: 'Route 66, Nationalparks und Küstenstraßen – der Klassiker unter den Roadtrip-Zielen weltweit.',
    searchQuery: 'Los Angeles USA',
  },
  {
    id: 'thailand',
    name: 'Thailand',
    country: 'Thailand',
    flag: '🇹🇭',
    description: 'Chiang Mai, die Nordküste und ruhige Halbinseln – Thailand überrascht mit dem eigenen Fahrzeug.',
    searchQuery: 'Phuket Thailand',
  },
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
