import Container from '@/components/layout/Container';

const CARDS = [
  {
    href: '/urlaub-fuer-alleinerziehende',
    eyebrow: 'Für Alleinerziehende',
    heading: 'Urlaub für\nAlleinerziehende',
    description: 'Stressfreier reisen mit Kind: Reiseideen mit kurzen Wegen, familienfreundlichen Unterkünften und fairer Budgetplanung.',
    cta: 'Mehr erfahren',
    gradient: 'linear-gradient(145deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%)',
    glowColor: 'rgba(14,165,233,0.14)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 8l-4 4-4-4"/><path d="M18 4v8"/>
      </svg>
    ),
  },
  {
    href: '/motorradurlaub',
    eyebrow: 'Auf zwei Rädern',
    heading: 'Motorradurlaub\ngeplant?',
    description: 'Entdecke passende Routen, Reiseziele und praktische Tipps für deinen Urlaub auf zwei Rädern.',
    cta: 'Jetzt entdecken',
    gradient: 'linear-gradient(145deg, #0F172A 0%, #0c2840 55%, #0a3352 100%)',
    glowColor: 'rgba(14,165,233,0.12)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17l4-8 4 4 4-6 4 10"/><path d="M21 17H3"/>
      </svg>
    ),
  },
];

export default function SpecialTeaserGrid() {
  return (
    <>
      <style>{`
        .stg-section {
          background: #F1F5F9;
          padding-top: clamp(48px, 6vw, 72px);
          padding-bottom: clamp(48px, 6vw, 72px);
        }
        .stg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .stg-card {
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          padding: clamp(28px, 4vw, 44px);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 4px 24px rgba(15,23,42,0.18);
        }
        .stg-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(15,23,42,0.28);
        }
        @media (max-width: 680px) {
          .stg-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="stg-section">
        <Container>
          <div className="stg-grid">
            {CARDS.map(({ href, eyebrow, heading, description, cta, gradient, glowColor, icon }) => (
              <a key={href} href={href} className="stg-card" style={{ background: gradient }}>

                {/* Decorative glow */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: '-25%', right: '-8%',
                  width: '320px', height: '320px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
                  pointerEvents: 'none',
                }} />

                {/* Icon */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: 'rgba(14,165,233,0.14)',
                  border: '1px solid rgba(14,165,233,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#38BDF8',
                  marginBottom: '20px',
                  flexShrink: 0,
                  position: 'relative', zIndex: 1,
                }}>
                  {icon}
                </div>

                {/* Eyebrow */}
                <p style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 10px',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  position: 'relative', zIndex: 1,
                }}>
                  {eyebrow}
                </p>

                {/* Heading */}
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(22px, 2.8vw, 30px)', fontWeight: 800,
                  color: '#FFFFFF', margin: '0 0 14px', lineHeight: 1.18,
                  letterSpacing: '-0.02em',
                  position: 'relative', zIndex: 1,
                  whiteSpace: 'pre-line',
                }}>
                  {heading}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '14px', color: '#94A3B8', lineHeight: 1.7,
                  margin: '0 0 28px',
                  position: 'relative', zIndex: 1,
                  flexGrow: 1,
                }}>
                  {description}
                </p>

                {/* CTA */}
                <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '12px 22px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF',
                    fontSize: '14px', fontWeight: 700,
                    boxShadow: '0 6px 20px rgba(14,165,233,0.35)',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    whiteSpace: 'nowrap',
                  }}>
                    {cta}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </div>

              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
