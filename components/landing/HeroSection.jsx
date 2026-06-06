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
        paddingTop: '72px',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          zIndex: 0,
        }}
      />

      {/* Gradient overlay — dark luxury */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(7,7,15,0.5) 0%, rgba(7,7,15,0.55) 40%, rgba(7,7,15,0.85) 80%, #07070f 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container style={{ position: 'relative', zIndex: 2, paddingTop: '60px', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '20px',
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.25)',
              marginBottom: '28px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#FFD700',
            }}
          >
            ✦ Traumreise AI ✦
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: 700,
              margin: '0 0 8px',
              lineHeight: 1.1,
              color: '#fff',
            }}
          >
            Deine Traumreise.
          </h1>
          <h2
            style={{
              fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(28px, 4.5vw, 52px)',
              fontWeight: 700,
              margin: '0 0 28px',
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Persönlich. Einzigartig. KI-basiert.
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.75,
              marginBottom: '40px',
              fontWeight: 300,
            }}
          >
            Erzähl uns von dir – unsere KI findet dein perfektes Reiseziel
            <br />
            inkl. Hotels, Flügen &amp; Aktivitäten – auf dich abgestimmt.
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(16px, 4vw, 40px)',
              flexWrap: 'wrap',
              marginBottom: '48px',
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
                  color: 'rgba(255,255,255,0.75)',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: '18px' }}>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/finder" size="lg">
              Traumreise finden ✈️
            </Button>
            <Button href="#so-funktionierts" variant="secondary" size="lg">
              Wie es funktioniert
            </Button>
          </div>
        </div>
      </Container>

      {/* Subtle bottom fade into next section */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, #07070f)',
          zIndex: 2,
        }}
      />
    </section>
  );
}
