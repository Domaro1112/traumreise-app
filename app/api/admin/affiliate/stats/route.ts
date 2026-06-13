import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/admin/affiliate/stats
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const supabase = createServerClient();

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const start7d = new Date(now);
    start7d.setDate(now.getDate() - 7);

    const start30d = new Date(now);
    start30d.setDate(now.getDate() - 30);

    const [todayRes, weekRes, monthRes, providerRes, destRes] = await Promise.all([
      supabase
        .from('affiliate_clicks')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfToday.toISOString()),

      supabase
        .from('affiliate_clicks')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', start7d.toISOString()),

      supabase
        .from('affiliate_clicks')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', start30d.toISOString()),

      supabase
        .from('affiliate_clicks')
        .select('provider')
        .gte('created_at', start30d.toISOString()),

      supabase
        .from('affiliate_clicks')
        .select('destination_name')
        .gte('created_at', start30d.toISOString())
        .not('destination_name', 'is', null),
    ]);

    // Aggregate provider counts (30 days)
    const providerMap: Record<string, number> = {};
    for (const row of providerRes.data ?? []) {
      providerMap[row.provider] = (providerMap[row.provider] ?? 0) + 1;
    }
    const topProviders = Object.entries(providerMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([provider, clicks]) => ({ provider, clicks }));

    // Aggregate destination counts (30 days)
    const destMap: Record<string, number> = {};
    for (const row of destRes.data ?? []) {
      if (row.destination_name) {
        destMap[row.destination_name] = (destMap[row.destination_name] ?? 0) + 1;
      }
    }
    const topDestinations = Object.entries(destMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([destination, clicks]) => ({ destination, clicks }));

    return NextResponse.json({
      today:           todayRes.count  ?? 0,
      week:            weekRes.count   ?? 0,
      month:           monthRes.count  ?? 0,
      topProviders,
      topDestinations,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
