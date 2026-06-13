import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { archiveBlogArticle } from '@/repositories/blog-cms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/blog/[id]/archive
export async function POST(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const article = await archiveBlogArticle(id);
    revalidatePath('/');
    revalidatePath('/reiseblog');
    return NextResponse.json({ article });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
