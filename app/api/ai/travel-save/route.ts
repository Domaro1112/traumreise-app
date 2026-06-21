import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createSession, saveAnalysis } from '@/repositories/travel-funnel';

export const maxDuration = 60;

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
    funnel_type?: string;
    source?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { freeText, interests, budget, duration, season, adults, children, moodIds, funnel_type, source } = body;

  const BUDGET_META: Record<string, { label: string; range: string; max: number }> = {
    low:  { label: 'Budget',       range: 'bis 500 €',     max: 500  },
    mid:  { label: 'Mittelklasse', range: '500–1.500 €',   max: 1500 },
    high: { label: 'Premium',      range: '1.500–4.000 €', max: 4000 },
  };
  const budgetMeta    = BUDGET_META[budget ?? ''] ?? BUDGET_META['mid'];
  const durationLabel = ({ weekend: 'Wochenende', week: '1 Woche', twoweeks: '2 Wochen', long: '3+ Wochen' } as Record<string, string>)[duration ?? ''] ?? duration ?? '1 Woche';
  const seasonLabel   = ({ spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' } as Record<string, string>)[season ?? ''] ?? season ?? 'Sommer';
  const interestList  = Array.isArray(interests) ? interests.join(', ') : (interests ?? '');

  // Phase 1: Schnell — nur Kerninfos, keine Hotels/Aktivitäten/Reiseplan
  // Ziel: ~700-900 Output-Tokens → ~10 Sekunden
  // Phase 2 (hotels, activities, itinerary, packingList) wird nachgelagert auf der Ergebnisseite geladen
  const prompt = `Du bist ein erfahrener Reise-Experte. Erstelle für folgende Person 3 Reiseempfehlungen (nur Basisinfo).

PERSON: "${freeText || 'keine Angabe'}"
Interessen: ${interestList} | Budget: ${budgetMeta.label} (${budgetMeta.range} pro Person Gesamtbudget) | Dauer: ${durationLabel} | Jahreszeit: ${seasonLabel} | ${adults ?? 2} Erwachsene${(children ?? 0) > 0 ? `, ${children} Kinder` : ''}

PREISREGELN — BITTE GENAU BEACHTEN:
1. Alle costEstimate-Werte pro Person (p.P.) für die gesamte Reisedauer.
2. Keine erfundenen Lockpreise. Flugkosten = realistischer Hin- und Rückflug ab Deutschland (Preisvergleich Skyscanner/Google Flights als Referenz).
   - Kurzstrecke Europa: typisch 80–250 € p.P. R/T, je nach Saison und Vorlaufzeit
   - Mittelstrecke (z.B. Ägypten, Türkei): 200–500 € p.P. R/T
   - Fernstrecke (z.B. Asien, Amerika): 500–1.400 € p.P. R/T
3. Unterkunft: Realistische Preise für die gewählte Reisedauer (Gesamtnächte × realistischer Nachtpreis p.P.).
4. Wähle bevorzugt Ziele, die realistisch im Budget erreichbar sind.
   - Bei Budget "${budgetMeta.label}": günstige Nahziele, Busreisen oder Niedrigpreisflieger in Nebensaison bevorzugen.
   - Falls ein Ziel trotzdem realistisch teurer ist: zeige ehrliche Preise und nutze budgetStatus "ueber" oder "knapp".
5. ERFINDE KEINE UNREALISTISCH NIEDRIGEN PREISE, nur damit sie unter ${budgetMeta.max}€ passen. Ehrlichkeit hat Vorrang.
6. budgetStatus-Werte: "passt" (Gesamtkosten klar im Budget), "knapp" (bis 20% über Budget), "ueber" (mehr als 20% über Budget), "nur_sparreise" (Ziel ist nur mit extremem Sparen erreichbar).

Antworte AUSSCHLIESSLICH als valides JSON ohne Markdown-Blöcke:
{
  "personality": {
    "types": ["Emoji1","Emoji2","Emoji3"],
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
      "budgetPerDay": "z.B. 60–90 € p.P.",
      "carRental": {"recommended": false, "reason": "Kurze Begründung"},
      "costEstimate": {
        "flight": "z.B. 120–200 € p.P.",
        "hotel": "z.B. 200–350 € p.P.",
        "carRental": "0 € p.P.",
        "activities": "z.B. 60–120 € p.P.",
        "total": "z.B. 380–670 € p.P.",
        "budgetStatus": "passt"
      }
    }
  ],
  "surprise": {
    "destination": "Wenig bekanntes Reiseziel",
    "country": "Land",
    "tagline": "Was viele nicht ahnen",
    "whySurprising": "Warum es perfekt passt"
  }
}
Alle Texte auf Deutsch. Traits-Werte 0–100. Verwende realistische Marktpreise — keine Lockpreise, keine erfundenen Billigstpreise.`;

  // ── Claude call (Phase 1) ──────────────────────────────────────────────────
  let raw: string;
  let stopReason: string | null = null;
  try {
    const client  = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2000,
      messages:   [{ role: 'user', content: prompt }],
    });
    stopReason = message.stop_reason ?? null;
    raw = message.content
      .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text ?? '' : ''))
      .join('')
      .replace(/```json\s*|```/g, '')
      .trim();

    if (stopReason === 'max_tokens') {
      console.error('[travel-save] Phase 1 truncated by max_tokens — raw length:', raw.length);
    }
  } catch (err) {
    console.error('[travel-save] Claude API error:', err);
    return NextResponse.json(
      { error: 'KI-Anfrage fehlgeschlagen. Bitte in wenigen Sekunden erneut versuchen.' },
      { status: 502 }
    );
  }

  // ── JSON parse ─────────────────────────────────────────────────────────────
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    console.error('[travel-save] JSON parse error:', String(err), '| stop_reason:', stopReason, '| raw:', raw.slice(0, 800));
    const isTimeout = stopReason === 'max_tokens';
    return NextResponse.json(
      {
        error:      isTimeout
          ? 'KI-Antwort wurde unterbrochen. Bitte nochmal versuchen.'
          : 'KI-Antwort konnte nicht verarbeitet werden. Bitte nochmal versuchen.',
        parseError: String(err),
        stopReason,
      },
      { status: 500 }
    );
  }

  // ── Basic validation ───────────────────────────────────────────────────────
  const dests = parsed.destinations as unknown[];
  if (!parsed.personality || !Array.isArray(dests) || dests.length === 0 || !parsed.surprise) {
    console.error('[travel-save] Validation failed. Keys:', Object.keys(parsed));
    return NextResponse.json(
      { error: 'KI-Antwort unvollständig. Bitte nochmal versuchen.' },
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
      funnelType: funnel_type || undefined,
      source:     source      || undefined,
    });
    await saveAnalysis(session.id, parsed);
    sessionId = session.id;
  } catch (err) {
    console.error('[travel-save] Supabase error:', err);
    return NextResponse.json(
      { error: 'Analyse konnte nicht gespeichert werden. Bitte nochmal versuchen.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: sessionId });
}
