'use client';

import { useState } from 'react';

export default function ContactHeroImage() {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      width: '300px', maxWidth: '100%', aspectRatio: '1',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(14,165,233,0.18) 0%, rgba(8,15,30,0.60) 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 24px 80px rgba(14,165,233,0.20)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Fallback icon */}
      <svg
        width="80" height="80" viewBox="0 0 24 24" fill="none"
        stroke="rgba(56,189,248,0.30)" strokeWidth="0.8"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', inset: 0, margin: 'auto' }}
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
      {!imgError && (
        <img
          src="/images/contact/reisemonkey-contact-hero.png"
          alt="Reisemonkey Kontakt"
          loading="eager"
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }}
        />
      )}
    </div>
  );
}
