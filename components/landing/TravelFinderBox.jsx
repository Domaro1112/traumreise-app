'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Flower2, Sun, Leaf, Snowflake,
  CalendarDays, Calendar, Globe, Briefcase,
  Wallet, Plane, Crown,
  Sparkles, Edit3, Lightbulb, ShieldCheck,
} from 'lucide-react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';

const SEASONS = [
  { id: 'spring', icon: Flower2,   label: 'Frühling' },
  { id: 'summer', icon: Sun,       label: 'Sommer' },
  { id: 'autumn', icon: Leaf,      label: 'Herbst' },
  { id: 'winter', icon: Snowflake, label: 'Winter' },
];

const DURATIONS = [
  { id: 'weekend',  icon: CalendarDays, label: 'Kurztrip' },
  { id: 'week',     icon: Calendar,     label: 'Urlaubswoche' },
  { id: 'twoweeks', icon: Globe,        label: 'Zwei Wochen' },
  { id: 'long',     icon: Briefcase,    label: 'Langzeitreise' },
];

const BUDGETS = [
  { id: 'low',  icon: Wallet, label: 'Budget',  desc: 'bis 500 €' },
  { id: 'mid',  icon: Plane,  label: 'Mittel',  desc: '500–1500 €' },
  { id: 'high', icon: Crown,  label: 'Premium', desc: '1500 €+' },
];

const EXAMPLES = [
  'Ich liebe es morgens früh aufzustehen, wenn noch niemand am Strand ist…',
  'Städte, in denen man sich verlaufen kann und es gut ist…',
  'Ich will Essen probieren, das ich zuhause nie finden würde…',
];

function ToggleChip({ label, icon: Icon, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: desc ? '10px 14px' : '9px 16px',
        borderRadius: '12px',
        border: `2px solid ${selected ? '#0EA5E9' : '#E2E8F0'}`,
        background: selected ? '#EFF6FF' : '#FFFFFF',
        color: selected ? '#0284C7' : '#475569',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '13px',
        fontWeight: selected ? 600 : 500,
        textAlign: 'left',
        lineHeight: 1.3,
        boxShadow: selected ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {Icon && <Icon size={13} strokeWidth={2} />}
        <span>{label}</span>
      </div>
      {desc && (
        <div style={{ fontSize: '11px', opacity: 0.65, marginTop: '2px', paddingLeft: '19px' }}>{desc}</div>
      )}
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: '#64748B',
        marginBottom: '10px',
        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
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
        background: '#FFFFFF',
        paddingTop: '0',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 48px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',
            padding: 'clamp(28px, 5vw, 48px)',
            marginTop: '-40px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '20px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#0284C7',
                marginBottom: '12px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              <Sparkles size={13} strokeWidth={2} />
              Finde deine Traumreise in 2 Minuten
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
              }}
            >
              Beschreib uns deinen Traumurlaub
            </h2>
          </div>

          {/* Main grid */}
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
                    background: '#F8FAFF',
                    border: `2px solid ${text.length >= 15 ? '#0EA5E9' : '#E2E8F0'}`,
                    borderRadius: '16px',
                    padding: '16px 18px 40px',
                    color: '#0F172A',
                    fontSize: '15px',
                    lineHeight: 1.75,
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit',
                    boxShadow: text.length >= 15 ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '14px',
                    fontSize: '12px',
                    color: text.length >= 15 ? '#0EA5E9' : '#94A3B8',
                    fontWeight: 500,
                  }}
                >
                  {text.length} / 600{text.length >= 15 && ' ✓'}
                </div>
              </div>

              <button
                onClick={() => setShowExamples((v) => !v)}
                style={{
                  marginTop: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                <Edit3 size={14} strokeWidth={2} />
                Beispiele ansehen {showExamples ? '▲' : '▼'}
              </button>

              {showExamples && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => { setText(ex); setShowExamples(false); }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #E2E8F0',
                        background: '#F8FAFF',
                        color: '#475569',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0EA5E9';
                        e.currentTarget.style.color = '#0284C7';
                        e.currentTarget.style.background = '#EFF6FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.background = '#F8FAFF';
                      }}
                    >
                      <Lightbulb size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
                      {ex}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <FieldLabel>Reisezeitraum</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SEASONS.map((s) => (
                    <ToggleChip
                      key={s.id}
                      label={s.label}
                      icon={s.icon}
                      selected={season === s.id}
                      onClick={() => setSeason(season === s.id ? '' : s.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Reisedauer</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DURATIONS.map((d) => (
                    <ToggleChip
                      key={d.id}
                      label={d.label}
                      icon={d.icon}
                      selected={duration === d.id}
                      onClick={() => setDuration(duration === d.id ? '' : d.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Budget pro Person</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {BUDGETS.map((b) => (
                    <ToggleChip
                      key={b.id}
                      label={b.label}
                      icon={b.icon}
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
                opacity: canSubmit ? 1 : 0.45,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Plane size={18} strokeWidth={2} />
                Traumreise finden
              </span>
            </Button>
            <p style={{ marginTop: '12px', fontSize: '13px', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <ShieldCheck size={13} strokeWidth={2} color="#94A3B8" />
              100% kostenlos &amp; unverbindlich
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
