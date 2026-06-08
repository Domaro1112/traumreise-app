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
  const seasonLabel = ({ spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' } as Record<string, string>)[season] || season;
  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;

  const prompt = `Du bist ein einfuehlsamer Reise-Experte. Schlage genau 3 Reiseziele vor:\nPERSOENLICHE BESCHREIBUNG: "${freeText || ''}"\nInteressen: ${interestList} | Budget: ${budgetLabel} | Dauer: ${durationLabel} | Reisezeit: ${seasonLabel} | Reisende: ${adults ?? 2} Erwachsene${(children ?? 0) > 0 ? `, ${children} Kinder` : ''}\nAntworte NUR als JSON ohne Markdown:\n{"personality":{"types":["Emoji Text","Emoji Text","Emoji Text"],"summary":"Poetischer Satz"},"destinations":[{"destination":"Stadtname","country":"Land","tagline":"kurzer Satz max 10 Woerter","highlights":["1","2","3"],"skySearch":"Stadtname englisch","iata":"IATA-Code des naechsten Flughafens zB LIS MUC BCN"}]}`;

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text ?? '' : '').join('').replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(raw);

  return NextResponse.json(parsed);
}
