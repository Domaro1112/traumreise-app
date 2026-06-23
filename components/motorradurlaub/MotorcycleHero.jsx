import Container from '@/components/layout/Container';

export default function MotorcycleHero() {
  return (
    <>
      <style>{`
        .moto-hero-bg {
          background-position: right center;
        }
        .moto-hero-overlay {
          background: linear-gradient(
            to right,
            rgba(15,23,42,0.82) 0%,
            rgba(15,23,42,0.58) 42%,
            rgba(15,23,42,0.14) 72%,
            transparent 100%
          );
        }
        @media (max-width: 768px) {
          .moto-hero-bg {
            background-position: 68% center;
          }
          .moto-hero-overlay {
            background: linear-gradient(
              to bottom,
              rgba(15,23,42,0.62) 0%,
              rgba(15,23,42,0.52) 60%,
              rgba(15,23,42,0.72) 100%
            );
          }
          .moto-hero-content {
            max-width: 100% !important;
            padding-top: 60px !important;
            padding-bottom: 60px !important;
          }
          .moto-hero-h1 {
            font-size: clamp(30px, 8vw, 48px) !important;
          }
          .moto-hero-btns {
            flex-direction: column !important;
          }
          .moto-hero-btns a {
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>

      <section
        className="moto-hero-bg"
        style={{
          position: 'relative',
          minHeight: 'clamp(520px, 75vh, 780px)',
          backgroundImage: 'url(/images/motorradurlaub/motorradurlaub-hero.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          className="moto-hero-overlay"
          style={{ position: 'absolute', inset: 0 }}
        />

        <Container>
          <div
            className="moto-hero-content"
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '540px',
              paddingTop: '80px',
              paddingBottom: '80px',
            }}
          >
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

            <h1
              className="moto-hero-h1"
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(34px, 5.5vw, 60px)',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '0 0 22px',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
            >
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

            <div
              className="moto-hero-btns"
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
            >
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
      </section>
    </>
  );
}
