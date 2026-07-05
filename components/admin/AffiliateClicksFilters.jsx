'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const PERIODS = [
  { value: 'today', label: 'Heute' },
  { value: '7d',    label: '7 Tage' },
  { value: '30d',   label: '30 Tage' },
  { value: 'all',   label: 'Alle' },
];

export default function AffiliateClicksFilters({ period, provider, providers }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  function update(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const chipBase = {
    padding: '5px 14px', borderRadius: '20px', border: '1.5px solid #E2E8F0',
    background: '#F8FAFC', color: '#64748B', fontSize: '13px', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
  };
  const chipActive = {
    ...chipBase,
    border: '1.5px solid #D97706', background: '#FFFBEB',
    color: '#B45309', fontWeight: 700,
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
      {/* Period filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {PERIODS.map(p => (
          <button
            key={p.value}
            type="button"
            onClick={() => update('period', p.value === 'all' ? '' : p.value)}
            style={(period || 'all') === p.value ? chipActive : chipBase}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Provider filter */}
      {providers.length > 0 && (
        <select
          value={provider || ''}
          onChange={e => update('provider', e.target.value)}
          style={{
            padding: '6px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0',
            background: '#F8FAFC', color: '#374151', fontSize: '13px',
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          <option value="">Alle Provider</option>
          {providers.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      )}
    </div>
  );
}
