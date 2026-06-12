import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { uploadDestinationImage } from '@/lib/supabase/storage-server';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const VALID_TYPES = new Set(['hero', 'og', 'twitter', 'gallery']);

// POST /api/admin/media/upload
// Body: FormData { file, slug, type }
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const slug = (form.get('slug') as string | null)?.trim().toLowerCase();
    const type = (form.get('type') as string | null)?.trim() ?? 'gallery';

    const galleryIndexRaw = (form.get('galleryIndex') as string | null)?.trim();
    const galleryIndex = galleryIndexRaw != null && /^\d+$/.test(galleryIndexRaw)
      ? parseInt(galleryIndexRaw, 10)
      : 0;

    if (!file)                     return NextResponse.json({ error: 'Keine Datei übermittelt.' }, { status: 400 });
    if (!slug)                     return NextResponse.json({ error: 'Slug fehlt.' },               { status: 400 });
    if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Ungültiger Slug.' },         { status: 400 });
    if (!VALID_TYPES.has(type))    return NextResponse.json({ error: 'Ungültiger Typ.' },            { status: 400 });
    if (!ALLOWED_MIME.has(file.type))
      return NextResponse.json({ error: 'Nur JPG, PNG oder WebP erlaubt.' }, { status: 415 });
    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: 'Datei zu groß (max. 10 MB).' }, { status: 413 });

    const result = await uploadDestinationImage(file, slug, type as 'hero' | 'og' | 'twitter' | 'gallery', galleryIndex);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload fehlgeschlagen.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
