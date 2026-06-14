import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KI nicht konfiguriert.' }, { status: 500 });
  }

  const { destination, country, messages } = await request.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Keine Nachrichten.' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: `Du bist ein freundlicher und kompetenter Reiseberater für ${destination}, ${country}. Beantworte Fragen präzise und hilfreich auf Deutsch. Halte Antworten unter 120 Wörtern. Sei persönlich und enthusiastisch, aber sachlich korrekt.`,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  const reply = response.content
    .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text ?? '' : ''))
    .join('');

  return NextResponse.json({ reply });
}
