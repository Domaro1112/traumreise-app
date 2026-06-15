import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createSession, saveAnalysis } from '@/repositories/travel-funnel';

// Allow up to 120 s on Vercel Pro / Fluid compute.
// Without this, Vercel Hobby cuts the function at 60 s — which is why the
// generic "Fehler beim Abrufen" error appeared: the Claude call was timing out.
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KI ist noch nicht konfiguriert.' }, { status: 500 });
  }

  let body: {
    freeText?: string;
    interests?: string[];
    budget?: string;
    duration?: string;
    season?: string;
    adults?: number;
    children?: number;
    moodIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { freeText, interests, budget, duration, season, adults, children, moodIds } = body;

  const budgetLabel   = ({ low: 'Budget', mid: 'Mittelklasse', high: 'Luxus' } as Record<string, string>)[budget ?? ''] ?? budget ?? 'Mittelklasse';
  const durationLabel = ({ weekend: 'Wochenende', week: '1 Woche', twoweeks: '2 Wochen', long: '3+ Wochen' } as Record<string, string>)[duration ?? ''] ?? duration ?? '1 Woche';
  // Reduced itinerary days to cut output tokens by ~40 %:
  // Old: weekend→3, week→5, twoweeks→7, long→7
  // New: weekend→2, week→3, twoweeks→5, long→5
  const itineraryDays = ({ weekend: 2, week: 3, twoweeks: 5, long: 5 } as Record<string, number>)[duration ?? ''] ?? 3;
  const seasonLabel   = ({ spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' } as Record<string, string>)[season ?? ''] ?? season ?? 'Sommer';
  const interestList  = Array.isArray(interests) ? interests.join(', ') : (interests ?? '');

  // JSON template — activities reduced 4→3 per destination to further cut output tokens
  const prompt = `Du bist ein Premium-Reise-Experte. Erstelle für folgende Person exakt 3 Reiseempfehlungen.
PERSON: "${freeText || 'keine Angabe'}"
Interessen: ${interestList} | Budget: ${budgetLabel} | Dauer: ${durationLabel} | Jahreszeit: ${seasonLabel} | ${adults ?? 2} Erwachsene${(children ?? 0) > 0 ? `, ${children} Kinder` : ''}

Antworte AUSSCHLIESSLICH als valides JSON ohne Markdown-Blöcke oder Erklärungen:
{
  "personality": {
    "types": ["Emoji Typ1","Emoji Typ2","Emoji Typ3"],
    "summary": "Poetischer Satz zur Reisepersönlichkeit",
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
      "tagline": "Inspirierender Satz max 10 Wörter",
      "highlights": ["Grund 1","Grund 2","Grund 3"],
      "skySearch": "City name in English",
      "iata": "IATA",
      "weather": "z.B. 24°C, sonnig",
      "flightTime": "z.B. 2h 30min ab Frankfurt",
      "budgetPerDay": "z.B. 80-120€ p.P.",
      "hotels": [
        {"name":"Hotelname","category":"4-Sterne Boutique","pricePerNight":"120-180€/Nacht","why":"Kurz"},
        {"name":"Hotelname2","category":"Design Hotel","pricePerNight":"80-120€/Nacht","why":"Kurz"}
      ],
      "activities": [
        {"name":"Aktivität","category":"Kultur","price":"kostenlos","why":"Kurze Begründung"},
        {"name":"Aktivität","category":"Erlebnis","price":"35€","why":"Kurze Begründung"},
        {"name":"Aktivität","category":"Kulinarik","price":"15€","why":"Kurze Begründung"}
      ],
      "carRental": {"recommended": false, "reason": "Kurz"},
      "itinerary": [
        {"day": 1, "title": "Tagesname", "activities": ["Aktivität 1","Aktivität 2","Aktivität 3"]}
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
    "documents": ["Reisepass","Krankenversicherungskarte","Kreditkarte ohne Auslandsgebühren"],
    "clothes": ["Leichte Kleidung","Bequeme Schuhe","Abendkleidung"],
    "tech": ["Reiseadapter","Powerbank","Kamera"],
    "health": ["Sonnencreme SPF 50","Reiseapotheke","Insektenschutz"],
    "misc": ["Offline-Stadtplan","Trinkflasche","Reise-App"]
  },
  "surprise": {
    "destination": "Wenig bekanntes Reiseziel",
    "country": "Land",
    "tagline": "Was die meisten nicht ahnen",
    "whySurprising": "Warum es perfekt passt"
  }
}
Wichtig: Genau ${itineraryDays} Einträge im itinerary-Array pro Destination. Alle Texte auf Deutsch. Traits-Werte 0-100.`;

  // ── Claude call ────────────────────────────────────────────────────────────
  let raw: string;
  try {
    const client  = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 4000,
      messages:   [{ role: 'user', content: prompt }],
    });
    raw = message.content
      .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text ?? '' : ''))
      .join('')
      .replace(/```json\s*|```/g, '')
      .trim();
  } catch (err) {
    console.error('[travel-save] Claude API error:', err);
    return NextResponse.json(
      { error: 'KI-Anfrage fehlgeschlagen. Bitte in wenigen Sekunden erneut versuchen.', detail: String(err) },
      { status: 502 }
    );
  }

  // ── JSON parse ─────────────────────────────────────────────────────────────
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error('[travel-save] JSON parse error. Raw output:', raw.slice(0, 500));
    return NextResponse.json(
      { error: 'KI-Antwort konnte nicht verarbeitet werden. Bitte nochmal versuchen.', detail: String(err) },
      { status: 500 }
    );
  }

  // ── Supabase persist ───────────────────────────────────────────────────────
  const userAgent = request.headers.get('user-agent') ?? undefined;
  const referrer  = request.headers.get('referer')   ?? undefined;

  let sessionId: string;
  try {
    const session = await createSession({
      moodSelection: Array.isArray(moodIds) ? moodIds : [],
      season,
      budget,
      duration,
      personalNote: freeText || undefined,
      userAgent,
      referrer,
    });
    await saveAnalysis(session.id, parsed);
    sessionId = session.id;
  } catch (err) {
    console.error('[travel-save] Supabase error:', err);
    return NextResponse.json(
      { error: 'Analyse konnte nicht gespeichert werden. Bitte nochmal versuchen.', detail: String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: sessionId });
}
