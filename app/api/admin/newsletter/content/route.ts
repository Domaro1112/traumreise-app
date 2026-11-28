import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { loadDestinations, loadArticles } from '@/lib/newsletter/content';
import { unauthorized, fail } from '../_shared';

export const dynamic = 'force-dynamic';

// GET – veröffentlichte Reiseziele und Artikel für die Auswahl im Editor
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) return unauthorized();
  try {
    const [destinations, articles] = await Promise.all([loadDestinations(), loadArticles()]);
    return NextResponse.json({ destinations, articles });
  } catch (err) { return fail(err); }
}
