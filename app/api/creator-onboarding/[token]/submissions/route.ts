import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendCreatorContentSubmittedNotification } from '@/lib/email';

type Params = { params: Promise<{ token: string }> };

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

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

// GET /api/creator-onboarding/[token]/submissions
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  if (!token || token.length < 32) return NextResponse.json({ error: 'Ungültiger Link.' }, { status: 400 });

  try {
    const profile = await resolveProfile(token);
    const err = tokenError(profile);
    if (err) return NextResponse.json({ error: err }, { status: err === 'Link nicht gefunden.' ? 404 : 410 });

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_submissions')
      .select('id, type, title, slug, excerpt, destination, country, category, tags, images, content, route_data, tip_data, status, rejection_reason, submitted_at, published_at, created_at, updated_at')
      .eq('creator_profile_id', profile!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ submissions: data ?? [] });
  } catch (err) {
    console.error('[creator-submissions GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

// POST /api/creator-onboarding/[token]/submissions
export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params;
  if (!token || token.length < 32) return NextResponse.json({ error: 'Ungültiger Link.' }, { status: 400 });

  try {
    const profile = await resolveProfile(token);
    const err = tokenError(profile);
    if (err) return NextResponse.json({ error: err }, { status: err === 'Link nicht gefunden.' ? 404 : 410 });

    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const type = body.type as string;

    if (!['guide', 'tip', 'route'].includes(type)) {
      return NextResponse.json({ error: 'Ungültiger Typ. Erlaubt: guide, tip, route.' }, { status: 400 });
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return NextResponse.json({ error: 'Titel ist erforderlich.' }, { status: 400 });
    if (title.length > 220) return NextResponse.json({ error: 'Titel: max. 220 Zeichen.' }, { status: 400 });

    const supabase = createServerClient();

    // Unique slug
    const base = slugify(title);
    let slug = base;
    for (let i = 1; i <= 20; i++) {
      const { data: existing } = await supabase
        .from('creator_submissions')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${base}-${i}`;
    }

    const insert: Record<string, unknown> = {
      creator_profile_id: profile!.id,
      type,
      title,
      slug,
      excerpt:     typeof body.excerpt     === 'string' ? (body.excerpt.trim() || null)     : null,
      destination: typeof body.destination === 'string' ? (body.destination.trim() || null) : null,
      country:     typeof body.country     === 'string' ? (body.country.trim() || null)     : null,
      category:    typeof body.category    === 'string' ? (body.category.trim() || null)    : null,
      tags:        Array.isArray(body.tags)   ? (body.tags as string[]).map(String).filter(Boolean)   : [],
      images:      Array.isArray(body.images) ? (body.images as string[]).map(String).filter(Boolean) : [],
      content:     typeof body.content     === 'string' ? (body.content.trim() || null)  : null,
      route_data:  (body.route_data && typeof body.route_data === 'object') ? body.route_data : {},
      tip_data:    (body.tip_data   && typeof body.tip_data   === 'object') ? body.tip_data   : {},
      status:      'draft',
    };

    const { data, error: insertErr } = await supabase
      .from('creator_submissions')
      .insert(insert)
      .select()
      .single();

    if (insertErr) throw insertErr;
    return NextResponse.json({ submission: data }, { status: 201 });
  } catch (err) {
    console.error('[creator-submissions POST]', err);
    return NextResponse.json({ error: 'Fehler beim Erstellen.' }, { status: 500 });
  }
}
