import { NextRequest, NextResponse } from 'next/server';
import { matchTraumreise } from '@/lib/traumreise/match';
import { createSession, saveAnalysis } from '@/repositories/travel-funnel';

// Regelbasierter Reisefinder – ersetzt die frühere KI-Route /api/ai/travel-save.
// Wählt passende Ziele aus dem Traumreise-Katalog, speichert das Ergebnis in
// travel_funnel_sessions und gibt die Session-ID für /traumreise/[id] zurück.

const ALLOWED_SP_KEYS = ['childAge', 'travelMode', 'holidayType', 'childcareNeed', 'stressLevel', 'budgetLevel', 'priorities'] as const;

function cleanString(v: unknown, max = 60): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;
}

function cleanStringArray(v: unknown, maxItems = 12): string[] {
  return Array.isArray(v) ? v.filter(x => typeof x === 'string').map(x => x.slice(0, 60)).slice(0, maxItems) : [];
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const moodIds   = cleanStringArray(body.moodIds);
  const interests = cleanStringArray(body.interests);
  const freeText  = typeof body.freeText === 'string' ? body.freeText.trim().slice(0, 500) : '';
  const budget    = cleanString(body.budget);
  const duration  = cleanString(body.duration);
  const season    = cleanString(body.season);
  const funnelType = cleanString(body.funnel_type);
  const source     = cleanString(body.source, 120);

  let singleParent: Record<string, unknown> | undefined;
  if (body.singleParent && typeof body.singleParent === 'object') {
    const sp = body.singleParent as Record<string, unknown>;
    singleParent = {};
    for (const key of ALLOWED_SP_KEYS) {
      singleParent[key] = key === 'priorities' ? cleanStringArray(sp[key]) : cleanString(sp[key]);
    }
  }

  const analysis = matchTraumreise({ moodIds, interests, freeText, budget, duration, season, singleParent });

  if (!analysis.destinations.length) {
    return NextResponse.json({ error: 'Es konnten keine passenden Reiseziele gefunden werden.' }, { status: 500 });
  }

  try {
    const session = await createSession({
      moodSelection: moodIds,
      season,
      budget,
      duration,
      personalNote: freeText || undefined,
      userAgent:    request.headers.get('user-agent') ?? undefined,
      referrer:     request.headers.get('referer') ?? undefined,
      funnelType,
      source,
    });
    await saveAnalysis(session.id, analysis);
    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error('[traumreise] Supabase error:', err);
    return NextResponse.json(
      { error: 'Dein Ergebnis konnte nicht gespeichert werden. Bitte versuche es noch einmal.' },
      { status: 500 },
    );
  }
}
