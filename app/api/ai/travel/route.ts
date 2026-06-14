import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KI ist noch nicht konfiguriert.' }, { status: 500 });
  }

  const { freeText, interests, budget, duration, season, adults, children } = await request.json();

  const budgetLabel = ({ low: 'Budget', mid: 'Mittelklasse', high: 'Luxus' } as Record<string, string>)[budget] || budget;
  const durationLabel = ({ weekend: 'Wochenende', week: '1 Woche', twoweeks: '2 Wochen', long: '3+ Wochen' } as Record<string, string>)[duration] || duration;
  const itineraryDays = ({ weekend: 3, week: 5, twoweeks: 7, long: 7 } as Record<string, number>)[duration] || 5;
  const seasonLabel = ({ spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' } as Record<string, string>)[season] || season;
  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;

  const prompt = `Du bist ein Premium-Reise-Experte. Erstelle für folgende Person exakt 3 Reiseempfehlungen.
PERSON: "${freeText || 'keine Angabe'}"
Interessen: ${interestList} | Budget: ${budgetLabel} | Dauer: ${durationLabel} | Jahreszeit: ${seasonLabel} | ${adults ?? 2} Erwachsene${(children ?? 0) > 0 ? `, ${children} Kinder` : ''}

Antworte AUSSCHLIESSLICH als valides JSON ohne Markdown-Blöcke oder Erklärungen:
{
  "personality": {
    "types": ["Emoji Typ1","Emoji Typ2","Emoji Typ3"],
    "summary": "Poetischer Satz zur Reisepersönlichkeit der Person",
    "traits": [
      {"label":"Abenteuerlust","value":75},
      {"label":"Komfort","value":60},
      {"label":"Kultur","value":80},
      {"label":"Entspannung","value":50}
    ]
  },
  "destinations": [
    {
      "destination": "Stadtname",
      "country": "Land",
      "tagline": "Kurzer inspirierender Satz max 12 Wörter",
      "highlights": ["Warum es passt 1","Warum es passt 2","Warum es passt 3"],
      "skySearch": "City name in English",
      "iata": "IATA",
      "weather": "z.B. 24°C, sonnig, wenig Regen im Sommer",
      "flightTime": "z.B. 2h 30min ab Frankfurt",
      "budgetPerDay": "z.B. 80-120€ pro Person",
      "hotels": [
        {"name":"Hotelname","category":"z.B. 4-Sterne Boutique","pricePerNight":"z.B. 120-180€/Nacht","why":"Passt weil..."},
        {"name":"Hotelname2","category":"z.B. Design Hotel","pricePerNight":"z.B. 80-120€/Nacht","why":"Passt weil..."}
      ],
      "activities": [
        {"name":"Aktivität","category":"Kultur","price":"kostenlos","why":"Passt zu deiner Vorliebe für..."},
        {"name":"Aktivität","category":"Erlebnis","price":"35€","why":"Kurze persönliche Begründung"},
        {"name":"Aktivität","category":"Natur","price":"20€","why":"Kurze Begründung"},
        {"name":"Aktivität","category":"Kulinarik","price":"15€","why":"Kurze Begründung"}
      ],
      "carRental": {"recommended": false, "reason": "Kurze Begründung"},
      "itinerary": [
        {"day": 1, "title": "Kurzname des Tages", "activities": ["Aktivität 1","Aktivität 2","Aktivität 3"]}
      ],
      "costEstimate": {
        "flight": "200-350€ p.P.",
        "hotel": "700-1200€ gesamt",
        "carRental": "0€",
        "activities": "150-250€",
        "total": "1050-1800€"
      }
    }
  ],
  "packingList": {
    "documents": ["Reisepass","Krankenversicherungskarte","Buchungsbestätigungen","Kreditkarte ohne Auslandsgebühren"],
    "clothes": ["Leichte Kleidung für warme Tage","Bequeme Laufschuhe","Abendkleidung","Leichter Pullover für kühlere Abende"],
    "tech": ["Reiseadapter","Powerbank","Kamera","Noise-Cancelling Kopfhörer"],
    "health": ["Sonnencreme SPF 50","Reiseapotheke","Insektenschutz","Persönliche Medikamente"],
    "misc": ["Offline-Stadtplan","Wiederverwendbare Trinkflasche","Reiseführer oder App","Kleines Schloss für Gepäck"]
  },
  "surprise": {
    "destination": "Wenig bekanntes Reiseziel",
    "country": "Land",
    "tagline": "Was die meisten nicht ahnen",
    "whySurprising": "Warum es überraschend perfekt zu dieser Person passt"
  }
}
Wichtig: Genau ${itineraryDays} Einträge im itinerary-Array pro Destination. Alle Texte auf Deutsch. Traits-Werte 0-100 passend zu den angegebenen Interessen.`;

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 5000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content
    .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text ?? '' : ''))
    .join('')
    .replace(/```json\s*|```/g, '')
    .trim();

  const parsed = JSON.parse(raw);
  return NextResponse.json(parsed);
}
