import { NextRequest, NextResponse } from 'next/server';
import { incrementBlogFeedback } from '@/repositories/blog-cms';

const ALLOWED_VOTES = new Set(['helpful', 'not_helpful']);

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// POST /api/blog/[slug]/feedback
// Public – no auth required. Abuse prevention is handled client-side via localStorage.
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Ungültiger Artikel.' }, { status: 400 });
    }

    const body = await request.json();
    const vote = body?.vote;

    if (!ALLOWED_VOTES.has(vote)) {
      return NextResponse.json({ error: 'Ungültige Stimme.' }, { status: 400 });
    }

    await incrementBlogFeedback(slug, vote);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Interner Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
