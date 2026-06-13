import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { listBlogAdmin, createBlogArticle } from '@/repositories/blog-cms';

// GET /api/admin/blog  – list all (all statuses)
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const articles = await listBlogAdmin();
    return NextResponse.json({ articles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/blog  – create new article
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const body = await request.json();

    if (!body.title?.trim() || !body.slug?.trim()) {
      return NextResponse.json(
        { error: 'Titel und Slug sind Pflichtfelder.' },
        { status: 400 }
      );
    }

    const article = await createBlogArticle(body);
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    if (message.includes('unique') || message.includes('duplicate') || message.includes('already exists')) {
      return NextResponse.json(
        { error: 'Dieser Slug existiert bereits.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
