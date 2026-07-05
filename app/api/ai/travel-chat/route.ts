import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Removes common Markdown formatting characters from a plain-text chat reply.
 * This is a defensive server-side fallback — the system prompt already instructs
 * Claude not to use Markdown. Both layers together prevent visible asterisks/symbols.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')        // **bold** → bold
    .replace(/\*([^*\n]+)\*/g, '$1')           // *italic* → italic
    .replace(/__([^_]+)__/g, '$1')             // __bold__ → bold
    .replace(/_([^_\n]+)_/g, '$1')             // _italic_ → italic
    .replace(/^#{1,6}\s+/gm, '')               // ### Header → Header
    .replace(/`+([^`]+)`+/g, '$1')             // `code` / ```code``` → code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // [label](url) → label
    .replace(/^[-*+]\s+/gm, '')                // unordered list markers
    .replace(/^\d+\.\s+/gm, '')                // ordered list markers
    .trim();
}

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
    system: `Du bist ein freundlicher und kompetenter Reiseberater für ${destination}, ${country}.
Antworte ausschließlich in fließendem Deutsch ohne jegliche Markdown-Formatierung.
Verwende keine Sternchen, Rauten, Unterstriche oder andere Sonderzeichen für Formatierungen.
Schreibe maximal 4–6 kurze Sätze oder kurze Absätze.
Keine Aufzählungslisten mit Bindestrichen oder Sternchen.
Sei persönlich, enthusiastisch und sachlich korrekt.`,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  const raw = response.content
    .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text ?? '' : ''))
    .join('');

  const reply = stripMarkdown(raw);

  return NextResponse.json({ reply });
}
