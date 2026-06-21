import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[äöü]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function uniqueSlug(supabase: ReturnType<typeof createServerClient>, base: string): Promise<string> {
  const { data } = await supabase
    .from('creator_profiles')
    .select('slug')
    .or(`slug.eq.${base},slug.like.${base}-[0-9]*`);

  if (!data?.length) return base;

  const existing = new Set(data.map((r: { slug: string }) => r.slug));
  if (!existing.has(base)) return base;

  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// POST /api/creator-profiles/from-application
// Erstellt ein Creator-Profil aus einer angenommenen Bewerbung.
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { applicationId } = body;

  if (!applicationId || typeof applicationId !== 'string') {
    return NextResponse.json({ error: 'applicationId fehlt.' }, { status: 400 });
  }

  try {
    const supabase = createServerClient();

    // Bewerbung laden
    const { data: app, error: appErr } = await supabase
      .from('creator_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appErr || !app) {
      return NextResponse.json({ error: 'Bewerbung nicht gefunden.' }, { status: 404 });
    }
    if (app.status !== 'accepted') {
      return NextResponse.json({ error: 'Bewerbung muss den Status "accepted" haben.' }, { status: 422 });
    }

    // Prüfen ob bereits ein Profil zu dieser Bewerbung existiert
    const { data: existing } = await supabase
      .from('creator_profiles')
      .select('id, slug')
      .eq('application_id', applicationId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Zu dieser Bewerbung existiert bereits ein Profil.', profileId: existing.id, slug: existing.slug },
        { status: 409 }
      );
    }

    // Social-Links aus profile_url ableiten (heuristisch)
    const social_links: Record<string, string> = {};
    const profileUrl = app.profile_url?.trim();
    if (profileUrl) {
      if (profileUrl.includes('instagram.com')) social_links.instagram = profileUrl;
      else if (profileUrl.includes('tiktok.com'))  social_links.tiktok   = profileUrl;
      else if (profileUrl.includes('youtube.com')) social_links.youtube  = profileUrl;
      else if (profileUrl.includes('facebook.com')) social_links.facebook = profileUrl;
    }

    const baseSlug = slugify(app.name);
    const slug = await uniqueSlug(supabase, baseSlug);

    const { data: profile, error: insertErr } = await supabase
      .from('creator_profiles')
      .insert({
        application_id:  applicationId,
        slug,
        display_name:    app.name.trim().slice(0, 120),
        contact_email:   app.email ?? null,
        creator_type:    app.creator_type ?? null,
        topics:          app.topics ?? [],
        social_links,
        website_url:     (!profileUrl || Object.values(social_links).includes(profileUrl)) ? null : profileUrl,
        internal_notes:  app.message ? `Aus Bewerbung:\n${app.message}` : null,
        status:          'draft',
      })
      .select()
      .single();

    if (insertErr) throw insertErr;
    return NextResponse.json({ profile }, { status: 201 });
  } catch (err) {
    console.error('[creator-profiles from-application]', err);
    return NextResponse.json({ error: 'Fehler beim Erstellen des Profils.' }, { status: 500 });
  }
}
