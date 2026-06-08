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

// ── Step 3: Region safe-images (all photo IDs confirmed in the project) ──────
const REGION_IMAGES = {
  alps:        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=88', // mountain lake
  mediterranean:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88', // Santorini
  atlantic:    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=88',    // Lisbon coast
  nordics:     'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=88', // fjord
  tropical:    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=88', // Bali lush
  beach:       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=88', // clear beach
  cityeurope:  'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1400&q=88', // Amsterdam canals
  cityusa:     'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=88', // NYC Manhattan
  cityasia:    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=88', // Tokyo skyline
  island:      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&q=88', // Maldives overwater
  desert:      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=88', // Dubai desert city
  nature:      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=88', // forest sunlight
  mountains:   'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=88', // Banff peaks
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
export const DESTINATION_IMAGES = {

  // ── Switzerland ─────────────────────────────────────────────────────────────
  schweiz:        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=88', // alpine lake
  switzerland:    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=88',
  luzern:         'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1400&q=88', // lake city
  lucerne:        'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1400&q=88',
  zuerich:        'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1400&q=88', // Zürich old town
  zurich:         'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1400&q=88',
  zermatt:        'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=1400&q=88', // Matterhorn
  interlaken:     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=88', // alpine valley
  genf:           'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1400&q=88', // Lake Geneva
  geneva:         'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1400&q=88',
  bern:           'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=88', // swiss city/alps fallback

  // ── Austria ─────────────────────────────────────────────────────────────────
  oesterreich:    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88', // Vienna
  austria:        'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88',
  wien:           'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88', // confirmed
  vienna:         'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88',
  salzburg:       'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1400&q=88', // baroque fortress
  innsbruck:      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=88', // alpine → alps
  hallstatt:      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1400&q=88', // lake village

  // ── Germany ─────────────────────────────────────────────────────────────────
  deutschland:    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=88', // Bavarian castle
  germany:        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=88',
  berlin:         'https://images.unsplash.com/photo-1560930700-b2e26b58f6e3?w=1400&q=88', // Brandenburg Gate
  muenchen:       'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=88', // Bavaria
  munich:         'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=88',
  hamburg:        'https://images.unsplash.com/photo-1554196869-fb30d4b72f1c?w=1400&q=88', // Speicherstadt
  koeln:          'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=88', // Germany fallback
  cologne:        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=88',
  schwarzwald:    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=88', // forest

  // ── France ──────────────────────────────────────────────────────────────────
  frankreich:     'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&q=88', // Paris Eiffel
  france:         'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&q=88',
  paris:          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&q=88', // confirmed
  nizza:          'https://images.unsplash.com/photo-1491166617655-4effd3c0c398?w=1400&q=88', // Nice bay
  nice:           'https://images.unsplash.com/photo-1491166617655-4effd3c0c398?w=1400&q=88',
  provence:       'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&q=88', // → France
  cotedazur:      'https://images.unsplash.com/photo-1491166617655-4effd3c0c398?w=1400&q=88', // → Nice
  lyon:           'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&q=88', // → France

  // ── Italy ───────────────────────────────────────────────────────────────────
  italien:        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88', // Colosseum
  italy:          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88',
  rom:            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88', // confirmed
  rome:           'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88',
  venedig:        'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1400&q=88', // Grand Canal
  venice:         'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1400&q=88',
  florenz:        'https://images.unsplash.com/photo-1543429258-ba6f07c6b91b?w=1400&q=88', // Duomo
  florence:       'https://images.unsplash.com/photo-1543429258-ba6f07c6b91b?w=1400&q=88',
  mailand:        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88', // → Italy
  milan:          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=88',
  amalfi:         'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1400&q=88', // cliff towns
  positano:       'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1400&q=88', // same coast
  sardinien:      'https://images.unsplash.com/photo-1574164559255-a9c9e03ec8d1?w=1400&q=88', // emerald coast
  sardinia:       'https://images.unsplash.com/photo-1574164559255-a9c9e03ec8d1?w=1400&q=88',
  suedtirol:      'https://images.unsplash.com/photo-1467841036291-a1e0e6d44a8b?w=1400&q=88', // Dolomites
  sizilien:       'https://images.unsplash.com/photo-1523365837958-36c9dafd63c8?w=1400&q=88',
  sicily:         'https://images.unsplash.com/photo-1523365837958-36c9dafd63c8?w=1400&q=88',
  toskana:        'https://images.unsplash.com/photo-1543429258-ba6f07c6b91b?w=1400&q=88', // rolling hills
  tuscany:        'https://images.unsplash.com/photo-1543429258-ba6f07c6b91b?w=1400&q=88',
  neapel:         'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1400&q=88', // Amalfi area
  naples:         'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1400&q=88',

  // ── Spain ───────────────────────────────────────────────────────────────────
  spanien:        'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=88', // Sagrada Família
  spain:          'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=88',
  barcelona:      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=88', // confirmed
  madrid:         'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1400&q=88', // Gran Vía
  mallorca:       'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1400&q=88', // rocky cove
  ibiza:          'https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&q=88',
  teneriffa:      'https://images.unsplash.com/photo-1512100601213-7d87efe40c8a?w=1400&q=88',
  tenerife:       'https://images.unsplash.com/photo-1512100601213-7d87efe40c8a?w=1400&q=88',
  kanaren:        'https://images.unsplash.com/photo-1512100601213-7d87efe40c8a?w=1400&q=88', // Canaries
  canaryislands:  'https://images.unsplash.com/photo-1512100601213-7d87efe40c8a?w=1400&q=88',
  sevilla:        'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=88', // → Spain
  seville:        'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=88',
  granada:        'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=88',

  // ── Portugal ────────────────────────────────────────────────────────────────
  portugal:       'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=88', // Alfama
  lissabon:       'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=88', // confirmed
  lisbon:         'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=88',
  porto:          'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1400&q=88', // confirmed
  madeira:        'https://images.unsplash.com/photo-1548623328-7e03f7041c34?w=1400&q=88', // cliff coast
  algarve:        'https://images.unsplash.com/photo-1577761814651-acdb04c39c04?w=1400&q=88', // Praia da Marinha
  azoren:         'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=88',
  azores:         'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=88',

  // ── Greece & Greek Islands ───────────────────────────────────────────────────
  griechenland:   'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88', // Santorini
  greece:         'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88',
  santorini:      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88', // confirmed Oia domes
  kreta:          'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88', // Balos lagoon
  crete:          'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88',
  mykonos:        'https://images.unsplash.com/photo-1570213489059-2c02c94a33f4?w=1400&q=88', // windmills
  rhodos:         'https://images.unsplash.com/photo-1555392375-3bf9e1bdf6b6?w=1400&q=88', // medieval city
  rhodes:         'https://images.unsplash.com/photo-1555392375-3bf9e1bdf6b6?w=1400&q=88',
  korfu:          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88', // → Greece/Ionian
  corfu:          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88',
  athen:          'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1400&q=88', // Acropolis
  athens:         'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1400&q=88',
  zakynthos:      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88', // → Greece
  zante:          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=88',
  heraklion:      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88', // Balos/Crete
  iraklio:        'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88',
  iraklion:       'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88',
  chania:         'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88',
  rethymno:       'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88',
  heraklionkreta: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88',
  heraklioncrete: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=88',

  // ── Croatia & Balkans ────────────────────────────────────────────────────────
  kroatien:       'https://images.unsplash.com/photo-1555990538-97a36e22c7bf?w=1400&q=88', // confirmed Dubrovnik
  croatia:        'https://images.unsplash.com/photo-1555990538-97a36e22c7bf?w=1400&q=88',
  dubrovnik:      'https://images.unsplash.com/photo-1555990538-97a36e22c7bf?w=1400&q=88',
  split:          'https://images.unsplash.com/photo-1555990538-97a36e22c7bf?w=1400&q=88', // → Croatia
  plitvice:       'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=88', // waterfall/nature
  albanien:       'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1400&q=88', // Riviera
  albania:        'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1400&q=88',
  budapest:       'https://images.unsplash.com/photo-1519963755010-f13eb9dded5a?w=1400&q=88', // Parliament/Danube

  // ── UK & Ireland ─────────────────────────────────────────────────────────────
  london:         'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=88', // confirmed Westminster
  schottland:     'https://images.unsplash.com/photo-1467594798736-bdb2697e5f15?w=1400&q=88', // Highlands
  scotland:       'https://images.unsplash.com/photo-1467594798736-bdb2697e5f15?w=1400&q=88',
  edinburgh:      'https://images.unsplash.com/photo-1520442921916-cb12cfb74e9e?w=1400&q=88', // castle
  irland:         'https://images.unsplash.com/photo-1505394664478-325b78a38e24?w=1400&q=88', // green coast
  ireland:        'https://images.unsplash.com/photo-1505394664478-325b78a38e24?w=1400&q=88',
  dublin:         'https://images.unsplash.com/photo-1505394664478-325b78a38e24?w=1400&q=88', // → Ireland

  // ── Benelux & CEE ────────────────────────────────────────────────────────────
  amsterdam:      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1400&q=88', // confirmed canals
  prag:           'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1400&q=88', // confirmed Old Town
  prague:         'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1400&q=88',
  wien:           'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88', // confirmed
  vienna:         'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=88',

  // ── Scandinavia ──────────────────────────────────────────────────────────────
  norwegen:       'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=88', // confirmed fjords
  norway:         'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=88',
  oslo:           'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=88', // → Norway
  bergen:         'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=88', // → fjords
  lofoten:        'https://images.unsplash.com/photo-1601625580688-b46190b0c1c5?w=1400&q=88', // dramatic islands
  schweden:       'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=88', // Stockholm
  sweden:         'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=88',
  stockholm:      'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=88', // confirmed
  kopenhagen:     'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1400&q=88', // confirmed Nyhavn
  copenhagen:     'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1400&q=88',
  daenemark:      'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1400&q=88',
  denmark:        'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1400&q=88',
  finnland:       'https://images.unsplash.com/photo-1561649674-c8cf81ca4e98?w=1400&q=88', // Helsinki/Nordic
  finland:        'https://images.unsplash.com/photo-1561649674-c8cf81ca4e98?w=1400&q=88',
  helsinki:       'https://images.unsplash.com/photo-1561649674-c8cf81ca4e98?w=1400&q=88',
  island:         'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1400&q=88', // confirmed volcanic
  iceland:        'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1400&q=88',
  reykjavik:      'https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?w=1400&q=88', // confirmed

  // ── Turkey / Middle East ─────────────────────────────────────────────────────
  istanbul:       'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1400&q=88', // confirmed Blue Mosque
  tuerkei:        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1400&q=88',
  turkey:         'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1400&q=88',
  kappadokien:    'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1400&q=88', // hot air balloons
  cappadocia:     'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1400&q=88',
  dubai:          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=88', // confirmed Burj Khalifa
  abudhabi:       'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=88', // → Dubai/UAE
  oman:           'https://images.unsplash.com/photo-1548706209-84c0c9a99fcc?w=1400&q=88', // Oman landscape
  jordanien:      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1400&q=88', // Petra
  jordan:         'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1400&q=88',
  petra:          'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1400&q=88', // Treasury

  // ── Africa ───────────────────────────────────────────────────────────────────
  marokko:        'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1400&q=88', // Marrakech medina
  morocco:        'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1400&q=88',
  marrakesch:     'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1400&q=88', // confirmed
  marrakech:      'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1400&q=88',
  suedafrika:     'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=88', // Table Mountain
  southafrica:    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=88',
  kapstadt:       'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=88', // confirmed
  capetown:       'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=88',
  tansania:       'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1400&q=88', // savanna/Kilimanjaro
  tanzania:       'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1400&q=88',
  sansibar:       'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1400&q=88', // turquoise beach
  zanzibar:       'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1400&q=88',

  // ── Indian Ocean ─────────────────────────────────────────────────────────────
  malediven:      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&q=88', // confirmed overwater
  maldives:       'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&q=88',
  seychellen:     'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1400&q=88', // confirmed boulders
  seychelles:     'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1400&q=88',

  // ── Americas ─────────────────────────────────────────────────────────────────
  usa:            'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=88', // NYC
  newyork:        'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=88', // confirmed Manhattan
  newyorkcity:    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=88',
  nyc:            'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=88',
  sanfrancisco:   'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1400&q=88', // Golden Gate
  losangeles:     'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=88', // LA coast/city
  miami:          'https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=1400&q=88', // beach/skyline
  lasvegas:       'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1400&q=88', // Strip at night
  kanada:         'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=88', // Banff mountains
  canada:         'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=88',
  banff:          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=88', // confirmed
  vancouver:      'https://images.unsplash.com/photo-1559511260-b120a37d8fc9?w=1400&q=88',
  toronto:        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=88', // → Canada
  mexiko:         'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1400&q=88',
  mexico:         'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1400&q=88',
  cancun:         'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1400&q=88', // Caribbean coast
  tulum:          'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1400&q=88', // Yucatán coast
  costarica:      'https://images.unsplash.com/photo-1553701879-1f2f0cd30b76?w=1400&q=88', // confirmed waterfall
  brasilien:      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=88', // Rio Christ statue
  brazil:         'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=88',
  rio:            'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=88',
  riodejaneiro:   'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=88',
  peru:           'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1400&q=88', // confirmed Machu Picchu
  machupichu:     'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1400&q=88',
  machupicchu:    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1400&q=88',

  // ── Southeast Asia ───────────────────────────────────────────────────────────
  bali:           'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=88', // confirmed rice terraces
  thailand:       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=88',
  bangkok:        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=88', // → Thailand temples
  phuket:         'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1400&q=88',
  kohsamui:       'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1400&q=88',
  kosamui:        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1400&q=88',
  chiangmai:      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=88', // → Thailand
  vietnam:        'https://images.unsplash.com/photo-1528127269322-539801943592?w=1400&q=88', // Ha Long Bay
  hanoi:          'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=88', // → Hoi An style
  hochiminh:      'https://images.unsplash.com/photo-1528127269322-539801943592?w=1400&q=88', // → Vietnam
  hoian:          'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=88', // lanterns
  singapur:       'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1400&q=88', // confirmed Marina Bay
  singapore:      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1400&q=88',
  philippinen:    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=88',
  palawan:        'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=88',

  // ── East Asia ────────────────────────────────────────────────────────────────
  tokio:          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=88', // confirmed
  tokyo:          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=88',
  japan:          'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1400&q=88', // Mt Fuji
  kyoto:          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=88', // confirmed Fushimi
  osaka:          'https://images.unsplash.com/photo-1565128939181-5dcb7e3ed3fd?w=1400&q=88', // confirmed Dotonbori
  hiroshima:      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1400&q=88', // → Japan
  nara:           'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=88', // → Kyoto/Japan
  hokkaido:       'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1400&q=88', // → Japan
  suedkorea:      'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1400&q=88', // Seoul skyline
  southkorea:     'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1400&q=88',
  korea:          'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1400&q=88',
  seoul:          'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1400&q=88',
  hongkong:       'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1400&q=88', // confirmed skyline

  // ── South Asia ───────────────────────────────────────────────────────────────
  srilanka:       'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=1400&q=88',
  nepal:          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=88', // Himalaya
  kathmandu:      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=88',

};

// ── Normalizer ────────────────────────────────────────────────────────────────

export function normalizeDestinationKey(value) {
  if (!value || typeof value !== 'string') return '';

  let s = value.toLowerCase().trim();

  // German umlauts BEFORE NFD normalization (they're precomposed in AI output)
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
