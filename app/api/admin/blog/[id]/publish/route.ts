import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { publishBlogArticle } from '@/repositories/blog-cms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/blog/[id]/publish
export async function POST(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const article = await publishBlogArticle(id);
    return NextResponse.json({ article });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
