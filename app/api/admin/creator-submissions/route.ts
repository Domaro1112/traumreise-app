import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const supabase = createServerClient();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type   = url.searchParams.get('type');

    let query = supabase
      .from('creator_submissions')
      .select(`
        id, type, title, slug, excerpt, destination, country, category,
        tags, images, content, route_data, tip_data,
        status, rejection_reason, admin_notes,
        submitted_at, published_at, created_at, updated_at,
        creator_profiles!creator_profile_id (
          id, display_name, slug, creator_type
        )
      `)
      .order('submitted_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);
    if (type   && type   !== 'all') query = query.eq('type', type);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ submissions: data ?? [] });
  } catch (err) {
    console.error('[admin/creator-submissions GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}
