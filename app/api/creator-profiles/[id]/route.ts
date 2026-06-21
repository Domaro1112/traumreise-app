import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { validateProfileBody } from '@/lib/creator-profiles-validation';

type Params = { params: Promise<{ id: string }> };

// GET /api/creator-profiles/[id]
export async function GET(request: NextRequest, { params }: Params) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 });
    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error('[creator-profiles GET id]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

// PATCH /api/creator-profiles/[id]
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const result = validateProfileBody(body, { partial: true });
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // published_at bei Statuswechsel auf 'published' setzen
    if (result.status === 'published' && !result.published_at) {
      result.published_at = new Date().toISOString();
    }
    if (result.status && result.status !== 'published') {
      result.published_at = null;
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_profiles')
      .update(result)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error('[creator-profiles PATCH]', err);
    return NextResponse.json({ error: 'Fehler beim Speichern.' }, { status: 500 });
  }
}

// DELETE /api/creator-profiles/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from('creator_profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[creator-profiles DELETE]', err);
    return NextResponse.json({ error: 'Fehler beim Löschen.' }, { status: 500 });
  }
}
