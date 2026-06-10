'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  'Reisemonkey durchsucht die ganze Welt für dich…',
  'Deine perfekten Reiseziele werden ausgewählt…',
  'Traumziele werden auf deine Wünsche zugeschnitten…',
  'Fast fertig – deine Top 3 Reiseideen sind gleich da!',
];

const IMAGES = [
  '/images/funnel/funnel-01.jpg',
  '/images/funnel/funnel-02.jpg',
  '/images/funnel/funnel-03.jpg',
  '/images/funnel/funnel-04.jpg',
  '/images/funnel/funnel-05.jpg',
  '/images/funnel/funnel-06.jpg',
];

export default function TravelFunnelLoading() {
  const [msgIdx,    setMsgIdx]    = useState(0);
  const [imgIdx,    setImgIdx]    = useState(0);
  const [progress,  setProgress]  = useState(8);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const mi = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2400);
    const ii = setInterval(() => setImgIdx(i => (i + 1) % IMAGES.length), 1600);
    const pi = setInterval(() => setProgress(p => Math.min(p + Math.random() * 10, 92)), 450);
    return () => { clearInterval(mi); clearInterval(ii); clearInterval(pi); };
  }, []);

  const hasImages = IMAGES.some((_, i) => !imgErrors[i]);

  return (
    <div style={{ textAlign: 'center', padding: 'clamp(32px, 6vw, 56px) 20px' }}>

      {/* Image cycling – hidden if all images fail */}
      {hasImages && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
            margin: '0 auto 36px',
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)',
          }}
        >
          {IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              onError={() => setImgErrors(e => ({ ...e, [i]: true }))}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: i === imgIdx && !imgErrors[i] ? 1 : 0,
                transition: 'opacity 0.7s ease',
                display: imgErrors[i] ? 'none' : 'block',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 50%, rgba(4,16,40,0.35) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Spinner */}
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          animation: 'spin 1.6s linear infinite',
          boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
        }}
      >
        <Sparkles size={26} strokeWidth={2} color="#fff" />
      </div>

      {/* Message */}
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(15px, 2.5vw, 19px)',
          fontWeight: 700,
          color: '#0F172A',
          margin: '0 0 6px',
          minHeight: '28px',
        }}
      >
        {MESSAGES[msgIdx]}
      </p>
      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '28px' }}>
        Das dauert nur einen Moment.
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '300px',
          margin: '0 auto',
          height: '6px',
          borderRadius: '3px',
          background: '#E2E8F0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '3px',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #0EA5E9 0%, #06B6D4 100%)',
            transition: 'width 0.45s ease',
          }}
        />
      </div>
      <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
        {Math.round(progress)}% abgeschlossen
      </p>
    </div>
  );
}
