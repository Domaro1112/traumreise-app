// ── Helper: create a placeholder destination ────────────────────────────────
function placeholder(name, slug, country, region, travelType, carRentalRecommended, affiliateSearchIntent, heroGradient, similarDestinations = []) {
  return {
    name,
    slug,
    country,
    region,
    heroImage: `/images/destinations/${slug}.jpg`,
    heroGradient,
    shortDescription: `${name} – ausführliche Reiseinfos, Tipps und Angebote folgen in Kürze.`,
    longDescription: '',
    aiSummary: '',
    bestTravelTime: '',
    idealDuration: '',
    travelType,
    quickFacts: {},
    highlights: [],
    insiderTips: [],
    faq: [],
    similarDestinations,
    carRentalRecommended,
    affiliateSearchIntent,
    isPlaceholder: true,
  };
}

// ── Full destinations ────────────────────────────────────────────────────────

const MALLORCA = {
  name: 'Mallorca',
  slug: 'mallorca',
  country: 'Spanien',
  region: 'Balearen',
  heroImage: '/images/destinations/mallorca.jpg',
  heroGradient: 'linear-gradient(160deg, #0369A1 0%, #0EA5E9 60%, #BAE6FD 100%)',
  shortDescription: 'Mallorca vereint türkisfarbene Buchten, das zerklüftete Tramuntana-Gebirge und die lebhafte Hauptstadt Palma – die vielseitigste Ferieninsel Europas.',
  longDescription: `Mallorca ist die größte der Baleareninseln und bietet weit mehr als sein Partyruf vermuten lässt. Das UNESCO-Welterbe Tramuntana-Gebirge lockt Wanderer und Radfahrer in malerische Bergdörfer wie Valldemossa und Deià. Die Südküste glänzt mit kilometerlangen weißen Sandstränden wie dem Platja des Trenc, während die Ostküste dramatische Felsbuchten und die beeindruckenden Tropfsteinhöhlen Coves del Drach bereithält. Palma de Mallorca überzeugt mit gotischer Kathedrale, Altstadt-Flair und einer lebhaften Gastronomie- und Kulturszene – Mallorca ist das ganze Jahr eine Reise wert.`,
  aiSummary: `Mallorca ist die größte Baleareninsel Spaniens mit einer Fläche von 3.640 km² und liegt ca. 2,5 Flugstunden von Deutschland entfernt. Die Insel eignet sich für Strandurlaub, Aktivurlaub, Familienreisen und Kulturreisen gleichermaßen. Die beste Reisezeit ist Mai bis Oktober; September und Oktober bieten angenehme Temperaturen abseits des Hochsaisontrubels. Ein Mietwagen ist die beste Art, die Insel zu erkunden – besonders die Nordwestküste und die Bergdörfer im Tramuntana. Typische Unterkünfte reichen von Ferienapartments und Hotels in Resortgebieten bis zu Agrotourismus-Fincas im Inland.`,
  bestTravelTime: 'Mai bis Oktober (beste Zeit: Mai, Juni, September, Oktober)',
  idealDuration: '7–14 Tage',
  travelType: ['Strand', 'Natur', 'Familie', 'Kultur'],
  quickFacts: {
    currency: 'Euro (€)',
    language: 'Spanisch, Katalanisch',
    timezone: 'MEZ/MESZ (wie Deutschland)',
    flightTime: 'ca. 2–2,5 Stunden',
    visaRequired: 'Nein (EU-Bürger)',
    bestMonths: 'Mai – Oktober',
    avgTempSummer: '28°C',
    capital: 'Palma de Mallorca',
  },
  highlights: [
    'Tramuntana-Gebirge (UNESCO-Welterbe)',
    'Platja des Trenc – wildester Sandstrand der Insel',
    'Altstadt Palma mit gotischer Kathedrale La Seu',
    'Coves del Drach – spektakuläre Tropfsteinhöhlen',
    'Cap de Formentor – dramatisches Küstenkap im Norden',
    'Bergdörfer Valldemossa und Deià',
  ],
  insiderTips: [
    'Mietwagen früh buchen: Im Sommer schnell ausgebucht – am besten 3 Monate vor Abflug reservieren.',
    'Nordwestküste statt Ballermann: Die MA-10 zwischen Andratx und Pollença ist eine der schönsten Küstenstraßen Europas.',
    'September reisen: Weniger Touristen, 26°C Wassertemperatur, günstigere Preise als Juli/August.',
    'Lokale Märkte: Wochenmärkte in Sineu (mittwochs) und Pollença (sonntags) bieten frische Produkte und Handwerk.',
    'Ensaïmada im Original: Das Hefegebäck kauft man am besten morgens frisch aus einer Bäckerei in Palma – nicht am Flughafen.',
  ],
  faq: [
    {
      question: 'Wann ist die beste Reisezeit für Mallorca?',
      answer: 'Die beste Reisezeit ist Mai bis Oktober. Juli und August sind die Hochsaison mit bis zu 35°C und sehr vollen Stränden. Mai, Juni, September und Oktober bieten angenehme 22–28°C, weniger Touristen und günstigere Preise. April ist ideal zum Wandern im Tramuntana.',
    },
    {
      question: 'Wie lange sollte man Mallorca bereisen?',
      answer: '7–10 Tage reichen für die Highlights: Palma, Nordwestküste und die schönsten Strände. Wer die ganze Insel mit Bergdörfern und weniger bekannten Buchten erkunden möchte, sollte 14 Tage einplanen.',
    },
    {
      question: 'Wie kommt man nach Mallorca?',
      answer: 'Direktflüge aus allen deutschen Großstädten (Frankfurt, München, Berlin, Hamburg, Düsseldorf u.a.) zum Flughafen Palma de Mallorca (PMI). Flugzeit ca. 2–2,5 Stunden. Im Sommer gibt es täglich Dutzende Verbindungen.',
    },
    {
      question: 'Was kostet ein Urlaub auf Mallorca?',
      answer: 'Budgetreisende kommen ab ca. 600–900 € pro Woche (Flug, Unterkunft, Essen, Mietwagen) aus. Mittelklasse-Urlaub liegt bei 1.200–1.800 € pro Person. Luxusresorts und Fincas können deutlich teurer sein. Im Mai oder Oktober sparen Reisende gegenüber der Hochsaison oft 30–40 %.',
    },
    {
      question: 'Braucht man für Mallorca ein Visum?',
      answer: 'Nein. Als EU-Mitgliedsstaat benötigen EU-Bürger für Mallorca kein Visum. Ein gültiger Personalausweis oder Reisepass genügt. Für Nicht-EU-Bürger gelten die allgemeinen Schengen-Regeln.',
    },
    {
      question: 'Was sind die schönsten Strände auf Mallorca?',
      answer: 'Platja des Trenc (unverbautem Naturstrand im Süden), Cala Formentor (türkisfarbenes Wasser, Kiefernwald), Cala Millor (langer Sandstrand im Osten) und Cala Mondragó (Naturschutzgebiet) zählen zu den schönsten. Im Norden begeistern Cala Sant Vicenç und Cala Mesquida mit klarem Wasser.',
    },
    {
      question: 'Ist Mallorca für Familien mit Kindern geeignet?',
      answer: 'Sehr gut geeignet. Die Insel bietet flache Sandstrände, Wasserparks (Aqualand, Western Water Park), Tierparks (Natura Parc) und Freizeitparks. Viele Hotels verfügen über spezielle Kinderanimation und Kindergerichte. Besonders die Hotelzonen Port d\'Alcúdia und Cala d\'Or sind familienfreundlich.',
    },
    {
      question: 'Lohnt sich ein Mietwagen auf Mallorca?',
      answer: 'Ja, unbedingt. Öffentliche Busse verbinden nur die größten Orte. Mit einem Mietwagen erschließt man die schönsten Buchten, Bergdörfer und Aussichtspunkte. Preise ab ca. 25–40 €/Tag bei frühzeitiger Buchung. Kleinwagen (MINI, VW Polo) reichen für die Insel vollkommen.',
    },
    {
      question: 'Was sollte man in Palma de Mallorca unbedingt gesehen haben?',
      answer: 'Kathedrale La Seu (abends beleuchtet besonders imposant), die gotische Lonja, das Araberbad Banys Àrabs, das Künstlerviertel Sant Feliu und den Passeig des Born. Am besten morgens zu Fuß erkunden, bevor die Tagestouristen von den Kreuzfahrtschiffen ankommen.',
    },
    {
      question: 'Was isst und trinkt man auf Mallorca?',
      answer: 'Typisch mallorquinisch: Pa amb oli (Brot mit Tomaten und Olivenöl), Sobrasada (Paprikawurst), Tumbet (Gemüse-Auflauf), Coca de trampó (dünner Gemüsekuchen) und das weltberühmte Hefegebäck Ensaïmada. Lokale Weine aus der DO Binissalem sind sehr empfehlenswert.',
    },
  ],
  similarDestinations: ['kreta', 'teneriffa', 'sardinien'],
  carRentalRecommended: true,
  affiliateSearchIntent: 'Mallorca Spanien',
  isPlaceholder: false,
};

const BALI = {
  name: 'Bali',
  slug: 'bali',
  country: 'Indonesien',
  region: 'Südostasien',
  heroImage: '/images/destinations/bali.jpg',
  heroGradient: 'linear-gradient(160deg, #064E3B 0%, #059669 55%, #6EE7B7 100%)',
  shortDescription: 'Bali fasziniert mit spiritueller Tempelkultur, smaragdgrünen Reisterrassen, kosmopolitischen Strandclubs und üppigem Dschungel – die Trauminsel Südostasiens.',
  longDescription: `Bali, die "Insel der Götter", ist Indonesiens bekanntestes Reiseziel und bietet eine einzigartige Mischung aus hinduistischer Kultur, spektakulärer Natur und modernem Tourismusangebot. Im Kulturzentrum Ubud verschmelzen traditionelle Tempelfeste, Reisfelder und eine lebhafte Kunstszene. Die Südküste rund um Seminyak und Canggu ist bekannt für weltklasse Surfwellen, hippe Cafés und Luxusvillen. Im Norden wartet das spirituelle Herz der Insel mit Tempeln wie Tanah Lot und Uluwatu, während das Hochland von Kintamani atemberaubende Vulkanpanoramen bietet. Bali ist für jeden etwas – vom Backpacker bis zum Luxusreisenden, vom Surfer bis zum Yogaurlauber.`,
  aiSummary: `Bali ist eine indonesische Insel mit ca. 4,2 Millionen Einwohnern und einem der stärksten Tourismussektoren Südostasiens. Die Insel liegt ca. 13 Flugstunden von Deutschland entfernt und ist das ganze Jahr bereisbar, wobei die Trockenzeit von April bis Oktober ideal ist. Hauptregionen: Ubud (Kultur, Natur), Seminyak/Canggu (Nightlife, Strand), Uluwatu (Surfen, Klippen-Tempel), Nusa Dua (Luxusresorts). Die Landeswährung ist die indonesische Rupiah (IDR); Kleingeld für Tempel-Eintrittsgelder und lokale Märkte mitnehmen. Deutsche Staatsbürger erhalten bei Einreise einen kostenfreien Visa on Arrival für 30 Tage.`,
  bestTravelTime: 'April bis Oktober (Trockenzeit)',
  idealDuration: '10–14 Tage',
  travelType: ['Strand', 'Natur', 'Kultur', 'Abenteuer', 'Luxus'],
  quickFacts: {
    currency: 'Indonesische Rupiah (IDR)',
    language: 'Balinesisch, Indonesisch; Englisch in Touristenzentren',
    timezone: 'WITA (UTC+8, 6 Std. vor Deutschland)',
    flightTime: 'ca. 12–14 Stunden (meist Stopover)',
    visaRequired: 'Visa on Arrival (30 Tage, kostenlos für Deutsche)',
    bestMonths: 'April – Oktober',
    avgTempSummer: '30°C',
    capital: 'Denpasar',
  },
  highlights: [
    'Reisterrassen Tegallalang (UNESCO-Welterbe)',
    'Tanah Lot – Tempel auf Meeresfelsklippe',
    'Ubud Sacred Monkey Forest Sanctuary',
    'Surfstrände Kuta und Uluwatu',
    'Sunrise am Vulkan Batur (1.717 m)',
    'Traditionelle Kecak-Feuershow in Uluwatu',
  ],
  insiderTips: [
    'Regenzeit (November–März) meiden: Tropische Regengüsse können Ausflüge erheblich einschränken; April bietet grüne Landschaft ohne Regenrisiko.',
    'Privatchauffeur statt Mietwagen: Linksverkehr und chaotische Straßen machen einen lokalen Fahrer für ca. 40–60 €/Tag zur komfortableren und sichereren Wahl.',
    'Ubud morgens früh: Tempelfeste und Märkte finden meist vor 10 Uhr statt – danach kommen Tagestouristen.',
    'Villenmiete lohnt sich: Für Familien oder Paare ab ca. 70–100 €/Nacht Privatpool-Villa oft günstiger als Hotelzimmer gleicher Qualität.',
    'Sarong und Schulterschal mitnehmen: Für Tempelbesuche zwingend erforderlich; vor Ort für ca. 2 € erhältlich, aber eigener ist hygienischer.',
  ],
  faq: [
    {
      question: 'Wann ist die beste Reisezeit für Bali?',
      answer: 'Die Trockenzeit von April bis Oktober ist ideal. Juli und August sind zwar die touristischste Zeit, aber das Wetter ist am stabilsten. April, Mai und September bieten angenehme Temperaturen, weniger Touristendrang und günstigere Preise. Die Regenzeit (November–März) bringt tägliche Regengüsse, was Ausflüge erschwert.',
    },
    {
      question: 'Wie lange sollte man Bali bereisen?',
      answer: '10–14 Tage sind ideal, um Ubud, die Südküste und mindestens einen Tagesausflug (Vulkan, Nusa Penida) zu erleben. Kürzer als 7 Tage lohnt sich wegen der langen Reisezeit kaum. Für Slow-Travel-Reisende oder Digitalnomadenurlaub sind 3–4 Wochen wunderbar.',
    },
    {
      question: 'Wie kommt man nach Bali?',
      answer: 'Der internationale Flughafen Ngurah Rai (DPS) in Denpasar ist der einzige internationale Airport. Von Deutschland gibt es keine Direktflüge; übliche Stopover-Verbindungen laufen über Dubai (Emirates), Doha (Qatar Airways), Amsterdam (KLM/Garuda), Singapur oder Kuala Lumpur. Gesamtreisezeit ca. 14–17 Stunden.',
    },
    {
      question: 'Braucht man für Bali ein Visum?',
      answer: 'Deutsche Staatsbürger erhalten bei Einreise einen Visa on Arrival (VoA) für 30 Tage – kostenlos. Eine einmalige Verlängerung um 30 Tage ist in Bali möglich. Für längere Aufenthalte empfiehlt sich ein B211A Social/Cultural Visa, das vorab beantragt werden muss.',
    },
    {
      question: 'Was kostet ein Urlaub auf Bali?',
      answer: 'Bali ist für jeden Geldbeutel. Backpacker kommen mit 30–50 €/Tag aus (Hostel, lokales Essen, Scooter). Mittelklasse-Reisende planen 80–150 €/Tag (Boutique-Hotel, Restaurantbesuche, Touren). Luxusvillen mit Privatpool beginnen bei ca. 100 €/Nacht, Highend-Resorts gehen weit darüber hinaus.',
    },
    {
      question: 'Welche Regionen auf Bali empfehlen sich für wen?',
      answer: 'Ubud: Kultur, Yoga, Natur, Wandern. Seminyak/Canggu: Strandclubs, Surfen, Nightlife, Digitalnomaden. Uluwatu: Klippen, Surfen, Sonnenuntergänge. Nusa Dua: Familien, Luxusresorts, ruhige Strände. Amed/Tulamben: Tauchen, Schnorcheln, Ruhe. Sanur: ruhigeres Flair, Familien.',
    },
    {
      question: 'Ist Bali für Alleinreisende geeignet?',
      answer: 'Sehr gut – besonders Canggu ist zum internationalen Hub für Solotravel und Digitalnomadengewordenen. Hostels, Co-Working-Spaces und organisierte Touren erleichtern das Kennenlernen. Frauen allein reisen nach allgemeiner Erfahrung sicher, sollten aber abends beleuchtete Straßen bevorzugen.',
    },
    {
      question: 'Wie bewegt man sich auf Bali fort?',
      answer: 'Scootermiete (ca. 5–8 €/Tag) ist die günstigste Option für erfahrene Fahrer. Für Tagesausflüge empfiehlt sich ein Privatfahrer (ca. 40–60 €/Tag) oder Touren. Apps wie Gojek und Grab (Uber-Äquivalent) funktionieren gut in Touristenzentren. Taxis (Blue Bird) sind seriöser als Wildtaxis.',
    },
    {
      question: 'Was muss man auf Bali unbedingt erlebt haben?',
      answer: 'Sonnenaufgang am Gunung Batur (Vulkantrekking ab 3:30 Uhr), Kecak-Feuershow in Uluwatu bei Sonnenuntergang, einen Tempelfest (Odalan) besuchen, Kochen lernen in einem Ubud-Kochkurs, schwimmen in einer der Reiswasserfall-Pools wie Sekumpul, und einmal ein Balinesisches Heilritual (Melukat) erleben.',
    },
    {
      question: 'Ist Bali sicher für Touristen?',
      answer: 'Bali gilt als eines der sichersten Ziele in Südostasien. Kleinkriminalität (Taschendiebstahl) kommt vor, größere Sicherheitsvorfälle sind selten. Die wichtigsten Vorsichtsmaßnahmen: auf Motorrädern immer Helm tragen, Leitungswasser nicht trinken, vor Scooter-Fahrten eine Reiseunfallversicherung abschließen.',
    },
  ],
  similarDestinations: ['thailand', 'sri-lanka', 'mauritius'],
  carRentalRecommended: true,
  affiliateSearchIntent: 'Bali Indonesien',
  isPlaceholder: false,
};

const KRETA = {
  name: 'Kreta',
  slug: 'kreta',
  country: 'Griechenland',
  region: 'Ägäis',
  heroImage: '/images/destinations/kreta.jpg',
  heroGradient: 'linear-gradient(160deg, #1E3A8A 0%, #2563EB 55%, #93C5FD 100%)',
  shortDescription: 'Kreta, die größte griechische Insel, besticht mit dem minoischen Erbe, der Samaria-Schlucht, türkisblauen Lagunen und einer der großzügigsten Gastfreundschaften Europas.',
  longDescription: `Kreta ist die südlichste und größte Insel Griechenlands und verbindet in einzigartiger Weise antike Geschichte, wilde Natur und entspanntes Mittelmeer-Urlaubsflair. Der Westen der Insel mit dem venezianischen Hafen Chanias gilt als der malerischste Teil; im Zentrum liegt Rethymno mit seiner gut erhaltenen Altstadt. Der Osten um Agios Nikolaos und die Lagune von Vai hat einen eigenen ruhigeren Charakter. Das Inland überrascht mit dem Samaria-Nationalpark, in dem die längste Schlucht Europas (16 km) durchwandert werden kann. Kreta hat eine der reichsten kulinarischen Traditionen Griechenlands – die kretische Küche gilt als einer der Grundpfeiler der mediteranen Ernährung.`,
  aiSummary: `Kreta ist mit 8.303 km² die größte griechische Insel und liegt ca. 3 Flugstunden von Deutschland entfernt. Die Insel ist ganzjährig bereisbar, wobei Mai bis Oktober die Hauptsaison darstellt. Hauptflughäfen: Heraklion (HER) im Osten und Chania (CHQ) im Westen. Bekannt für: Minoische Zivilisation (Knossos-Palast), Samaria-Schlucht, Elafonissi-Strand, venezianische Altstädte. Ein Mietwagen ist auf Kreta unverzichtbar, da viele der schönsten Strände und Dörfer nur über kurvenreiche Bergstraßen erreichbar sind. Die kretische Küche – besonders Dakos, Lamm und lokaler Olivenöl – ist weltbekannt.`,
  bestTravelTime: 'Mai bis Oktober (beste Zeit: Mai, Juni, September)',
  idealDuration: '7–14 Tage',
  travelType: ['Strand', 'Natur', 'Kultur', 'Familie'],
  quickFacts: {
    currency: 'Euro (€)',
    language: 'Griechisch; Englisch in Touristenzentren',
    timezone: 'OEZ/OESZ (1 Std. vor Deutschland)',
    flightTime: 'ca. 3–3,5 Stunden',
    visaRequired: 'Nein (EU-Bürger)',
    bestMonths: 'Mai – Oktober',
    avgTempSummer: '30°C',
    capital: 'Heraklion',
  },
  highlights: [
    'Elafonissi – rosa Sandlagune im Westen',
    'Samaria-Schlucht – längste Schlucht Europas',
    'Knossos-Palast – Zentrum der Minoischen Zivilisation',
    'Balos-Lagune – türkisfarbenes Flachwasser',
    'Venezianischer Hafen Chania',
    'Preveli-Palmenlagune mit Flussauslauf',
  ],
  insiderTips: [
    'Mietwagen buchen: Viele der schönsten Strände sind ohne Auto kaum erreichbar – auf Kreta ist ein Mietwagen wichtiger als auf jeder anderen griechischen Insel.',
    'Chania statt Heraklion als Basis: Die Altstadt Chanias ist mittelalterlich-venezianisch und deutlich charmanter als die Hauptstadt.',
    'Sfakia für Authentizität: Das kleine Fischerdorf an der Südküste ist gelebtes Kreta fernab von Touristenzentren – Lammgerichte hier unbedingt probieren.',
    'Frühzeitig zur Samaria-Schlucht: Die 16 km lange Wanderung beginnt am besten vor 8 Uhr, um Menschenmassen zu vermeiden und die Abkühlung im Flussbett zu genießen.',
    'September ist ideal: Wassertemperatur 24°C, 26°C Lufttemperatur, Erntesaison – Trauben und Feigen direkt vom Baum am Wegesrand.',
  ],
  faq: [
    {
      question: 'Wann ist die beste Reisezeit für Kreta?',
      answer: 'Mai bis Oktober ist die Hauptsaison. Juli und August sind heiß (32–35°C) und touristisch. Mai, Juni, September und Oktober sind angenehmer – die Natur ist noch grün bzw. die Temperaturen milder. April eignet sich hervorragend zum Wandern.',
    },
    {
      question: 'Wie lange sollte man Kreta bereisen?',
      answer: 'Eine Woche reicht für eine Region (z.B. Westen mit Chania und Elafonissi). Für die gesamte Insel inklusive Samaria-Wanderung und Ostküste sollte man 10–14 Tage einplanen. Die Insel ist mit 260 km Länge deutlich größer als die meisten Besucher erwarten.',
    },
    {
      question: 'Welcher Flughafen ist besser: Heraklion oder Chania?',
      answer: 'Das hängt vom Reiseziel ab. Heraklion (HER) liegt im Osten und ist besser für Knossos, den Lassithi-Hochebene und den Rethymno-Bereich. Chania (CHQ) ist ideal für den Westen mit Elafonissi, Balos und Samaria-Schlucht. Chania hat deutlich weniger Passagiere und ist angenehmer.',
    },
    {
      question: 'Braucht man für Kreta ein Visum?',
      answer: 'Nein. Kreta gehört zu Griechenland und damit zur EU. EU-Bürger benötigen nur einen gültigen Personalausweis oder Reisepass. Für Nicht-EU-Bürger gelten die Schengen-Einreiseregeln.',
    },
    {
      question: 'Was kostet ein Urlaub auf Kreta?',
      answer: 'Budgetreisen sind ab ca. 700–900 € pro Person und Woche möglich. Mittelklasse-Urlaub liegt bei 1.100–1.600 € (inkl. Flug, Hotel, Mietwagen). Luxusresorts an der Südküste oder All-inclusive-Hotels kosten entsprechend mehr. Essen und Trinken sind günstiger als in Westeuropa.',
    },
    {
      question: 'Was sind die besten Sehenswürdigkeiten auf Kreta?',
      answer: 'Knossos-Palast (minoische Ausgrabungsstätte), Samaria-Schlucht (Wanderung), Elafonissi und Balos (Lagunen), Venetianisches Chania und Rethymno, Spinalonga (Leprakolonie-Insel) und der Archäologische Nationalmuseum in Heraklion – eines der bedeutendsten der Welt.',
    },
    {
      question: 'Ist Kreta für Familien mit Kindern geeignet?',
      answer: 'Sehr gut. Flache Sandstrände wie Georgioupolis, Platanias und Plakias sind perfekt für Kinder. Viele Hotels bieten Kinderanimation an. Die Samaria-Schlucht ist auch mit älteren Kindern (ab 8 Jahren) machbar. Für kleine Kinder ist der Norden mit ruhigen Badebuchten ideal.',
    },
    {
      question: 'Lohnt sich ein Mietwagen auf Kreta?',
      answer: 'Unbedingt. Die schönsten Strände und Bergdörfer sind nur mit eigenem Fahrzeug erreichbar. Busse verbinden nur die Hauptorte. Kleinwagen mit Allradoption empfohlen für Schotterpisten zur Südküste. Preise ab ca. 25–45 €/Tag – frühzeitige Buchung spart erheblich.',
    },
    {
      question: 'Ist der Osten oder Westen von Kreta schöner?',
      answer: 'Beide Teile haben ihre Qualitäten. Der Westen (Chania, Elafonissi, Samaria) gilt als malerischer und ruhiger. Der Osten (Agios Nikolaos, Spinalonga, Vai-Palmenstrand) ist historisch und naturschönheitsreich. Die Mitte (Rethymno) verbindet beides. Für einen zweiwöchigen Urlaub lohnt sich eine Rundreise.',
    },
    {
      question: 'Was isst man auf Kreta?',
      answer: 'Die kretische Küche ist mediterran und sehr gesund. Typisch: Dakos (Zwieback mit Tomaten, Käse, Olivenöl), Staka (Spezialrahm), gegrilltes Lamm und Ziege, frischer Fisch, Kalitsounia (Käse- oder Spinatpasteten) und der lokale Raki (Tresterbrand) nach dem Essen – dieser wird auf Kreta traditionell gratis zum Kaffee gereicht.',
    },
  ],
  similarDestinations: ['mallorca', 'sardinien', 'algarve'],
  carRentalRecommended: true,
  affiliateSearchIntent: 'Kreta Griechenland',
  isPlaceholder: false,
};

// ── Placeholder destinations ─────────────────────────────────────────────────

export const SEO_DESTINATIONS = [
  MALLORCA,
  BALI,
  KRETA,
  placeholder('Teneriffa',  'teneriffa',  'Spanien',      'Kanarische Inseln', ['Strand', 'Natur', 'Familie'],         true,  'Teneriffa Spanien Kanarische Inseln',     'linear-gradient(160deg, #0369A1 0%, #0EA5E9 100%)',             ['mallorca', 'kreta', 'madeira']),
  placeholder('Madeira',    'madeira',    'Portugal',     'Atlantik',          ['Natur', 'Abenteuer', 'Wandern'],       true,  'Madeira Portugal',                        'linear-gradient(160deg, #064E3B 0%, #059669 100%)',             ['algarve', 'teneriffa', 'island']),
  placeholder('Algarve',    'algarve',    'Portugal',     'Südportugal',       ['Strand', 'Natur', 'Familie'],          true,  'Algarve Portugal',                        'linear-gradient(160deg, #B45309 0%, #F59E0B 100%)',             ['kreta', 'sardinien', 'mallorca']),
  placeholder('Sardinien',  'sardinien',  'Italien',      'Mittelmeer',        ['Strand', 'Natur', 'Kultur'],           true,  'Sardinien Italien',                       'linear-gradient(160deg, #0E7490 0%, #06B6D4 100%)',             ['kreta', 'mallorca', 'algarve']),
  placeholder('Thailand',   'thailand',   'Thailand',     'Südostasien',       ['Strand', 'Kultur', 'Abenteuer'],       true,  'Thailand',                                'linear-gradient(160deg, #7C3AED 0%, #A78BFA 100%)',             ['bali', 'sri-lanka', 'vietnam']),
  placeholder('Mauritius',  'mauritius',  'Mauritius',    'Indischer Ozean',   ['Strand', 'Luxus', 'Familie'],          false, 'Mauritius',                               'linear-gradient(160deg, #0891B2 0%, #67E8F9 100%)',             ['bali', 'malediven', 'thailand']),
  placeholder('Island',     'island',     'Island',       'Nordatlantik',      ['Natur', 'Abenteuer', 'Roadtrip'],      true,  'Island Reykjavik',                        'linear-gradient(160deg, #1E3A5F 0%, #1D4ED8 100%)',             ['norwegen', 'kanada', 'madeira']),
  placeholder('New York',   'new-york',   'USA',          'Nordamerika',       ['Stadt', 'Kultur', 'Abenteuer'],        false, 'New York City USA',                       'linear-gradient(160deg, #1F2937 0%, #374151 100%)',             ['dubai', 'japan', 'kapstadt']),
  placeholder('Dubai',      'dubai',      'Vereinigte Arabische Emirate', 'Naher Osten', ['Stadt', 'Luxus', 'Familie'], false, 'Dubai VAE',                               'linear-gradient(160deg, #92400E 0%, #F59E0B 100%)',             ['new-york', 'mauritius', 'malediven']),
  placeholder('Florida',    'florida',    'USA',          'Nordamerika',       ['Strand', 'Familie', 'Abenteuer'],      true,  'Florida USA',                             'linear-gradient(160deg, #B45309 0%, #FCD34D 100%)',             ['kanada', 'costa-rica', 'new-york']),
  placeholder('Norwegen',   'norwegen',   'Norwegen',     'Nordeuropa',        ['Natur', 'Abenteuer', 'Roadtrip'],      true,  'Norwegen Fjorde',                         'linear-gradient(160deg, #1E3A5F 0%, #60A5FA 100%)',             ['island', 'kanada', 'madeira']),
  placeholder('Kapstadt',   'kapstadt',   'Südafrika',    'Afrika',            ['Stadt', 'Natur', 'Abenteuer'],         true,  'Kapstadt Südafrika',                      'linear-gradient(160deg, #7F1D1D 0%, #EF4444 100%)',             ['mauritius', 'bali', 'costa-rica']),
  placeholder('Malediven',  'malediven',  'Malediven',    'Indischer Ozean',   ['Strand', 'Luxus'],                     false, 'Malediven',                               'linear-gradient(160deg, #0C4A6E 0%, #38BDF8 100%)',             ['mauritius', 'bali', 'thailand']),
  placeholder('Sri Lanka',  'sri-lanka',  'Sri Lanka',    'Indischer Ozean',   ['Natur', 'Kultur', 'Abenteuer'],        true,  'Sri Lanka',                               'linear-gradient(160deg, #064E3B 0%, #10B981 100%)',             ['bali', 'thailand', 'mauritius']),
  placeholder('Costa Rica', 'costa-rica', 'Costa Rica',   'Mittelamerika',     ['Natur', 'Abenteuer', 'Familie'],       true,  'Costa Rica',                              'linear-gradient(160deg, #166534 0%, #4ADE80 100%)',             ['florida', 'bali', 'kapstadt']),
  placeholder('Japan',      'japan',      'Japan',        'Ostasien',          ['Stadt', 'Kultur', 'Natur'],            false, 'Japan Tokio Kyoto',                       'linear-gradient(160deg, #9F1239 0%, #FB7185 100%)',             ['new-york', 'dubai', 'thailand']),
  placeholder('Kanada',     'kanada',     'Kanada',       'Nordamerika',       ['Natur', 'Abenteuer', 'Roadtrip'],      true,  'Kanada',                                  'linear-gradient(160deg, #7F1D1D 0%, #DC2626 100%)',             ['norwegen', 'island', 'florida']),
];

// ── Helper functions ─────────────────────────────────────────────────────────

export function getDestinationBySlug(slug) {
  return SEO_DESTINATIONS.find(d => d.slug === slug) ?? null;
}

export function getDestinationSlugByName(name) {
  if (!name) return null;
  const norm = name.trim().toLowerCase();
  // Exact match first
  const exact = SEO_DESTINATIONS.find(d => d.name.toLowerCase() === norm);
  if (exact) return exact.slug;
  // Partial match
  const partial = SEO_DESTINATIONS.find(
    d => norm.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(norm)
  );
  return partial?.slug ?? null;
}

export const TRAVEL_TYPES = ['Strand', 'Stadt', 'Natur', 'Abenteuer', 'Familie', 'Luxus'];
