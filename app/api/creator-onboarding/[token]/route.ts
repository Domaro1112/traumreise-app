import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendCreatorProfileSubmittedNotification } from '@/lib/email';

type Params = { params: Promise<{ token: string }> };

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

const CREATOR_TYPES = [
  'Reiseblogger', 'Instagram Creator', 'TikTok Creator', 'YouTube Creator',
  'UGC Creator', 'Camper / Vanlife', 'Familienreise', 'Urlaub mit Hund', 'Sonstiges',
];

// Felder, die der Creator selbst bearbeiten darf
const ALLOWED_CREATOR_FIELDS = new Set([
  'display_name', 'slug', 'short_bio', 'bio', 'creator_type',
  'topics', 'destinations', 'travel_styles',
  'social_links', 'website_url', 'gallery_images', 'featured_tips',
  'cta_label', 'cta_url', 'profile_image_url', 'hero_image_url',
  'status',
]);

const ALLOWED_STATUSES = ['draft', 'submitted'] as const;

async function resolveProfile(token: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('creator_profiles')
    .select('id, slug, display_name, short_bio, bio, creator_type, topics, destinations, travel_styles, social_links, website_url, gallery_images, featured_tips, cta_label, cta_url, profile_image_url, hero_image_url, status, onboarding_token_expires_at, onboarding_completed_at, submitted_at')
    .eq('onboarding_token', token)
    .single();

  return data;
}

function isTokenExpired(profile: { onboarding_token_expires_at?: string | null }): boolean {
  if (!profile.onboarding_token_expires_at) return true;
  return new Date(profile.onboarding_token_expires_at) < new Date();
}

// GET /api/creator-onboarding/[token]
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;

  if (!token || token.length < 32) {
    return NextResponse.json({ error: 'Ungültiger Link.' }, { status: 400 });
  }

  try {
    const profile = await resolveProfile(token);

    if (!profile) return NextResponse.json({ error: 'Link nicht gefunden.' }, { status: 404 });
    if (isTokenExpired(profile)) return NextResponse.json({ error: 'Link abgelaufen.' }, { status: 410 });
    if (profile.status === 'archived') return NextResponse.json({ error: 'Profil archiviert.' }, { status: 410 });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('[creator-onboarding GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

// PATCH /api/creator-onboarding/[token]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { token } = await params;

  if (!token || token.length < 32) {
    return NextResponse.json({ error: 'Ungültiger Link.' }, { status: 400 });
  }

  try {
    const supabase = createServerClient();

    // Erst vollständiges Profil laden (inkl. ID und status für Checks + Notification)
    const { data: fullProfile } = await supabase
      .from('creator_profiles')
      .select('id, slug, display_name, creator_type, status, submitted_at, onboarding_token_expires_at, onboarding_completed_at')
      .eq('onboarding_token', token)
      .single();

    if (!fullProfile) return NextResponse.json({ error: 'Link nicht gefunden.' }, { status: 404 });
    if (isTokenExpired(fullProfile)) return NextResponse.json({ error: 'Dieser Einrichtungslink ist abgelaufen.' }, { status: 410 });
    if (fullProfile.status === 'archived') return NextResponse.json({ error: 'Profil archiviert.' }, { status: 410 });

    const body = await req.json().catch(() => ({})) as Record<string, unknown>;

    // Nur erlaubte Felder
    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body)) {
      if (ALLOWED_CREATOR_FIELDS.has(k)) update[k] = v;
    }

    // Status-Validierung
    if ('status' in update) {
      if (!(ALLOWED_STATUSES as readonly string[]).includes(update.status as string)) {
        return NextResponse.json({ error: 'Ungültiger Status. Erlaubt: draft, submitted.' }, { status: 400 });
      }
      // Creator darf niemals published setzen
      if (update.status === 'published') {
        return NextResponse.json({ error: 'Veröffentlichung erfolgt ausschließlich durch den Admin.' }, { status: 403 });
      }
    }

    // display_name
    if (typeof update.display_name === 'string') {
      if (!update.display_name.trim()) return NextResponse.json({ error: 'Name darf nicht leer sein.' }, { status: 400 });
      if (update.display_name.length > 200) return NextResponse.json({ error: 'Name: max. 200 Zeichen.' }, { status: 400 });
      update.display_name = update.display_name.trim();
    }

    // slug (nur wenn Status nicht published)
    if (typeof update.slug === 'string') {
      const s = update.slug.trim().toLowerCase();
      if (!SLUG_RE.test(s)) return NextResponse.json({ error: 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.' }, { status: 400 });
      if (s.length > 100) return NextResponse.json({ error: 'Slug: max. 100 Zeichen.' }, { status: 400 });

      // Eindeutigkeit prüfen (exkludiert eigene ID)
      if (s !== fullProfile.slug) {
        const { data: slugCheck } = await supabase
          .from('creator_profiles')
          .select('id')
          .eq('slug', s)
          .neq('id', fullProfile.id)
          .maybeSingle();
        if (slugCheck) return NextResponse.json({ error: `Slug "${s}" ist bereits vergeben.` }, { status: 409 });
      }
      update.slug = s;
    }

    // short_bio max 220 Zeichen
    if (typeof update.short_bio === 'string') {
      if (update.short_bio.length > 220) return NextResponse.json({ error: 'Kurzbeschreibung: max. 220 Zeichen.' }, { status: 400 });
      update.short_bio = update.short_bio.trim() || null;
    }

    // bio max 3000 Zeichen
    if (typeof update.bio === 'string') {
      if (update.bio.length > 3000) return NextResponse.json({ error: 'Bio: max. 3000 Zeichen.' }, { status: 400 });
      update.bio = update.bio.trim() || null;
    }

    // creator_type
    if (typeof update.creator_type === 'string') {
      if (update.creator_type && !CREATOR_TYPES.includes(update.creator_type)) {
        return NextResponse.json({ error: 'Ungültiger Creator-Typ.' }, { status: 400 });
      }
      update.creator_type = update.creator_type || null;
    }

    // Texte bereinigen
    for (const f of ['website_url', 'cta_label', 'cta_url', 'profile_image_url', 'hero_image_url']) {
      if (typeof update[f] === 'string') {
        update[f] = (update[f] as string).trim() || null;
      }
    }

    // Arrays
    for (const f of ['topics', 'destinations', 'travel_styles', 'gallery_images']) {
      if (Array.isArray(update[f])) {
        update[f] = (update[f] as unknown[]).map(String).filter(Boolean);
      }
    }

    // social_links: nur object erlaubt
    if ('social_links' in update && (typeof update.social_links !== 'object' || Array.isArray(update.social_links))) {
      delete update.social_links;
    }

    // featured_tips: array mit einfachen Objekten
    if ('featured_tips' in update) {
      if (!Array.isArray(update.featured_tips)) {
        delete update.featured_tips;
      } else {
        update.featured_tips = (update.featured_tips as Record<string, unknown>[]).map(t => ({
          title:       String(t.title ?? '').trim(),
          text:        String(t.text ?? '').trim() || undefined,
          destination: String(t.destination ?? '').trim() || undefined,
          url:         String(t.url ?? '').trim() || undefined,
        })).filter(t => t.title);
      }
    }

    // Zeitstempel setzen
    update.last_creator_edit_at = new Date().toISOString();
    if (update.status === 'submitted') {
      update.submitted_at = new Date().toISOString();
      if (!fullProfile.onboarding_completed_at) {
        update.onboarding_completed_at = new Date().toISOString();
      }
    }

    // Prüfen ob das die erste Einreichung ist (für Admin-Notification)
    const isFirstSubmit = update.status === 'submitted'
      && fullProfile.status !== 'submitted'
      && !fullProfile.submitted_at;

    const { error: updateErr } = await supabase
      .from('creator_profiles')
      .update(update)
      .eq('id', fullProfile.id);

    if (updateErr) throw updateErr;

    // Admin-Notification bei erster Einreichung (fire-and-forget, darf nicht Request blockieren)
    if (isFirstSubmit) {
      const submittedAt = (update.submitted_at as string) ?? new Date().toISOString();
      sendCreatorProfileSubmittedNotification({
        id:           fullProfile.id,
        display_name: (typeof update.display_name === 'string' ? update.display_name : fullProfile.display_name) ?? '',
        slug:         (typeof update.slug === 'string' ? update.slug : fullProfile.slug) ?? '',
        creator_type: (typeof update.creator_type === 'string' ? update.creator_type : fullProfile.creator_type) ?? null,
        submitted_at: submittedAt,
      }).catch(e => console.error('[CREATOR_NOTIFY] Fire-and-forget error:', e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[creator-onboarding PATCH]', err);
    return NextResponse.json({ error: 'Fehler beim Speichern.' }, { status: 500 });
  }
}
