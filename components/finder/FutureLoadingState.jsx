'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const MSGS = [
  'Dein Reise-Ich wird erschaffen...',
  'Wir verbinden deine Stimmung mit passenden Orten...',
  'Deine alternative Reisegeschichte entsteht...',
  'Fast fertig – dein Fernweh bekommt ein Ziel...',
];

export default function FutureLoadingState() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setMsgIdx(m => (m + 1) % MSGS.length), 1900);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'clamp(64px, 12vw, 110px) 0',
        animation: 'fadeIn .4s ease',
      }}
    >
      {/* Dual-ring spinner */}
      <div
        style={{
          position: 'relative',
          width: '92px',
          height: '92px',
          margin: '0 auto 32px',
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid #EDE9FE',
            borderTopColor: '#A78BFA',
            borderRadius: '50%',
            animation: 'spin 1.2s linear infinite',
          }}
        />
        {/* Inner ring (reverse) */}
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '2px solid #DDD6FE',
            borderBottomColor: '#7C3AED',
            borderRadius: '50%',
            animation: 'spin 0.85s linear infinite reverse',
          }}
        />
        {/* Center icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={28} strokeWidth={1.5} color="#A78BFA" />
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '18px',
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
        }}
      >
        Dein Reise-Ich entsteht
      </div>

      {/* Cycling message */}
      <div
        key={msgIdx}
        style={{
          fontSize: '14px',
          color: '#64748B',
          fontStyle: 'italic',
          fontWeight: 500,
          minHeight: '22px',
          animation: 'fadeIn 0.45s ease',
        }}
      >
        {MSGS[msgIdx]}
      </div>

      {/* Progress dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '26px',
        }}
      >
        {MSGS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === msgIdx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === msgIdx ? '#A78BFA' : '#E2E8F0',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
