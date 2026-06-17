import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSession, mergeAnalysis } from '@/repositories/travel-funnel';

export const maxDuration = 90;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KI nicht konfiguriert.' }, { status: 500 });
  }

  let sessionId: string;
  try {
    const body = await request.json() as { id?: string };
    if (!body.id) throw new Error('missing id');
    sessionId = body.id;
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  // Load session to get Phase 1 destinations + travel params
  let session: Record<string, unknown>;
  try {
    session = await getSession(sessionId);
  } catch (err) {
    console.error('[travel-details] getSession error:', err);
    return NextResponse.json({ error: 'Session nicht gefunden.' }, { status: 404 });
  }

  const analysis = session?.generated_destinations as Record<string, unknown> | null;
  const destinations = analysis?.destinations as Array<{ destination: string; country: string }> | undefined;
  if (!destinations?.length) {
    return NextResponse.json({ error: 'Keine Phase-1-Daten gefunden.' }, { status: 422 });
  }

  // Already has Phase 2 data? Return existing instead of re-generating.
  const first = destinations[0] as Record<string, unknown>;
  if (Array.isArray(first.hotels) && (first.hotels as unknown[]).length > 0) {
    return NextResponse.json({
      destinations: (analysis!.destinations as unknown[]),
      packingList:  analysis!.packingList,
    });
  }

  const budget   = session.budget   as string | undefined;
  const duration = session.duration as string | undefined;
  const season   = session.season   as string | undefined;

  const budgetLabel   = ({ low: 'Budget', mid: 'Mittelklasse', high: 'Luxus' } as Record<string, string>)[budget ?? ''] ?? budget ?? 'Mittelklasse';
  const durationLabel = ({ weekend: 'Wochenende', week: '1 Woche', twoweeks: '2 Wochen', long: '3+ Wochen' } as Record<string, string>)[duration ?? ''] ?? duration ?? '1 Woche';
  const seasonLabel   = ({ spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' } as Record<string, string>)[season ?? ''] ?? season ?? 'Sommer';

  const itineraryDays = ({ weekend: 2, week: 5, twoweeks: 7, long: 7 } as Record<string, number>)[duration ?? ''] ?? 5;
  const destLines = destinations.map((d, i) => `${i + 1}. ${d.destination}, ${d.country}`).join('\n');

  // Phase 2: hotels, activities, itinerary, packingList for all 3 destinations
  // Ziel: ~1000-1400 Output-Tokens → ~15 Sekunden
  const prompt = `Du bist ein Premium-Reise-Experte. Ergänze folgende 3 Reiseziele mit vollständigen Details.

Reiseziele:
${destLines}

Budget: ${budgetLabel} | Dauer: ${durationLabel} | Jahreszeit: ${seasonLabel}

Antworte AUSSCHLIESSLICH als valides JSON ohne Markdown-Blöcke:
{
  "destinations": [
    {
      "destination": "${destinations[0].destination}",
      "hotels": [
        {"name":"Konkreter echter Hotelname","category":"3-Sterne","pricePerNight":"90€/Nacht","why":"Kurzer Grund","type":"city","searchQuery":"Hotelname Zielort"},
        {"name":"Konkreter echter Hotelname","category":"4-Sterne","pricePerNight":"140€/Nacht","why":"Kurzer Grund","type":"boutique","searchQuery":"Hotelname Zielort"}
      ],
      "activities": [
        {"name":"Aktivität","category":"Kultur","price":"kostenlos","why":"Kurzer Grund"},
        {"name":"Aktivität","category":"Erlebnis","price":"25€","why":"Kurzer Grund"},
        {"name":"Aktivität","category":"Kulinarik","price":"20€","why":"Kurzer Grund"}
      ],
      "itinerary": [
        {"day":1,"title":"Ankunft & Erkundung","activities":["Aktivität A","Aktivität B","Abendessen im Zentrum"]},
        {"day":2,"title":"Highlights","activities":["Sehenswürdigkeit","Tour","Straßenmarkt"]}
      ]
    }
  ],
  "packingList": {
    "documents": ["Reisepass","Krankenversicherungskarte","Kreditkarte"],
    "clothes": ["Leichte Kleidung","Bequeme Schuhe","Abendkleidung"],
    "tech": ["Reiseadapter","Powerbank","Ladekabel"],
    "health": ["Sonnencreme","Reiseapotheke","Insektenschutz"],
    "misc": ["Offline-Karte","Trinkflasche","Reise-Taschentücher"]
  }
}
Wichtig:
- Hotels: Nenne 2 bekannte, real existierende Hotels mit konkretem Eigennamen für das jeweilige Reiseziel (z.B. "Hotel Ritz Paris", "Bairro Alto Hotel Lissabon", "Hotel Elephant Weimar"). Erfinde KEINE generischen Beschreibungen wie "Stadthotel in Weimar", "Boutique-Hotel in Lissabon" oder "Strandresort in Mallorca". Nur wenn dir für ein konkretes Reiseziel wirklich kein einziger echter Hotelname bekannt ist, gib ein leeres Array zurück — bei bekannten Reisezielen gibt es fast immer passende Hotels.
- type-Feld muss eines sein von: city, boutique, wellness, family, beach, mountain, budget, romantic
- searchQuery = Hotelname + Zielort als Suchbegriff (z.B. "Hotel Elephant Weimar")
- Genau ${itineraryDays} Einträge pro itinerary-Array. Alle 3 Destinations vollständig ausfüllen. Alle Texte auf Deutsch.`;

  // ── Claude call (Phase 2) ──────────────────────────────────────────────────
  let raw: string;
  let stopReason: string | null = null;
  try {
    const client  = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 3000,
      messages:   [{ role: 'user', content: prompt }],
    });
    stopReason = message.stop_reason ?? null;
    raw = message.content
      .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text ?? '' : ''))
      .join('')
      .replace(/```json\s*|```/g, '')
      .trim();

    if (stopReason === 'max_tokens') {
      console.error('[travel-details] Phase 2 truncated by max_tokens — raw length:', raw.length);
    }
  } catch (err) {
    console.error('[travel-details] Claude error:', err);
    return NextResponse.json({ error: 'KI-Anfrage fehlgeschlagen.' }, { status: 502 });
  }

  // ── JSON parse ─────────────────────────────────────────────────────────────
  let phase2: Record<string, unknown>;
  try {
    phase2 = JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    console.error('[travel-details] JSON parse error:', String(err), '| stop_reason:', stopReason, '| raw:', raw.slice(0, 800));
    return NextResponse.json({ error: 'Detaildaten konnten nicht verarbeitet werden.' }, { status: 500 });
  }

  if (process.env.NODE_ENV === 'development') {
    const dests = phase2.destinations as Array<Record<string, unknown>> | undefined;
    dests?.forEach((d, i) => {
      console.log(`[travel-details] dest[${i}] (${d.destination}) hotels:`, d.hotels);
    });
  }

  // ── Merge into Supabase ────────────────────────────────────────────────────
  let merged: Record<string, unknown>;
  try {
    merged = await mergeAnalysis(sessionId, phase2);
  } catch (err) {
    console.error('[travel-details] mergeAnalysis error:', err);
    return NextResponse.json({ error: 'Details konnten nicht gespeichert werden.' }, { status: 500 });
  }

  return NextResponse.json({
    destinations: merged.destinations,
    packingList:  merged.packingList,
  });
}
