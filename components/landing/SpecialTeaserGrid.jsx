import Container from '@/components/layout/Container';

const CARDS = [
  {
    href: '/urlaub-fuer-alleinerziehende',
    eyebrow: 'Für Alleinerziehende',
    heading: 'Urlaub für\nAlleinerziehende',
    description: 'Stressfreier reisen mit Kind: Reiseideen mit kurzen Wegen, familienfreundlichen Unterkünften und fairer Budgetplanung.',
    cta: 'Mehr erfahren',
    backgroundImage: '/images/urlaub-fuer-alleinerziehende-hero.jpg',
    backgroundPosition: 'center 20%',
    // Fallback gradient shown when image fails to load
    fallbackGradient: 'linear-gradient(145deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%)',
    overlay: 'linear-gradient(to top, rgba(10,20,38,0.94) 0%, rgba(10,20,38,0.72) 45%, rgba(10,20,38,0.48) 80%, rgba(10,20,38,0.36) 100%)',
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
    backgroundImage: '/images/motorradurlaub/motorradurlaub-hero.png',
    backgroundPosition: '68% center',
    fallbackGradient: 'linear-gradient(145deg, #0F172A 0%, #0c2840 55%, #0a3352 100%)',
    overlay: 'linear-gradient(to top, rgba(10,20,38,0.94) 0%, rgba(10,20,38,0.68) 45%, rgba(10,20,38,0.42) 80%, rgba(10,20,38,0.28) 100%)',
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
          transition: transform 0.20s ease, box-shadow 0.20s ease;
          box-shadow: 0 4px 24px rgba(15,23,42,0.22);
          background-size: cover;
          background-repeat: no-repeat;
          min-height: 320px;
        }
        .stg-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(15,23,42,0.32);
        }
        @media (max-width: 680px) {
          .stg-grid {
            grid-template-columns: 1fr;
          }
          .stg-card {
            min-height: 280px;
          }
        }
      `}</style>

      <section className="stg-section">
        <Container>
          <div className="stg-grid">
            {CARDS.map(({ href, eyebrow, heading, description, cta, backgroundImage, backgroundPosition, fallbackGradient, overlay, icon }) => (
              <a
                key={href}
                href={href}
                className="stg-card"
                style={{
                  backgroundImage: `url(${backgroundImage}), ${fallbackGradient}`,
                  backgroundPosition: `${backgroundPosition}, center`,
                }}
              >
                {/* Dark overlay for text legibility */}
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0,
                  background: overlay,
                  pointerEvents: 'none',
                  zIndex: 0,
                }} />

                {/* Decorative blue glow accent */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: '-20%', right: '-6%',
                  width: '280px', height: '280px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 68%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />

                {/* Icon */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: 'rgba(14,165,233,0.18)',
                  border: '1px solid rgba(14,165,233,0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#38BDF8',
                  marginBottom: '20px',
                  flexShrink: 0,
                  position: 'relative', zIndex: 2,
                }}>
                  {icon}
                </div>

                {/* Eyebrow */}
                <p style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 10px',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  position: 'relative', zIndex: 2,
                }}>
                  {eyebrow}
                </p>

                {/* Heading */}
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(22px, 2.8vw, 30px)', fontWeight: 800,
                  color: '#FFFFFF', margin: '0 0 14px', lineHeight: 1.18,
                  letterSpacing: '-0.02em',
                  position: 'relative', zIndex: 2,
                  whiteSpace: 'pre-line',
                  textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                }}>
                  {heading}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7,
                  margin: '0 0 28px',
                  position: 'relative', zIndex: 2,
                  flexGrow: 1,
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}>
                  {description}
                </p>

                {/* CTA */}
                <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '12px 22px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF',
                    fontSize: '14px', fontWeight: 700,
                    boxShadow: '0 6px 20px rgba(14,165,233,0.40)',
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
