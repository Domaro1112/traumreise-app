'use client';

import { useState, useCallback } from 'react';
import {
  Sparkles, Plane, ChevronRight, ChevronLeft, RotateCcw, ShieldCheck,
} from 'lucide-react';
import Container from '@/components/layout/Container';
import TravelFunnelLoading from '@/components/funnel/TravelFunnelLoading';
import TravelResultCard    from '@/components/funnel/TravelResultCard';
import TravelFunnelOptin   from '@/components/funnel/TravelFunnelOptin';

// ── Option data ───────────────────────────────────────────────────────────────
// Images: add photos to public/images/moods/{id}.jpg and public/images/seasons/{id}.jpg
// Gradient bg = fallback colour shown when image is missing
const MOODS = [
  { id: 'relax',     label: 'Entspannung', emoji: '🌊', bg: '#0369A1' },
  { id: 'adventure', label: 'Abenteuer',   emoji: '🏔️', bg: '#166534' },
  { id: 'luxury',    label: 'Luxus',       emoji: '✨', bg: '#92400E' },
  { id: 'family',    label: 'Familie',     emoji: '👨‍👩‍👧', bg: '#9A3412' },
  { id: 'romance',   label: 'Romantik',    emoji: '💕', bg: '#9D174D' },
  { id: 'culture',   label: 'Kultur',      emoji: '🏛️', bg: '#7C2D12' },
  { id: 'nature',    label: 'Natur',       emoji: '🌿', bg: '#064E3B' },
  { id: 'party',     label: 'Party',       emoji: '🎉', bg: '#4C1D95' },
  { id: 'beach',     label: 'Strand',      emoji: '🏖️', bg: '#0C4A6E' },
  { id: 'wellness',  label: 'Wellness',    emoji: '🧘', bg: '#1E3A5F' },
  { id: 'city',      label: 'Städtetrip',  emoji: '🏙️', bg: '#1E293B' },
  { id: 'active',    label: 'Aktivurlaub', emoji: '🚴', bg: '#7F1D1D' },
];

const SEASONS = [
  { id: 'spring', label: 'Frühling', emoji: '🌸', bg: '#14532D' },
  { id: 'summer', label: 'Sommer',   emoji: '☀️', bg: '#0C4A6E' },
  { id: 'autumn', label: 'Herbst',   emoji: '🍂', bg: '#78350F' },
  { id: 'winter', label: 'Winter',   emoji: '❄️', bg: '#1E3A5F' },
  { id: 'flex',   label: 'Flexibel', emoji: '🗺️', bg: '#312E81' },
];

const BUDGETS = [
  { id: 'budget',  label: 'Sparsam',      sub: 'ca. 100–500 €',      emoji: '🎒', bg: '#14532D' },
  { id: 'mid',     label: 'Mittelklasse', sub: 'ca. 500–1.500 €',    emoji: '🧳', bg: '#0369A1' },
  { id: 'comfort', label: 'Komfort',      sub: 'ca. 1.500–5.000 €',  emoji: '⭐', bg: '#5B21B6' },
  { id: 'luxury',  label: 'Luxus',        sub: 'ab 5.000 €',         emoji: '💎', bg: '#78350F' },
  { id: 'open',    label: 'Flexibel',     sub: 'Budget offen',       emoji: '🗺️', bg: '#0C4A6E' },
];

const STEPS = [
  { num: 1, label: 'Stimmung' },
  { num: 2, label: 'Reisezeit' },
  { num: 3, label: 'Budget' },
];

// ── Visual card (mood / season / budget) ──────────────────────────────────────
function VisualCard({
  selected, disabled, onClick,
  imageSrc, bg, emoji, label, sublabel,
  height = 'clamp(130px, 22vw, 165px)',
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className="funnel-visual-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        border: selected ? '2.5px solid #0EA5E9' : '2.5px solid rgba(255,255,255,0.12)',
        padding: 0,
        display: 'block',
        width: '100%',
        height,
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.62) 100%), url('${imageSrc}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: bg,
        boxShadow: selected
          ? '0 0 0 3px rgba(14,165,233,0.28), 0 10px 28px rgba(0,0,0,0.22)'
          : '0 3px 14px rgba(0,0,0,0.18)',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        fontFamily: 'inherit',
      }}
    >
      {/* Decorative emoji — centered, acts as placeholder illustration */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingBottom: sublabel ? '28px' : '22px',
        }}
      >
        <span style={{ fontSize: '52px', lineHeight: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
          {emoji}
        </span>
      </div>

      {/* Bottom label band */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: sublabel ? '10px 10px 11px' : '8px 10px 10px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.6)', lineHeight: 1.3 }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.82)', marginTop: '2px', lineHeight: 1.2 }}>
            {sublabel}
          </div>
        )}
      </div>

      {/* Selected checkmark badge */}
      {selected && (
        <div
          style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '22px', height: '22px', borderRadius: '50%',
            background: '#0EA5E9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(14,165,233,0.55)',
            fontSize: '12px', color: '#fff', fontWeight: 800,
          }}
        >
          ✓
        </div>
      )}

      {/* Disabled overlay */}
      {disabled && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.45)' }} />
      )}
    </button>
  );
}

// ── Step progress indicator ───────────────────────────────────────────────────
function StepProgress({ current }) {
  return (
    <div
      className="wizard-progress-scroll"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}
    >
      {STEPS.map((s, i) => {
        const done   = current > s.num;
        const active = current === s.num;
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '5px 13px', borderRadius: '20px',
                background: active
                  ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                  : done ? '#EFF6FF' : '#F8FAFF',
                border: active ? 'none' : done ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                transition: 'all 0.3s ease', flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: '17px', height: '17px', borderRadius: '50%',
                  background: active ? 'rgba(255,255,255,0.28)' : done ? '#0EA5E9' : '#E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700,
                  color: active ? '#fff' : done ? '#fff' : '#94A3B8',
                  flexShrink: 0,
                }}
              >
                {done ? '✓' : s.num}
              </span>
              <span
                style={{
                  fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
                  color: active ? '#fff' : done ? '#0284C7' : '#94A3B8',
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: '18px', height: '2px', borderRadius: '1px', flexShrink: 0,
                  background: done ? '#BFDBFE' : '#E2E8F0',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomeTravelWizard() {
  const [phase,     setPhase]     = useState('form');
  const [step,      setStep]      = useState(1);
  const [moods,     setMoods]     = useState([]);
  const [season,    setSeason]    = useState('');
  const [budget,    setBudget]    = useState('');
  const [results,   setResults]   = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [apiError,  setApiError]  = useState('');

  const toggleMood = useCallback(
    id => setMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : prev.length >= 3 ? prev : [...prev, id]
    ),
    []
  );

  const handleSelectSeason = (id) => {
    setSeason(id);
    setStep(3);
  };

  const handleSubmit = async () => {
    setPhase('loading');
    setApiError('');

    let sid = null;
    try {
      const sRes = await fetch('/api/travel-finder/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodSelection: moods }),
      });
      sid = (await sRes.json()).sessionId ?? null;
      setSessionId(sid);
    } catch {}

    try {
      const gRes = await fetch('/api/travel-finder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, moods, season, budget }),
      });
      if (!gRes.ok) {
        const err = await gRes.json();
        throw new Error(err.error || 'KI-Fehler');
      }
      setResults((await gRes.json()).destinations ?? []);
      setPhase('results');
    } catch (err) {
      setApiError(err.message || 'Ein Fehler ist aufgetreten.');
      setPhase('error');
    }
  };

  const handleAffiliateClick = (provider, destinationName, url) => {
    fetch('/api/travel-finder/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, destinationName, provider, affiliateUrl: url }),
    }).catch(() => {});
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setPhase('form'); setStep(1); setMoods([]); setSeason('');
    setBudget(''); setResults(null); setSessionId(null); setApiError('');
  };

  return (
    <section id="wizard" style={{ background: '#FFFFFF', paddingBottom: '80px' }}>
      <Container>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 48px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',
            padding: 'clamp(24px, 5vw, 44px)',
            marginTop: '-40px',
            position: 'relative',
            zIndex: 10,
          }}
        >

          {/* ── LOADING ─────────────────────────────────────────────────── */}
          {phase === 'loading' && <TravelFunnelLoading />}

          {/* ── ERROR ───────────────────────────────────────────────────── */}
          {phase === 'error' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '16px', color: '#DC2626', marginBottom: '20px', lineHeight: 1.6 }}>
                {apiError || 'Reiseziele konnten leider nicht geladen werden.'}
              </p>
              <button
                onClick={handleReset}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 28px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  color: '#fff', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-heading)',
                }}
              >
                <RotateCcw size={16} strokeWidth={2} />
                Erneut versuchen
              </button>
            </div>
          )}

          {/* ── RESULTS ─────────────────────────────────────────────────── */}
          {phase === 'results' && results && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '5px 16px', borderRadius: '20px',
                    background: '#EFF6FF', border: '1px solid #BFDBFE',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: '#0284C7', marginBottom: '10px',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  <Sparkles size={11} strokeWidth={2} />
                  Deine persönlichen Traumreisen
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(19px, 3vw, 28px)', fontWeight: 800,
                    color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em',
                  }}
                >
                  Reisemonkey hat {results.length} Traumziele für dich gefunden
                </h2>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                  Passend zu deiner Stimmung, Reisezeit und deinem Budget.
                </p>
              </div>

              <TravelFunnelOptin
                destinations={results} moods={moods}
                season={season} budget={budget} sessionId={sessionId}
              />

              <div className="funnel-results-grid">
                {results.map((dest, i) => (
                  <TravelResultCard
                    key={i} destination={dest} index={i}
                    sessionId={sessionId} onAffiliateClick={handleAffiliateClick}
                  />
                ))}
              </div>

              <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
                * Einige Links können Affiliate-Links sein. Wenn du darüber buchst, erhalten wir
                eventuell eine Provision. Für dich entstehen keine Mehrkosten.
              </p>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '11px 22px', borderRadius: '12px',
                    border: '1.5px solid #E2E8F0', background: '#FFFFFF',
                    color: '#64748B', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <RotateCcw size={14} strokeWidth={2} />
                  Neue Suche starten
                </button>
              </div>
            </div>
          )}

          {/* ── FORM ────────────────────────────────────────────────────── */}
          {phase === 'form' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 18px', borderRadius: '20px',
                    background: '#EFF6FF', border: '1px solid #BFDBFE',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: '#0284C7', marginBottom: '12px',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  <Sparkles size={12} strokeWidth={2} />
                  Deine Traumreise in 2 Minuten
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 800,
                    color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 8px',
                  }}
                >
                  Beschreibe deine perfekte Reise
                </h2>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto' }}>
                  Sag uns, worauf du Lust hast – Reisemonkey findet deine 3 persönlichen Traumziele.
                </p>
              </div>

              <StepProgress current={step} />

              {/* ── STEP 1: MOODS ──────────────────────────────────────── */}
              {step === 1 && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700,
                        color: '#0F172A', margin: '0 0 4px',
                      }}
                    >
                      Was ist deine Urlaubsstimmung?
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Wähle bis zu 3 Optionen
                      {moods.length > 0 && (
                        <span style={{ color: '#0EA5E9', fontWeight: 700, marginLeft: '8px' }}>
                          · {moods.length}/3 ausgewählt
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="funnel-mood-grid" style={{ marginBottom: '28px' }}>
                    {MOODS.map(m => {
                      const sel   = moods.includes(m.id);
                      const maxed = !sel && moods.length >= 3;
                      return (
                        <VisualCard
                          key={m.id}
                          selected={sel}
                          disabled={maxed}
                          onClick={() => toggleMood(m.id)}
                          imageSrc={`/images/moods/${m.id}.jpg`}
                          bg={m.bg}
                          emoji={m.emoji}
                          label={m.label}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── STEP 2: SEASONS ────────────────────────────────────── */}
              {step === 2 && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700,
                        color: '#0F172A', margin: '0 0 4px',
                      }}
                    >
                      Wann möchtest du verreisen?
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Wähle eine Option – danach geht es automatisch weiter
                    </p>
                  </div>

                  <div className="funnel-season-grid" style={{ marginBottom: '28px' }}>
                    {SEASONS.map(s => (
                      <VisualCard
                        key={s.id}
                        selected={season === s.id}
                        onClick={() => handleSelectSeason(s.id)}
                        imageSrc={`/images/seasons/${s.id}.jpg`}
                        bg={s.bg}
                        emoji={s.emoji}
                        label={s.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 3: BUDGET ─────────────────────────────────────── */}
              {step === 3 && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700,
                        color: '#0F172A', margin: '0 0 4px',
                      }}
                    >
                      Welches Budget passt zu dir?
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Wähle eine Option
                    </p>
                  </div>

                  <div className="funnel-budget-grid" style={{ marginBottom: '28px' }}>
                    {BUDGETS.map(b => (
                      <VisualCard
                        key={b.id}
                        selected={budget === b.id}
                        onClick={() => setBudget(b.id)}
                        imageSrc={`/images/budget/${b.id}.jpg`}
                        bg={b.bg}
                        emoji={b.emoji}
                        label={b.label}
                        sublabel={b.sub}
                        height="clamp(120px, 20vw, 155px)"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── NAVIGATION ─────────────────────────────────────────── */}
              <div
                style={{
                  paddingTop: '22px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(s => s - 1)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '11px 18px', borderRadius: '12px',
                        border: '1.5px solid #E2E8F0', background: '#FFFFFF',
                        color: '#64748B', fontSize: '14px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} />
                      Zurück
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {step === 1 && (
                    <button
                      onClick={() => setStep(2)}
                      disabled={moods.length === 0}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '13px 26px', borderRadius: '14px', border: 'none',
                        background: moods.length > 0
                          ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                          : '#E2E8F0',
                        color: moods.length > 0 ? '#fff' : '#94A3B8',
                        cursor: moods.length > 0 ? 'pointer' : 'not-allowed',
                        fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                        boxShadow: moods.length > 0 ? '0 6px 20px rgba(14,165,233,0.35)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      Weiter
                      <ChevronRight size={17} strokeWidth={2.5} />
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      onClick={() => season && setStep(3)}
                      disabled={!season}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '13px 26px', borderRadius: '14px', border: 'none',
                        background: season
                          ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                          : '#E2E8F0',
                        color: season ? '#fff' : '#94A3B8',
                        cursor: season ? 'pointer' : 'not-allowed',
                        fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                        boxShadow: season ? '0 6px 20px rgba(14,165,233,0.35)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      Weiter
                      <ChevronRight size={17} strokeWidth={2.5} />
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      onClick={budget ? handleSubmit : undefined}
                      disabled={!budget}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        padding: '15px clamp(22px, 4vw, 48px)', borderRadius: '14px', border: 'none',
                        background: budget
                          ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                          : '#E2E8F0',
                        color: budget ? '#FFFFFF' : '#94A3B8',
                        cursor: budget ? 'pointer' : 'not-allowed',
                        fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        boxShadow: budget ? '0 6px 24px rgba(14,165,233,0.38)' : 'none',
                        transition: 'all 0.22s ease',
                      }}
                    >
                      <Plane size={18} strokeWidth={2.5} />
                      Meine Traumreise finden
                      <Sparkles size={16} strokeWidth={2} />
                    </button>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={11} strokeWidth={2} color="#94A3B8" />
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      100% kostenlos &amp; unverbindlich
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}
