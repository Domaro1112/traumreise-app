'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  'ApeAround analysiert deine Wünsche…',
  'Passende Traumziele werden gesucht…',
  'Beste Reisezeiten werden geprüft…',
  'Geheimtipps werden verglichen…',
  'Traumreisen werden vorbereitet…',
  'Fast geschafft…',
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
  const [progress,  setProgress]  = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const mi = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 1800);
    const ii = setInterval(() => setImgIdx(i => (i + 1) % IMAGES.length), 2400);
    const pi = setInterval(() => setProgress(p => {
      const remaining = 88 - p;
      if (remaining <= 0) return p;
      return p + Math.max(0.12, remaining * 0.042);
    }), 250);
    return () => { clearInterval(mi); clearInterval(ii); clearInterval(pi); };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: 'clamp(28px, 5vw, 48px) clamp(20px, 4vw, 40px)' }}>

      {/*
        Image carousel.

        Layout-Shift-Schutz:
        - Äußeres div: feste Breite via min(78vw, 480px) — vw statt % vermeidet
          Abhängigkeit vom Flex-Parent-Kontext.
        - Spacer-div mit paddingBottom: 75% erzeugt exakt 4:3-Verhältnis ohne
          aspect-ratio CSS-Property (funktioniert in allen Browsern zuverlässig).
          paddingBottom % ist immer relativ zur eigenen Breite — stabil.
        - Inhalt-div position: absolute inset:0 → füllt den durch den Spacer
          aufgespannten Raum exakt aus.
        - Container wird IMMER gerendert (kein condtional auf hasImages) → kein
          Sprung wenn alle Bilder fehlschlagen; Gradient-Fallback ist sichtbar.
        - Bilder nur über opacity wechseln — kein width/height/scale wird animiert.
        - display:none nur bei Fehler, sonst immer block — verhindert Reflow durch
          nachträgliches display-Toggle.
      */}
      <div style={{
        width: 'min(78vw, 480px)',
        margin: '0 auto 32px',
      }}>
        {/* Spacer: paddingBottom 75% = 4:3 Seitenverhältnis — niemals von Bildgröße abhängig */}
        <div style={{ position: 'relative', paddingBottom: '75%' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #1E3A5F 0%, #0369A1 100%)',
            overflow: 'hidden',
          }}>
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
                  objectPosition: 'center',
                  // Nur opacity animieren — niemals Dimensionen
                  opacity: i === imgIdx && !imgErrors[i] ? 1 : 0,
                  transition: 'opacity 0.7s ease-in-out',
                  // display:none bei Fehler, sonst immer block
                  display: imgErrors[i] ? 'none' : 'block',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Spinner */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 18px',
        animation: 'spin 1.6s linear infinite',
        boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
      }}>
        <Sparkles size={24} strokeWidth={2} color="#fff" />
      </div>

      {/*
        Nachricht: feste Mindesthöhe für 2 Zeilen, damit auch längere Texte
        keinen Sprung erzeugen. Flex-Zentrierung hält den Text vertikal stabil.
      */}
      <p style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(15px, 2.5vw, 19px)', fontWeight: 700,
        color: '#0F172A', margin: '0 0 5px',
        minHeight: '2.6em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {MESSAGES[msgIdx]}
      </p>
      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '26px' }}>
        Das dauert nur einen Moment.
      </p>

      {/* Progress bar */}
      <div style={{
        width: '100%', maxWidth: '280px', margin: '0 auto',
        height: '6px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '3px',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #0EA5E9 0%, #06B6D4 100%)',
          transition: 'width 0.25s linear',
        }} />
      </div>
      <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
        Deine Traumreise wird vorbereitet…
      </p>
    </div>
  );
}
