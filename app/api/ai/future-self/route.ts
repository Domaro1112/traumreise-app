import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KI ist noch nicht konfiguriert.' }, { status: 500 });
  }

  const { vibes, text } = await request.json();

  const vibeList = Array.isArray(vibes) ? vibes.join(', ') : vibes;
  const firstVibe = Array.isArray(vibes) ? (vibes[0] || 'relax') : 'relax';

  const prompt = `Du bist ein poetischer Reise-Storyteller. Erstelle 3 verschiedene Reise-Ich Szenarien.\nBESCHREIBUNG: "${text || 'keine'}"\nVIBES: ${vibeList}\nNUR JSON-Array:\n[{"destination":"Stadt","country":"Land","vibe":"${firstVibe}","identity_title":"Titel","teaser":"1 Satz","story":"3-4 Saetze du-Form Gegenwart emotional","moment":"1 magischer Moment","bookingCity":"englisch","skyCity":"englisch"}]`;

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text ?? '' : '').join('').replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(raw);

  return NextResponse.json(parsed);
}
