'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Sparkles, Plane, ChevronRight, ChevronLeft, RotateCcw, ShieldCheck,
} from 'lucide-react';
import Container from '@/components/layout/Container';
import TravelFunnelLoading from '@/components/funnel/TravelFunnelLoading';
import TravelResultCard    from '@/components/funnel/TravelResultCard';
import TravelFunnelOptin   from '@/components/funnel/TravelFunnelOptin';

// ── Local image paths ─────────────────────────────────────────────────────────
// All 15 files must live in public/images/funnel/cards/
// Missing files → gradient fallback only (no broken icon, no external load)
const IMG = {
  beach:    '/images/funnel/cards/beach.jpg',
  mountain: '/images/funnel/cards/mountain.jpg',
  luxury:   '/images/funnel/cards/luxury.jpg',
  city:     '/images/funnel/cards/city.jpg',
  culture:  '/images/funnel/cards/culture.jpg',
  family:   '/images/funnel/cards/family.jpg',
  romance:  '/images/funnel/cards/romance.jpg',
  party:    '/images/funnel/cards/party.jpg',
  spring:   '/images/funnel/cards/spring.jpg',
  autumn:   '/images/funnel/cards/autumn.jpg',
  winter:   '/images/funnel/cards/winter.jpg',
  world:    '/images/funnel/cards/world.jpg',
  backpack: '/images/funnel/cards/backpack.jpg',
  hotel:    '/images/funnel/cards/hotel.jpg',
  resort:   '/images/funnel/cards/resort.jpg',
};

// ── Gradient shown when image file is absent ──────────────────────────────────
const OVERLAY = 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.65) 100%)';

// ── Option data ───────────────────────────────────────────────────────────────
const MOODS = [
  { id: 'relax',     label: 'Entspannung', bg: '#0369A1', img: IMG.beach },
  { id: 'adventure', label: 'Abenteuer',   bg: '#166534', img: IMG.mountain },
  { id: 'luxury',    label: 'Luxus',       bg: '#92400E', img: IMG.luxury },
  { id: 'family',    label: 'Familie',     bg: '#9A3412', img: IMG.family },
  { id: 'romance',   label: 'Romantik',    bg: '#9D174D', img: IMG.romance },
  { id: 'culture',   label: 'Kultur',      bg: '#7C2D12', img: IMG.culture },
  { id: 'nature',    label: 'Natur',       bg: '#064E3B', img: IMG.mountain },
  { id: 'party',     label: 'Party',       bg: '#4C1D95', img: IMG.party },
  { id: 'beach',     label: 'Strand',      bg: '#0C4A6E', img: IMG.beach },
  { id: 'wellness',  label: 'Wellness',    bg: '#1E3A5F', img: IMG.luxury },
  { id: 'city',      label: 'Städtetrip',  bg: '#1E293B', img: IMG.city },
  { id: 'active',    label: 'Aktivurlaub', bg: '#7F1D1D', img: IMG.mountain },
];

const SEASONS = [
  { id: 'spring', label: 'Frühling', bg: '#14532D', img: IMG.spring },
  { id: 'summer', label: 'Sommer',   bg: '#0C4A6E', img: IMG.beach },
  { id: 'autumn', label: 'Herbst',   bg: '#78350F', img: IMG.autumn },
  { id: 'winter', label: 'Winter',   bg: '#1E3A5F', img: IMG.winter },
  { id: 'flex',   label: 'Flexibel', bg: '#312E81', img: IMG.world },
];

const BUDGETS = [
  { id: 'budget',  label: 'Sparsam',      sub: 'ca. 100–500 €',     bg: '#14532D', img: IMG.backpack },
  { id: 'mid',     label: 'Mittelklasse', sub: 'ca. 500–1.500 €',   bg: '#0369A1', img: IMG.hotel },
  { id: 'comfort', label: 'Komfort',      sub: 'ca. 1.500–5.000 €', bg: '#5B21B6', img: IMG.resort },
  { id: 'luxury',  label: 'Luxus',        sub: 'ab 5.000 €',        bg: '#78350F', img: IMG.luxury },
  { id: 'open',    label: 'Flexibel',     sub: 'Budget offen',      bg: '#0C4A6E', img: IMG.world },
];

const DURATIONS = [
  { id: 'short_trip', label: 'Kurztrip',    sub: '2–4 Tage',      bg: '#1E293B', img: IMG.city },
  { id: 'one_week',   label: 'Eine Woche',  sub: '5–8 Tage',      bg: '#0369A1', img: IMG.beach },
  { id: 'two_weeks',  label: 'Zwei Wochen', sub: '9–15 Tage',     bg: '#064E3B', img: IMG.resort },
  { id: 'long_trip',  label: 'Drei Wochen+',sub: '16+ Tage',      bg: '#312E81', img: IMG.mountain },
  { id: 'flexible',   label: 'Flexibel',    sub: 'Ich bin offen', bg: '#0C4A6E', img: IMG.world },
];

const STEPS = [
  { num: 1, label: 'Stimmung' },
  { num: 2, label: 'Reisezeit' },
  { num: 3, label: 'Budget' },
  { num: 4, label: 'Dauer' },
];

// ── Visual card ───────────────────────────────────────────────────────────────
// Uses CSS background-image so a missing local file shows only the gradient
// (silent failure — never a broken icon). No external URLs.
function VisualCard({ selected, disabled, onClick, img, bg, label, sublabel }) {
  // Dev-only: warn once per card if the local image is missing
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !img) return;
    const probe = new window.Image();
    probe.onerror = () => console.warn(`Missing funnel card image: ${img}`);
    probe.src = img;
  }, [img]);

  const backgroundImage = img
    ? `${OVERLAY}, url(${img})`
    : OVERLAY;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className="funnel-visual-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        border: selected ? '2.5px solid #0EA5E9' : '2.5px solid transparent',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: bg,
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: selected
          ? '0 0 0 3px rgba(14,165,233,0.50), 0 0 0 6px rgba(14,165,233,0.14), 0 10px 28px rgba(0,0,0,0.22)'
          : '0 3px 14px rgba(0,0,0,0.18)',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        fontFamily: 'inherit',
      }}
    >
      {/* Label — centered at bottom, no emoji */}
      <div style={{ padding: sublabel ? '10px 12px 13px' : '8px 12px 12px', textAlign: 'center' }}>
        <div style={{
          fontSize: '13px', fontWeight: 700, color: '#fff',
          textShadow: '0 1px 6px rgba(0,0,0,0.9)',
          lineHeight: 1.2, letterSpacing: '0.01em',
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.85)',
            marginTop: '3px', lineHeight: 1.2,
          }}>
            {sublabel}
          </div>
        )}
      </div>

      {/* Selected badge */}
      {selected && (
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          width: '22px', height: '22px', borderRadius: '50%',
          background: '#0EA5E9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(14,165,233,0.65)',
          fontSize: '12px', color: '#fff', fontWeight: 800,
        }}>
          ✓
        </div>
      )}

      {/* Disabled veil */}
      {disabled && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.42)' }} />
      )}
    </button>
  );
}

// ── Step progress indicator ───────────────────────────────────────────────────
function StepProgress({ current }) {
  return (
    <div
      className="wizard-progress-scroll"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}
    >
      {STEPS.map((s, i) => {
        const done   = current > s.num;
        const active = current === s.num;
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '20px',
                background: active
                  ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                  : done ? '#EFF6FF' : '#F8FAFF',
                border: active ? 'none' : done ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                transition: 'all 0.3s ease', flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: active ? 'rgba(255,255,255,0.28)' : done ? '#0EA5E9' : '#E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 700,
                  color: active ? '#fff' : done ? '#fff' : '#94A3B8', flexShrink: 0,
                }}
              >
                {done ? '✓' : s.num}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', color: active ? '#fff' : done ? '#0284C7' : '#94A3B8' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: '14px', height: '2px', borderRadius: '1px', flexShrink: 0, background: done ? '#BFDBFE' : '#E2E8F0' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepHeading({ title, hint }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
        {title}
      </h3>
      {hint && <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{hint}</p>}
    </div>
  );
}

function NextBtn({ onClick, disabled, label = 'Weiter' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '13px 26px', borderRadius: '14px', border: 'none',
        background: !disabled
          ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
          : '#E2E8F0',
        color: !disabled ? '#fff' : '#94A3B8',
        cursor: !disabled ? 'pointer' : 'not-allowed',
        fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
        boxShadow: !disabled ? '0 6px 20px rgba(14,165,233,0.35)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      {label}
      <ChevronRight size={17} strokeWidth={2.5} />
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomeTravelWizard() {
  const [phase,     setPhase]     = useState('form');
  const [step,      setStep]      = useState(1);
  const [moods,     setMoods]     = useState([]);
  const [season,    setSeason]    = useState('');
  const [budget,    setBudget]    = useState('');
  const [duration,  setDuration]  = useState('');
  const [results,   setResults]   = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [apiError,  setApiError]  = useState('');

  const toggleMood = useCallback(
    id => setMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : prev.length >= 3 ? prev : [...prev, id]
    ),
    []
  );

  const handleSelectSeason = (id) => { setSeason(id); setStep(3); };

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
        body: JSON.stringify({ sessionId: sid, moods, season, budget, duration }),
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
    setBudget(''); setDuration(''); setResults(null); setSessionId(null); setApiError('');
  };

  return (
    <section id="wizard" style={{ background: '#FFFFFF', paddingBottom: '80px' }}>
      <Container>
        <div
          style={{
            background: '#FFFFFF', borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 48px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',
            padding: 'clamp(24px, 5vw, 44px)',
            marginTop: '-40px', position: 'relative', zIndex: 10,
          }}
        >

          {phase === 'loading' && <TravelFunnelLoading />}

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

          {phase === 'results' && results && (
            <div className="funnel-results-fade">
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
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(19px, 3vw, 28px)', fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                  Reisemonkey hat {results.length} Traumziele für dich gefunden
                </h2>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                  Passend zu deiner Stimmung, Reisezeit, Budget und Reisedauer.
                </p>
              </div>

              <TravelFunnelOptin
                destinations={results} moods={moods}
                season={season} budget={budget} duration={duration} sessionId={sessionId}
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
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
                  Beschreibe deine perfekte Reise
                </h2>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto' }}>
                  Sag uns, worauf du Lust hast – Reisemonkey findet deine 3 persönlichen Traumziele.
                </p>
              </div>

              <StepProgress current={step} />

              {step === 1 && (
                <div>
                  <StepHeading
                    title="Was ist deine Urlaubsstimmung?"
                    hint={
                      <>
                        Wähle bis zu 3 Optionen
                        {moods.length > 0 && (
                          <span style={{ color: '#0EA5E9', fontWeight: 700, marginLeft: '8px' }}>
                            · {moods.length}/3 ausgewählt
                          </span>
                        )}
                      </>
                    }
                  />
                  <div className="funnel-mood-grid" style={{ marginBottom: '28px' }}>
                    {MOODS.map(m => {
                      const sel   = moods.includes(m.id);
                      const maxed = !sel && moods.length >= 3;
                      return (
                        <VisualCard key={m.id} selected={sel} disabled={maxed}
                          onClick={() => toggleMood(m.id)}
                          img={m.img} bg={m.bg} label={m.label} />
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <StepHeading
                    title="Wann möchtest du verreisen?"
                    hint="Wähle eine Option – danach geht es automatisch weiter"
                  />
                  <div className="funnel-season-grid" style={{ marginBottom: '28px' }}>
                    {SEASONS.map(s => (
                      <VisualCard key={s.id} selected={season === s.id}
                        onClick={() => handleSelectSeason(s.id)}
                        img={s.img} bg={s.bg} label={s.label} />
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <StepHeading title="Welches Budget passt zu dir?" hint="Wähle eine Option" />
                  <div className="funnel-budget-grid" style={{ marginBottom: '28px' }}>
                    {BUDGETS.map(b => (
                      <VisualCard key={b.id} selected={budget === b.id}
                        onClick={() => setBudget(b.id)}
                        img={b.img} bg={b.bg}
                        label={b.label} sublabel={b.sub} />
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <StepHeading title="Wie lange möchtest du verreisen?" hint="Wähle eine Option" />
                  <div className="funnel-season-grid" style={{ marginBottom: '28px' }}>
                    {DURATIONS.map(d => (
                      <VisualCard key={d.id} selected={duration === d.id}
                        onClick={() => setDuration(d.id)}
                        img={d.img} bg={d.bg}
                        label={d.label} sublabel={d.sub} />
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div
                style={{
                  paddingTop: '22px', borderTop: '1px solid #F1F5F9',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
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
                  {step === 1 && <NextBtn onClick={() => setStep(2)} disabled={moods.length === 0} />}
                  {step === 2 && <NextBtn onClick={() => season && setStep(3)} disabled={!season} />}
                  {step === 3 && <NextBtn onClick={() => budget && setStep(4)} disabled={!budget} />}

                  {step === 4 && (
                    <button
                      onClick={duration ? handleSubmit : undefined}
                      disabled={!duration}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        padding: '15px clamp(22px, 4vw, 48px)', borderRadius: '14px', border: 'none',
                        background: duration
                          ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                          : '#E2E8F0',
                        color: duration ? '#FFFFFF' : '#94A3B8',
                        cursor: duration ? 'pointer' : 'not-allowed',
                        fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        boxShadow: duration ? '0 6px 24px rgba(14,165,233,0.38)' : 'none',
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
