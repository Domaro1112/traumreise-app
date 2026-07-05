import { TrendingUp } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import AffiliateClicksFilters from '@/components/admin/AffiliateClicksFilters';

export const metadata = {
  title: 'Affiliate-Klicks | ApeAround Admin',
};

export const dynamic = 'force-dynamic';

function truncateUrl(url, max = 60) {
  if (!url) return '–';
  try {
    const u = new URL(url);
    const short = u.hostname + u.pathname;
    return short.length > max ? short.slice(0, max) + '…' : short;
  } catch {
    return url.length > max ? url.slice(0, max) + '…' : url;
  }
}

function formatDate(iso) {
  if (!iso) return '–';
  const d = new Date(iso);
  return d.toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const PERIOD_LABELS = { today: 'Heute', '7d': '7 Tage', '30d': '30 Tage' };
const PROVIDER_COLORS = {
  booking:          { bg: '#EFF6FF', color: '#1D4ED8' },
  skyscanner:       { bg: '#F0F9FF', color: '#0284C7' },
  check24:          { bg: '#FEF2F2', color: '#DC2626' },
  check24_mietwagen:{ bg: '#FEF2F2', color: '#DC2626' },
  trivago:          { bg: '#FFF7ED', color: '#C2410C' },
  getyourguide:     { bg: '#F0FDF4', color: '#15803D' },
  expedia:          { bg: '#EFF6FF', color: '#1E40AF' },
  holidaycheck:     { bg: '#FFF7ED', color: '#B45309' },
};

function ProviderBadge({ provider }) {
  const style = PROVIDER_COLORS[provider] ?? { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
      background: style.bg, color: style.color,
    }}>
      {provider}
    </span>
  );
}

export default async function AffiliateClicksPage({ searchParams }) {
  const params  = await searchParams;
  const period   = params?.period  || 'all';
  const provider = params?.provider || '';

  const supabase = createServerClient();
  const now = new Date();

  // Date range
  let fromDate = null;
  if (period === 'today') {
    fromDate = new Date(now); fromDate.setHours(0, 0, 0, 0);
  } else if (period === '7d') {
    fromDate = new Date(now); fromDate.setDate(now.getDate() - 7);
  } else if (period === '30d') {
    fromDate = new Date(now); fromDate.setDate(now.getDate() - 30);
  }

  // Stats (always full range for top bar)
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const week7Start = new Date(now); week7Start.setDate(now.getDate() - 7);
  const month30Start = new Date(now); month30Start.setDate(now.getDate() - 30);

  let totalClicks = 0, todayClicks = 0, weekClicks = 0, monthClicks = 0;
  let topProviders = [];

  try {
    const [totRes, dayRes, wkRes, moRes, provRes] = await Promise.all([
      supabase.from('affiliate_clicks').select('*', { count: 'exact', head: true }),
      supabase.from('affiliate_clicks').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
      supabase.from('affiliate_clicks').select('*', { count: 'exact', head: true }).gte('created_at', week7Start.toISOString()),
      supabase.from('affiliate_clicks').select('*', { count: 'exact', head: true }).gte('created_at', month30Start.toISOString()),
      supabase.from('affiliate_clicks').select('provider').gte('created_at', month30Start.toISOString()),
    ]);
    totalClicks = totRes.count ?? 0;
    todayClicks = dayRes.count ?? 0;
    weekClicks  = wkRes.count  ?? 0;
    monthClicks = moRes.count  ?? 0;

    const provMap = {};
    for (const row of provRes.data ?? []) {
      provMap[row.provider] = (provMap[row.provider] ?? 0) + 1;
    }
    topProviders = Object.entries(provMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([p, c]) => ({ provider: p, clicks: c }));
  } catch { /* table may be empty */ }

  // Rows query
  let rows = [];
  let allProviders = [];
  try {
    let q = supabase
      .from('affiliate_clicks')
      .select('id, created_at, provider, affiliate_url, referrer, destination_name, destination_country')
      .order('created_at', { ascending: false })
      .limit(200);

    if (fromDate) q = q.gte('created_at', fromDate.toISOString());
    if (provider) q = q.eq('provider', provider);

    const { data } = await q;
    rows = data ?? [];

    // Unique providers for filter dropdown
    const { data: provData } = await supabase
      .from('affiliate_clicks')
      .select('provider')
      .order('provider');
    const seen = new Set();
    for (const r of provData ?? []) {
      if (!seen.has(r.provider)) { seen.add(r.provider); allProviders.push(r.provider); }
    }
  } catch { /* no rows */ }

  const statBox = {
    background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0',
    padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800,
          color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Affiliate-Klicks
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Klicks auf Affiliate-Links via /go/[provider] — gespeichert in <code>affiliate_clicks</code>.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Klicks gesamt', value: totalClicks },
          { label: 'Heute',         value: todayClicks },
          { label: '7 Tage',        value: weekClicks  },
          { label: '30 Tage',       value: monthClicks },
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

      {/* Top providers */}
      {topProviders.length > 0 && (
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '18px 20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Top Provider (30 Tage)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {topProviders.map(({ provider: p, clicks: c }, i) => (
              <div key={p} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', borderRadius: '10px',
                background: i === 0 ? '#FFFBEB' : '#F8FAFC',
                border: `1.5px solid ${i === 0 ? '#FDE68A' : '#E2E8F0'}`,
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: i === 0 ? '#92400E' : '#64748B' }}>#{i + 1}</span>
                <ProviderBadge provider={p} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Suspense fallback={null}>
        <AffiliateClicksFilters period={period} provider={provider} providers={allProviders} />
      </Suspense>

      {/* Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            {rows.length} Einträge
            {period !== 'all' && ` · ${PERIOD_LABELS[period] ?? period}`}
            {provider && ` · ${provider}`}
          </div>
          {rows.length === 200 && (
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Zeige max. 200 Einträge</span>
          )}
        </div>

        {rows.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            Keine Klicks gefunden.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Datum', 'Provider', 'Ziel-URL', 'Referrer', 'Reiseziel'].map(col => (
                    <th key={col} style={{
                      padding: '10px 14px', textAlign: 'left', fontSize: '11px',
                      fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em',
                      textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid #F8FAFF' : 'none' }}>
                    <td style={{ padding: '9px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {formatDate(row.created_at)}
                    </td>
                    <td style={{ padding: '9px 14px' }}>
                      <ProviderBadge provider={row.provider} />
                    </td>
                    <td style={{ padding: '9px 14px', maxWidth: '260px' }}>
                      {row.affiliate_url ? (
                        <a
                          href={row.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={row.affiliate_url}
                          style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 500 }}
                        >
                          {truncateUrl(row.affiliate_url)}
                        </a>
                      ) : '–'}
                    </td>
                    <td style={{ padding: '9px 14px', color: '#94A3B8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.referrer ? truncateUrl(row.referrer, 40) : '–'}
                    </td>
                    <td style={{ padding: '9px 14px', fontWeight: 500, color: '#0F172A' }}>
                      {row.destination_name || '–'}
                      {row.destination_country && (
                        <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>
                          {row.destination_country}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
