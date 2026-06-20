'use client';

export default function AlleinerziehendHeroImage() {
  return (
    <div style={{
      width: '320px', maxWidth: '100%', aspectRatio: '1',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 38% 38%, rgba(14,165,233,0.20) 0%, rgba(8,15,30,0.65) 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 24px 80px rgba(14,165,233,0.22)',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Decorative glow ring */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: '12px',
        borderRadius: '50%',
        border: '1px solid rgba(56,189,248,0.12)',
        pointerEvents: 'none',
      }} />

      {/* Illustration */}
      <svg
        width="180" height="180" viewBox="0 0 200 200" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Airplane path (top area) */}
        <path
          d="M130 36 L155 44 L142 51 L137 57 L134 48 Z"
          fill="rgba(56,189,248,0.18)" stroke="#38BDF8" strokeWidth="1.4" strokeLinejoin="round"
        />
        <path d="M142 43 L148 33" stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M137 49 L130 55" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round"/>

        {/* Adult figure — left */}
        {/* Head */}
        <circle cx="78" cy="72" r="14" stroke="rgba(56,189,248,0.85)" strokeWidth="1.8"/>
        {/* Body */}
        <line x1="78" y1="86" x2="78" y2="130" stroke="rgba(56,189,248,0.75)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Left leg */}
        <line x1="78" y1="130" x2="68" y2="150" stroke="rgba(56,189,248,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Right leg */}
        <line x1="78" y1="130" x2="88" y2="150" stroke="rgba(56,189,248,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Left arm */}
        <line x1="78" y1="100" x2="60" y2="118" stroke="rgba(56,189,248,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Right arm → toward child */}
        <line x1="78" y1="100" x2="96" y2="108" stroke="rgba(56,189,248,0.65)" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Child figure — right */}
        {/* Head */}
        <circle cx="116" cy="84" r="10" stroke="rgba(14,165,233,0.85)" strokeWidth="1.8"/>
        {/* Body */}
        <line x1="116" y1="94" x2="116" y2="128" stroke="rgba(14,165,233,0.75)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Left leg */}
        <line x1="116" y1="128" x2="108" y2="150" stroke="rgba(14,165,233,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Right leg */}
        <line x1="116" y1="128" x2="124" y2="150" stroke="rgba(14,165,233,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Left arm → toward parent */}
        <line x1="116" y1="106" x2="96" y2="108" stroke="rgba(14,165,233,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Right arm */}
        <line x1="116" y1="106" x2="130" y2="116" stroke="rgba(14,165,233,0.65)" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Small suitcase */}
        <rect x="53" y="140" width="18" height="14" rx="3" stroke="rgba(56,189,248,0.55)" strokeWidth="1.4"/>
        <path d="M57 140 L57 136 L67 136 L67 140" stroke="rgba(56,189,248,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="62" y1="140" x2="62" y2="154" stroke="rgba(56,189,248,0.35)" strokeWidth="1"/>

        {/* Destination arc / globe suggestion */}
        <path
          d="M40 165 Q100 145 160 165"
          stroke="rgba(14,165,233,0.25)" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"
        />

        {/* Stars / sparkle accents */}
        <circle cx="152" cy="90" r="1.5" fill="rgba(56,189,248,0.45)"/>
        <circle cx="45" cy="80" r="1.2" fill="rgba(56,189,248,0.35)"/>
        <circle cx="160" cy="118" r="1.0" fill="rgba(14,165,233,0.40)"/>
      </svg>
    </div>
  );
}
