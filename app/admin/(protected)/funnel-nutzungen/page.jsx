import { Zap } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import FunnelFilters from '@/components/admin/FunnelFilters';

export const metadata = {
  title: 'Funnel-Nutzungen | ApeAround Admin',
};

export const dynamic = 'force-dynamic';

const BUDGET_LABELS = {
  budget:  'Budget',
  mid:     'Mittel',
  comfort: 'Komfort',
  luxury:  'Luxus',
  open:    'Offen',
};

const SEASON_LABELS = {
  spring: 'Frühling',
  summer: 'Sommer',
  autumn: 'Herbst',
  winter: 'Winter',
  flex:   'Flexibel',
};

const DURATION_LABELS = {
  short_trip: 'Kurztrip',
  one_week:   '1 Woche',
  two_weeks:  '2 Wochen',
  long_trip:  'Langtrip',
  flexible:   'Flexibel',
};

function formatDate(iso) {
  if (!iso) return '–';
  const d = new Date(iso);
  return d.toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function TypeBadge({ type }) {
  const isSingle = type === 'single_parent';
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
      background: isSingle ? '#F5F3FF' : '#EFF6FF',
      color:      isSingle ? '#7C3AED' : '#1D4ED8',
    }}>
      {isSingle ? 'Alleinerziehend' : 'Normal'}
    </span>
  );
}

export default async function FunnelNutzungenPage({ searchParams }) {
  const params  = await searchParams;
  const period   = params?.period || 'all';
  const typeFilter = params?.type  || '';

  const supabase = createServerClient();
  const now = new Date();
  const todayStart  = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const week7Start  = new Date(now); week7Start.setDate(now.getDate() - 7);
  const month30Start = new Date(now); month30Start.setDate(now.getDate() - 30);

  // Stats
  let totalSessions = 0, todaySessions = 0, normalSessions = 0, singleSessions = 0;
  let topDestinations = [];

  try {
    const [totRes, dayRes, normRes, singleRes, destRes] = await Promise.all([
      supabase.from('travel_funnel_sessions').select('*', { count: 'exact', head: true }),
      supabase.from('travel_funnel_sessions').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
      supabase.from('travel_funnel_sessions').select('*', { count: 'exact', head: true }).neq('funnel_type', 'single_parent'),
      supabase.from('travel_funnel_sessions').select('*', { count: 'exact', head: true }).eq('funnel_type', 'single_parent'),
      supabase.from('travel_funnel_sessions').select('generated_destinations').gte('created_at', month30Start.toISOString()).not('generated_destinations', 'is', null),
    ]);
    totalSessions  = totRes.count    ?? 0;
    todaySessions  = dayRes.count    ?? 0;
    normalSessions = normRes.count   ?? 0;
    singleSessions = singleRes.count ?? 0;

    // Aggregate top destinations from JSONB field
    const destMap = {};
    for (const row of destRes.data ?? []) {
      const dests = row.generated_destinations?.destinations ?? [];
      const topDest = dests[0]?.destination;
      if (topDest) destMap[topDest] = (destMap[topDest] ?? 0) + 1;
    }
    topDestinations = Object.entries(destMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([d, c]) => ({ destination: d, count: c }));
  } catch { /* table may be empty */ }

  // Rows query with filters
  let rows = [];
  try {
    let fromDate = null;
    if (period === 'today') { fromDate = todayStart; }
    else if (period === '7d') { fromDate = week7Start; }
    else if (period === '30d') { fromDate = month30Start; }

    let q = supabase
      .from('travel_funnel_sessions')
      .select('id, created_at, funnel_type, budget, season, duration, mood_selection, generated_destinations, email_submitted_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (fromDate) q = q.gte('created_at', fromDate.toISOString());
    if (typeFilter === 'single_parent') q = q.eq('funnel_type', 'single_parent');
    else if (typeFilter === 'normal') q = q.neq('funnel_type', 'single_parent');

    const { data } = await q;
    rows = data ?? [];
  } catch { /* no rows */ }

  const statBox = {
    background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0',
    padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px',
  };

  const PERIOD_LABELS = { today: 'Heute', '7d': '7 Tage', '30d': '30 Tage' };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800,
          color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Funnel-Nutzungen
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Gestartete Reisefunnel-Sessions aus <code>travel_funnel_sessions</code>.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Gesamt',          value: totalSessions  },
          { label: 'Heute',           value: todaySessions  },
          { label: 'Normal',          value: normalSessions },
          { label: 'Alleinerziehend', value: singleSessions },
        ].map(s => (
          <div key={s.label} style={statBox}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {s.label}
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Top destinations */}
      {topDestinations.length > 0 && (
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '18px 20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Top Reiseziele (30 Tage, Platz 1 der KI-Empfehlung)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topDestinations.map(({ destination, count }, i) => (
              <div key={destination} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 12px', borderRadius: '10px',
                background: i === 0 ? '#ECFEFF' : '#F8FAFC',
                border: `1.5px solid ${i === 0 ? '#A5F3FC' : '#E2E8F0'}`,
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>#{i + 1}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{destination}</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Suspense fallback={null}>
        <FunnelFilters period={period} type={typeFilter} />
      </Suspense>

      {/* Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            {rows.length} Sessions
            {period !== 'all' && ` · ${PERIOD_LABELS[period] ?? period}`}
            {typeFilter && ` · ${typeFilter === 'single_parent' ? 'Alleinerziehend' : 'Normal'}`}
          </div>
          {rows.length === 200 && (
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Zeige max. 200 Einträge</span>
          )}
        </div>

        {rows.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            Keine Sessions gefunden.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Datum', 'Typ', 'Budget', 'Saison', 'Dauer', 'Top-Reiseziel', 'E-Mail'].map(col => (
                    <th key={col} style={{
                      padding: '10px 14px', textAlign: 'left', fontSize: '11px',
                      fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em',
                      textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const topDest = row.generated_destinations?.destinations?.[0]?.destination ?? '–';
                  const emailDone = !!row.email_submitted_at;
                  return (
                    <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid #F8FAFF' : 'none' }}>
                      <td style={{ padding: '9px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>
                        {formatDate(row.created_at)}
                      </td>
                      <td style={{ padding: '9px 14px' }}>
                        <TypeBadge type={row.funnel_type} />
                      </td>
                      <td style={{ padding: '9px 14px', color: '#64748B' }}>
                        {BUDGET_LABELS[row.budget] ?? row.budget ?? '–'}
                      </td>
                      <td style={{ padding: '9px 14px', color: '#64748B' }}>
                        {SEASON_LABELS[row.season] ?? row.season ?? '–'}
                      </td>
                      <td style={{ padding: '9px 14px', color: '#64748B' }}>
                        {DURATION_LABELS[row.duration] ?? row.duration ?? '–'}
                      </td>
                      <td style={{ padding: '9px 14px', fontWeight: 500, color: '#0F172A' }}>
                        {topDest}
                      </td>
                      <td style={{ padding: '9px 14px' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 700,
                          color:      emailDone ? '#059669' : '#94A3B8',
                          background: emailDone ? '#ECFDF5' : '#F8FAFF',
                          padding: '2px 8px', borderRadius: '6px',
                        }}>
                          {emailDone ? '✓ Ja' : '–'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
