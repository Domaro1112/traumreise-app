import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

// Explizit Node.js-Runtime erzwingen (kein Edge-Runtime — Anthropic SDK läuft dort nicht stabil)
export const runtime    = 'nodejs';
export const maxDuration = 90;

const DURATION_MAP    = { short: '3–5 Tage', week: '1 Woche', twoweeks: '2 Wochen', long: 'Länger als 2 Wochen' };
const DAILY_KM_MAP    = { low: 'bis 150 km', mid: '150–300 km', high: '300–500 km', ultra: '500+ km' };
const STYLE_MAP       = { curves: 'Kurvenreiche Strecken', passes: 'Bergpässe', coast: 'Küstenstraßen', landscape: 'Landschaft genießen', cruising: 'Entspanntes Cruisen' };
const DESTINATION_MAP = { germany: 'Deutschland', alps: 'Alpen', italy: 'Italien', france: 'Frankreich', scandinavia: 'Skandinavien', open: 'Offen – überraschen' };
const ACCOMMODATION_MAP = { hotel: 'Hotel', pension: 'Pension', camping: 'Camping', any: 'Egal' };
const PARKING_MAP     = { veryImportant: 'Sehr wichtig', niceToHave: 'Schön wenn vorhanden', notImportant: 'Nicht wichtig' };

const MODEL = 'claude-sonnet-4-6';

export async function POST(request) {
  // ── 1. API-Key-Check ──────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('[motorcycle-trip] env key exists:', !!apiKey, '| key prefix:', apiKey ? apiKey.slice(0, 14) + '…' : 'MISSING');
  if (!apiKey) {
    console.error('[motorcycle-trip] ANTHROPIC_API_KEY fehlt in .env.local — Dev-Server nach Key-Eintrag neu starten!');
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  // ── 2. Request body ────────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch (parseErr) {
    console.error('[motorcycle-trip] Request body parse error:', String(parseErr));
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { duration, dailyKm, style, destination, accommodation, parking, fallbackResult } = body;
  console.log('[motorcycle-trip] body received:', { duration, dailyKm, style, destination, accommodation, parking, fallbackRegion: fallbackResult?.regions?.[0]?.name ?? 'n/a' });

  const dLabel     = DURATION_MAP[duration]          || duration          || '1 Woche';
  const kmLabel    = DAILY_KM_MAP[dailyKm]           || dailyKm           || '150–300 km';
  const styleLabel = STYLE_MAP[style]                || style             || 'Landschaft genießen';
  const destLabel  = DESTINATION_MAP[destination]    || destination       || 'Offen';
  const accoLabel  = ACCOMMODATION_MAP[accommodation] || accommodation    || 'Egal';
  const parkLabel  = PARKING_MAP[parking]            || parking           || 'Schön wenn vorhanden';
  const fallbackRegion = fallbackResult?.regions?.[0]?.name || 'Europa';

  const systemPrompt = `Du bist ein erfahrener Motorradreise-Experte.
Antworte AUSSCHLIESSLICH als valides JSON ohne Markdown-Blöcke oder Code-Fences.
Alle Texte auf Deutsch. Sei realistisch und konkret.
Erfinde KEINE konkreten Hotels. Behaupte KEINE exakten Preise.
Nenne KEINE garantierten Öffnungszeiten von Pässen oder Sehenswürdigkeiten.
Weise bei Alpenpässen auf saisonale Sperren hin.
Warne bei 500+ km/Tag ehrlich vor Ermüdungsgefahr.
Berücksichtige bei Camping Wetter und Gepäck stärker.
Gehe bei sicherem Stellplatz auf Garage/Carport ein.
Nenne maximal 3–5 konkrete Routen.
Für sampleItinerary gilt:
- Liefere realistische Etappenvorschläge, keine exakten Navigationsanweisungen oder GPS-Koordinaten.
- start und end sind bekannte Ortschaften oder Regionen, keine genauen Adressen.
- stops sind Ausflugsziele, Aussichtspunkte, Panoramastraßen oder Pausenideen — keine Gastro-Adressen mit Öffnungszeiten.
- Erlaubte type-Werte für stops: Aussichtspunkt, See, Passhöhe, Altstadt, Motorradtreff, Café, Burg, Panoramastraße, Fähre, Museum, Pause.
- note soll ehrlich auf Länge, Wetter, Pässe oder besondere Anforderungen eingehen.
- difficulty-Werte: leicht | leicht bis mittel | mittel | mittel bis anspruchsvoll | anspruchsvoll.`;

  const userPrompt = `Erstelle eine individuelle Motorradurlaub-Planung für folgende Angaben:

- Reisedauer: ${dLabel}
- Tageskilometer: ${kmLabel}
- Fahrstil: ${styleLabel}
- Reiseziel: ${destLabel}
- Unterkunft: ${accoLabel}
- Motorrad-Stellplatz: ${parkLabel}

Regelbasierter Vorschlag zur Orientierung: ${fallbackRegion}

Antworte AUSSCHLIESSLICH als valides JSON in exakt diesem Format:
{
  "title": "Dein Motorradurlaub: ...",
  "riderProfile": { "name": "...", "description": "..." },
  "recommendedRegion": { "name": "...", "country": "...", "whyItFits": "..." },
  "topRoutes": [
    { "name": "...", "region": "...", "description": "...", "difficulty": "leicht", "bestFor": "...", "notes": "..." }
  ],
  "dailyStages": { "recommendedKmPerDay": "...", "description": "..." },
  "sampleItinerary": [
    {
      "day": 1,
      "title": "Ankommen und erste Kurven",
      "start": "Startort",
      "end": "Zielort",
      "routeIdea": "Kurze Beschreibung der Routenidee als Etappenvorschlag",
      "approxKm": "120–160 km",
      "stops": [
        { "name": "Name des Stopps", "type": "Aussichtspunkt", "whyStop": "Kurzer Hinweis, warum dieser Stopp lohnt" }
      ],
      "foodStop": "Café, Gasthof oder Biker-Treff entlang der Strecke",
      "difficulty": "leicht bis mittel",
      "note": "Ehrlicher Hinweis zur Etappe (Länge, Wetter, Pässe etc.)"
    }
  ],
  "bestTravelTime": { "summary": "...", "months": "...", "weatherNote": "..." },
  "accommodationAdvice": { "type": "...", "description": "...", "features": ["abschließbare Garage", "Trockenraum", "frühes Frühstück"] },
  "packingList": ["..."],
  "safetyTips": ["..."],
  "routeWarnings": ["..."],
  "hotelSearchQuery": "Motorradhotel ...",
  "summary": "..."
}`;

  // ── 3. Anthropic API call ──────────────────────────────────────────────────
  console.log('[motorcycle-trip] Calling Anthropic | model:', MODEL, '| max_tokens: 8000');

  let raw;
  try {
    const client  = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model:      MODEL,
      max_tokens: 8000,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    });

    const stopReason = message.stop_reason;
    raw = message.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .replace(/```json\s*[\r\n]*/g, '')
      .replace(/```[\r\n]*/g, '')
      .trim();

    console.log('[motorcycle-trip] Anthropic response OK | stop_reason:', stopReason, '| raw length:', raw.length);

    if (stopReason === 'max_tokens') {
      console.warn('[motorcycle-trip] Antwort bei max_tokens abgeschnitten — JSON möglicherweise unvollständig.');
    }
  } catch (err) {
    const httpStatus = err?.status ?? err?.statusCode ?? 'unknown';
    const errMsg     = err?.message ?? String(err);
    console.error(`[motorcycle-trip] Anthropic API error | HTTP ${httpStatus} | ${errMsg}`);
    return NextResponse.json({ error: 'KI-Anfrage fehlgeschlagen.' }, { status: 502 });
  }

  // ── 4. JSON-Extraktion ─────────────────────────────────────────────────────
  let result;
  try {
    // Robuste Extraktion: nimmt das erste vollständige {...}-Objekt aus der Antwort
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[motorcycle-trip] Kein JSON-Objekt in Antwort | raw (erste 400 Zeichen):', raw.slice(0, 400));
      return NextResponse.json({ error: 'KI-Antwort enthält kein JSON.' }, { status: 500 });
    }
    result = JSON.parse(jsonMatch[0]);
    console.log('[motorcycle-trip] JSON parse success | keys:', Object.keys(result).join(', '));
  } catch (err) {
    console.error('[motorcycle-trip] JSON.parse Fehler:', String(err), '| raw (erste 500 Zeichen):', raw.slice(0, 500));
    return NextResponse.json({ error: 'KI-Antwort konnte nicht verarbeitet werden.' }, { status: 500 });
  }

  return NextResponse.json(result);
}
