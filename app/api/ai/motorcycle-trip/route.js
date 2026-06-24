import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const maxDuration = 90;

const DURATION_MAP    = { short: '3–5 Tage', week: '1 Woche', twoweeks: '2 Wochen', long: 'Länger als 2 Wochen' };
const DAILY_KM_MAP    = { low: 'bis 150 km', mid: '150–300 km', high: '300–500 km', ultra: '500+ km' };
const STYLE_MAP       = { curves: 'Kurvenreiche Strecken', passes: 'Bergpässe', coast: 'Küstenstraßen', landscape: 'Landschaft genießen', cruising: 'Entspanntes Cruisen' };
const DESTINATION_MAP = { germany: 'Deutschland', alps: 'Alpen', italy: 'Italien', france: 'Frankreich', scandinavia: 'Skandinavien', open: 'Offen – überraschen' };
const ACCOMMODATION_MAP = { hotel: 'Hotel', pension: 'Pension', camping: 'Camping', any: 'Egal' };
const PARKING_MAP     = { veryImportant: 'Sehr wichtig', niceToHave: 'Schön wenn vorhanden', notImportant: 'Nicht wichtig' };

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { duration, dailyKm, style, destination, accommodation, parking, fallbackResult } = body;

  const dLabel     = DURATION_MAP[duration]     || duration     || '1 Woche';
  const kmLabel    = DAILY_KM_MAP[dailyKm]      || dailyKm      || '150–300 km';
  const styleLabel = STYLE_MAP[style]           || style        || 'Landschaft genießen';
  const destLabel  = DESTINATION_MAP[destination] || destination || 'Offen';
  const accoLabel  = ACCOMMODATION_MAP[accommodation] || accommodation || 'Egal';
  const parkLabel  = PARKING_MAP[parking]       || parking      || 'Schön wenn vorhanden';
  const fallbackRegion = fallbackResult?.regions?.[0]?.name || 'Europa';

  const systemPrompt = `Du bist ein erfahrener Motorradreise-Experte.
Antworte AUSSCHLIESSLICH als valides JSON ohne Markdown-Blöcke oder Code-Fences.
Alle Texte auf Deutsch. Sei realistisch und konkret.
Erfinde KEINE konkreten Hotels. Behaupte KEINE exakten Preise.
Nenne KEINE garantierten Öffnungszeiten von Pässen.
Weise bei Alpenpässen auf saisonale Sperren hin.
Warne bei 500+ km/Tag vor Ermüdung.
Berücksichtige bei Camping Wetter und Gepäck stärker.
Gehe bei sicherem Stellplatz auf Garage/Carport ein.
Nenne maximal 3–5 konkrete Routen.`;

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
    { "day": 1, "title": "...", "routeIdea": "...", "description": "...", "approxKm": "..." }
  ],
  "bestTravelTime": { "summary": "...", "months": "...", "weatherNote": "..." },
  "accommodationAdvice": { "type": "...", "description": "...", "features": ["abschließbare Garage", "Trockenraum", "frühes Frühstück"] },
  "packingList": ["..."],
  "safetyTips": ["..."],
  "routeWarnings": ["..."],
  "hotelSearchQuery": "Motorradhotel ...",
  "summary": "..."
}`;

  let raw;
  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4000,
      thinking: { type: 'adaptive' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    raw = message.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .replace(/```json\s*|```/g, '')
      .trim();
  } catch (err) {
    console.error('[motorcycle-trip] Claude error:', err);
    return NextResponse.json({ error: 'KI-Anfrage fehlgeschlagen.' }, { status: 502 });
  }

  let result;
  try {
    result = JSON.parse(raw);
  } catch (err) {
    console.error('[motorcycle-trip] JSON parse error:', String(err), '| raw:', raw.slice(0, 500));
    return NextResponse.json({ error: 'KI-Antwort konnte nicht verarbeitet werden.' }, { status: 500 });
  }

  return NextResponse.json(result);
}
