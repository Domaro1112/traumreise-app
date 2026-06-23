import Container from '@/components/layout/Container';
import LandingPageHero from '@/components/layout/LandingPageHero';

export default function MotorcycleHero() {
  return (
    <>
      <style>{`
        .moto-content {
          position: relative;
          z-index: 1;
          max-width: 540px;
          padding-top: clamp(80px, 10vw, 116px);
          padding-bottom: clamp(60px, 8vw, 96px);
        }
        .moto-h1 {
          font-family: var(--font-heading, "Poppins", system-ui, sans-serif);
          font-size: clamp(34px, 5.5vw, 60px);
          font-weight: 900;
          color: #FFFFFF;
          margin: 0 0 22px;
          line-height: 1.08;
          letter-spacing: -0.02em;
        }
        .moto-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .moto-content {
            max-width: 100%;
            padding-top: clamp(80px, 10vw, 100px);
            padding-bottom: 60px;
          }
          .moto-h1 {
            font-size: clamp(30px, 8vw, 48px);
          }
          .moto-btns {
            flex-direction: column;
          }
          .moto-btns a {
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>

      <LandingPageHero
        backgroundImage="/images/motorradurlaub/motorradurlaub-hero.png"
        backgroundPosition="right 20%"
        mobileBackgroundPosition="68% 25%"
        overlayGradient="linear-gradient(to right, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.58) 42%, rgba(15,23,42,0.14) 72%, transparent 100%)"
        mobileOverlayGradient="linear-gradient(to bottom, rgba(15,23,42,0.62) 0%, rgba(15,23,42,0.52) 60%, rgba(15,23,42,0.72) 100%)"
      >
        <Container>
          <div className="moto-content">
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#38BDF8',
              margin: '0 0 18px',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}>
              Auf zwei Rädern durch die Welt
            </p>

            <h1 className="moto-h1">
              Motorradurlaub<br />planen
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.65,
              margin: '0 0 36px',
              maxWidth: '460px',
            }}>
              Finde traumhafte Routen, passende Reiseziele und praktische Tipps
              für deinen Urlaub auf zwei Rädern.
            </p>

            <div className="moto-btns">
              <a
                href="/motorradurlaub/planen"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  boxShadow: '0 6px 28px rgba(14,165,233,0.42)',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  whiteSpace: 'nowrap',
                }}
              >
                Motorradurlaub planen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              <a
                href="/reiseziele"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  border: '1.5px solid rgba(255,255,255,0.28)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  whiteSpace: 'nowrap',
                }}
              >
                Reiseideen entdecken
              </a>
            </div>
          </div>
        </Container>
      </LandingPageHero>
    </>
  );
}
