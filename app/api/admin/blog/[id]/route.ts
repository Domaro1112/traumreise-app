import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { getBlogAdmin, updateBlogArticle, deleteBlogArticle } from '@/repositories/blog-cms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/blog/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const article = await getBlogAdmin(id);
    return NextResponse.json({ article });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

// PATCH /api/admin/blog/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const article = await updateBlogArticle(id, body);
    // Revalidate whenever status could have changed (slug or status update).
    revalidatePath('/reiseblog');
    if (article.slug) {
      revalidatePath(`/reiseblog/${article.slug}`);
    }
    return NextResponse.json({ article });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'Dieser Slug existiert bereits.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    await deleteBlogArticle(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
