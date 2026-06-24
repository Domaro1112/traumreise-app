'use client';

import Container from '@/components/layout/Container';
import { computeResult, PACKING_LIST, SAFETY_TIPS } from '@/lib/motorradurlaub-funnel';

const AFFILIATE_PROVIDERS = [
  {
    key: 'booking',
    name: 'Booking.com',
    description: 'Größte Auswahl an Motorradhotels und Pensionen – mit Bewertungen von Motorradreisenden.',
    cta: 'Hotels suchen',
    buildUrl: (search) =>
      `/go/booking?url=${encodeURIComponent(`https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(search)}&lang=de&selected_currency=EUR`)}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'trivago',
    name: 'Trivago',
    description: 'Hotelpreise vergleichen – über 5 Millionen Unterkünfte weltweit auf einen Blick.',
    cta: 'Preise vergleichen',
    buildUrl: (search) =>
      `/go/trivago?url=${encodeURIComponent(`https://www.trivago.de/?query=${encodeURIComponent(search)}&iPathCombination=am`)}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    key: 'holidaycheck',
    name: 'HolidayCheck',
    description: 'Echte Bewertungen von Urlaubern – ideal um motorradfreundliche Unterkünfte zu finden.',
    cta: 'Bewertungen lesen',
    buildUrl: (search) =>
      `/go/holidaycheck?url=${encodeURIComponent(`https://www.holidaycheck.de/hotel-search?terms=${encodeURIComponent(search)}`)}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

const ARROW_RIGHT = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const DIFFICULTY_COLOR = {
  leicht:        { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
  mittel:        { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  anspruchsvoll: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
};

export default function MotorcycleResultView({ answers, onReset, aiResult, aiError }) {
  const result = computeResult(answers);
  const { profile, regions, bestTime, accommodation, etappen, kmPerDay, duration } = result;

  const primaryRegion = aiResult?.recommendedRegion?.name || regions[0]?.name || 'Motorradurlaub';
  const searchTerm = aiResult?.hotelSearchQuery || `Motorradhotel ${primaryRegion}`;

  return (
    <>
      <style>{`
        .mrv-profile {
          background: linear-gradient(135deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%);
          border-radius: 24px;
          padding: clamp(32px, 5vw, 52px);
          position: relative;
          overflow: hidden;
          text-align: center;
          margin-bottom: 40px;
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
        .mrv-packing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .mrv-affiliate-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .mrv-routes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .mrv-itinerary-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
        }
        .mrv-ai-packing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 40px;
        }
        @media (max-width: 840px) {
          .mrv-regions-grid { grid-template-columns: 1fr; }
          .mrv-affiliate-grid { grid-template-columns: 1fr; }
          .mrv-routes-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 620px) {
          .mrv-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          VARIANTE A – KI-Ergebnis vorhanden
      ══════════════════════════════════════════════════════════════════ */}
      {aiResult ? (
        <>
          {/* ── AI Profile header ───────────────────────────────────────── */}
          <section style={{ background: '#F1F5F9', paddingTop: 'clamp(40px, 6vw, 64px)', paddingBottom: '40px' }}>
            <Container size="sm">
              <div className="mrv-profile">
                <div aria-hidden="true" style={{
                  position: 'absolute', top: '-30%', right: '-8%',
                  width: '360px', height: '360px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 68%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(14,165,233,0.15)',
                  border: '1px solid rgba(14,165,233,0.30)',
                  borderRadius: '20px',
                  padding: '4px 16px',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: '#38BDF8',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    KI-Planung · {aiResult.riderProfile?.name || 'Dein Fahrprofil'}
                  </span>
                </div>
                <h1 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(26px, 4.5vw, 40px)',
                  fontWeight: 900, color: '#FFFFFF',
                  margin: '0 0 16px', letterSpacing: '-0.02em',
                  lineHeight: 1.12, position: 'relative', zIndex: 1,
                }}>
                  {aiResult.title}
                </h1>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.65, margin: '0 auto 28px',
                  maxWidth: '520px', position: 'relative', zIndex: 1,
                }}>
                  {aiResult.riderProfile?.description}
                </p>
                {aiResult.summary && (
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.60)',
                    lineHeight: 1.65, margin: '0 auto',
                    maxWidth: '480px', position: 'relative', zIndex: 1,
                    fontStyle: 'italic',
                  }}>
                    {aiResult.summary}
                  </p>
                )}
              </div>
            </Container>
          </section>

          {/* ── Empfohlene Region ───────────────────────────────────────── */}
          {aiResult.recommendedRegion && (
            <section style={{ background: '#F1F5F9', paddingBottom: '40px' }}>
              <Container>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>KI-Empfehlung</p>
                  <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Empfohlene Region
                  </h2>
                </div>
                <div className="mrv-region-card" style={{ maxWidth: '600px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                    {aiResult.recommendedRegion.country}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                    {aiResult.recommendedRegion.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                    {aiResult.recommendedRegion.whyItFits}
                  </p>
                </div>
              </Container>
            </section>
          )}

          {/* ── Top Routen ──────────────────────────────────────────────── */}
          {Array.isArray(aiResult.topRoutes) && aiResult.topRoutes.length > 0 && (
            <section style={{ background: '#F1F5F9', paddingBottom: '40px' }}>
              <Container>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Streckenempfehlungen</p>
                  <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Top Routen
                  </h2>
                </div>
                <div className="mrv-routes-grid">
                  {aiResult.topRoutes.map((route, i) => {
                    const diff = DIFFICULTY_COLOR[route.difficulty] || DIFFICULTY_COLOR.mittel;
                    return (
                      <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: 'clamp(18px, 3vw, 24px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
                          <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                            {route.name}
                          </h3>
                          <span style={{
                            fontSize: '11px', fontWeight: 700,
                            background: diff.bg, color: diff.color,
                            border: `1px solid ${diff.border}`,
                            borderRadius: '8px', padding: '3px 10px',
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}>
                            {route.difficulty}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: 600, margin: '0 0 8px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                          {route.region}
                        </p>
                        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>
                          {route.description}
                        </p>
                        {route.bestFor && (
                          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 6px' }}>
                            <strong style={{ color: '#0F172A' }}>Ideal für:</strong> {route.bestFor}
                          </p>
                        )}
                        {route.notes && (
                          <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>
                            {route.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Container>
            </section>
          )}

          {/* ── Beispiel-Tagesplan ──────────────────────────────────────── */}
          {Array.isArray(aiResult.sampleItinerary) && aiResult.sampleItinerary.length > 0 && (
            <section style={{ background: '#FFFFFF', paddingTop: 'clamp(40px, 5vw, 56px)', paddingBottom: 'clamp(40px, 5vw, 56px)' }}>
              <Container>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Beispiel-Reiseplan</p>
                  <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Dein Tagesplan
                  </h2>
                </div>
                <div className="mrv-itinerary-list">
                  {aiResult.sampleItinerary.map((day) => (
                    <div key={day.day} style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: 'clamp(16px, 3vw, 24px)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.20)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                        fontSize: '13px', fontWeight: 800, color: '#0EA5E9',
                      }}>
                        T{day.day}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', alignItems: 'baseline' }}>
                          <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            {day.title}
                          </h3>
                          {day.approxKm && (
                            <span style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              ca. {day.approxKm}
                            </span>
                          )}
                        </div>
                        {day.routeIdea && (
                          <p style={{ fontSize: '13px', color: '#0EA5E9', margin: '0 0 4px', fontWeight: 600 }}>
                            {day.routeIdea}
                          </p>
                        )}
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Container>
            </section>
          )}

          {/* ── Tageskilometer + Beste Reisezeit ────────────────────────── */}
          <section style={{ background: '#F1F5F9', paddingTop: 'clamp(40px, 5vw, 56px)', paddingBottom: '40px' }}>
            <Container>
              <div className="mrv-info-grid">
                {aiResult.dailyStages && (
                  <div className="mrv-info-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                        </svg>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Empfohlene Tagesetappe
                      </h3>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0EA5E9', margin: '0 0 10px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                      {aiResult.dailyStages.recommendedKmPerDay}
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                      {aiResult.dailyStages.description}
                    </p>
                  </div>
                )}
                {aiResult.bestTravelTime && (
                  <div className="mrv-info-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Beste Reisezeit
                      </h3>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>
                      {aiResult.bestTravelTime.months}
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: '0 0 10px' }}>
                      {aiResult.bestTravelTime.summary}
                    </p>
                    {aiResult.bestTravelTime.weatherNote && (
                      <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                        {aiResult.bestTravelTime.weatherNote}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Container>
          </section>

          {/* ── Unterkunftstipps ─────────────────────────────────────────── */}
          {aiResult.accommodationAdvice && (
            <section style={{ background: '#F1F5F9', paddingBottom: '40px' }}>
              <Container>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Unterkunft</p>
                  <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Unterkunftstipps
                  </h2>
                </div>
                <div className="mrv-info-card" style={{ maxWidth: '600px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                    {aiResult.accommodationAdvice.type}
                  </p>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: '0 0 16px' }}>
                    {aiResult.accommodationAdvice.description}
                  </p>
                  {Array.isArray(aiResult.accommodationAdvice.features) && aiResult.accommodationAdvice.features.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {aiResult.accommodationAdvice.features.map((f, i) => (
                        <span key={i} style={{ fontSize: '12px', fontWeight: 600, background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '3px 10px' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Container>
            </section>
          )}

          {/* ── KI Packliste ─────────────────────────────────────────────── */}
          {Array.isArray(aiResult.packingList) && aiResult.packingList.length > 0 && (
            <section style={{ background: '#FFFFFF', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
              <Container>
                <div style={{ marginBottom: '28px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Checkliste</p>
                  <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Motorrad-Packliste
                  </h2>
                </div>
                <div className="mrv-ai-packing-grid">
                  {aiResult.packingList.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
                      <span style={{ color: '#0EA5E9', marginTop: '2px', flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      <span style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Container>
            </section>
          )}

          {/* ── KI Sicherheitstipps ─────────────────────────────────────── */}
          {Array.isArray(aiResult.safetyTips) && aiResult.safetyTips.length > 0 && (
            <section style={{ background: '#F8FAFF', paddingTop: 'clamp(40px, 5vw, 56px)', paddingBottom: 'clamp(40px, 5vw, 56px)' }}>
              <Container>
                <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%)', borderRadius: '24px', padding: 'clamp(28px, 4vw, 44px)', position: 'relative', overflow: 'hidden' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', top: '-20%', right: '-6%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(14,165,233,0.16)', border: '1px solid rgba(14,165,233,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', flexShrink: 0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 6px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Immer beachten</p>
                      <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>Sicherheitstipps</h2>
                    </div>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
                    {aiResult.safetyTips.map((tip, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(14,165,233,0.20)', border: '1px solid rgba(14,165,233,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#38BDF8', flexShrink: 0, marginTop: '1px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.65 }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Container>
            </section>
          )}

          {/* ── Routenhinweise ───────────────────────────────────────────── */}
          {Array.isArray(aiResult.routeWarnings) && aiResult.routeWarnings.length > 0 && (
            <section style={{ background: '#FFFBEB', paddingTop: 'clamp(32px, 4vw, 48px)', paddingBottom: 'clamp(32px, 4vw, 48px)' }}>
              <Container>
                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '20px', padding: 'clamp(20px, 3vw, 32px)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 800, color: '#92400E', margin: 0, letterSpacing: '-0.01em', alignSelf: 'center' }}>
                      Routenhinweise
                    </h3>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {aiResult.routeWarnings.map((w, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#D97706', flexShrink: 0, marginTop: '3px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                        <span style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.65 }}>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Container>
            </section>
          )}
        </>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════════
              VARIANTE B – Regelbasiertes Ergebnis (Fallback)
          ══════════════════════════════════════════════════════════════ */}

          {aiError && (
            <section style={{ background: '#FFF7ED', paddingTop: '20px', paddingBottom: '4px' }}>
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

          {/* ── Profile header ─────────────────────────────────────────── */}
          <section style={{ background: '#F1F5F9', paddingTop: 'clamp(40px, 6vw, 64px)', paddingBottom: '40px' }}>
            <Container size="sm">
              <div className="mrv-profile">
                <div aria-hidden="true" style={{
                  position: 'absolute', top: '-30%', right: '-8%',
                  width: '360px', height: '360px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 68%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(14,165,233,0.15)',
                  border: '1px solid rgba(14,165,233,0.30)',
                  borderRadius: '20px',
                  padding: '4px 16px',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: '#38BDF8',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    Dein Fahrprofil
                  </span>
                </div>
                <h1 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(28px, 5vw, 44px)',
                  fontWeight: 900, color: '#FFFFFF',
                  margin: '0 0 16px', letterSpacing: '-0.02em',
                  lineHeight: 1.12, position: 'relative', zIndex: 1,
                }}>
                  {profile.label}
                </h1>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.65, margin: '0 auto 28px',
                  maxWidth: '480px', position: 'relative', zIndex: 1,
                }}>
                  {profile.description}
                </p>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '10px',
                  justifyContent: 'center', position: 'relative', zIndex: 1,
                }}>
                  {[
                    { label: 'Reisedauer', value: duration },
                    { label: 'Tagesziel', value: kmPerDay },
                    { label: 'Beste Zeit', value: bestTime.split('–')[0].trim() + (bestTime.includes('–') ? '–...' : '') },
                  ].map(chip => (
                    <div key={chip.label} style={{
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: '12px', padding: '8px 16px', textAlign: 'left',
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{chip.label}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{chip.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>

          {/* ── Top 3 Regionen ─────────────────────────────────────────── */}
          <section style={{ background: '#F1F5F9', paddingBottom: '40px' }}>
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
                    <div style={{
                      position: 'absolute', top: '20px', right: '20px',
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: i === 0
                        ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
                        : i === 1 ? '#94A3B8' : '#CBD5E1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 800, color: '#FFFFFF',
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                      {region.country}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                      {region.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: '0 0 16px' }}>
                      {region.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {region.highlights.map(h => (
                        <span key={h} style={{ fontSize: '12px', fontWeight: 600, background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '3px 10px' }}>
                          {h}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Beste Reisezeit: <strong style={{ color: '#0F172A' }}>{region.bestTime}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* ── Tagesetappen + Reisezeit ───────────────────────────────── */}
          <section style={{ background: '#F1F5F9', paddingBottom: '40px' }}>
            <Container>
              <div className="mrv-info-grid">
                <div className="mrv-info-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Empfohlene Tagesetappen
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0EA5E9', margin: '0 0 12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                    {kmPerDay} pro Tag
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {etappen.map((e, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F0F9FF', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#0EA5E9', flexShrink: 0, marginTop: '1px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: '14px', color: '#475569', lineHeight: 1.55 }}>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mrv-info-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Beste Reisezeit
                    </h3>
                  </div>
                  <p style={{ fontSize: '15px', color: '#0F172A', lineHeight: 1.65, margin: '0 0 16px', fontWeight: 600 }}>
                    {bestTime.split('–')[0]}&nbsp;–&nbsp;{bestTime.split('–')[1] ?? ''}
                  </p>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                    {bestTime}
                  </p>
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                      Unterkunftsempfehlung
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                      {accommodation.label}
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: '0 0 10px' }}>
                      {accommodation.description}
                    </p>
                    <p style={{ fontSize: '12px', color: '#0EA5E9', margin: 0, fontStyle: 'italic' }}>
                      {accommodation.tip}
                    </p>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* ── Packliste ──────────────────────────────────────────────── */}
          <section style={{ background: '#FFFFFF', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
            <Container>
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Checkliste</p>
                <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                  Motorrad-Packliste
                </h2>
              </div>
              <div className="mrv-packing-grid">
                {PACKING_LIST.map(cat => (
                  <div key={cat.category} style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 22px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                      {cat.category}
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {cat.items.map(item => (
                        <li key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#0EA5E9', marginTop: '3px', flexShrink: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                          </span>
                          <span style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* ── Sicherheitstipps ───────────────────────────────────────── */}
          <section style={{ background: '#F8FAFF', paddingTop: 'clamp(40px, 5vw, 56px)', paddingBottom: 'clamp(40px, 5vw, 56px)' }}>
            <Container>
              <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%)', borderRadius: '24px', padding: 'clamp(28px, 4vw, 44px)', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden="true" style={{ position: 'absolute', top: '-20%', right: '-6%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(14,165,233,0.16)', border: '1px solid rgba(14,165,233,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 6px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Immer beachten</p>
                    <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>Sicherheitstipps</h2>
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
                  {SAFETY_TIPS.map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(14,165,233,0.20)', border: '1px solid rgba(14,165,233,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#38BDF8', flexShrink: 0, marginTop: '1px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.65 }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        </>
      )}

      {/* ── Affiliate ──────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <Container>
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>Unterkunft buchen</p>
            <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Passende Unterkünfte finden
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
              Jetzt Motorradhotels in {primaryRegion} suchen und vergleichen.
            </p>
          </div>
          <div className="mrv-affiliate-grid">
            {AFFILIATE_PROVIDERS.map(provider => (
              <div key={provider.key} style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: 'clamp(20px, 3vw, 28px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}>
                    {provider.icon}
                  </div>
                  <p style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {provider.name}
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: '0 0 20px', flexGrow: 1 }}>
                  {provider.description}
                </p>
                <a
                  href={provider.buildUrl(searchTerm)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                    padding: '12px 20px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF', textDecoration: 'none',
                    fontSize: '14px', fontWeight: 700,
                    boxShadow: '0 4px 16px rgba(14,165,233,0.28)',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  {provider.cta}
                  {ARROW_RIGHT}
                </a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '20px', textAlign: 'center', lineHeight: 1.6 }}>
            Bei einer Weiterleitung zu einem Partnerportal kann ApeAround eine Provision erhalten. Für dich entstehen keine zusätzlichen Kosten.{' '}
            <a href="/affiliate-hinweis" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Mehr erfahren</a>
          </p>
        </Container>
      </section>

      {/* ── Reset ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#F1F5F9', paddingTop: '32px', paddingBottom: '48px' }}>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>
              Andere Präferenzen? Starte den Planungshelfer neu.
            </p>
            <button
              type="button"
              onClick={onReset}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF', color: '#0F172A',
                fontSize: '14px', fontWeight: 600,
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              Neu starten
            </button>
          </div>
        </Container>
      </section>
    </>
  );
}
