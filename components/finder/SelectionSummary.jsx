import { Sparkles, ShieldCheck } from 'lucide-react';
import { moodOptions, seasonOptions, durationOptions, budgetOptions } from '@/data/finderOptions';

export default function SelectionSummary({ interests, season, duration, budget }) {
  const selectedMoods = moodOptions.filter(m => interests.includes(m.id));
  const selectedSeason = seasonOptions.find(s => s.id === season);
  const selectedDuration = durationOptions.find(d => d.id === duration);
  const selectedBudget = budgetOptions.find(b => b.id === budget);

  const rows = [
    {
      label: 'Stimmung',
      value: selectedMoods.length > 0 ? selectedMoods.map(m => m.label).join(', ') : null,
      badge: selectedMoods.length > 0 ? `${selectedMoods.length} ausgewählt` : null,
      image: selectedMoods[0]?.imageUrl,
    },
    {
      label: 'Reisezeit',
      value: selectedSeason?.label ?? null,
      image: selectedSeason?.imageUrl,
    },
    {
      label: 'Dauer',
      value: selectedDuration ? `${selectedDuration.label}` : null,
      badge: selectedDuration?.subtitle ?? null,
      image: selectedDuration?.imageUrl,
    },
    {
      label: 'Budget',
      value: selectedBudget?.label ?? null,
      badge: selectedBudget?.subtitle ?? null,
      image: selectedBudget?.imageUrl,
    },
  ];

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #F0F9FF, #F8FAFF)',
        }}
      >
        <Sparkles size={15} strokeWidth={2} color="#0EA5E9" />
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '0.01em',
          }}
        >
          Deine Auswahl
        </span>
      </div>

      {/* Selection rows */}
      <div style={{ padding: '8px 0' }}>
        {rows.map(row => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 18px',
              opacity: row.value ? 1 : 0.38,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: row.image
                  ? `url(${row.image}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #F1F5F9, #E2E8F0)',
                flexShrink: 0,
                border: '1px solid #E2E8F0',
                transition: 'background 0.3s ease',
              }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '2px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {row.label}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: row.value ? '#0F172A' : '#CBD5E1',
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.value ?? '—'}
              </div>
              {row.badge && row.value && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#0EA5E9',
                    fontWeight: 600,
                    marginTop: '1px',
                  }}
                >
                  {row.badge}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trust box */}
      <div
        style={{
          margin: '6px 14px 16px',
          padding: '13px 14px',
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '5px',
          }}
        >
          <ShieldCheck size={13} strokeWidth={2} color="#0284C7" />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#0284C7',
              fontFamily: 'var(--font-heading)',
            }}
          >
            100% kostenlos & unverbindlich
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
          Wir zeigen dir nur Reisen, die wirklich zu dir passen.
        </p>
      </div>
    </div>
  );
}
