import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createSsrClient } from '@supabase/ssr';
import { isAdminRequest } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/admin/settings — fetch site_settings row (or defaults)
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) throw error;

    // If no row yet (migration not applied or default missing), return shape with defaults
    if (!data) {
      const { data: inserted } = await supabase
        .from('site_settings')
        .upsert({ id: 'default' })
        .select('*')
        .maybeSingle();
      return NextResponse.json({ settings: inserted ?? { id: 'default' } });
    }

    return NextResponse.json({ settings: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/admin/settings — validate + upsert site_settings + write audit log
export async function PUT(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const settings: Record<string, unknown> = {};

    // ── Text fields ──────────────────────────────────────────────────────────
    if (body.site_name !== undefined)
      settings.site_name = String(body.site_name).trim().slice(0, 100);

    if (body.site_url !== undefined) {
      const u = String(body.site_url).trim();
      if (u && !/^https?:\/\/.+/.test(u))
        return NextResponse.json({ error: 'site_url muss eine gültige URL sein (https://...).' }, { status: 400 });
      settings.site_url = u || null;
    }

    if (body.site_description !== undefined)
      settings.site_description = String(body.site_description).trim().slice(0, 500) || null;

    if (body.default_seo_title !== undefined)
      settings.default_seo_title = String(body.default_seo_title).trim().slice(0, 150) || null;

    if (body.default_seo_description !== undefined)
      settings.default_seo_description = String(body.default_seo_description).trim().slice(0, 300) || null;

    if (body.maintenance_message !== undefined)
      settings.maintenance_message = String(body.maintenance_message).trim().slice(0, 500) || null;

    // ── E-Mail fields ────────────────────────────────────────────────────────
    for (const key of ['contact_email', 'support_email', 'admin_notification_email'] as const) {
      if (body[key] !== undefined) {
        const email = String(body[key]).trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          return NextResponse.json({ error: `${key} muss eine gültige E-Mail-Adresse sein.` }, { status: 400 });
        settings[key] = email || null;
      }
    }

    // ── Boolean fields ───────────────────────────────────────────────────────
    for (const key of [
      'maintenance_mode',
      'notify_on_contact_inquiry',
      'notify_on_partner_inquiry',
      'notify_on_creator_application',
      'notify_on_newsletter_signup',
    ] as const) {
      if (body[key] !== undefined) settings[key] = Boolean(body[key]);
    }

    if (Object.keys(settings).length === 0)
      return NextResponse.json({ error: 'Keine Felder zum Speichern angegeben.' }, { status: 400 });

    const supabase = createServerClient();
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'default', ...settings });

    if (error) throw error;

    // Write audit log (non-fatal — table may not exist yet)
    try {
      const adminEmail = await resolveAdminEmail(request);
      await supabase.from('admin_audit_log').insert({
        admin_email: adminEmail,
        action: 'site_settings_updated',
        entity_type: 'site_settings',
        entity_id: 'default',
        metadata: { fields: Object.keys(settings) },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function resolveAdminEmail(request: NextRequest): Promise<string> {
  try {
    const client = createSsrClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return request.cookies.getAll(); }, setAll() {} } }
    );
    const { data: { user } } = await client.auth.getUser();
    return user?.email ?? 'unknown';
  } catch {
    return 'unknown';
  }
}
