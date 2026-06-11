'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  'Reisemonkey analysiert deine Wünsche…',
  'Passende Traumziele werden gesucht…',
  'Beste Reisezeiten werden geprüft…',
  'Geheimtipps werden verglichen…',
  'Traumreisen werden vorbereitet…',
  'Fast geschafft…',
];

export default function TravelFunnelLoading() {
  const [msgIdx,   setMsgIdx]   = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mi = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 1800);
    // Linear progress: reaches ~92% in ~18 s (1.28 per 250 ms)
    const pi = setInterval(() => setProgress(p => Math.min(p + 1.28, 92)), 250);
    return () => { clearInterval(mi); clearInterval(pi); };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: 'clamp(36px, 5vw, 56px) clamp(20px, 4vw, 40px)' }}>

      {/* Spinner */}
      <div
        style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 22px',
          animation: 'spin 1.6s linear infinite',
          boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
        }}
      >
        <Sparkles size={26} strokeWidth={2} color="#fff" />
      </div>

      {/* Cycling message */}
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          fontWeight: 700,
          color: '#0F172A',
          margin: '0 0 6px',
          minHeight: '30px',
        }}
      >
        {MESSAGES[msgIdx]}
      </p>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>
        Das dauert nur einen Moment.
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: '100%', maxWidth: '320px', margin: '0 auto',
          height: '6px', borderRadius: '3px',
          background: '#E2E8F0', overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%', borderRadius: '3px',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #0EA5E9 0%, #06B6D4 100%)',
            transition: 'width 0.25s linear',
          }}
        />
      </div>
      <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
        {Math.round(progress)}% abgeschlossen
      </p>
    </div>
  );
}
