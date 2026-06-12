import { NextResponse } from 'next/server';
import { listPublishedSlugs } from '@/repositories/destinations-cms';

// Cache for 60 s — matches the ISR revalidate on the destination pages.
export const revalidate = 60;

// GET /api/destinations/published-slugs
// Public endpoint used by client components (e.g. funnel) to check
// whether a destination slug has a published page before linking to it.
export async function GET() {
  try {
    const slugs = await listPublishedSlugs();
    return NextResponse.json({ slugs });
  } catch {
    return NextResponse.json({ slugs: [] });
  }
}
