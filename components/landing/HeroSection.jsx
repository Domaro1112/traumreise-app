import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { trustBadges } from '@/data/features';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '68px',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
          zIndex: 0,
        }}
      />

      {/* Light gradient overlay — lets the photo breathe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.4) 50%, rgba(15,23,42,0.65) 80%, rgba(15,23,42,0.85) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container style={{ position: 'relative', zIndex: 2, paddingTop: '60px', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 20px',
              borderRadius: '24px',
              background: 'rgba(14,165,233,0.25)',
              border: '1px solid rgba(14,165,233,0.5)',
              backdropFilter: 'blur(8px)',
              marginBottom: '28px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#fff',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}
          >
            ✨ Deine Reiseplanung — kostenlos &amp; sofort
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(36px, 6.5vw, 72px)',
              fontWeight: 800,
              margin: '0 0 20px',
              lineHeight: 1.1,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            Finde deine perfekte
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #38BDF8 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Traumreise
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.75,
              marginBottom: '44px',
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto 44px',
            }}
          >
            Wir finden in wenigen Minuten deine Reiseziele, Hotels und Erlebnisse,
            die wirklich zu dir passen.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Button href="/finder" size="lg">
              Traumreise finden ✈️
            </Button>
            <Button
              href="#so-funktionierts"
              size="lg"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#fff',
                boxShadow: 'none',
              }}
            >
              Wie es funktioniert
            </Button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(20px, 4vw, 48px)',
              flexWrap: 'wrap',
            }}
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.88)',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: '18px' }}>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom fade into white */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, #FFFFFF)',
          zIndex: 2,
        }}
      />
    </section>
  );
}
