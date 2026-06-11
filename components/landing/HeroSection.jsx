import Image from 'next/image';
import { Gift, Bot, ShieldCheck, Plane, Sparkles } from 'lucide-react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { trustBadges } from '@/data/features';

const TRUST_ICON_MAP = { Gift, Bot, ShieldCheck };

export default function HeroSection() {
  return (
    <section className="hero-fullwidth">
      {/* ── Background image – full browser width, no container ── */}
      <Image
        src="/images/hero/reisemonkey-hero.png"
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        className="hero-bg-img"
        style={{
          objectFit: 'cover',
          objectPosition: 'center 65%',
          zIndex: 0,
        }}
      />

      {/* ── Gradient overlay (text readable left, monkey emerges right) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(4,16,40,0.85) 0%, rgba(4,16,40,0.60) 35%, rgba(4,16,40,0.20) 65%, rgba(4,16,40,0.05) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Bottom fade into page ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to bottom, transparent, #FFFFFF)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content block – left-aligned ── */}
      <Container
        style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '72px',
        }}
      >
        <div style={{ maxWidth: '600px', width: '100%' }}>
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
            Deine Reiseplanung beginnt hier — kostenlos &amp; sofort buchbar
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(36px, 5.5vw, 72px)',
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
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.75,
              marginBottom: '44px',
              fontWeight: 400,
              maxWidth: '520px',
            }}
          >
            Wir finden in wenigen Minuten deine Reiseziele, Hotels und Erlebnisse,
            die wirklich zu dir passen.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '48px',
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
              Dein Weg zur Traumreise
            </Button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(20px, 4vw, 48px)',
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
      </Container>
    </section>
  );
}
