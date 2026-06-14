'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Sparkles, Plane, ChevronRight, ChevronLeft, ShieldCheck,
  Mail, CheckCircle2,
} from 'lucide-react';
import Container from '@/components/layout/Container';
import TravelResultView from '@/components/finder/TravelResultView';
import TravelFunnelLoading from '@/components/funnel/TravelFunnelLoading';

// ── Image library ─────────────────────────────────────────────────────────────
// All files must live in public/images/funnel/cards/
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
  relax:    '/images/funnel/cards/relax.jpg',
  wellness: '/images/funnel/cards/wellness.jpg',
  active:   '/images/funnel/cards/active.jpg',
};

const OVERLAY = 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.65) 100%)';

// ── Option data ───────────────────────────────────────────────────────────────
const MOODS = [
  { id: 'relax',     label: 'Entspannung', bg: '#0369A1', img: IMG.relax },
  { id: 'adventure', label: 'Abenteuer',   bg: '#166534', img: IMG.mountain },
  { id: 'luxury',    label: 'Luxus',       bg: '#92400E', img: IMG.luxury },
  { id: 'family',    label: 'Familie',     bg: '#9A3412', img: IMG.family },
  { id: 'romance',   label: 'Romantik',    bg: '#9D174D', img: IMG.romance },
  { id: 'culture',   label: 'Kultur',      bg: '#7C2D12', img: IMG.culture },
  { id: 'nature',    label: 'Natur',       bg: '#064E3B', img: IMG.mountain },
  { id: 'party',     label: 'Party',       bg: '#4C1D95', img: IMG.party },
  { id: 'beach',     label: 'Strand',      bg: '#0C4A6E', img: IMG.beach },
  { id: 'wellness',  label: 'Wellness',    bg: '#1E3A5F', img: IMG.wellness },
  { id: 'city',      label: 'Städtetrip',  bg: '#1E293B', img: IMG.city },
  { id: 'active',    label: 'Aktivurlaub', bg: '#7F1D1D', img: IMG.active },
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

// ── Value mappings to /api/ai/travel format ───────────────────────────────────
const BUDGET_MAP   = { budget: 'low', mid: 'mid', comfort: 'high', luxury: 'high', open: 'mid' };
const DURATION_MAP = { short_trip: 'weekend', one_week: 'week', two_weeks: 'twoweeks', long_trip: 'long', flexible: 'week' };

// ── Visual card ───────────────────────────────────────────────────────────────
function VisualCard({ selected, disabled, onClick, img, bg, label, sublabel }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !img) return;
    const probe = new window.Image();
    probe.onerror = () => console.warn(`Missing funnel card image: ${img}`);
    probe.src = img;
  }, [img]);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className="funnel-visual-card"
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '16px',
        border: selected ? '2.5px solid #0EA5E9' : '2.5px solid transparent',
        padding: 0, display: 'block', width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: bg,
        boxShadow: selected
          ? '0 0 0 3px rgba(14,165,233,0.50), 0 0 0 6px rgba(14,165,233,0.14), 0 10px 28px rgba(0,0,0,0.22)'
          : '0 3px 14px rgba(0,0,0,0.18)',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        fontFamily: 'inherit',
      }}
    >
      {img && (
        <div aria-hidden="true" style={{
          position: 'absolute', inset: '-1px',
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        }} />
      )}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-1px',
        background: OVERLAY, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: sublabel ? '10px 12px 13px' : '8px 12px 12px',
        textAlign: 'center', zIndex: 2,
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.9)', lineHeight: 1.2, letterSpacing: '0.01em' }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', marginTop: '3px', lineHeight: 1.2 }}>
            {sublabel}
          </div>
        )}
      </div>
      {selected && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px', borderRadius: '50%', background: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(14,165,233,0.65)', fontSize: '12px', color: '#fff', fontWeight: 800, zIndex: 3 }}>
          ✓
        </div>
      )}
      {disabled && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.42)', zIndex: 4 }} />
      )}
    </button>
  );
}

// ── Step progress ─────────────────────────────────────────────────────────────
function StepProgress({ current }) {
  return (
    <div className="wizard-progress-scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}>
      {STEPS.map((s, i) => {
        const done   = current > s.num;
        const active = current === s.num;
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '20px',
              background: active ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' : done ? '#EFF6FF' : '#F8FAFF',
              border: active ? 'none' : done ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
              transition: 'all 0.3s ease', flexShrink: 0,
            }}>
              <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: active ? 'rgba(255,255,255,0.28)' : done ? '#0EA5E9' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: active ? '#fff' : done ? '#fff' : '#94A3B8', flexShrink: 0 }}>
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
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '13px 26px', borderRadius: '14px', border: 'none',
      background: !disabled ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' : '#E2E8F0',
      color: !disabled ? '#fff' : '#94A3B8',
      cursor: !disabled ? 'pointer' : 'not-allowed',
      fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
      boxShadow: !disabled ? '0 6px 20px rgba(14,165,233,0.35)' : 'none',
      transition: 'all 0.2s',
    }}>
      {label}
      <ChevronRight size={17} strokeWidth={2.5} />
    </button>
  );
}

// ── Email popup (same as /finder) ─────────────────────────────────────────────
function EmailPopup({ destination, onClose }) {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const valid = email.includes('@') && email.includes('.') && agreed;

  if (done) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15,23,42,0.20)', maxWidth: '420px', width: '100%', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '1.5px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={28} strokeWidth={1.5} color="#0EA5E9" />
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Fast geschafft!</h3>
        <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>Wir haben dir eine <strong style={{ color: '#0EA5E9' }}>Bestätigungsmail</strong> geschickt.</p>
        <button onClick={onClose} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
          Alles klar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15,23,42,0.20)', maxWidth: '420px', width: '100%', padding: '36px 32px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#94A3B8', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Reise-Inspiration ins Postfach</h3>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>
            {destination ? `Erhalte deinen ${destination}-Reiseplan + wöchentlich die besten Deals.` : 'Wöchentlich die besten Deals & Inspiration.'}
          </p>
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de"
          style={{ width: '100%', boxSizing: 'border-box', background: '#F8FAFF', border: `2px solid ${email.includes('@') ? '#0EA5E9' : '#E2E8F0'}`, borderRadius: '12px', padding: '13px 16px', color: '#0F172A', fontSize: '15px', outline: 'none', marginBottom: '14px', fontFamily: 'inherit' }} />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
          <div onClick={() => setAgreed(a => !a)} style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '5px', border: `2px solid ${agreed ? '#0EA5E9' : '#CBD5E1'}`, background: agreed ? '#EFF6FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px', cursor: 'pointer' }}>
            {agreed && <span style={{ color: '#0EA5E9', fontSize: '13px', fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6 }}>
            Ich bin einverstanden, Reise-Inspiration & Angebote per Mail zu erhalten. Abmeldung jederzeit möglich.
          </span>
        </label>
        <button onClick={() => valid && setDone(true)} disabled={!valid}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: valid ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F1F5F9', color: valid ? '#fff' : '#94A3B8', fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Mail size={16} strokeWidth={2} />
          Kostenlos anmelden
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '12px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={11} strokeWidth={2} /> DSGVO-konform
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Kein Spam</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomeTravelWizard() {
  const [step,         setStep]         = useState(1);
  const [moods,        setMoods]        = useState([]);
  const [season,       setSeason]       = useState('');
  const [budget,       setBudget]       = useState('');
  const [duration,     setDuration]     = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  // Result state
  const [results,      setResults]      = useState(null);
  const [personality,  setPersonality]  = useState(null);
  const [extras,       setExtras]       = useState(null);
  const [error,        setError]        = useState('');
  const [showEmail,    setShowEmail]    = useState(false);

  const toggleMood = useCallback(
    id => setMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : prev.length >= 3 ? prev : [...prev, id]
    ),
    []
  );

  const handleSelectSeason = (id) => { setSeason(id); setStep(3); };

  // ── Affiliate URL helpers (same logic as /finder Classic) ──────────────────
  const getDefaultDates = () => {
    const apiDuration = DURATION_MAP[duration] || 'week';
    const apiSeason   = season === 'flex' ? 'spring' : season;
    const now  = new Date();
    const year = now.getFullYear();
    const nights = { weekend: 4, week: 7, twoweeks: 14, long: 21 }[apiDuration] || 7;
    const seasonStart = {
      spring: new Date(year, 3, 15),
      summer: new Date(year, 6, 10),
      autumn: new Date(year, 9, 10),
      winter: new Date(year, 11, 20),
    }[apiSeason] || new Date(now.getTime() + 30 * 86400000);
    if (seasonStart < now) seasonStart.setFullYear(year + 1);
    const end = new Date(seasonStart.getTime() + nights * 86400000);
    const fmt = d => d.toISOString().split('T')[0];
    return { ci: fmt(seasonStart), co: fmt(end) };
  };

  const buildAffiliateUrls = (dest) => {
    const apiBudget   = BUDGET_MAP[budget] || 'mid';
    const { ci, co }  = getDefaultDates();
    const searchCity  = dest.skySearch || dest.destination;
    const iata        = (dest.iata || '').toUpperCase().trim();
    const skyClass    = apiBudget === 'high' ? 'business' : 'economy';
    const toSlug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const BOOKING_ORDER = { low: 'price', mid: 'popularity', high: 'class_asc' };
    const trivagoUrl = `https://www.trivago.de/?sQuery=${encodeURIComponent(searchCity)}&aDateRange%5Barr%5D=${ci}&aDateRange%5Bdep%5D=${co}&adults=2&children=0&iRoomType=7`;
    const bookingUrl = `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(searchCity)}&checkin=${ci}&checkout=${co}&group_adults=2&group_children=0&no_rooms=1&order=${BOOKING_ORDER[apiBudget] || 'popularity'}&lang=de`;
    const skyUrl = iata
      ? `https://www.skyscanner.de/fluge-nach/${iata}/?adults=2&children=0&cabinclass=${skyClass}`
      : `https://www.skyscanner.de/fluge-nach/${toSlug(searchCity)}/?adults=2&children=0&cabinclass=${skyClass}`;
    const gygUrl     = `https://www.getyourguide.de/s/?q=${encodeURIComponent(dest.destination)}&date_from=${ci}&date_to=${co}`;
    const check24Url = `https://www.check24.de/urlaub/ergebnisse/?reiseziel=${encodeURIComponent(dest.destination)}&abreise=${ci}&rueckreise=${co}&erwachsene=2&kinder=0`;
    return { trivagoUrl, bookingUrl, skyUrl, gygUrl, check24Url };
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const moodLabels  = moods.map(id => MOODS.find(m => m.id === id)?.label || id);
      const apiBudget   = BUDGET_MAP[budget]   || 'mid';
      const apiDuration = DURATION_MAP[duration] || 'week';
      const apiSeason   = season === 'flex' ? 'spring' : season;

      const res = await fetch('/api/ai/travel', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeText:  personalNote.trim() || '',
          interests: moodLabels,
          budget:    apiBudget,
          duration:  apiDuration,
          season:    apiSeason,
          adults:    2,
          children:  0,
        }),
      });
      if (!res.ok) throw new Error();
      const parsed = await res.json();
      setPersonality(parsed.personality);
      setResults(parsed.destinations.map(d => ({ ...d, ...buildAffiliateUrls(d) })));
      setExtras({ packingList: parsed.packingList, surprise: parsed.surprise });
    } catch {
      setError('Fehler beim Abrufen. Bitte nochmal versuchen.');
    }
    setSubmitting(false);
  };

  const reset = () => {
    setResults(null);
    setPersonality(null);
    setExtras(null);
    setError('');
    setStep(1);
    setMoods([]);
    setSeason('');
    setBudget('');
    setDuration('');
    setPersonalNote('');
  };

  return (
    <section id="wizard" style={{ background: '#FFFFFF', paddingBottom: '80px' }}>
      <Container>
        <div style={{
          background: '#FFFFFF', borderRadius: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 48px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',
          padding: 'clamp(24px, 5vw, 44px)',
          marginTop: '-40px', position: 'relative', zIndex: 10,
        }}>

          {/* ── Loading ────────────────────────────────────────────────────── */}
          {submitting && <TravelFunnelLoading />}

          {/* ── Results ────────────────────────────────────────────────────── */}
          {!submitting && results && (
            <TravelResultView
              results={results}
              personality={personality}
              interests={moods}
              packingList={extras?.packingList}
              surprise={extras?.surprise}
              duration={DURATION_MAP[duration] || 'week'}
              onReset={reset}
              onEmail={() => setShowEmail(true)}
            />
          )}

          {/* ── Funnel (unchanged) ─────────────────────────────────────────── */}
          {!submitting && !results && (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 18px', borderRadius: '20px',
                  background: '#EFF6FF', border: '1px solid #BFDBFE',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
                  textTransform: 'uppercase', color: '#0284C7', marginBottom: '12px',
                  fontFamily: 'var(--font-heading)',
                }}>
                  <Sparkles size={12} strokeWidth={2} />
                  Deine Traumreise in 2 Minuten
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
                  Beschreibe deine perfekte Reise
                </h2>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto' }}>
                  Sag uns, worauf du Lust hast – ApeAround findet deine 3 persönlichen Traumziele.
                </p>
              </div>

              <StepProgress current={step} />

              {/* Step 1 — Stimmung */}
              {step === 1 && (
                <div>
                  <StepHeading
                    title="Welche Reise passt gerade zu dir?"
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

              {/* Step 2 — Reisezeit */}
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

              {/* Step 3 — Budget */}
              {step === 3 && (
                <div>
                  <StepHeading title="Welches Budget passt zu dir?" hint="Wähle eine Option" />
                  <div className="funnel-budget-grid" style={{ marginBottom: '28px' }}>
                    {BUDGETS.map(b => (
                      <VisualCard key={b.id} selected={budget === b.id}
                        onClick={() => setBudget(b.id)}
                        img={b.img} bg={b.bg} label={b.label} sublabel={b.sub} />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 — Dauer + persönliche Notiz */}
              {step === 4 && (
                <div>
                  <StepHeading title="Wie lange möchtest du verreisen?" hint="Wähle eine Option" />
                  <div className="funnel-season-grid" style={{ marginBottom: '28px' }}>
                    {DURATIONS.map(d => (
                      <VisualCard key={d.id} selected={duration === d.id}
                        onClick={() => setDuration(d.id)}
                        img={d.img} bg={d.bg} label={d.label} sublabel={d.sub} />
                    ))}
                  </div>

                  {/* Optional free-text field */}
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{
                      display: 'block', fontSize: '14px', fontWeight: 600,
                      color: '#374151', marginBottom: '8px',
                    }}>
                      Was ist dir bei deiner Traumreise besonders wichtig?
                      <span style={{ fontWeight: 400, color: '#94A3B8', marginLeft: '6px' }}>
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={personalNote}
                      onChange={e => setPersonalNote(e.target.value.slice(0, 500))}
                      maxLength={500}
                      rows={3}
                      placeholder="Zum Beispiel: ruhiges Hotel, wenig Touristen, gutes Essen, kurze Flugzeit, kinderfreundlich, viel Natur …"
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '14px',
                        border: '1.5px solid #E2E8F0', background: '#FAFBFF',
                        fontSize: '14px', color: '#0F172A', lineHeight: 1.65,
                        fontFamily: 'inherit', resize: 'vertical',
                        transition: 'border-color 0.2s',
                        outline: 'none',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#0EA5E9'; e.currentTarget.style.background = '#fff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#FAFBFF'; }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Optional – wir berücksichtigen nur Angaben, die zu deiner Reise passen.
                      </span>
                      <span style={{ fontSize: '11px', color: personalNote.length > 450 ? '#F97316' : '#94A3B8' }}>
                        {personalNote.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '14px', marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div style={{
                paddingTop: '22px', borderTop: '1px solid #F1F5F9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
              }}>
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
                      onClick={duration && !submitting ? handleSubmit : undefined}
                      disabled={!duration || submitting}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        padding: '15px clamp(22px, 4vw, 48px)', borderRadius: '14px', border: 'none',
                        background: duration && !submitting
                          ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                          : '#E2E8F0',
                        color: duration && !submitting ? '#FFFFFF' : '#94A3B8',
                        cursor: duration && !submitting ? 'pointer' : 'not-allowed',
                        fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        boxShadow: duration && !submitting ? '0 6px 24px rgba(14,165,233,0.38)' : 'none',
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
            </>
          )}

        </div>
      </Container>

      {showEmail && (
        <EmailPopup
          destination={results?.[0]?.destination || ''}
          onClose={() => setShowEmail(false)}
        />
      )}
    </section>
  );
}
