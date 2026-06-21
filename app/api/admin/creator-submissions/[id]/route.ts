import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = ['draft', 'submitted', 'published', 'rejected', 'archived'];

export async function GET(request: NextRequest, { params }: Params) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_submissions')
      .select(`
        *,
        creator_profiles!creator_profile_id (
          id, display_name, slug, creator_type
        )
      `)
      .eq('id', id)
      .single();
    if (error || !data) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 });
    return NextResponse.json({ submission: data });
  } catch (err) {
    console.error('[admin/creator-submissions/:id GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServerClient();
    const { data: existing } = await supabase
      .from('creator_submissions')
      .select('id, status, published_at, submitted_at')
      .eq('id', id)
      .single();
    if (!existing) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 });

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const update: Record<string, unknown> = {};

    if (typeof body.status === 'string') {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Ungültiger Status.' }, { status: 400 });
      }
      update.status = body.status;
      if (body.status === 'published' && !existing.published_at) {
        update.published_at = new Date().toISOString();
      }
      if (body.status === 'rejected') {
        update.rejection_reason = typeof body.rejection_reason === 'string'
          ? (body.rejection_reason.trim() || null)
          : null;
      }
    }

    for (const f of ['title', 'excerpt', 'destination', 'country', 'category', 'content', 'admin_notes', 'rejection_reason']) {
      if (typeof body[f] === 'string') update[f] = (body[f] as string).trim() || null;
    }

    for (const f of ['tags', 'images']) {
      if (Array.isArray(body[f])) update[f] = (body[f] as string[]).map(String).filter(Boolean);
    }

    if (body.route_data && typeof body.route_data === 'object' && !Array.isArray(body.route_data)) {
      update.route_data = body.route_data;
    }
    if (body.tip_data && typeof body.tip_data === 'object' && !Array.isArray(body.tip_data)) {
      update.tip_data = body.tip_data;
    }

    const { data, error } = await supabase
      .from('creator_submissions')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ submission: data });
  } catch (err) {
    console.error('[admin/creator-submissions/:id PATCH]', err);
    return NextResponse.json({ error: 'Fehler beim Speichern.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from('creator_submissions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/creator-submissions/:id DELETE]', err);
    return NextResponse.json({ error: 'Fehler beim Löschen.' }, { status: 500 });
  }
}
