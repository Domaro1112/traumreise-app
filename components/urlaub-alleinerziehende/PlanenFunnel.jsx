'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';


// ── Step definitions ────────────────────────────────────────────────────────

// ── Image base paths ────────────────────────────────────────────────────────
const FUNNEL_IMG  = '/images/urlaub-alleinerziehende/funnel';
const FALLBACK_IMG = '/images/funnel/cards';

const STEPS = [
  {
    id: 'childAge',
    question: 'Wie alt ist dein Kind?',
    multi: false,
    options: [
      { value: '0-3',     label: '0–3 Jahre',                               img: `${FUNNEL_IMG}/child-age-0-3.png`,       fallbackImg: `${FALLBACK_IMG}/spring.jpg`,   bg: '#0F3460' },
      { value: '4-6',     label: '4–6 Jahre',                               img: `${FUNNEL_IMG}/child-age-4-6.png`,       fallbackImg: `${FALLBACK_IMG}/family.jpg`,   bg: '#1a4a2e' },
      { value: '7-10',    label: '7–10 Jahre',                              img: `${FUNNEL_IMG}/child-age-7-10.png`,      fallbackImg: `${FALLBACK_IMG}/active.jpg`,   bg: '#162040' },
      { value: '11-14',   label: '11–14 Jahre',                             img: `${FUNNEL_IMG}/child-age-11-14.png`,     fallbackImg: `${FALLBACK_IMG}/world.jpg`,    bg: '#221a44' },
      { value: '15+',     label: '15+ Jahre',                               img: `${FUNNEL_IMG}/child-age-15-plus.png`,   fallbackImg: `${FALLBACK_IMG}/mountain.jpg`, bg: '#1a2030' },
      { value: 'mehrere', label: 'Mehrere Kinder mit unterschiedlichem Alter', img: `${FUNNEL_IMG}/child-age-multiple.png`,  fallbackImg: `${FALLBACK_IMG}/resort.jpg`,   bg: '#0F3460' },
    ],
  },
  {
    id: 'travelMode',
    question: 'Wie möchtest du am liebsten reisen?',
    multi: false,
    options: [
      { value: 'auto',     label: 'Mit dem Auto',            img: `${FUNNEL_IMG}/travel-car.png`,            fallbackImg: `${FALLBACK_IMG}/mountain.jpg`, bg: '#1a2030' },
      { value: 'bahn',     label: 'Mit der Bahn',            img: `${FUNNEL_IMG}/travel-train.png`,          fallbackImg: `${FALLBACK_IMG}/city.jpg`,     bg: '#1e1020' },
      { value: 'flugzeug', label: 'Mit dem Flugzeug',        img: `${FUNNEL_IMG}/travel-plane.png`,          fallbackImg: `${FALLBACK_IMG}/world.jpg`,    bg: '#0F2A4C' },
      { value: 'kurz',     label: 'Möglichst kurze Anreise', img: `${FUNNEL_IMG}/travel-short-distance.png`, fallbackImg: `${FALLBACK_IMG}/relax.jpg`,    bg: '#1a3020' },
      { value: 'offen',    label: 'Ich bin offen',           img: `${FUNNEL_IMG}/travel-open.png`,           fallbackImg: `${FALLBACK_IMG}/active.jpg`,   bg: '#1e2010' },
    ],
  },
  {
    id: 'holidayType',
    question: 'Welche Urlaubsart passt zu euch?',
    multi: false,
    options: [
      { value: 'strand',       label: 'Strandurlaub',    img: `${FUNNEL_IMG}/holiday-beach.png`,         fallbackImg: `${FALLBACK_IMG}/beach.jpg`,    bg: '#0F2A4C' },
      { value: 'ferienpark',   label: 'Ferienpark',      img: `${FUNNEL_IMG}/holiday-park.png`,          fallbackImg: `${FALLBACK_IMG}/family.jpg`,   bg: '#1a4a2e' },
      { value: 'bauernhof',    label: 'Bauernhofurlaub', img: `${FUNNEL_IMG}/holiday-farm.png`,          fallbackImg: `${FALLBACK_IMG}/autumn.jpg`,   bg: '#2a1800' },
      { value: 'camping',      label: 'Camping',         img: `${FUNNEL_IMG}/holiday-camping.png`,       fallbackImg: `${FALLBACK_IMG}/backpack.jpg`, bg: '#182010' },
      { value: 'allinclusive', label: 'All-Inclusive',   img: `${FUNNEL_IMG}/holiday-all-inclusive.png`, fallbackImg: `${FALLBACK_IMG}/resort.jpg`,   bg: '#0F1A3C' },
      { value: 'natur',        label: 'Natururlaub',     img: `${FUNNEL_IMG}/holiday-nature.png`,        fallbackImg: `${FALLBACK_IMG}/mountain.jpg`, bg: '#1a2818' },
      { value: 'staedte',      label: 'Städtetrip',      img: `${FUNNEL_IMG}/holiday-city.png`,          fallbackImg: `${FALLBACK_IMG}/city.jpg`,     bg: '#1e1020' },
      { value: 'offen',        label: 'Ich bin offen',   img: `${FUNNEL_IMG}/holiday-open.png`,          fallbackImg: `${FALLBACK_IMG}/world.jpg`,    bg: '#1a1a34' },
    ],
  },
  {
    id: 'childcareNeed',
    question: 'Wie wichtig ist dir Kinderbetreuung oder Animation?',
    multi: false,
    options: [
      { value: 'sehr',      label: 'Sehr wichtig',                           img: `${FUNNEL_IMG}/childcare-important.png`,      fallbackImg: `${FALLBACK_IMG}/family.jpg`,   bg: '#1a4a2e' },
      { value: 'gut',       label: 'Schön, wenn vorhanden',                  img: `${FUNNEL_IMG}/childcare-nice-to-have.png`,   fallbackImg: `${FALLBACK_IMG}/resort.jpg`,   bg: '#0F2A4C' },
      { value: 'unwichtig', label: 'Nicht wichtig',                          img: `${FUNNEL_IMG}/childcare-not-important.png`,  fallbackImg: `${FALLBACK_IMG}/relax.jpg`,    bg: '#1a3020' },
      { value: 'ruhig',     label: 'Lieber ruhige Umgebung ohne Animation',  img: `${FUNNEL_IMG}/childcare-quiet.png`,          fallbackImg: `${FALLBACK_IMG}/wellness.jpg`, bg: '#221a34' },
    ],
  },
  {
    id: 'stressLevel',
    question: 'Wie stressarm soll die Reise sein?',
    multi: false,
    options: [
      { value: 'maxentspannt', label: 'So entspannt wie möglich',                   img: `${FUNNEL_IMG}/stress-relaxed.png`,   fallbackImg: `${FALLBACK_IMG}/relax.jpg`,    bg: '#1a3020' },
      { value: 'mix',          label: 'Gute Mischung aus Erholung und Aktivitäten', img: `${FUNNEL_IMG}/stress-balanced.png`,  fallbackImg: `${FALLBACK_IMG}/active.jpg`,   bg: '#162040' },
      { value: 'abenteuer',    label: 'Wir sind abenteuerlustig',                   img: `${FUNNEL_IMG}/stress-adventure.png`, fallbackImg: `${FALLBACK_IMG}/mountain.jpg`, bg: '#1a2818' },
      { value: 'guenstig',     label: 'Hauptsache günstig',                         img: `${FUNNEL_IMG}/stress-budget.png`,    fallbackImg: `${FALLBACK_IMG}/backpack.jpg`, bg: '#2a1800' },
    ],
  },
  {
    id: 'budgetLevel',
    question: 'Welches Budget passt ungefähr?',
    multi: false,
    options: [
      { value: 'low',     label: 'Möglichst günstig',                   img: `${FUNNEL_IMG}/budget-cheap.png`,   fallbackImg: `${FALLBACK_IMG}/backpack.jpg`, bg: '#182010' },
      { value: 'mid',     label: 'Solides Mittelklasse-Budget',         img: `${FUNNEL_IMG}/budget-middle.png`,  fallbackImg: `${FALLBACK_IMG}/hotel.jpg`,    bg: '#162040' },
      { value: 'high',    label: 'Komfort darf etwas kosten',           img: `${FUNNEL_IMG}/budget-comfort.png`, fallbackImg: `${FALLBACK_IMG}/luxury.jpg`,   bg: '#2a1800' },
      { value: 'compare', label: 'Ich möchte erstmal Ideen vergleichen',img: `${FUNNEL_IMG}/budget-compare.png`, fallbackImg: `${FALLBACK_IMG}/world.jpg`,    bg: '#1a1a34' },
    ],
  },
  {
    id: 'priorities',
    question: 'Was ist dir besonders wichtig?',
    multi: true,
    hint: 'Mehrfachauswahl möglich',
    options: [
      { value: 'kurze_wege',   label: 'Kurze Wege',                        img: `${FUNNEL_IMG}/priority-short-distances.png`,     fallbackImg: `${FALLBACK_IMG}/relax.jpg`,    bg: '#1a3020' },
      { value: 'sicherheit',   label: 'Sichere Umgebung',                  img: `${FUNNEL_IMG}/priority-safe-area.png`,            fallbackImg: `${FALLBACK_IMG}/family.jpg`,   bg: '#1a4a2e' },
      { value: 'unterkunft',   label: 'Kinderfreundliche Unterkunft',      img: `${FUNNEL_IMG}/priority-child-friendly-stay.png`,  fallbackImg: `${FALLBACK_IMG}/hotel.jpg`,    bg: '#162040' },
      { value: 'familien',     label: 'Andere Familien vor Ort',           img: `${FUNNEL_IMG}/priority-other-families.png`,       fallbackImg: `${FALLBACK_IMG}/resort.jpg`,   bg: '#0F2A4C' },
      { value: 'preis',        label: 'Gutes Preis-Leistungs-Verhältnis',  img: `${FUNNEL_IMG}/priority-good-value.png`,           fallbackImg: `${FALLBACK_IMG}/backpack.jpg`, bg: '#182010' },
      { value: 'verpflegung',  label: 'Einfache Verpflegung',              img: `${FUNNEL_IMG}/priority-easy-food.png`,            fallbackImg: `${FALLBACK_IMG}/autumn.jpg`,   bg: '#2a1800' },
      { value: 'aktivitaeten', label: 'Aktivitäten für Kinder',            img: `${FUNNEL_IMG}/priority-kids-activities.png`,      fallbackImg: `${FALLBACK_IMG}/active.jpg`,   bg: '#162040' },
      { value: 'elternteil',   label: 'Erholung für mich als Elternteil',  img: `${FUNNEL_IMG}/priority-parent-relaxation.png`,    fallbackImg: `${FALLBACK_IMG}/wellness.jpg`, bg: '#221a34' },
    ],
  },
];

// ── Label maps (for display + freeText) ────────────────────────────────────

const AGE_LABELS        = { '0-3':'0–3 Jahre','4-6':'4–6 Jahre','7-10':'7–10 Jahre','11-14':'11–14 Jahre','15+':'15+ Jahre','mehrere':'mehrere Kinder verschiedenen Alters' };
const TRAVEL_LABELS     = { auto:'Auto',bahn:'Bahn',flugzeug:'Flugzeug',kurz:'möglichst kurze Anreise',offen:'offen für alle Reisewege' };
const HOLIDAY_LABELS    = { strand:'Strandurlaub',ferienpark:'Ferienpark',bauernhof:'Bauernhofurlaub',camping:'Camping',allinclusive:'All-Inclusive',natur:'Natururlaub',staedte:'Städtetrip',offen:'offene Urlaubsart' };
const CHILDCARE_LABELS  = { sehr:'Kinderbetreuung ist sehr wichtig',gut:'Kinderbetreuung wäre schön',unwichtig:'keine Kinderbetreuung nötig',ruhig:'lieber ruhige Umgebung ohne Animation' };
const STRESS_LABELS     = { maxentspannt:'so entspannt wie möglich',mix:'Mix aus Erholung und Aktivitäten',abenteuer:'abenteuerlustig',guenstig:'Hauptsache günstig' };
const PRIORITY_LABELS   = { kurze_wege:'kurze Wege',sicherheit:'sichere Umgebung',unterkunft:'kinderfreundliche Unterkunft',familien:'andere Familien vor Ort',preis:'gutes Preis-Leistungs-Verhältnis',verpflegung:'einfache Verpflegung',aktivitaeten:'Aktivitäten für Kinder',elternteil:'Erholung für mich als Elternteil' };

// ── Preview computation ─────────────────────────────────────────────────────

function computePreview(a) {
  // Reisearten
  const reisearten = [];
  if (a.holidayType && a.holidayType !== 'offen') reisearten.push(HOLIDAY_LABELS[a.holidayType]);
  if (a.childcareNeed === 'sehr') { if (!reisearten.includes('All-Inclusive')) reisearten.push('All-Inclusive'); if (!reisearten.includes('Ferienpark')) reisearten.push('Ferienpark'); }
  if (a.stressLevel === 'maxentspannt' && !reisearten.includes('Ferienpark') && !reisearten.includes('All-Inclusive')) { reisearten.push('Ferienpark','All-Inclusive'); }
  if (a.budgetLevel === 'low') { ['Camping','Bauernhofurlaub','Ferienwohnung'].forEach(r => { if (!reisearten.includes(r)) reisearten.push(r); }); }

  // Zielrichtungen
  const ziele = [];
  if (a.travelMode === 'auto' || a.travelMode === 'kurz') {
    ziele.push('Nordsee','Ostsee','Niederlande');
    if (a.budgetLevel === 'low' || a.stressLevel === 'guenstig') ziele.push('Ferienpark in Deutschland','Dänemark');
    else ziele.push('Österreich','Südtirol','Tschechien');
  }
  if (a.travelMode === 'bahn') ziele.push('Nordsee','Ostsee','Österreich','Schwarzwald','München','Hamburg');
  if (a.travelMode === 'flugzeug' || a.travelMode === 'offen') {
    if (a.budgetLevel === 'high') ziele.push('Mallorca','Griechenland','Kanaren','Zypern');
    else ziele.push('Mallorca','Kroatien','Griechenland');
    if (a.childcareNeed === 'sehr') ziele.push('Türkei (Clubhotels)','Kreta (All-Inclusive)');
  }
  if (a.holidayType === 'bauernhof' || a.holidayType === 'natur') ['Allgäu','Schwarzwald','Bayerische Alpen','Österreich'].forEach(z => { if (!ziele.includes(z)) ziele.push(z); });
  if (a.holidayType === 'ferienpark') ['Ferienpark in Deutschland','Center Parcs','Dänemark'].forEach(z => { if (!ziele.includes(z)) ziele.push(z); });

  // Worauf achten
  const achten = [];
  const prio = a.priorities || [];
  if (prio.includes('kurze_wege') || a.stressLevel === 'maxentspannt') achten.push('Unterkünfte wählen, bei denen alles auf einem Gelände liegt');
  if (a.childcareNeed === 'sehr' || a.childcareNeed === 'gut') achten.push('Resorts oder Ferienparks mit ausgewiesenem Kinderclub oder Kinderanimation bevorzugen');
  if (prio.includes('unterkunft')) achten.push('Ferienwohnung mit Küche für mehr Flexibilität und Selbstverpflegung');
  if (prio.includes('sicherheit')) achten.push('Touristisch gut erschlossene Ziele mit vielen Familienbewertungen wählen');
  if (prio.includes('elternteil')) achten.push('Mindestens ein ruhiger Nachmittag pro Woche ohne Programm einplanen');
  if (prio.includes('preis') || a.budgetLevel === 'low') achten.push('Frühbucherpreise und Ferienwohnungen außerhalb der Hauptsaison vergleichen');
  if (a.stressLevel === 'abenteuer') achten.push('Abenteuerliche Reisen mit kurzen Tagesetappen planen – Kinder brauchen Pausen');

  // Ehrliche Hinweise
  const hinweise = [];
  if (a.childAge === '0-3' && a.holidayType === 'staedte') hinweise.push('Städtetrips mit Kleinkindern unter 4 Jahren sind oft anstrengend. Kurze Aufenthalte (max. 2–3 Tage) mit wenig Programm und guter Schlafmöglichkeit vor Ort sind empfehlenswert.');
  if (a.childAge === '0-3' && a.travelMode === 'flugzeug') hinweise.push('Lange Flugreisen können mit Kleinkind stressig sein. Flüge unter 3 Stunden oder Autofahrten sind oft einfacher zu handhaben.');
  if (a.budgetLevel === 'low' && a.holidayType === 'allinclusive') hinweise.push('All-Inclusive ist komfortabel, aber selten günstig. Für ein knappes Budget sind Ferienwohnungen oder Campingplätze oft die bessere Wahl.');
  if (a.stressLevel === 'abenteuer' && (a.childAge === '0-3' || a.childAge === '4-6')) hinweise.push('Abenteuerreisen mit Kindern unter 7 Jahren haben ihre Grenzen. Kürzere Tagesetappen und weniger Programm machen die Reise für alle angenehmer.');
  if (a.childAge === '0-3' && a.holidayType === 'camping') hinweise.push('Camping mit Kleinkind erfordert mehr Vorbereitung. Feste Stellplätze mit Sanitäranlagen sind deutlich einfacher als Zelte.');

  return {
    reisearten: [...new Set(reisearten)].slice(0, 4),
    ziele:      [...new Set(ziele)].slice(0, 6),
    achten:     [...new Set(achten)].slice(0, 4),
    hinweise,
  };
}

// ── AI integration helpers ──────────────────────────────────────────────────

function mapBudget(b) {
  if (b === 'low')  return 'low';
  if (b === 'high') return 'high';
  return 'mid';
}

function buildInterests(a) {
  const list = [];
  const prio = a.priorities || [];
  if (a.holidayType === 'strand')       list.push('Strandurlaub');
  if (a.holidayType === 'ferienpark')   list.push('Ferienpark','Familie');
  if (a.holidayType === 'bauernhof')    list.push('Natur','Landleben');
  if (a.holidayType === 'camping')      list.push('Outdoor','Camping');
  if (a.holidayType === 'natur')        list.push('Natur','Wandern');
  if (a.holidayType === 'staedte')      list.push('Kultur','Städtereise');
  if (a.holidayType === 'allinclusive') list.push('All-Inclusive','Familie');
  if (prio.includes('aktivitaeten'))    list.push('Kinderurlaub');
  if (prio.includes('elternteil'))      list.push('Entspannung');
  if (prio.includes('sicherheit'))      list.push('Sicherheit');
  if (prio.includes('familien'))        list.push('Familienfreundlich');
  return [...new Set(list)].slice(0, 5);
}

function buildFreeText(a) {
  const prios = (a.priorities || []).map(p => PRIORITY_LABELS[p] || p).join(', ') || 'keine besonderen Prioritäten';
  return [
    `Ich bin alleinerziehend und reise mit meinem Kind (${AGE_LABELS[a.childAge] || a.childAge}).`,
    `Bevorzugte Anreise: ${TRAVEL_LABELS[a.travelMode] || a.travelMode}.`,
    `Gewünschte Urlaubsart: ${HOLIDAY_LABELS[a.holidayType] || a.holidayType}.`,
    `${CHILDCARE_LABELS[a.childcareNeed] || a.childcareNeed}.`,
    `Reisestil: ${STRESS_LABELS[a.stressLevel] || a.stressLevel}.`,
    `Besonders wichtig für uns: ${prios}.`,
    'Bitte familienfreundliche Reiseideen für Alleinerziehende vorschlagen, mit Fokus auf einfache Anreise, sichere Umgebung und kindgerechte Ziele.',
  ].join(' ');
}

// ── Style constants ─────────────────────────────────────────────────────────

const S = {
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '14px 28px', borderRadius: '14px',
    background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)',
    color: '#fff', textDecoration: 'none', border: 'none',
    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(14,165,233,0.35)',
    fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 22px', borderRadius: '12px',
    background: 'transparent', border: '1.5px solid #E2E8F0',
    color: '#64748B', fontSize: '14px', fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)',
  },
  label: {
    fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#0EA5E9',
    fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)',
    display: 'block', marginBottom: '12px',
  },
  heading: {
    fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)',
    fontWeight: 800, color: '#0F172A', lineHeight: 1.2,
  },
};

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ── VisualCard (matches HomeTravelWizard card style) ────────────────────────

function VisualCard({ selected, onClick, img, fallbackImg, bg, label, height }) {
  const [imgSrc, setImgSrc] = useState(img || fallbackImg || null);

  function handleImgError() {
    if (fallbackImg && imgSrc !== fallbackImg) {
      setImgSrc(fallbackImg);
    } else {
      setImgSrc(null);
    }
  }

  return (
    <button
      onClick={onClick}
      className="funnel-visual-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        border: selected ? '2.5px solid #0EA5E9' : '2.5px solid transparent',
        padding: 0,
        display: 'block',
        width: '100%',
        height: height || '160px',
        cursor: 'pointer',
        backgroundColor: bg || '#162040',
        boxShadow: selected
          ? '0 0 0 3px rgba(14,165,233,0.50), 0 0 0 6px rgba(14,165,233,0.14), 0 10px 28px rgba(0,0,0,0.22)'
          : '0 3px 14px rgba(0,0,0,0.18)',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)',
        textAlign: 'left',
      }}
    >
      {imgSrc && (
        <>
          {/* Hidden probe — detects load failure and triggers fallback */}
          <img
            key={imgSrc}
            src={imgSrc}
            alt=""
            aria-hidden="true"
            onError={handleImgError}
            style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-1px',
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </>
      )}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 12px 13px',
        zIndex: 2,
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.65), 0 1px 2px rgba(0,0,0,0.9)',
          lineHeight: 1.3,
          letterSpacing: '0.01em',
        }}>
          {label}
        </div>
      </div>
      {selected && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: '#0EA5E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(14,165,233,0.65)',
          zIndex: 3,
          fontSize: '13px',
          color: '#fff',
          fontWeight: 800,
          lineHeight: 1,
        }}>
          ✓
        </div>
      )}
    </button>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function PlanenFunnel() {
  const router = useRouter();

  const [step,     setStep]     = useState(0);
  const [answers,  setAnswers]  = useState({ priorities: [] });
  const [phase,    setPhase]    = useState('questions'); // 'questions' | 'preview' | 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const totalSteps   = STEPS.length;
  const currentStep  = STEPS[step];
  const isMultiStep  = currentStep?.multi;
  const canAdvance   = isMultiStep
    ? (answers.priorities || []).length > 0
    : !!answers[currentStep?.id];

  // ── Handlers ──────────────────────────────────────────────────────────────

  function selectSingle(value) {
    setAnswers(prev => ({ ...prev, [currentStep.id]: value }));
  }

  function toggleMulti(value) {
    setAnswers(prev => {
      const cur = prev.priorities || [];
      return { ...prev, priorities: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] };
    });
  }

  function handleNext() {
    if (step < totalSteps - 1) setStep(s => s + 1);
    else setPhase('preview');
  }

  function handleBack() {
    if (phase === 'preview' || phase === 'error') { setPhase('questions'); return; }
    if (step > 0) setStep(s => s - 1);
  }

  async function handleCreateIdeas() {
    setPhase('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/travel-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeText:  buildFreeText(answers),
          interests: buildInterests(answers),
          budget:    mapBudget(answers.budgetLevel),
          duration:  'week',
          season:    'summer',
          adults:    1,
          children:  1,
          moodIds:   [],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        setErrorMsg(data.error || 'Reiseideen konnten nicht erstellt werden. Bitte versuche es erneut.');
        setPhase('error');
        return;
      }
      router.push('/traumreise/' + data.id);
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte prüfe deine Internetverbindung und versuche es erneut.');
      setPhase('error');
    }
  }

  // ── Render phases ─────────────────────────────────────────────────────────

  if (phase === 'loading') return <LoadingView />;
  if (phase === 'error')   return <ErrorView msg={errorMsg} onBack={() => setPhase('preview')} />;
  if (phase === 'preview') return (
    <PreviewView
      answers={answers}
      preview={computePreview(answers)}
      onCreateIdeas={handleCreateIdeas}
      onBack={handleBack}
    />
  );

  // Grid: single-select → 1 col mobile / 2 col desktop; multi → 2 col mobile / 4 col desktop
  const gridCols  = isMultiStep ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))';
  const cardHeight = isMultiStep ? '130px' : '160px';

  // Questions
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFF',
      paddingTop: 'calc(80px + 48px)',
      paddingBottom: '80px',
    }}>
      <Container>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* Progress */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)' }}>
                Schritt {step + 1} von {totalSteps}
              </span>
              <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                {Math.round(((step) / totalSteps) * 100)}% abgeschlossen
              </span>
            </div>
            <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '99px',
                background: 'linear-gradient(90deg,#0EA5E9,#06B6D4)',
                width: `${((step) / totalSteps) * 100}%`,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Question card */}
          <div style={{
            background: '#FFFFFF', borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
            padding: 'clamp(28px,5vw,48px)',
            marginBottom: '24px',
          }}>
            <h2 style={{ ...S.heading, fontSize: 'clamp(18px,3vw,24px)', marginBottom: isMultiStep && currentStep.hint ? '8px' : '28px' }}>
              {currentStep.question}
            </h2>

            {isMultiStep && currentStep.hint && (
              <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
                {currentStep.hint}
                {(answers.priorities || []).length > 0 && (
                  <span style={{ color: '#0EA5E9', fontWeight: 600, marginLeft: '8px' }}>
                    · {(answers.priorities || []).length} ausgewählt
                  </span>
                )}
              </p>
            )}

            {/* Visual card grid */}
            <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '10px' }}>
              {currentStep.options.map(opt => {
                const selected = isMultiStep
                  ? (answers.priorities || []).includes(opt.value)
                  : answers[currentStep.id] === opt.value;
                return (
                  <VisualCard
                    key={opt.value}
                    selected={selected}
                    onClick={() => isMultiStep ? toggleMulti(opt.value) : selectSingle(opt.value)}
                    img={opt.img}
                    fallbackImg={opt.fallbackImg}
                    bg={opt.bg}
                    label={opt.label}
                    height={cardHeight}
                  />
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {step > 0 ? (
              <button onClick={handleBack} style={S.btnGhost}>
                <ArrowLeft /> Zurück
              </button>
            ) : (
              <a href="/urlaub-fuer-alleinerziehende" style={{ ...S.btnGhost, textDecoration: 'none' }}>
                <ArrowLeft /> Zur Übersicht
              </a>
            )}

            <button
              onClick={handleNext}
              disabled={!canAdvance}
              style={{
                ...S.btnPrimary,
                opacity: canAdvance ? 1 : 0.4,
                cursor: canAdvance ? 'pointer' : 'not-allowed',
              }}
            >
              {step === totalSteps - 1 ? 'Ergebnis anzeigen' : 'Weiter'}
              <ArrowRight />
            </button>
          </div>

        </div>
      </Container>
    </div>
  );
}

// ── Preview view ────────────────────────────────────────────────────────────

function PreviewView({ answers, preview, onCreateIdeas, onBack }) {
  const { reisearten, ziele, achten, hinweise } = preview;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', paddingTop: 'calc(80px + 48px)', paddingBottom: '80px' }}>
      <Container>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span style={S.label}>Unsere erste Einschätzung</span>
            <h2 style={{ ...S.heading, fontSize: 'clamp(22px,4vw,34px)', marginBottom: '12px' }}>
              Unsere erste Einschätzung für euch
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7 }}>
              Basierend auf deinen Angaben haben wir erste Reiseideen für dich und dein Kind zusammengestellt.
            </p>
          </div>

          {/* Result cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>

            {reisearten.length > 0 && (
              <PreviewCard
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                title="Passende Reisearten für euch"
                items={reisearten}
                color="#0EA5E9"
              />
            )}

            {ziele.length > 0 && (
              <PreviewCard
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                title="Passende Zielrichtungen"
                items={ziele}
                color="#06B6D4"
              />
            )}

            {achten.length > 0 && (
              <PreviewCard
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                title="Worauf ihr besonders achten solltet"
                items={achten}
                color="#8B5CF6"
              />
            )}

            {hinweise.length > 0 && (
              <div style={{
                background: '#FFFBEB', border: '1px solid #FDE68A',
                borderRadius: '20px', padding: '28px 32px',
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
                    background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <h3 style={{ ...S.heading, fontSize: '16px', color: '#92400E', margin: 0, alignSelf: 'center' }}>
                    Ehrlicher Hinweis
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {hinweise.map((h, i) => (
                    <p key={i} style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.7, margin: 0 }}>{h}</p>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* CTA */}
          <div style={{
            background: 'linear-gradient(135deg,#0F172A 0%,#12324a 60%,#0EA5E9 160%)',
            borderRadius: '24px', padding: 'clamp(32px,5vw,48px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: '-20%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ ...S.heading, fontSize: 'clamp(18px,3vw,26px)', color: '#FFFFFF', marginBottom: '12px' }}>
                Möchtest du daraus konkrete Reiseideen machen?
              </h3>
              <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.7, marginBottom: '28px' }}>
                ApeAround kann deine Angaben nutzen, um daraus passende Reisevorschläge mit Zielideen, Budgeteinschätzung und Unterkunfts-Tipps zu erstellen.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button onClick={onCreateIdeas} style={S.btnPrimary}>
                  Konkrete Reiseideen erstellen
                  <ArrowRight />
                </button>
                <button onClick={onBack} style={{
                  ...S.btnGhost,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  color: '#CBD5E1',
                }}>
                  Antworten bearbeiten
                </button>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

function PreviewCard({ icon, title, items, color }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px 32px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{
          flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
          background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          {icon}
        </div>
        <h3 style={{ ...S.heading, fontSize: '16px', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map(item => (
          <span key={item} style={{
            display: 'inline-block',
            padding: '6px 14px', borderRadius: '40px',
            background: `${color}12`, border: `1px solid ${color}30`,
            color, fontSize: '13px', fontWeight: 600,
            fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Loading view ────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <>
      <style>{`@keyframes ape-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{
        minHeight: '100vh', background: '#F8FAFF',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingTop: '80px', padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          border: '4px solid #E2E8F0', borderTopColor: '#0EA5E9',
          animation: 'ape-spin 0.9s linear infinite',
          marginBottom: '28px',
        }} />
        <h2 style={{ ...S.heading, fontSize: '22px', marginBottom: '12px' }}>
          Reiseideen werden erstellt
        </h2>
        <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '380px', lineHeight: 1.7 }}>
          Wir suchen passende Reiseziele, die zu dir, deinem Kind und eurem Budget passen. Das dauert einen Moment.
        </p>
      </div>
    </>
  );
}

// ── Error view ──────────────────────────────────────────────────────────────

function ErrorView({ msg, onBack }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#F8FAFF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: '80px', padding: '80px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 style={{ ...S.heading, fontSize: '22px', marginBottom: '12px' }}>
        Das hat leider nicht geklappt
      </h2>
      <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '420px', lineHeight: 1.7, marginBottom: '32px' }}>
        {msg}
      </p>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onBack} style={S.btnPrimary}>
          Nochmal versuchen
        </button>
        <a href="/urlaub-fuer-alleinerziehende" style={{ ...S.btnGhost, textDecoration: 'none' }}>
          Zurück zur Übersicht
        </a>
      </div>
    </div>
  );
}
