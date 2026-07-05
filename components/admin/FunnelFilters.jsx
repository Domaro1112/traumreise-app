'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const PERIODS = [
  { value: 'today', label: 'Heute' },
  { value: '7d',    label: '7 Tage' },
  { value: '30d',   label: '30 Tage' },
  { value: 'all',   label: 'Alle' },
];

const TYPES = [
  { value: '',              label: 'Alle' },
  { value: 'normal',        label: 'Normal' },
  { value: 'single_parent', label: 'Alleinerziehend' },
];

export default function FunnelFilters({ period, type }) {
  const router       = useRouter();
  const pathname     = usePathname();
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
    border: '1.5px solid #0891B2', background: '#ECFEFF',
    color: '#0E7490', fontWeight: 700,
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
      {/* Period */}
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

      {/* Type */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => update('type', t.value)}
            style={(type || '') === t.value ? chipActive : chipBase}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
