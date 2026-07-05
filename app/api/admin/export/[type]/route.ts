import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createSsrClient } from '@supabase/ssr';
import { isAdminRequest } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';

type ExportConfig = { table: string; columns: string[] };

const CONFIGS: Record<string, ExportConfig> = {
  'affiliate-clicks': {
    table: 'affiliate_clicks',
    columns: ['id', 'created_at', 'provider', 'destination_name', 'destination_context', 'referrer'],
  },
  'funnel-sessions': {
    table: 'travel_funnel_sessions',
    columns: ['id', 'created_at', 'mood_selection', 'season', 'budget', 'duration', 'funnel_type', 'referrer'],
  },
  'leads': {
    table: 'travel_leads',
    columns: ['id', 'created_at', 'email', 'consent', 'season', 'budget', 'source'],
  },
  'newsletter': {
    table: 'newsletter_subscribers',
    columns: ['id', 'email', 'confirmed', 'source', 'created_at'],
  },
  'contact-inquiries': {
    table: 'contact_inquiries',
    columns: ['id', 'created_at', 'name', 'email', 'subject', 'inquiry_type', 'status'],
  },
  'partner-inquiries': {
    table: 'partner_inquiries',
    columns: ['id', 'created_at', 'name', 'email', 'status'],
  },
};

function toCSV(rows: Record<string, unknown>[], columns: string[]): string {
  function escape(v: unknown): string {
    const s =
      v === null || v === undefined
        ? ''
        : Array.isArray(v)
        ? v.join('; ')
        : String(v);
    return s.includes(',') || s.includes('\n') || s.includes('"')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  }
  const header = columns.join(',');
  const body = rows.map(r => columns.map(c => escape(r[c])).join(','));
  return [header, ...body].join('\n');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }

  const { type } = await context.params;
  const config = CONFIGS[type];
  if (!config) {
    return NextResponse.json({ error: 'Unbekannter Export-Typ.' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const days = searchParams.get('days');

  try {
    const supabase = createServerClient();
    let query = supabase
      .from(config.table)
      .select(config.columns.join(', '))
      .order('created_at', { ascending: false })
      .limit(10000);

    if (days && /^\d+$/.test(days)) {
      const since = new Date(Date.now() - parseInt(days) * 86400_000).toISOString();
      query = query.gte('created_at', since);
    }

    const { data, error } = await query;
    if (error) throw error;

    const csv = toCSV((data as unknown as Record<string, unknown>[]) ?? [], config.columns);
    const filename = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;

    // Write audit log (non-fatal)
    try {
      const adminEmail = await resolveAdminEmail(request);
      await supabase.from('admin_audit_log').insert({
        admin_email: adminEmail,
        action: `export_${type.replace(/-/g, '_')}`,
        entity_type: type,
        metadata: { period: days ? `${days}d` : 'all', rows: data?.length ?? 0 },
      });
    } catch { /* non-fatal */ }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
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
