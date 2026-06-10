import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/repositories/travel-funnel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as { moodSelection?: string[] };
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const referrer  = request.headers.get('referer')   ?? undefined;

    const session = await createSession({
      moodSelection: body.moodSelection ?? [],
      userAgent,
      referrer,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('[travel-finder/session]', err);
    return NextResponse.json({ error: 'Session konnte nicht erstellt werden.' }, { status: 500 });
  }
}
