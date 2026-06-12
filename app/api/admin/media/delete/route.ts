import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { deleteStorageFile, pathFromPublicUrl } from '@/lib/supabase/storage-server';

// DELETE /api/admin/media/delete
// Body: { path?: string, url?: string }
export async function DELETE(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const body = await request.json();
    // Accept either a storage path or a full public URL
    const storagePath = body?.path?.trim()
      ?? (body?.url ? pathFromPublicUrl(body.url) : null);

    if (!storagePath) {
      return NextResponse.json({ error: 'Pfad oder URL fehlt.' }, { status: 400 });
    }
    // Prevent path traversal
    if (storagePath.includes('..') || storagePath.startsWith('/')) {
      return NextResponse.json({ error: 'Ungültiger Pfad.' }, { status: 400 });
    }
    await deleteStorageFile(storagePath);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Löschen fehlgeschlagen.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
