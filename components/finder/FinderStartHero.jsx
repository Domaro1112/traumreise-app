import { Compass, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const TRUST = [
  { Icon: ShieldCheck, label: '100% kostenlos' },
  { Icon: Sparkles,    label: 'kostenlose Analyse' },
  { Icon: Zap,         label: 'Keine Anmeldung nötig' },
];

export default function FinderStartHero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'clamp(280px, 32vw, 420px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background travel image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
        }}
      />

      {/* Light brand overlay — keeps Traumreise helle Optik */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(160deg, rgba(240,249,255,0.88) 0%, rgba(236,254,255,0.84) 40%, rgba(248,250,255,0.91) 70%, rgba(255,255,255,0.97) 100%)',
        }}
      />

      {/* Subtle radial glow – adds depth without heaviness */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          padding: 'clamp(52px, 7vw, 88px) clamp(16px, 4vw, 40px) clamp(44px, 6vw, 72px)',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 20px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1.5px solid #BFDBFE',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#0284C7',
            marginBottom: '22px',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 2px 16px rgba(14,165,233,0.12)',
          }}
        >
          <Compass size={13} strokeWidth={2} />
          Traumreise KI-Finder
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(26px, 4.5vw, 50px)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.025em',
            margin: '0 0 14px',
            lineHeight: 1.1,
          }}
        >
          Finde deine Reise,{' '}
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            die wirklich zu dir passt
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(14px, 1.8vw, 17px)',
            color: '#475569',
            lineHeight: 1.72,
            maxWidth: '560px',
            margin: '0 auto 30px',
          }}
        >
          Ob klassischer Reiseziel-Finder oder emotionales Reise-Zukunfts-Ich –
          starte mit dem Erlebnis, das zu dir passt.
        </p>

        {/* Trust badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(16px, 3.5vw, 36px)',
            flexWrap: 'wrap',
          }}
        >
          {TRUST.map(({ Icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#475569',
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  background: 'rgba(255,255,255,0.90)',
                  border: '1.5px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  boxShadow: '0 1px 6px rgba(14,165,233,0.10)',
                }}
              >
                <Icon size={14} strokeWidth={2} color="#0EA5E9" />
              </div>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background:
            'linear-gradient(to bottom, transparent, rgba(240,249,255,0.6))',
          zIndex: 3,
        }}
      />
    </section>
  );
}
