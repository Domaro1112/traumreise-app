import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import {
  uploadCreatorProfileImage,
  uploadCreatorSubmissionImage,
} from '@/lib/supabase/storage-creator';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES    = 5 * 1024 * 1024; // 5 MB (strenger als Admin)

const VALID_TARGET_TYPES = new Set([
  'profile', 'hero', 'gallery',          // Profilbilder
  'submission',                           // Submission-Bilder (Guide/Tipp/Route)
  'routeStation',                         // Stations-Bilder einer Route
]);

async function resolveProfile(token: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('creator_profiles')
    .select('id, status, onboarding_token_expires_at')
    .eq('onboarding_token', token)
    .single();
  return data;
}

// POST /api/creator-media/upload
// Body: FormData { token, file, targetType, submissionId?, galleryIndex?, stationIndex? }
export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const token      = (form.get('token')      as string | null)?.trim() ?? '';
    const file       = form.get('file') as File | null;
    const targetType = (form.get('targetType') as string | null)?.trim() ?? '';
    const submissionId = (form.get('submissionId') as string | null)?.trim() ?? '';

    const galleryIndexRaw = (form.get('galleryIndex') as string | null)?.trim();
    const stationIndexRaw = (form.get('stationIndex') as string | null)?.trim();
    const galleryIndex = galleryIndexRaw && /^\d+$/.test(galleryIndexRaw) ? parseInt(galleryIndexRaw, 10) : 0;
    const stationIndex = stationIndexRaw && /^\d+$/.test(stationIndexRaw) ? parseInt(stationIndexRaw, 10) : 0;

    // ── Auth ────────────────────────────────────────────────────────────────────
    if (!token || token.length < 32) {
      return NextResponse.json({ error: 'Ungültiger Link.' }, { status: 400 });
    }

    const profile = await resolveProfile(token);
    if (!profile)                     return NextResponse.json({ error: 'Link nicht gefunden.' },  { status: 404 });
    if (profile.status === 'archived') return NextResponse.json({ error: 'Profil archiviert.' },   { status: 410 });
    if (!profile.onboarding_token_expires_at || new Date(profile.onboarding_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Link abgelaufen.' }, { status: 410 });
    }

    // ── Validierung ─────────────────────────────────────────────────────────────
    if (!file)                              return NextResponse.json({ error: 'Keine Datei übermittelt.' },          { status: 400 });
    if (!VALID_TARGET_TYPES.has(targetType)) return NextResponse.json({ error: 'Ungültiger Zieltyp.' },              { status: 400 });
    if (!ALLOWED_MIME.has(file.type))       return NextResponse.json({ error: 'Nur JPG, PNG oder WebP erlaubt.' },   { status: 415 });
    if (file.size > MAX_BYTES)              return NextResponse.json({ error: 'Datei zu groß (max. 5 MB).' },        { status: 413 });

    // Für Submission-Uploads: prüfen ob Submission zu diesem Creator gehört
    if (['submission', 'routeStation'].includes(targetType)) {
      if (!submissionId) return NextResponse.json({ error: 'submissionId fehlt.' }, { status: 400 });

      const supabase = createServerClient();
      const { data: sub } = await supabase
        .from('creator_submissions')
        .select('id')
        .eq('id', submissionId)
        .eq('creator_profile_id', profile.id)
        .single();

      if (!sub) return NextResponse.json({ error: 'Submission nicht gefunden oder gehört nicht zu diesem Creator.' }, { status: 403 });
    }

    // ── Upload ──────────────────────────────────────────────────────────────────
    let result: { url: string | null };

    if (targetType === 'profile' || targetType === 'hero') {
      result = await uploadCreatorProfileImage(
        file, profile.id,
        targetType as 'profile' | 'hero',
        0,
      );
    } else if (targetType === 'gallery') {
      result = await uploadCreatorProfileImage(file, profile.id, 'gallery', galleryIndex);
    } else if (targetType === 'submission') {
      result = await uploadCreatorSubmissionImage(file, submissionId, 'image', galleryIndex);
    } else if (targetType === 'routeStation') {
      result = await uploadCreatorSubmissionImage(file, submissionId, 'station', stationIndex);
    } else {
      return NextResponse.json({ error: 'Unbekannter Zieltyp.' }, { status: 400 });
    }

    if (!result.url) return NextResponse.json({ error: 'URL konnte nicht ermittelt werden.' }, { status: 500 });
    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error('[creator-media/upload]', err);
    // Keine Details an Client – nur generischer Fehler
    return NextResponse.json({ error: 'Upload fehlgeschlagen.' }, { status: 500 });
  }
}
