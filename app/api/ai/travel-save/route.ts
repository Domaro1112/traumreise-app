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
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { freeText, interests, budget, duration, season, adults, children, moodIds } = body;

  const BUDGET_INFO: Record<string, { label: string; range: string; max: number; exampleFlight: string; exampleHotel: string; exampleActivities: string; exampleTotal: string; exampleDay: string }> = {
    low:  { label: 'Budget',       range: 'bis 500 €',          max: 500,  exampleFlight: '80-150€ p.P.',  exampleHotel: '150-280€ p.P.', exampleActivities: '40-80€ p.P.',  exampleTotal: '270-500€ p.P.',   exampleDay: '40-70€ p.P.' },
    mid:  { label: 'Mittelklasse', range: '500–1.500 €',        max: 1500, exampleFlight: '200-450€ p.P.', exampleHotel: '350-700€ p.P.', exampleActivities: '100-250€ p.P.', exampleTotal: '650-1400€ p.P.',  exampleDay: '80-140€ p.P.' },
    high: { label: 'Premium',      range: '1.500–4.000 €',      max: 4000, exampleFlight: '600-1400€ p.P.',exampleHotel: '800-2000€ p.P.',exampleActivities: '300-600€ p.P.', exampleTotal: '1700-4000€ p.P.', exampleDay: '200-400€ p.P.' },
  };
  const budgetInfo    = BUDGET_INFO[budget ?? ''] ?? BUDGET_INFO['mid'];
  const durationLabel = ({ weekend: 'Wochenende', week: '1 Woche', twoweeks: '2 Wochen', long: '3+ Wochen' } as Record<string, string>)[duration ?? ''] ?? duration ?? '1 Woche';
  const seasonLabel   = ({ spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' } as Record<string, string>)[season ?? ''] ?? season ?? 'Sommer';
  const interestList  = Array.isArray(interests) ? interests.join(', ') : (interests ?? '');

  // Phase 1: Schnell — nur Kerninfos, keine Hotels/Aktivitäten/Reiseplan
  // Ziel: ~700-900 Output-Tokens → ~10 Sekunden
  // Phase 2 (hotels, activities, itinerary, packingList) wird nachgelagert auf der Ergebnisseite geladen
  const prompt = `Du bist ein Premium-Reise-Experte. Erstelle für folgende Person 3 Reiseempfehlungen (nur Basisinfo).

PERSON: "${freeText || 'keine Angabe'}"
Interessen: ${interestList} | Budget: ${budgetInfo.label} (${budgetInfo.range} pro Person Gesamtbudget) | Dauer: ${durationLabel} | Jahreszeit: ${seasonLabel} | ${adults ?? 2} Erwachsene${(children ?? 0) > 0 ? `, ${children} Kinder` : ''}

BUDGETREGELN (PFLICHT — nicht überschreiten):
- Maximales Gesamtbudget: ${budgetInfo.max}€ pro Person für die gesamte Reise
- Alle costEstimate-Werte MÜSSEN pro Person (p.P.) angegeben werden — KEIN "gesamt"
- Das Feld "total" DARF NICHT über ${budgetInfo.max}€ p.P. liegen
- Wähle nur Reiseziele, die realistisch in diesem Budget erreichbar sind
- Bei Budget-Kategorie: günstige europäische Ziele oder Fernziele in der Nebensaison bevorzugen

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
      "budgetPerDay": "${budgetInfo.exampleDay}",
      "carRental": {"recommended": false, "reason": "Kurze Begründung"},
      "costEstimate": {"flight":"${budgetInfo.exampleFlight}","hotel":"${budgetInfo.exampleHotel}","carRental":"0€ p.P.","activities":"${budgetInfo.exampleActivities}","total":"${budgetInfo.exampleTotal}"}
    }
  ],
  "surprise": {
    "destination": "Wenig bekanntes Reiseziel",
    "country": "Land",
    "tagline": "Was viele nicht ahnen",
    "whySurprising": "Warum es perfekt passt"
  }
}
Alle Texte auf Deutsch. Traits-Werte 0-100. WICHTIG: costEstimate.total MUSS unter ${budgetInfo.max}€ p.P. bleiben.`;

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
