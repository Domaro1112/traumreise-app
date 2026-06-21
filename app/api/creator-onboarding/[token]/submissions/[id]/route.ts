import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendCreatorContentSubmittedNotification } from '@/lib/email';

type Params = { params: Promise<{ token: string; id: string }> };

const ALLOWED_STATUSES = ['draft', 'submitted'] as const;

async function resolveProfile(token: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('creator_profiles')
    .select('id, display_name, status, onboarding_token_expires_at')
    .eq('onboarding_token', token)
    .single();
  return data;
}

function tokenError(profile: { onboarding_token_expires_at?: string | null; status?: string } | null) {
  if (!profile) return 'Link nicht gefunden.';
  if (profile.status === 'archived') return 'Profil archiviert.';
  if (!profile.onboarding_token_expires_at) return 'Link abgelaufen.';
  if (new Date(profile.onboarding_token_expires_at) < new Date()) return 'Link abgelaufen.';
  return null;
}

// PATCH /api/creator-onboarding/[token]/submissions/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { token, id } = await params;
  if (!token || token.length < 32) return NextResponse.json({ error: 'Ungültiger Link.' }, { status: 400 });

  try {
    const profile = await resolveProfile(token);
    const err = tokenError(profile);
    if (err) return NextResponse.json({ error: err }, { status: err === 'Link nicht gefunden.' ? 404 : 410 });

    const supabase = createServerClient();

    // Sicherstellen dass der Inhalt diesem Creator gehört
    const { data: existing } = await supabase
      .from('creator_submissions')
      .select('id, type, title, destination, status, submitted_at, creator_profile_id')
      .eq('id', id)
      .eq('creator_profile_id', profile!.id)
      .single();

    if (!existing) return NextResponse.json({ error: 'Inhalt nicht gefunden.' }, { status: 404 });
    if (existing.status === 'published') {
      return NextResponse.json({ error: 'Veröffentlichte Inhalte können nicht mehr bearbeitet werden.' }, { status: 403 });
    }
    if (existing.status === 'archived') {
      return NextResponse.json({ error: 'Archivierte Inhalte können nicht bearbeitet werden.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const update: Record<string, unknown> = {};

    if (typeof body.title === 'string') {
      const t = body.title.trim();
      if (!t) return NextResponse.json({ error: 'Titel darf nicht leer sein.' }, { status: 400 });
      if (t.length > 220) return NextResponse.json({ error: 'Titel: max. 220 Zeichen.' }, { status: 400 });
      update.title = t;
    }

    if (typeof body.status === 'string') {
      if (!(ALLOWED_STATUSES as readonly string[]).includes(body.status)) {
        return NextResponse.json({ error: 'Ungültiger Status. Erlaubt: draft, submitted.' }, { status: 400 });
      }
      update.status = body.status;
    }

    for (const f of ['excerpt', 'destination', 'country', 'category', 'content']) {
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

    const isFirstSubmit = update.status === 'submitted'
      && existing.status !== 'submitted'
      && !existing.submitted_at;

    if (update.status === 'submitted' && !existing.submitted_at) {
      update.submitted_at = new Date().toISOString();
    }

    const { data: updated, error: updateErr } = await supabase
      .from('creator_submissions')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    if (isFirstSubmit) {
      sendCreatorContentSubmittedNotification({
        creator_name:  profile!.display_name ?? '',
        content_type:  existing.type,
        title:         (typeof update.title === 'string' ? update.title : existing.title) ?? '',
        destination:   (typeof update.destination === 'string' ? update.destination : existing.destination) ?? null,
        submission_id: id,
        submitted_at:  (update.submitted_at as string) ?? new Date().toISOString(),
      }).catch(e => console.error('[CONTENT_NOTIFY] Fire-and-forget error:', e));
    }

    return NextResponse.json({ submission: updated });
  } catch (err) {
    console.error('[creator-submissions PATCH]', err);
    return NextResponse.json({ error: 'Fehler beim Speichern.' }, { status: 500 });
  }
}

// DELETE /api/creator-onboarding/[token]/submissions/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { token, id } = await params;
  if (!token || token.length < 32) return NextResponse.json({ error: 'Ungültiger Link.' }, { status: 400 });

  try {
    const profile = await resolveProfile(token);
    const err = tokenError(profile);
    if (err) return NextResponse.json({ error: err }, { status: err === 'Link nicht gefunden.' ? 404 : 410 });

    const supabase = createServerClient();

    const { data: existing } = await supabase
      .from('creator_submissions')
      .select('id, status')
      .eq('id', id)
      .eq('creator_profile_id', profile!.id)
      .single();

    if (!existing) return NextResponse.json({ error: 'Inhalt nicht gefunden.' }, { status: 404 });
    if (existing.status !== 'draft') {
      return NextResponse.json({ error: 'Nur Entwürfe können gelöscht werden.' }, { status: 403 });
    }

    const { error: deleteErr } = await supabase
      .from('creator_submissions')
      .delete()
      .eq('id', id);

    if (deleteErr) throw deleteErr;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[creator-submissions DELETE]', err);
    return NextResponse.json({ error: 'Fehler beim Löschen.' }, { status: 500 });
  }
}
