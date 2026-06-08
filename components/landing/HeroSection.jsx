import Image from 'next/image';
import { Gift, Bot, ShieldCheck, Plane, Sparkles } from 'lucide-react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { trustBadges } from '@/data/features';

const TRUST_ICON_MAP = { Gift, Bot, ShieldCheck };

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '72px',
        paddingBottom: '0',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A1628 0%, #0E2246 40%, #0B2D5E 75%, #0F3570 100%)',
        minHeight: '88vh',
      }}
    >
      {/* Subtle radial glow behind image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 75% 50%, rgba(14,165,233,0.14) 0%, transparent 58%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

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
          pointerEvents: 'none',
        }}
      />

      <Container
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: '48px',
          paddingBottom: '110px',
          width: '100%',
        }}
      >
        <div className="hero-split">
          {/* ── Text column ─────────────────────────── */}
          <div className="hero-text-col">
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
              <Sparkles size={14} strokeWidth={2} />
              Deine Reiseplanung — kostenlos &amp; sofort buchbar
            </div>

            {/* Main heading */}
            <h1
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(34px, 5.5vw, 64px)',
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
              className="hero-subtitle"
              style={{
                fontSize: 'clamp(15px, 2vw, 19px)',
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.75,
                fontWeight: 400,
              }}
            >
              Wir finden in wenigen Minuten deine Reiseziele, Hotels und Erlebnisse,
              die wirklich zu dir passen.
            </p>

            {/* CTA buttons */}
            <div
              className="hero-ctas"
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '40px',
              }}
            >
              <Button href="/finder" size="lg">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plane size={18} strokeWidth={2} />
                  Traumreise finden
                </span>
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
              className="hero-trust"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(16px, 3vw, 40px)',
                flexWrap: 'wrap',
              }}
            >
              {trustBadges.map((badge) => {
                const Icon = TRUST_ICON_MAP[badge.icon];
                return (
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
                    {Icon && <Icon size={17} strokeWidth={2} color="rgba(255,255,255,0.88)" />}
                    {badge.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Image column ─────────────────────────── */}
          <div className="hero-image-col">
            <Image
              src="/images/hero/reisemonkey-hero.png"
              alt="Reisemonkey – zeigt auf deine nächste Traumreise"
              width={1672}
              height={941}
              loading="eager"
              preload={true}
              fetchPriority="high"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.45), 0 8px 32px rgba(14,165,233,0.18)',
                display: 'block',
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
