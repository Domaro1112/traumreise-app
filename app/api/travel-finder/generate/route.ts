import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { updateSession } from '@/repositories/travel-funnel';
import { sanitizePersonalNote } from '@/lib/sanitize-personal-note';

const SEASON_LABELS: Record<string, string> = {
  spring: 'Frühling',
  summer: 'Sommer',
  autumn: 'Herbst',
  winter: 'Winter',
  flex:   'flexibel / egal wann',
};

const BUDGET_LABELS: Record<string, string> = {
  budget:  'Sparsam (Backpacker-Style)',
  mid:     'Mittelklasse (gutes Preis-Leistungs-Verhältnis)',
  comfort: 'Komfort (gehobener Standard)',
  luxury:  'Luxus (Premium pur)',
  open:    'Noch offen (Budget zweitrangig)',
};

const DURATION_LABELS: Record<string, string> = {
  short_trip: 'Kurztrip (2–4 Tage)',
  one_week:   'Eine Woche (5–8 Tage)',
  two_weeks:  'Zwei Wochen (9–15 Tage)',
  long_trip:  'Drei Wochen oder länger (16+ Tage)',
  flexible:   'Flexibel (offen)',
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KI nicht konfiguriert.' }, { status: 500 });
  }

  const { sessionId, moods, season, budget, duration, personalNote } =
    (await request.json()) as {
      sessionId?:    string;
      moods:         string[];
      season:        string;
      budget:        string;
      duration?:     string;
      personalNote?: string;
    };

  const seasonLabel   = SEASON_LABELS[season]          ?? season;
  const budgetLabel   = BUDGET_LABELS[budget]          ?? budget;
  const durationLabel = DURATION_LABELS[duration ?? ''] ?? (duration ?? 'nicht angegeben');
  const moodList      = Array.isArray(moods) ? moods.join(', ') : moods;

  // Sanitize the free-text note — null if junk/unsafe
  const sanitizedNote = sanitizePersonalNote(personalNote ?? null);

  const personalNoteSection = sanitizedNote
    ? `\n- Persönlicher Wunsch des Nutzers: ${sanitizedNote}\n  → Nur urlaubsrelevante Hinweise daraus berücksichtigen. Keine Verfügbarkeitsgarantien, Preiszusagen oder nicht erfüllbaren Versprechen machen.`
    : '';

  const prompt = `Du bist ein erfahrener Reise-Experte für ApeAround.de.
Erstelle genau 3 passende Reiseziel-Empfehlungen.

Eingaben des Nutzers:
- Urlaubsstimmung: ${moodList}
- Reisezeit: ${seasonLabel}
- Budget: ${budgetLabel}
- Reisedauer: ${durationLabel}${personalNoteSection}

Wichtige Regeln:
- Nur echte, reale Reiseziele (keine erfundenen Orte)
- Keine konkreten Europreise (keine "ab 500€" o.ä.)
- Keine Buchungsverfügbarkeit versprechen
- Fokus auf emotionale Inspiration und authentische Reisemomente
- Passe Empfehlungen der Reisedauer an: Kurztrip → gut erreichbare Nahziele (z.B. europäische Städte/Strände), längere Reisen → entferntere Ziele (z.B. Südostasien, Ozeanien, Südamerika, Ostafrika)
- story: lebendig, Du-Form, Präsens, 2-3 Sätze
- highlights: 4 bis 6 konkrete, vor Ort erlebbare Dinge
- fitReason: soll auf die Reisedauer eingehen (z.B. "Perfekt für einen Kurztrip" oder "Ideal für zwei Wochen Entspannung")
- budgetHint: kurze Einschätzung ohne exakte Zahlen (z.B. "Für das mittlere Budget gut geeignet")
- affiliateSearchIntent: englischer Suchbegriff für Buchungsportale
- carRentalRecommended: true wenn ein Mietwagen vor Ort wirklich sinnvoll ist – typisch bei Inseln (Mallorca, Kreta, Teneriffa, Sardinien, Madeira, Island, Zypern, Fuerteventura), Küstenregionen (Algarve, Andalusien, Amalfiküste), Nationalparks, ländlichen Gebieten und weitläufigen Ländern (Florida, Costa Rica, Südafrika, Schottland, Norwegen, Australien). false bei reinen Städtereisen (New York, Paris, Tokyo, Amsterdam, London, Singapur, Venedig, Barcelona Städtetrip).
- carRentalReason: ein kurzer inspirierender Satz, warum ein Mietwagen empfohlen wird (nur wenn carRentalRecommended true, sonst exakt leerer String "").

Antworte NUR als valides JSON-Objekt (kein Markdown, keine Erklärungen davor oder danach):
{"destinations":[{"name":"","country":"","region":"","fitReason":"","story":"","highlights":["","","",""],"bestTravelTime":"","budgetHint":"","affiliateSearchIntent":"","carRentalRecommended":false,"carRentalReason":""}]}`;

  try {
    const client  = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2500,
      messages:   [{ role: 'user', content: prompt }],
    });

    const raw = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
      .replace(/```json|```/g, '')
      .trim();

    const parsed = JSON.parse(raw) as { destinations: unknown[] };

    if (sessionId) {
      updateSession(sessionId, {
        moodSelection:         Array.isArray(moods) ? moods : [moods],
        season,
        budget,
        duration:              duration ?? undefined,
        generatedDestinations: parsed.destinations,
      }).catch(e => console.error('[generate] session update failed:', e));
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[travel-finder/generate]', err);
    return NextResponse.json(
      { error: 'Reiseziele konnten nicht generiert werden. Bitte versuche es erneut.' },
      { status: 500 }
    );
  }
}
