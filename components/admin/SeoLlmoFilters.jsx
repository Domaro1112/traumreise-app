'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const TABS = [
  { value: 'destinations', label: 'Reiseziele' },
  { value: 'blog',         label: 'Blog' },
  { value: 'all',          label: 'Alle' },
];

export default function SeoLlmoFilters({ tab }) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  function update(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'destinations') params.delete(key);
    else params.set(key, value);
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

  const current = tab || 'destinations';

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {TABS.map(t => (
        <button
          key={t.value}
          type="button"
          onClick={() => update('tab', t.value)}
          style={current === t.value ? chipActive : chipBase}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
