'use client';

import { useState } from 'react';
import Container from '@/components/layout/Container';
import { computeResult, PACKING_LIST, SAFETY_TIPS } from '@/lib/motorradurlaub-funnel';

// ── Image with progressive fallback ──────────────────────────────────────────
function ResultImg({ sources = [], alt = '', style = {} }) {
  const srcs = sources.filter(Boolean);
  const [idx, setIdx] = useState(0);
  if (idx >= srcs.length) return null;
  return (
    <img
      src={srcs[idx]}
      alt={alt}
      onError={() => setIdx(i => i + 1)}
      style={style}
    />
  );
}

// ── Image source lists ────────────────────────────────────────────────────────
const IMGS = {
  region:  ['/images/motorradurlaub/results/result-region.png',  '/images/motorradurlaub/motorradurlaub-hero.png'],
  hotel:   ['/images/motorradurlaub/results/result-hotel.png',   '/images/motorradurlaub/motorradurlaub-hero.png'],
  route:   ['/images/motorradurlaub/results/result-route.png',   '/images/motorradurlaub/funnel/style-curves.png',    '/images/funnel/cards/mountain.jpg'],
  packing: ['/images/motorradurlaub/results/result-packing.png', '/images/motorradurlaub/funnel/duration-longer.png', '/images/funnel/cards/backpack.jpg'],
};

// ── Affiliate providers ───────────────────────────────────────────────────────
const AFFILIATE_PROVIDERS = [
  {
    key: 'booking',
    name: 'Booking.com',
    tagline: 'Motorradhotels mit sicherem Stellplatz',
    description: 'Größte Auswahl an Motorradhotels und Pensionen – filterbar nach Parkplatz, Trockenraum und Biker-Services.',
    trust: 'Kostenlose Stornierung bei vielen Angeboten',
    cta: 'Motorradhotel bei Booking suchen',
    buildUrl: (s) => `/go/booking?url=${encodeURIComponent(`https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(s)}&lang=de&selected_currency=EUR`)}`,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'trivago',
    name: 'Trivago',
    tagline: 'Preise vergleichen & sparen',
    description: 'Über 5 Millionen Unterkünfte weltweit auf einen Blick – finde das beste Preis-Leistungs-Verhältnis für deine Tour.',
    trust: 'Über 5 Mio. Unterkünfte im Vergleich',
    cta: 'Unterkünfte vergleichen',
    buildUrl: (s) => `/go/trivago?url=${encodeURIComponent(`https://www.trivago.de/?query=${encodeURIComponent(s)}&iPathCombination=am`)}`,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    key: 'holidaycheck',
    name: 'HolidayCheck',
    tagline: 'Echte Bewertungen von Bikern',
    description: 'Echte Bewertungen von Motorradreisenden helfen dir, die wirklich bikertaugliche Unterkunft an deiner Route zu finden.',
    trust: 'Authentische Bewertungen von echten Urlaubern',
    cta: 'Bewertungen ansehen',
    buildUrl: (s) => `/go/holidaycheck?url=${encodeURIComponent(`https://www.holidaycheck.de/hotel-search?terms=${encodeURIComponent(s)}`)}`,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

const DIFFICULTY_COLOR = {
  leicht:        { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
  mittel:        { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  anspruchsvoll: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
};

const ARROW_RIGHT = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Hotel / Affiliate Section ─────────────────────────────────────────────────
function HotelSection({ searchTerm, primaryRegion }) {
  return (
    <section style={{ background: '#F0F9FF', borderTop: '1px solid #BAE6FD', borderBottom: '1px solid #BAE6FD', paddingTop: 'clamp(44px, 6vw, 72px)', paddingBottom: 'clamp(44px, 6vw, 72px)' }}>
      <Container>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
              Unterkunft buchen
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              Passende Motorrad-Unterkünfte finden
            </h2>
            <p style={{ fontSize: 'clamp(13px, 1.8vw, 15px)', color: '#64748B', lineHeight: 1.65, margin: 0, maxWidth: '560px' }}>
              Finde Unterkünfte mit guter Lage für Tagestouren, sicherem Stellplatz, Frühstück und kurzen Wegen zu deiner Route.
            </p>
          </div>
          <div style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.22)', borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0369A1' }}>{primaryRegion}</span>
          </div>
        </div>

        {/* Affiliate cards */}
        <div className="mrv-hotel-grid">
          {AFFILIATE_PROVIDERS.map(p => (
            <a
              key={p.key}
              href={p.buildUrl(searchTerm)}
              target="_blank"
              rel="noopener noreferrer"
              className="mrv-hotel-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {/* Icon + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(14,165,233,0.13) 0%, rgba(6,182,212,0.08) 100%)', border: '1px solid rgba(14,165,233,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>{p.name}</p>
                  <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 700, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{p.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: '0 0 16px', flexGrow: 1 }}>{p.description}</p>

              {/* Trust line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 600 }}>{p.trust}</span>
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, boxShadow: '0 6px 20px rgba(14,165,233,0.30), 0 2px 8px rgba(14,165,233,0.18)', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', letterSpacing: '0.01em' }}>
                {p.cta}
                {ARROW_RIGHT}
              </div>
            </a>
          ))}
        </div>

        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '24px', textAlign: 'center', lineHeight: 1.6 }}>
          Bei einer Weiterleitung zu einem Partnerportal kann ApeAround eine Provision erhalten. Für dich entstehen keine zusätzlichen Kosten.{' '}
          <a href="/affiliate-hinweis" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Mehr erfahren</a>
        </p>
      </Container>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MotorcycleResultView({ answers, onReset, aiResult, aiError }) {
  const result = computeResult(answers);
  const { profile, regions, bestTime, accommodation, etappen, kmPerDay, duration } = result;

  const primaryRegion = aiResult?.recommendedRegion?.name || regions[0]?.name || 'Motorradurlaub';
  const searchTerm    = aiResult?.hotelSearchQuery || `Motorradhotel ${primaryRegion}`;

  const heroChips = aiResult
    ? [
        { label: 'Tageskilometer', value: aiResult.dailyStages?.recommendedKmPerDay || kmPerDay },
        { label: 'Beste Reisezeit', value: aiResult.bestTravelTime?.months || bestTime.split('–')[0].trim() },
        { label: 'Unterkunft',      value: aiResult.accommodationAdvice?.type || accommodation.label },
      ]
    : [
        { label: 'Reisedauer', value: duration },
        { label: 'Tagesziel',  value: kmPerDay },
        { label: 'Beste Zeit', value: bestTime.split(' ').slice(0, 2).join(' ') + ' …' },
      ];

  return (
    <>
      <style>{`
        .mrv-hero-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: clamp(28px, 4vw, 52px);
          align-items: center;
        }
        .mrv-hero-img-wrap {
          aspect-ratio: 1 / 1;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          flex-shrink: 0;
        }
        .mrv-hotel-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .mrv-hotel-card {
          background: #FFFFFF;
          border: 1.5px solid #E0F2FE;
          border-radius: 24px;
          padding: clamp(20px, 3vw, 32px);
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(14,165,233,0.07);
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .mrv-hotel-card:hover {
          box-shadow: 0 10px 36px rgba(14,165,233,0.18);
          transform: translateY(-3px);
          border-color: rgba(14,165,233,0.35);
        }
        .mrv-regions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }
        .mrv-region-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: clamp(20px, 3vw, 28px);
          position: relative;
          box-shadow: 0 2px 12px rgba(15,23,42,0.05);
        }
        .mrv-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }
        .mrv-info-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: clamp(20px, 3vw, 28px);
        }
        .mrv-routes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          margin-bottom: 0;
        }
        .mrv-packing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .mrv-ai-packing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 0;
        }
        @media (max-width: 900px) {
          .mrv-hero-grid { grid-template-columns: 1fr; }
          .mrv-hero-img-wrap { max-width: 380px; margin: 0 auto; width: 100%; }
        }
        @media (max-width: 840px) {
          .mrv-hotel-grid { grid-template-columns: 1fr; }
          .mrv-regions-grid { grid-template-columns: 1fr; }
          .mrv-routes-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 620px) {
          .mrv-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Fallback-Hinweis ─────────────────────────────────────────── */}
      {aiError && (
        <section style={{ background: '#FFF7ED', paddingTop: '16px', paddingBottom: '4px' }}>
          <Container size="sm">
            <div style={{ background: '#FED7AA', border: '1px solid #FDBA74', borderRadius: '14px', padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginTop: '1px', flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: '13px', color: '#7C2D12', margin: 0, lineHeight: 1.55 }}>
                Die KI-Planung war gerade nicht verfügbar. Du siehst eine regelbasierte Empfehlung.
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* ── 1. HERO / SUMMARY CARD ───────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0e2d46 58%, #0c3a55 100%)', paddingTop: 'clamp(44px, 6vw, 72px)', paddingBottom: 'clamp(44px, 6vw, 72px)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-15%', left: '-5%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-25%', right: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <Container>
          <div className="mrv-hero-grid">
            {/* Text */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(14,165,233,0.14)', border: '1px solid rgba(14,165,233,0.30)', borderRadius: '20px', padding: '5px 16px', marginBottom: '24px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#38BDF8" stroke="none" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#38BDF8', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                  {aiResult ? `KI-Planung · ${aiResult.riderProfile?.name || 'Dein Profil'}` : 'Dein Fahrprofil'}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
                {aiResult ? aiResult.title : profile.label}
              </h1>

              {/* Description */}
              <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.70)', lineHeight: 1.65, margin: '0 0 28px', maxWidth: '520px' }}>
                {aiResult
                  ? (aiResult.riderProfile?.description || aiResult.summary)
                  : profile.description}
              </p>

              {/* Region pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.24)', borderRadius: '12px', padding: '8px 16px', marginBottom: '28px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontSize: '14px', color: '#E0F2FE', fontWeight: 700, fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                  {aiResult
                    ? `${aiResult.recommendedRegion?.name || primaryRegion}${aiResult.recommendedRegion?.country ? ` · ${aiResult.recommendedRegion.country}` : ''}`
                    : `${regions[0]?.name || primaryRegion}${regions[0]?.country ? ` · ${regions[0].country}` : ''}`}
                </span>
              </div>

              {/* Info chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {heroChips.map(chip => (
                  <div key={chip.label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 18px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '3px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{chip.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', lineHeight: 1.2 }}>{chip.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="mrv-hero-img-wrap">
              <ResultImg
                sources={IMGS.region}
                alt={`Motorradurlaub in ${primaryRegion}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,28,50,0.55) 0%, transparent 55%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                <span style={{ display: 'inline-block', background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: '#FFFFFF', fontWeight: 700, fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', letterSpacing: '0.01em' }}>
                  {primaryRegion}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. HOTEL SECTION ────────────────────────────────────────────── */}
      <HotelSection searchTerm={searchTerm} primaryRegion={primaryRegion} />

      {/* ══ VARIANTE A – KI-Ergebnis ════════════════════════════════════ */}
      {aiResult ? (
        <>
          {/* ── 3. Top Routen ──────────────────────────────────────────── */}
          {Array.isArray(aiResult.topRoutes) && aiResult.topRoutes.length > 0 && (
            <section style={{ background: '#F1F5F9', paddingTop: 'clamp(40px, 5vw, 60px)', paddingBottom: 'clamp(40px, 5vw, 60px)' }}>
              <Container>
                <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ marginBottom: '28px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Streckenempfehlungen</p>
                      <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                        Top Routen
                      </h2>
                    </div>
                    <div className="mrv-routes-grid">
                      {aiResult.topRoutes.map((route, i) => {
                        const diff = DIFFICULTY_COLOR[route.difficulty] || DIFFICULTY_COLOR.mittel;
                        return (
                          <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: 'clamp(16px, 2.5vw, 24px)', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '10px' }}>
                              <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                                {route.name}
                              </h3>
                              <span style={{ fontSize: '11px', fontWeight: 700, background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, borderRadius: '8px', padding: '3px 9px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                {route.difficulty}
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                              {route.region}
                            </p>
                            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>{route.description}</p>
                            {route.bestFor && (
                              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px' }}>
                                <strong style={{ color: '#0F172A' }}>Ideal für:</strong> {route.bestFor}
                              </p>
                            )}
                            {route.notes && (
                              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '8px 0 0', fontStyle: 'italic', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                                {route.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Route image sidebar */}
                  <div style={{ width: '210px', flexShrink: 0, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1', background: '#162040', border: '1px solid #E2E8F0' }}>
                      <ResultImg sources={IMGS.route} alt="Motorradroute" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
                      <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Empfohlene Region</p>
                      <p style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', lineHeight: 1.2 }}>
                        {aiResult.recommendedRegion?.name || primaryRegion}
                      </p>
                      {aiResult.recommendedRegion?.country && (
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>{aiResult.recommendedRegion.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          )}

          {/* ── 4. Beispiel-Tagesplan ──────────────────────────────────── */}
          {Array.isArray(aiResult.sampleItinerary) && aiResult.sampleItinerary.length > 0 && (
            <section style={{ background: '#FFFFFF', paddingTop: 'clamp(40px, 5vw, 60px)', paddingBottom: 'clamp(40px, 5vw, 60px)' }}>
              <Container size="sm">
                <div style={{ marginBottom: '28px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Beispiel-Reiseplan</p>
                  <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Dein Tagesplan
                  </h2>
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative', paddingLeft: '48px' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', left: '18px', top: '22px', bottom: '22px', width: '2px', background: 'linear-gradient(to bottom, #0EA5E9 0%, rgba(14,165,233,0.08) 100%)' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {aiResult.sampleItinerary.map((day, i) => (
                      <div key={day.day} style={{ position: 'relative' }}>
                        {/* Timeline dot */}
                        <div aria-hidden="true" style={{ position: 'absolute', left: '-38px', top: '13px', width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)', border: '3px solid #FFFFFF', boxShadow: '0 0 0 2px rgba(14,165,233,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                          {day.day}
                        </div>

                        <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: 'clamp(14px, 2.5vw, 20px)' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                              {day.title}
                            </h3>
                            {day.approxKm && (
                              <span style={{ background: 'rgba(14,165,233,0.09)', border: '1px solid rgba(14,165,233,0.20)', borderRadius: '8px', padding: '2px 10px', fontSize: '12px', color: '#0EA5E9', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                ca. {day.approxKm}
                              </span>
                            )}
                          </div>
                          {day.routeIdea && (
                            <p style={{ fontSize: '12px', color: '#0EA5E9', margin: '0 0 5px', fontWeight: 600 }}>{day.routeIdea}</p>
                          )}
                          <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Container>
            </section>
          )}

          {/* ── 5. Tageskilometer + Beste Reisezeit ─────────────────────── */}
          <section style={{ background: '#F1F5F9', paddingTop: 'clamp(40px, 5vw, 56px)', paddingBottom: '40px' }}>
            <Container>
              <div className="mrv-info-grid">
                {aiResult.dailyStages && (
                  <div className="mrv-info-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Tagesetappe</h3>
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 800, color: '#0EA5E9', margin: '0 0 10px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{aiResult.dailyStages.recommendedKmPerDay}</p>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>{aiResult.dailyStages.description}</p>
                  </div>
                )}
                {aiResult.bestTravelTime && (
                  <div className="mrv-info-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Beste Reisezeit</h3>
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>{aiResult.bestTravelTime.months}</p>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: '0 0 8px' }}>{aiResult.bestTravelTime.summary}</p>
                    {aiResult.bestTravelTime.weatherNote && (
                      <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{aiResult.bestTravelTime.weatherNote}</p>
                    )}
                  </div>
                )}
              </div>
            </Container>
          </section>

          {/* ── 6. Unterkunftstipps ──────────────────────────────────────── */}
          {aiResult.accommodationAdvice && (
            <section style={{ background: '#F1F5F9', paddingBottom: '40px' }}>
              <Container>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Unterkunft</p>
                  <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Unterkunftstipps</h2>
                </div>
                <div className="mrv-info-card" style={{ maxWidth: '600px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{aiResult.accommodationAdvice.type}</p>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: '0 0 16px' }}>{aiResult.accommodationAdvice.description}</p>
                  {Array.isArray(aiResult.accommodationAdvice.features) && aiResult.accommodationAdvice.features.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {aiResult.accommodationAdvice.features.map((f, i) => (
                        <span key={i} style={{ fontSize: '12px', fontWeight: 600, background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '3px 10px' }}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Container>
            </section>
          )}

          {/* ── 7. Packliste ──────────────────────────────────────────────── */}
          {Array.isArray(aiResult.packingList) && aiResult.packingList.length > 0 && (
            <section style={{ background: '#FFFFFF', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
              <Container>
                <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Checkliste</p>
                      <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Motorrad-Packliste</h2>
                    </div>
                    <div className="mrv-ai-packing-grid">
                      {aiResult.packingList.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '11px 14px' }}>
                          <span style={{ color: '#0EA5E9', marginTop: '2px', flexShrink: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                          </span>
                          <span style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Packing image */}
                  <div style={{ width: '200px', flexShrink: 0, alignSelf: 'flex-start' }}>
                    <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1', background: '#0F172A', border: '1px solid #E2E8F0' }}>
                      <ResultImg sources={IMGS.packing} alt="Motorrad-Gepäck" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          )}

          {/* ── 8. Sicherheit + Routenhinweise ──────────────────────────── */}
          {Array.isArray(aiResult.safetyTips) && aiResult.safetyTips.length > 0 && (
            <section style={{ background: '#F8FAFF', paddingTop: 'clamp(40px, 5vw, 56px)', paddingBottom: 'clamp(40px, 5vw, 56px)' }}>
              <Container>
                <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%)', borderRadius: '24px', padding: 'clamp(28px, 4vw, 44px)', position: 'relative', overflow: 'hidden' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', top: '-20%', right: '-6%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(14,165,233,0.16)', border: '1px solid rgba(14,165,233,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', flexShrink: 0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 6px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Immer beachten</p>
                      <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>Sicherheitstipps</h2>
                    </div>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
                    {aiResult.safetyTips.map((tip, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(14,165,233,0.20)', border: '1px solid rgba(14,165,233,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#38BDF8', flexShrink: 0, marginTop: '1px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{i + 1}</span>
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.65 }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {Array.isArray(aiResult.routeWarnings) && aiResult.routeWarnings.length > 0 && (
                  <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: '20px', padding: 'clamp(20px, 3vw, 28px)', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78350F', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '16px', fontWeight: 800, color: '#78350F', margin: 0 }}>Routenhinweise</h3>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {aiResult.routeWarnings.map((w, i) => (
                        <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#D97706', flexShrink: 0, marginTop: '4px' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                          </span>
                          <span style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.65 }}>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Container>
            </section>
          )}
        </>
      ) : (
        <>
          {/* ══ VARIANTE B – Regelbasiertes Ergebnis ═══════════════════ */}

          {/* Top 3 Regionen */}
          <section style={{ background: '#F1F5F9', paddingTop: 'clamp(40px, 5vw, 60px)', paddingBottom: '40px' }}>
            <Container>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Empfehlungen für dich</p>
                <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                  Deine Top 3 Regionen
                </h2>
              </div>
              <div className="mrv-regions-grid">
                {regions.map((region, i) => (
                  <div key={region.name} className="mrv-region-card">
                    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '28px', height: '28px', borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' : i === 1 ? '#94A3B8' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{i + 1}</div>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{region.country}</p>
                    <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.02em' }}>{region.name}</h3>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: '0 0 16px' }}>{region.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {region.highlights.map(h => (
                        <span key={h} style={{ fontSize: '12px', fontWeight: 600, background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '3px 10px' }}>{h}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Beste Reisezeit: <strong style={{ color: '#0F172A' }}>{region.bestTime}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* Tagesetappen + Reisezeit */}
          <section style={{ background: '#F1F5F9', paddingBottom: '40px' }}>
            <Container>
              <div className="mrv-info-grid">
                <div className="mrv-info-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Empfohlene Tagesetappen</h3>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#0EA5E9', margin: '0 0 12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{kmPerDay} pro Tag</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {etappen.map((e, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F0F9FF', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#0EA5E9', flexShrink: 0, marginTop: '1px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{i + 1}</span>
                        <span style={{ fontSize: '14px', color: '#475569', lineHeight: 1.55 }}>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mrv-info-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Beste Reisezeit</h3>
                  </div>
                  <p style={{ fontSize: '15px', color: '#0F172A', fontWeight: 600, lineHeight: 1.65, margin: '0 0 16px' }}>{bestTime}</p>
                  <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Unterkunftsempfehlung</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{accommodation.label}</p>
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: '0 0 8px' }}>{accommodation.description}</p>
                    <p style={{ fontSize: '12px', color: '#0EA5E9', margin: 0, fontStyle: 'italic' }}>{accommodation.tip}</p>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* Packliste (kategorisiert) */}
          <section style={{ background: '#FFFFFF', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
            <Container>
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Checkliste</p>
                <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Motorrad-Packliste</h2>
              </div>
              <div className="mrv-packing-grid">
                {PACKING_LIST.map(cat => (
                  <div key={cat.category} style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 22px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{cat.category}</p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {cat.items.map(item => (
                        <li key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#0EA5E9', marginTop: '3px', flexShrink: 0 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span>
                          <span style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* Sicherheitstipps */}
          <section style={{ background: '#F8FAFF', paddingTop: 'clamp(40px, 5vw, 56px)', paddingBottom: 'clamp(40px, 5vw, 56px)' }}>
            <Container>
              <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%)', borderRadius: '24px', padding: 'clamp(28px, 4vw, 44px)', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden="true" style={{ position: 'absolute', top: '-20%', right: '-6%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(14,165,233,0.16)', border: '1px solid rgba(14,165,233,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 6px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Immer beachten</p>
                    <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>Sicherheitstipps</h2>
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
                  {SAFETY_TIPS.map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(14,165,233,0.20)', border: '1px solid rgba(14,165,233,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#38BDF8', flexShrink: 0, marginTop: '1px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{i + 1}</span>
                      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.65 }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        </>
      )}

      {/* ── Reset ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#F1F5F9', paddingTop: '32px', paddingBottom: '48px' }}>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>Andere Präferenzen? Starte den Planungshelfer neu.</p>
            <button type="button" onClick={onReset} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
              Neu starten
            </button>
          </div>
        </Container>
      </section>
    </>
  );
}
