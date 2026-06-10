'use client';

import { useState, useCallback } from 'react';
import {
  Sparkles, Plane, ChevronRight, ChevronLeft, RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import Container from '@/components/layout/Container';
import TravelFunnelLoading from '@/components/funnel/TravelFunnelLoading';
import TravelResultCard    from '@/components/funnel/TravelResultCard';
import TravelFunnelOptin   from '@/components/funnel/TravelFunnelOptin';

// ── Funnel option data ────────────────────────────────────────────────────────
const MOODS = [
  { id: 'relax',     label: 'Entspannung', emoji: '🌊' },
  { id: 'adventure', label: 'Abenteuer',   emoji: '🏔️' },
  { id: 'luxury',    label: 'Luxus',       emoji: '✨' },
  { id: 'family',    label: 'Familie',     emoji: '👨‍👩‍👧' },
  { id: 'romance',   label: 'Romantik',    emoji: '💕' },
  { id: 'culture',   label: 'Kultur',      emoji: '🏛️' },
  { id: 'nature',    label: 'Natur',       emoji: '🌿' },
  { id: 'party',     label: 'Party',       emoji: '🎉' },
  { id: 'beach',     label: 'Strand',      emoji: '🏖️' },
  { id: 'wellness',  label: 'Wellness',    emoji: '🧘' },
  { id: 'city',      label: 'Städtetrip',  emoji: '🏙️' },
  { id: 'active',    label: 'Aktivurlaub', emoji: '🚴' },
];

const SEASONS = [
  { id: 'spring', label: 'Frühling', emoji: '🌸' },
  { id: 'summer', label: 'Sommer',   emoji: '☀️' },
  { id: 'autumn', label: 'Herbst',   emoji: '🍂' },
  { id: 'winter', label: 'Winter',   emoji: '❄️' },
  { id: 'flex',   label: 'Flexibel', emoji: '🗓️' },
];

const BUDGETS = [
  { id: 'budget',  label: 'Sparsam',      sub: 'Backpacker-Style' },
  { id: 'mid',     label: 'Mittelklasse', sub: 'Bestes Preis-Leistungs-Verhältnis' },
  { id: 'comfort', label: 'Komfort',      sub: 'Gehobener Standard' },
  { id: 'luxury',  label: 'Luxus',        sub: 'Premium pur' },
  { id: 'open',    label: 'Noch offen',   sub: 'Budget ist zweitrangig' },
];

const STEPS = [
  { num: 1, label: 'Stimmung' },
  { num: 2, label: 'Reisezeit' },
  { num: 3, label: 'Budget' },
];

// ── Progress indicator ────────────────────────────────────────────────────────
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
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '5px 13px',
                borderRadius: '20px',
                background: active
                  ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                  : done ? '#EFF6FF' : '#F8FAFF',
                border: active ? 'none' : done ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: '17px', height: '17px',
                  borderRadius: '50%',
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
                  fontSize: '12px', fontWeight: 600,
                  color: active ? '#fff' : done ? '#0284C7' : '#94A3B8',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: '18px', height: '2px',
                  background: done ? '#BFDBFE' : '#E2E8F0',
                  borderRadius: '1px',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Option pill button ────────────────────────────────────────────────────────
function OptionPill({ selected, disabled, onClick, children, vertical = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: vertical ? 'center' : 'flex-start',
        gap: vertical ? '6px' : '10px',
        padding: vertical ? '14px 8px' : '13px 18px',
        borderRadius: '14px',
        border: selected ? '2px solid #0EA5E9' : '1.5px solid #E2E8F0',
        background: selected ? 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)' : '#FAFBFF',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.42 : 1,
        fontFamily: 'inherit',
        boxShadow: selected ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
        transition: 'all 0.16s ease',
        width: '100%',
        textAlign: vertical ? 'center' : 'left',
      }}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomeTravelWizard() {
  const [phase,     setPhase]     = useState('form');  // 'form'|'loading'|'results'|'error'
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
    // Auto-advance to step 3
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
      const sData = await sRes.json();
      sid = sData.sessionId ?? null;
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
      const data = await gRes.json();
      setResults(data.destinations ?? []);
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

  // ── Shared card shell ───────────────────────────────────────────
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

          {/* ── LOADING ──────────────────────────────────────────── */}
          {phase === 'loading' && <TravelFunnelLoading />}

          {/* ── ERROR ────────────────────────────────────────────── */}
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

          {/* ── RESULTS ──────────────────────────────────────────── */}
          {phase === 'results' && results && (
            <div>
              {/* Header */}
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

              {/* Opt-in above results */}
              <TravelFunnelOptin
                destinations={results}
                moods={moods}
                season={season}
                budget={budget}
                sessionId={sessionId}
              />

              {/* Cards */}
              <div className="funnel-results-grid">
                {results.map((dest, i) => (
                  <TravelResultCard
                    key={i}
                    destination={dest}
                    index={i}
                    sessionId={sessionId}
                    onAffiliateClick={handleAffiliateClick}
                  />
                ))}
              </div>

              {/* Affiliate disclaimer */}
              <p
                style={{
                  fontSize: '12px', color: '#94A3B8', textAlign: 'center',
                  marginTop: '20px', lineHeight: 1.6,
                }}
              >
                * Einige Links können Affiliate-Links sein. Wenn du darüber buchst, erhalten wir
                eventuell eine Provision. Für dich entstehen keine Mehrkosten.
              </p>

              {/* Reset */}
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

          {/* ── FORM ─────────────────────────────────────────────── */}
          {phase === 'form' && (
            <div>
              {/* Header */}
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

              {/* Progress */}
              <StepProgress current={step} />

              {/* ─── STEP 1: MOODS ─────────────────────────────── */}
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
                      const sel    = moods.includes(m.id);
                      const maxed  = !sel && moods.length >= 3;
                      return (
                        <OptionPill
                          key={m.id}
                          selected={sel}
                          disabled={maxed}
                          onClick={() => toggleMood(m.id)}
                          vertical
                        >
                          <span style={{ fontSize: '22px', lineHeight: 1 }}>{m.emoji}</span>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: sel ? 700 : 500,
                              color: sel ? '#0284C7' : '#475569',
                              textAlign: 'center',
                              lineHeight: 1.3,
                            }}
                          >
                            {m.label}
                          </span>
                        </OptionPill>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─── STEP 2: SEASON ────────────────────────────── */}
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
                      <OptionPill
                        key={s.id}
                        selected={season === s.id}
                        onClick={() => handleSelectSeason(s.id)}
                        vertical
                      >
                        <span style={{ fontSize: '24px', lineHeight: 1 }}>{s.emoji}</span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: season === s.id ? 700 : 500,
                            color: season === s.id ? '#0284C7' : '#475569',
                          }}
                        >
                          {s.label}
                        </span>
                      </OptionPill>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── STEP 3: BUDGET ────────────────────────────── */}
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {BUDGETS.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setBudget(b.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '15px 20px', borderRadius: '14px',
                          border: budget === b.id ? '2px solid #0EA5E9' : '1.5px solid #E2E8F0',
                          background: budget === b.id
                            ? 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)'
                            : '#FAFBFF',
                          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                          boxShadow: budget === b.id ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
                          transition: 'all 0.16s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            border: budget === b.id ? '6px solid #0EA5E9' : '2px solid #CBD5E1',
                            background: '#fff', transition: 'all 0.16s ease', flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: budget === b.id ? 700 : 600,
                              color: budget === b.id ? '#0284C7' : '#0F172A',
                            }}
                          >
                            {b.label}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {b.sub}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── NAVIGATION ────────────────────────────────── */}
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
                {/* Back */}
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

                {/* Forward / Submit */}
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
