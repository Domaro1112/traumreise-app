import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Stimmung' },
  { id: 2, label: 'Reisezeit' },
  { id: 3, label: 'Dauer' },
  { id: 4, label: 'Budget' },
  { id: 5, label: 'Deine Reise' },
];

export default function WizardProgress({ currentStep }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 0,
        marginBottom: '40px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
      }}
    >
      {STEPS.map((step, i) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;

        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
            {/* Connector line (before each step except the first) */}
            {i > 0 && (
              <div
                style={{
                  width: 'clamp(16px, 4vw, 52px)',
                  height: '2px',
                  marginTop: '17px',
                  background: done || active ? '#0EA5E9' : '#E2E8F0',
                  transition: 'background 0.4s ease',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Step item */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
              {/* Circle */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: done || active ? '#0EA5E9' : '#F1F5F9',
                  border: `2px solid ${done || active ? '#0EA5E9' : '#E2E8F0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: active ? '0 0 0 4px rgba(14,165,233,0.16)' : 'none',
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <Check size={16} strokeWidth={2.5} color="#FFFFFF" />
                ) : (
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: active ? '#FFFFFF' : '#94A3B8',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {step.id}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 'clamp(10px, 1.5vw, 12px)',
                  fontWeight: active ? 700 : done ? 600 : 500,
                  color: active ? '#0284C7' : done ? '#0F172A' : '#94A3B8',
                  fontFamily: 'var(--font-heading)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                  letterSpacing: active ? '0.01em' : 0,
                }}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
