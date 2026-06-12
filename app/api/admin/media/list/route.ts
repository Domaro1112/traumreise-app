import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { listDestinationFiles } from '@/lib/supabase/storage-server';

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
    const files = await listDestinationFiles(slug);
    return NextResponse.json({ files });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Fehler beim Laden der Mediendaten.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
