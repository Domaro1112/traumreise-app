import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { getAffiliateSettings, upsertAffiliateSettings } from '@/repositories/affiliate-settings';

// GET /api/admin/affiliate/settings
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const settings = await getAffiliateSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/affiliate/settings  – bulk upsert
export async function PUT(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!Array.isArray(body.settings)) {
      return NextResponse.json({ error: 'Ungültiges Format.' }, { status: 400 });
    }

    const validated = (body.settings as unknown[]).map((s: any) => ({
      provider:     String(s.provider).trim(),
      affiliate_id: String(s.affiliate_id ?? '').trim(),
      enabled:      Boolean(s.enabled),
    }));

    await upsertAffiliateSettings(validated);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
