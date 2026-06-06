'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import GlassPanel from '@/components/ui/GlassPanel';
import Button from '@/components/ui/Button';

const SEASONS = [
  { id: 'spring', label: '🌸 Frühling' },
  { id: 'summer', label: '☀️ Sommer' },
  { id: 'autumn', label: '🍂 Herbst' },
  { id: 'winter', label: '❄️ Winter' },
];

const DURATIONS = [
  { id: 'weekend', label: '🗓️ Wochenende' },
  { id: 'week', label: '📅 1 Woche' },
  { id: 'twoweeks', label: '🌍 2 Wochen' },
  { id: 'long', label: '🧳 Länger' },
];

const BUDGETS = [
  { id: 'low', label: '💸 Budget', desc: 'bis 500 €' },
  { id: 'mid', label: '✈️ Mittel', desc: '500–1500 €' },
  { id: 'high', label: '💎 Premium', desc: '1500 €+' },
];

const EXAMPLES = [
  'Ich liebe es morgens früh aufzustehen, wenn noch niemand am Strand ist…',
  'Städte, in denen man sich verlaufen kann und es gut ist…',
  'Ich will Essen probieren, das ich zuhause nie finden würde…',
];

function ToggleChip({ label, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: desc ? '10px 14px' : '9px 16px',
        borderRadius: '10px',
        border: `1.5px solid ${selected ? '#FFD700' : 'rgba(255,255,255,0.1)'}`,
        background: selected ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
        color: selected ? '#FFD700' : 'rgba(255,255,255,0.65)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '13px',
        fontWeight: selected ? 600 : 400,
        textAlign: 'left',
        lineHeight: 1.3,
        boxShadow: selected ? '0 0 12px rgba(255,215,0,0.2)' : 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
      }}
    >
      <div>{label}</div>
      {desc && (
        <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>{desc}</div>
      )}
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <div
      style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '2.5px',
        textTransform: 'uppercase',
        color: '#FFD700',
        marginBottom: '10px',
      }}
    >
      {children}
    </div>
  );
}

export default function TravelFinderBox() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [season, setSeason] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const canSubmit = text.trim().length >= 15;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const params = new URLSearchParams();
    if (text) params.set('text', text);
    if (season) params.set('season', season);
    if (duration) params.set('duration', duration);
    if (budget) params.set('budget', budget);
    router.push(`/finder?${params.toString()}`);
  };

  return (
    <section
      style={{
        background: '#07070f',
        paddingTop: '0',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <GlassPanel
          gold
          style={{
            padding: 'clamp(28px, 5vw, 48px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#FFD700',
                marginBottom: '10px',
              }}
            >
              ✦ Finde deine Traumreise in 2 Minuten
            </div>
          </div>

          {/* Main grid: textarea left, options right */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginBottom: '28px',
            }}
          >
            {/* Left: Textarea */}
            <div>
              <FieldLabel>Erzähl uns von dir und deinen Reiseträumen…</FieldLabel>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  placeholder="z. B. Ich liebe es morgens früh aufzustehen, wenn noch niemand am Strand ist…"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${
                      text.length >= 15
                        ? 'rgba(255,215,0,0.45)'
                        : 'rgba(255,255,255,0.1)'
                    }`,
                    borderRadius: '14px',
                    padding: '16px 18px 40px',
                    color: '#fff',
                    fontSize: '15px',
                    lineHeight: 1.75,
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                    fontWeight: 300,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '14px',
                    fontSize: '12px',
                    color:
                      text.length >= 15
                        ? 'rgba(255,215,0,0.6)'
                        : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {text.length} / 600 Zeichen{' '}
                  {text.length >= 15 && '✓'}
                </div>
              </div>

              {/* Examples toggle */}
              <button
                onClick={() => setShowExamples((v) => !v)}
                style={{
                  marginTop: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              >
                <span style={{ fontSize: '16px' }}>✏️</span>
                Beispiele ansehen {showExamples ? '▲' : '▼'}
              </button>

              {showExamples && (
                <div
                  style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => { setText(ex); setShowExamples(false); }}
                      style={{
                        textAlign: 'left',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,215,0,0.15)',
                        background: 'rgba(255,215,0,0.04)',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD700')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')
                      }
                    >
                      💡 {ex}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Season */}
              <div>
                <FieldLabel>Reisezeitraum</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SEASONS.map((s) => (
                    <ToggleChip
                      key={s.id}
                      label={s.label}
                      selected={season === s.id}
                      onClick={() => setSeason(season === s.id ? '' : s.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <FieldLabel>Reisedauer</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DURATIONS.map((d) => (
                    <ToggleChip
                      key={d.id}
                      label={d.label}
                      selected={duration === d.id}
                      onClick={() => setDuration(duration === d.id ? '' : d.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <FieldLabel>Budget pro Person</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {BUDGETS.map((b) => (
                    <ToggleChip
                      key={b.id}
                      label={b.label}
                      desc={b.desc}
                      selected={budget === b.id}
                      onClick={() => setBudget(budget === b.id ? '' : b.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              size="lg"
              fullWidth
              style={{
                maxWidth: '480px',
                fontSize: '17px',
                padding: '18px 40px',
                borderRadius: '14px',
                opacity: canSubmit ? 1 : 0.5,
              }}
            >
              ✈️ Traumreise finden
            </Button>
            <p
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              🔒 100% kostenlos &amp; unverbindlich
            </p>
          </div>
        </GlassPanel>
      </Container>
    </section>
  );
}
