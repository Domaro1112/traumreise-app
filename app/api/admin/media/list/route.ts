import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { listDestinationFiles } from '@/lib/supabase/storage-server';
import { createServerClient } from '@/lib/supabase/server';

// Map storage filename → image_alt_texts key
// gallery-01.jpg → "gallery_0" (1-indexed filename → 0-indexed key)
// hero.jpg       → "hero"
// open-graph.jpg → "og"
// twitter.jpg    → "twitter"
function altKey(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').toLowerCase();
  const m = base.match(/^gallery-(\d+)$/);
  if (m) return `gallery_${parseInt(m[1], 10) - 1}`;
  if (base === 'open-graph') return 'og';
  return base;
}

// Human-readable fallback when no alt text is stored in DB
function fallbackName(fileName: string, destName: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').toLowerCase();
  const m = base.match(/^gallery-(\d+)$/);
  if (m)                  return `${destName} Reisebild ${parseInt(m[1], 10)}`;
  if (base === 'hero')        return `${destName} – Hero-Bild`;
  if (base === 'open-graph')  return `${destName} – OG-Bild`;
  if (base === 'twitter')     return `${destName} – Twitter-Bild`;
  return `${destName} – ${fileName}`;
}

// Slug → readable name when destination is not yet in DB
function slugToName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// GET /api/admin/media/list?slug=mallorca
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const slug = request.nextUrl.searchParams.get('slug')?.trim().toLowerCase();
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Gültiger Slug erforderlich.' }, { status: 400 });
    }

    // Fetch files from Supabase Storage
    const files = await listDestinationFiles(slug);

    // Fetch destination metadata from DB (best-effort — no throw on missing)
    const supabase = createServerClient();
    const { data: dest } = await supabase
      .from('destinations')
      .select('name, image_alt_texts')
      .eq('slug', slug)
      .maybeSingle();

    const destName = dest?.name ?? slugToName(slug);
    const altTexts = (dest?.image_alt_texts ?? {}) as Record<string, string>;

    // Enrich each file with display metadata
    const enriched = files.map(file => {
      const key         = altKey(file.name);
      const altText     = altTexts[key] ?? null;
      const displayName = altText || fallbackName(file.name, destName);
      return { ...file, displayName, altText, altKey: key };
    });

    return NextResponse.json({ files: enriched });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Fehler beim Laden der Mediendaten.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
