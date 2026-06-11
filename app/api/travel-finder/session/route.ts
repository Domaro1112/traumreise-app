import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession } from '@/repositories/travel-funnel';

// GET /api/travel-finder/session?session_id=<uuid>
// Returns mood_selection, season, budget, duration, generated_destinations.
// Never returns lead / email data.
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id fehlt.' }, { status: 400 });
  }
  try {
    const session = await getSession(sessionId);
    return NextResponse.json(session);
  } catch (err) {
    console.error('[travel-finder/session GET]', err);
    return NextResponse.json({ error: 'Session nicht gefunden.' }, { status: 404 });
  }
}

// POST /api/travel-finder/session
// Creates a new session. Accepts moodSelection, season, budget, duration.
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      moodSelection?: string[];
      season?:        string;
      budget?:        string;
      duration?:      string;
      personalNote?:  string;
    };
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const referrer  = request.headers.get('referer')   ?? undefined;

    const session = await createSession({
      moodSelection: body.moodSelection ?? [],
      season:        body.season,
      budget:        body.budget,
      duration:      body.duration,
      personalNote:  body.personalNote,
      userAgent,
      referrer,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('[travel-finder/session POST]', err);
    return NextResponse.json({ error: 'Session konnte nicht erstellt werden.' }, { status: 500 });
  }
}
