import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { updateSession } from '@/repositories/travel-funnel';

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

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KI nicht konfiguriert.' }, { status: 500 });
  }

  const { sessionId, moods, season, budget } =
    (await request.json()) as {
      sessionId?: string;
      moods: string[];
      season: string;
      budget: string;
    };

  const seasonLabel = SEASON_LABELS[season]  ?? season;
  const budgetLabel = BUDGET_LABELS[budget]  ?? budget;
  const moodList    = Array.isArray(moods) ? moods.join(', ') : moods;

  const prompt = `Du bist ein erfahrener Reise-Experte für reisemonkey.de.
Erstelle genau 3 passende Reiseziel-Empfehlungen.

Eingaben des Nutzers:
- Urlaubsstimmung: ${moodList}
- Reisezeit: ${seasonLabel}
- Budget: ${budgetLabel}

Wichtige Regeln:
- Nur echte, reale Reiseziele (keine erfundenen Orte)
- Keine konkreten Europreise (keine "ab 500€" o.ä.)
- Keine Buchungsverfügbarkeit versprechen
- Fokus auf emotionale Inspiration und authentische Reisemomente
- story: lebendig, Du-Form, Präsens, 2-3 Sätze
- highlights: 4 bis 6 konkrete, vor Ort erlebbare Dinge
- budgetHint: kurze Einschätzung ohne exakte Zahlen (z.B. "Für das mittlere Budget gut geeignet")
- affiliateSearchIntent: englischer Suchbegriff für Buchungsportale

Antworte NUR als valides JSON-Objekt (kein Markdown, keine Erklärungen davor oder danach):
{"destinations":[{"name":"","country":"","region":"","fitReason":"","story":"","highlights":["","","",""],"bestTravelTime":"","budgetHint":"","affiliateSearchIntent":""}]}`;

  try {
    const client  = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2000,
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
