'use client';

import { useState } from 'react';

export default function PartnerHeroImage() {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      width: '320px', maxWidth: '100%', aspectRatio: '1',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(14,165,233,0.18) 0%, rgba(8,15,30,0.60) 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 24px 80px rgba(14,165,233,0.20)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Fallback SVG (shown when image is missing or errors) */}
      <svg
        width="90" height="90" viewBox="0 0 24 24" fill="none"
        stroke="rgba(56,189,248,0.28)" strokeWidth="0.8"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', inset: 0, margin: 'auto' }}
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>

      {!imgError && (
        <img
          src="/images/partner/reisemonkey-partner-hero.png"
          alt="Reisemonkey Partner"
          loading="eager"
          onError={() => setImgError(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain',
            position: 'relative', zIndex: 1,
          }}
        />
      )}
    </div>
  );
}
