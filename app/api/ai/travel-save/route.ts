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

  const budgetLabel   = ({ low: 'Budget', mid: 'Mittelklasse', high: 'Luxus' } as Record<string, string>)[budget ?? ''] ?? budget ?? 'Mittelklasse';
  const durationLabel = ({ weekend: 'Wochenende', week: '1 Woche', twoweeks: '2 Wochen', long: '3+ Wochen' } as Record<string, string>)[duration ?? ''] ?? duration ?? '1 Woche';
  const seasonLabel   = ({ spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' } as Record<string, string>)[season ?? ''] ?? season ?? 'Sommer';
  const interestList  = Array.isArray(interests) ? interests.join(', ') : (interests ?? '');

  // Phase 1: Schnell — nur Kerninfos, keine Hotels/Aktivitäten/Reiseplan
  // Ziel: ~700-900 Output-Tokens → ~10 Sekunden
  // Phase 2 (hotels, activities, itinerary, packingList) wird nachgelagert auf der Ergebnisseite geladen
  const prompt = `Du bist ein Premium-Reise-Experte. Erstelle für folgende Person 3 Reiseempfehlungen (nur Basisinfo).

PERSON: "${freeText || 'keine Angabe'}"
Interessen: ${interestList} | Budget: ${budgetLabel} | Dauer: ${durationLabel} | Jahreszeit: ${seasonLabel} | ${adults ?? 2} Erwachsene${(children ?? 0) > 0 ? `, ${children} Kinder` : ''}

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
      "budgetPerDay": "z.B. 80-120€ p.P.",
      "carRental": {"recommended": false, "reason": "Kurze Begründung"},
      "costEstimate": {"flight":"200-350€ p.P.","hotel":"700-1200€","carRental":"0€","activities":"150-250€","total":"1050-1800€"}
    }
  ],
  "surprise": {
    "destination": "Wenig bekanntes Reiseziel",
    "country": "Land",
    "tagline": "Was viele nicht ahnen",
    "whySurprising": "Warum es perfekt passt"
  }
}
Alle Texte auf Deutsch. Traits-Werte 0-100.`;

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
