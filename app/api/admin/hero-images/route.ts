import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { HERO_PAGES, FOCUS_PATTERN } from '@/lib/hero-config';
import { listHeroFocus, saveHeroFocus } from '@/repositories/hero-images';

// GET /api/admin/hero-images – alle Hero-Bereiche mit Fokuspunkt
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  try {
    return NextResponse.json({ items: await listHeroFocus() });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler beim Laden.' }, { status: 500 });
  }
}

// PUT /api/admin/hero-images – { page_key, focus_desktop, focus_mobile }
export async function PUT(request: NextRequest) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  let body: { page_key?: string; focus_desktop?: string; focus_mobile?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }); }

  const page = HERO_PAGES.find(p => p.key === body.page_key);
  if (!page) return NextResponse.json({ error: 'Unbekannter Bereich.' }, { status: 400 });
  const d = String(body.focus_desktop ?? '');
  const m = String(body.focus_mobile ?? '');
  if (!FOCUS_PATTERN.test(d) || !FOCUS_PATTERN.test(m)) {
    return NextResponse.json({ error: 'Ungültiger Bildausschnitt.' }, { status: 400 });
  }
  try {
    await saveHeroFocus(page.key, d, m);
    revalidatePath(page.path);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Speichern fehlgeschlagen.';
    const hint = /hero_images/.test(msg) ? ' – bitte zuerst supabase/hero-bilder.sql im Supabase SQL Editor ausführen.' : '';
    return NextResponse.json({ error: msg + hint }, { status: 500 });
  }
}
