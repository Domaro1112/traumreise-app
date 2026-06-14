export const EXAMPLE_BLOG_JSON = {
  title: "Die 10 besten Strände auf Bali – Geheimtipps und Must-See-Highlights",
  slug: "bali-beste-straende",
  excerpt: "Von weißen Traumstränden bis zu versteckten schwarzen Lavabuchten – Bali hat für jeden Strandtyp das Richtige. Unser Guide zeigt dir die 10 schönsten Strände der Götterinsel.",
  category: "Strandurlaub",
  tags: ["Bali", "Strand", "Indonesien", "Südostasien", "Surfen"],
  author: "Dominik Markus Rothke",
  status: "draft",
  featured: false,
  readingTime: "9 min",
  destination: "Bali",
  country: "Indonesien",
  date: "2025-06-15",
  seoTitle: "Die 10 besten Strände auf Bali 2025 – Geheimtipps & Karte",
  seoDescription: "Welche Strände auf Bali sind wirklich ein Muss? Unsere Top-10-Liste mit Karte, Anfahrt und Geheimtipps – von Seminyak bis Nyang Nyang.",
  tableOfContents: [
    { id: "einleitung",    label: "Warum Bali der perfekte Strandurlaub ist" },
    { id: "seminyak",      label: "Seminyak Beach – Sonnenuntergänge & Sundowner" },
    { id: "nusa-dua",      label: "Nusa Dua – Familienstrand mit kristallklarem Wasser" },
    { id: "uluwatu",       label: "Uluwatu – Surflegenden und Klippendrama" },
    { id: "geheimtipps",   label: "3 Geheimstrände, die kaum Touristen kennen" },
    { id: "reiseplanung",  label: "Praktische Tipps für deinen Bali-Strandurlaub" }
  ],
  contentSections: [
    {
      id: "einleitung",
      title: "Warum Bali der perfekte Strandurlaub ist",
      content: "Bali ist mehr als ein Reiseziel – es ist ein Gefühl. Die Insel vereint traumhafte Strände, spirituelle Tempelkultur und eine der lebendigsten Surf- und Foodscenen Asiens. Ob du entspannten Sonnenuntergang-Sundowner magst oder auf der Suche nach dem perfekten Barrel bist: Bali hat für jeden Reisetyp die richtige Küste.",
      highlights: [
        "Über 70 verschiedene Strände auf einer Insel",
        "Surfspots für alle Level – von Anfänger bis Weltklasse",
        "Günstiges Preis-Leistungs-Verhältnis im Vergleich zu europäischen Stränden"
      ]
    },
    {
      id: "seminyak",
      title: "Seminyak Beach – Sonnenuntergänge & Sundowner",
      content: "Seminyak ist Balis kosmopolitischster Strand. Hier reihen sich Beach Clubs aneinander, von denen Potato Head und Ku De Ta wohl die bekanntesten sind. Der Strand ist breit, der Sand golden und die Wellen perfekt für mittlere Surfer. Am schönsten ist Seminyak kurz vor Sonnenuntergang, wenn die Strandbars anfangen zu spielen.",
      highlights: [
        "Bester Strand für Beach-Club-Atmosphäre",
        "Ideale Wellenriffe für Surfer auf Mittel-Level",
        "20 Minuten Fahrt vom Flughafen Ngurah Rai"
      ]
    }
  ],
  faq: [
    {
      question: "Welcher Strand auf Bali ist am schönsten?",
      answer: "Das hängt von deinem Reisestil ab. Für Surfer ist Uluwatu unschlagbar, für Familien bietet Nusa Dua ruhiges, klares Wasser, und für Beach-Club-Atmosphäre ist Seminyak die erste Wahl."
    },
    {
      question: "Wann ist die beste Reisezeit für Balis Strände?",
      answer: "Die Trockenzeit von Mai bis Oktober ist ideal für Strandurlaub – wenig Regen, ruhige See und viel Sonnenschein. Die Regenzeit (November bis April) bringt mehr Wellen für Surfer, aber häufige Schauer am Nachmittag."
    },
    {
      question: "Sind die Strände in Bali gefährlich?",
      answer: "Einige Strände haben starke Unterströmungen. Schwimme immer in ausgewiesenen Bereichen, beachte Warnschilder und halte dich an die Anweisungen der lokalen Surflehrer. An sicheren Stränden wie Nusa Dua und Sanur ist Baden unproblematisch."
    }
  ],
  relatedDestinations: [
    "lombok-straende",
    "thailand-inseln",
    "malediven-guide"
  ]
};

// ── Claude prompt template ─────────────────────────────────────────────────────
export const BLOG_CLAUDE_PROMPT = `Erstelle mir einen vollständigen Reiseblog-Artikel als JSON im Traumreise-Format.
Thema:   (Platzhalter)
Pflichtfelder (camelCase, alle Texte auf Deutsch):

* title (prägnant, SEO-optimiert, max. 70 Zeichen)
* slug (lowercase, nur Bindestriche, kein trailing slash)
* excerpt (2–3 Sätze, klickstark, max. 180 Zeichen)
* category (eines von: Reisetipps | Inspiration | Strandurlaub | Städtereisen | Familienurlaub | Budget | Roadtrips)
* tags (Array, 4–7 relevante Tags)
* author: "Dominik Markus Rothke"
* status: "draft"
* featured: false
* readingTime (z. B. "8 min")
* destination (Hauptzielort)
* country (Land)
* date (heutiges Datum, ISO: YYYY-MM-DD)
SEO / AEO / LLMO:

* seoTitle (max. 60 Zeichen, Hauptkeyword möglichst vorne)
* seoDescription (120–155 Zeichen, klickstark und handlungsaufrufend)
* keyTakeaways (Array mit 4–6 konkreten Kernaussagen, jeweils max. 140 Zeichen)
* focusKeyword (Hauptkeyword des Artikels)
* secondaryKeywords (Array mit 5–10 passenden Nebenkeywords)
* searchIntent (kurze Beschreibung der Suchintention)
* llmoSummary (kurze KI-freundliche Zusammenfassung des Artikels in 2–3 Sätzen)
Struktur:

* tableOfContents (Array von { "id": "abschnitt-id", "label": "Abschnittstitel" }, mind. 5 Einträge)
* contentSections (Array von { "id": "...", "title": "...", "content": "...", "highlights": [] }, mind. 5 Abschnitte mit je min. 180 Wörtern)
* faq (Array von { "question": "...", "answer": "..." }, mind. 5 häufige Fragen)
* relatedDestinations (Array mit 2–3 thematisch verwandten Slug-Namen)
Inhaltliche Anforderungen:

* Schreibe natürlich, hilfreich und nicht generisch.
* Der Artikel soll echten Mehrwert bieten und nicht wie ein oberflächlicher KI-Text wirken.
* Nenne konkrete Orte, Strände, Aussichtspunkte, Wege, Restaurants, Buchten oder Erlebnisse rund um Cala Ratjada.
* Erkläre, warum diese Tipps weniger touristisch sind.
* Baue praktische Hinweise ein: beste Uhrzeit, Anfahrt, Parken, Kosten, Dauer, für wen geeignet.
* Vermeide erfundene Fakten, wenn du dir bei Details nicht sicher bist.
* Keine übertriebenen Werbeversprechen.
* Kein Markdown im JSON.
* Keine HTML-Tags im content.
* Alle IDs müssen lowercase sein, nur Buchstaben, Zahlen und Bindestriche.
* tableOfContents-IDs müssen zu den contentSections-IDs passen.
Gib ausschließlich gültiges JSON zurück, ohne Markdown-Umrandung, ohne Erklärung.`;
