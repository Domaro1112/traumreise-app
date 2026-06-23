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

export default function MotorcycleResultView({ answers, onReset }) {
  const result = computeResult(answers);
  const { profile, regions, bestTime, accommodation, etappen, kmPerDay, duration } = result;

  const primaryRegion = regions[0]?.name ?? 'Motorradurlaub';
  const searchTerm = `Motorradhotel ${primaryRegion}`;

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
        @media (max-width: 840px) {
          .mrv-regions-grid {
            grid-template-columns: 1fr;
          }
          .mrv-affiliate-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 620px) {
          .mrv-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── Profile header ─────────────────────────────────────────── */}
      <section style={{ background: '#F1F5F9', paddingTop: 'clamp(40px, 6vw, 64px)', paddingBottom: '40px' }}>
        <Container size="sm">
          <div className="mrv-profile">
            {/* Decorative glow */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: '-30%', right: '-8%',
              width: '360px', height: '360px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 68%)',
              pointerEvents: 'none',
            }} />

            {/* Badge */}
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
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
              lineHeight: 1.12,
              position: 'relative', zIndex: 1,
            }}>
              {profile.label}
            </h1>

            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.65,
              margin: '0 auto 28px',
              maxWidth: '480px',
              position: 'relative', zIndex: 1,
            }}>
              {profile.description}
            </p>

            {/* Summary chips */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '10px',
              justifyContent: 'center',
              position: 'relative', zIndex: 1,
            }}>
              {[
                { label: 'Reisedauer', value: duration },
                { label: 'Tagesziel', value: kmPerDay },
                { label: 'Beste Zeit', value: bestTime.split('–')[0].trim() + (bestTime.includes('–') ? '–...' : '') },
              ].map(chip => (
                <div key={chip.label} style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  textAlign: 'left',
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
                {/* Rank badge */}
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

                {/* Highlights */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {region.highlights.map(h => (
                    <span key={h} style={{
                      fontSize: '12px', fontWeight: 600,
                      background: '#F0F9FF', color: '#0369A1',
                      border: '1px solid #BAE6FD',
                      borderRadius: '8px', padding: '3px 10px',
                    }}>
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
            {/* Tagesetappen */}
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

            {/* Beste Reisezeit */}
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

              {/* Unterkunft */}
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

      {/* ── Affiliate ──────────────────────────────────────────────── */}
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

      {/* ── Reset ──────────────────────────────────────────────────── */}
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
