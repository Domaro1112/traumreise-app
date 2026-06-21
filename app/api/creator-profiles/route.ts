import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { validateProfileBody } from '@/lib/creator-profiles-validation';

// GET /api/creator-profiles — Admin: Liste aller Profile
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ profiles: data ?? [] });
  } catch (err) {
    console.error('[creator-profiles GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

// POST /api/creator-profiles — Admin: neues Profil erstellen
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const result = validateProfileBody(body);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_profiles')
      .insert(result)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ profile: data }, { status: 201 });
  } catch (err) {
    console.error('[creator-profiles POST]', err);
    return NextResponse.json({ error: 'Fehler beim Erstellen.' }, { status: 500 });
  }
}
