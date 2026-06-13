'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Share2, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { zukunftVibeOptions } from '@/data/finderOptions';
import { getDestinationImage } from '@/data/destinationImages';

function TypewriterText({ text, speed = 16, onDone }) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const pos = useRef(0);

  useEffect(() => {
    setShown('');
    setDone(false);
    pos.current = 0;
    const iv = setInterval(() => {
      pos.current++;
      setShown(text.slice(0, pos.current));
      if (pos.current >= text.length) {
        clearInterval(iv);
        setDone(true);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span>
      {shown}
      {!done && <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>}
    </span>
  );
}

export default function FutureStoryResult({
  cur,
  idx,
  total,
  color,
  VibeIcon,
  onNext,
  onPrev,
  onNavigate,
  onReset,
  onShare,
}) {
  const [textDone, setTextDone] = useState(false);
  const [showBtns, setShowBtns] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);

  const vibe = zukunftVibeOptions.find(v => v.id === cur.vibe);
  const vibeFallback = (vibe?.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80')
    .replace('w=600', 'w=1400')
    .replace('q=80', 'q=88');
  // Destination-specific image first; vibe image as last-resort fallback
  const heroUrl = getDestinationImage(cur.destination, vibeFallback, cur.country, {
    vibe: cur.vibe,
    resultType: 'future-self',
  });
  const vibeLabel = vibe?.label || '';

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[affiliate-links]', {
        destination: cur.destination,
        country: cur.country,
        bookingUrl: cur.bookingUrl,
        trivagoUrl: cur.trivagoUrl,
        skyscannerUrl: cur.skyUrl,
        getYourGuideUrl: cur.gygUrl,
        check24Url: cur.check24Url,
      });
    }
  }, []);

  const goUrl = (provider, rawUrl) =>
    rawUrl ? `/go/${provider}?url=${encodeURIComponent(rawUrl)}` : '#';

  const affiliateLinks = [
    { href: goUrl('trivago',      cur.trivagoUrl), label: 'Hotels auf Trivago',        bg: 'linear-gradient(90deg,#d00e17,#ff4d57)' },
    { href: goUrl('booking',      cur.bookingUrl), label: 'Hotel auf Booking.com',     bg: 'linear-gradient(90deg,#003580,#0057b8)' },
    { href: goUrl('skyscanner',   cur.skyUrl),     label: 'Flüge auf Skyscanner',      bg: 'linear-gradient(90deg,#0770e3,#00a0de)' },
    { href: goUrl('getyourguide', cur.gygUrl),     label: 'Aktivitäten GetYourGuide',  bg: 'linear-gradient(90deg,#FF5533,#FF8C00)' },
    { href: goUrl('check24',      cur.check24Url), label: 'Pauschalreise CHECK24',     bg: 'linear-gradient(90deg,#003399,#e30613)' },
  ];

  return (
    <div style={{ animation: 'fadeUp .42s cubic-bezier(0.16, 1, 0.3, 1) both' }}>

      {/* ── Hero Image ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          height: 'clamp(300px, 42vw, 480px)',
          marginBottom: '0',
          boxShadow: `0 24px 80px ${color}28, 0 4px 20px rgba(15,23,42,0.12)`,
        }}
      >
        {/* Photo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />

        {/* Luminance gradient — dark bottom, subtle top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.14) 35%, rgba(0,0,0,0.70) 80%, rgba(0,0,0,0.82) 100%)',
          }}
        />

        {/* Subtle color wash */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `${color}1a`,
            mixBlendMode: 'soft-light',
          }}
        />

        {/* Top-left: counter badge */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '20px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(15,23,42,0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.22)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            color: '#FFFFFF',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Reise-Ich {idx + 1} von {total}
        </div>

        {/* Top-right: vibe label */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: `${color}cc`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            color: '#FFFFFF',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <VibeIcon size={11} strokeWidth={2.5} />
          {vibeLabel}
        </div>

        {/* Bottom: destination name */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'clamp(22px, 4vw, 36px)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(34px, 7vw, 60px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}
          >
            {cur.destination}
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.78)',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
            }}
          >
            <MapPin size={11} strokeWidth={2.5} />
            {cur.country}
          </div>
        </div>
      </div>

      {/* ── Navigation Bar ───────────────────────────────────────────────────── */}
      {total > 1 && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '12px 16px',
            margin: '14px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
          }}
        >
          {/* Prev */}
          <button
            onClick={idx > 0 ? onPrev : undefined}
            disabled={idx === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: `1.5px solid ${idx === 0 ? '#E2E8F0' : `${color}55`}`,
              background: idx === 0 ? '#F8FAFF' : `${color}0d`,
              color: idx === 0 ? '#CBD5E1' : color,
              cursor: idx === 0 ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              transition: 'all 0.18s',
              opacity: idx === 0 ? 0.4 : 1,
            }}
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
          </button>

          {/* Dots + counter */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                title={`Reise-Ich ${i + 1}`}
                style={{
                  width: i === idx ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: i === idx ? color : '#CBD5E1',
                  cursor: i === idx ? 'default' : 'pointer',
                  padding: 0,
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  flexShrink: 0,
                }}
              />
            ))}
            <span
              style={{
                marginLeft: '6px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#94A3B8',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
              }}
            >
              {idx + 1} / {total}
            </span>
          </div>

          {/* Next */}
          <button
            onClick={idx < total - 1 ? onNext : undefined}
            disabled={idx === total - 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: `1.5px solid ${idx === total - 1 ? '#E2E8F0' : `${color}55`}`,
              background: idx === total - 1 ? '#F8FAFF' : `${color}0d`,
              color: idx === total - 1 ? '#CBD5E1' : color,
              cursor: idx === total - 1 ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              transition: 'all 0.18s',
              opacity: idx === total - 1 ? 0.4 : 1,
            }}
          >
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ── Story Card ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #F1F5F9',
          boxShadow: '0 4px 32px rgba(15,23,42,0.06)',
          padding: 'clamp(24px, 5vw, 40px)',
          marginBottom: '16px',
        }}
      >
        {/* Large opening quote + identity title */}
        <div style={{ position: 'relative', marginBottom: '28px', paddingBottom: '24px', borderBottom: `1.5px solid ${color}18` }}>
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-6px',
              fontSize: '80px',
              lineHeight: 1,
              color: `${color}1a`,
              fontFamily: 'Georgia, "Times New Roman", serif',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              margin: 0,
              paddingLeft: '12px',
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              fontStyle: 'italic',
              color: '#334155',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {cur.identity_title}
          </p>
        </div>

        {/* Story (typewriter) */}
        <div
          style={{
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            lineHeight: 1.92,
            color: '#1E293B',
            marginBottom: '24px',
          }}
        >
          <TypewriterText
            text={cur.story}
            speed={16}
            onDone={() => {
              setTextDone(true);
              setTimeout(() => setShowBtns(true), 320);
            }}
          />
        </div>

        {/* Magic moment */}
        {textDone && (
          <div
            style={{
              background: `linear-gradient(135deg, ${color}0e 0%, ${color}06 100%)`,
              border: `1.5px solid ${color}28`,
              borderRadius: '16px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              animation: 'fadeUp .45s ease both',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: `${color}16`,
                border: `1.5px solid ${color}2c`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={15} strokeWidth={2} color={color} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color,
                  marginBottom: '6px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Dein magischer Moment
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '15px',
                  color: '#1E293B',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                }}
              >
                {cur.moment}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Booking + Share ─────────────────────────────────────────────────── */}
      {showBtns && (
        <div style={{ animation: 'fadeUp .45s ease both' }}>
          {/* Section header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: '#94A3B8',
                fontFamily: 'var(--font-heading)',
                whiteSpace: 'nowrap',
              }}
            >
              Buche dieses Leben
            </span>
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
          </div>

          {/* Affiliate 2-col grid */}
          <div className="future-affiliate-grid" style={{ marginBottom: '8px' }}>
            {affiliateLinks.slice(0, 4).map(btn => (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '13px 10px',
                  background: btn.bg,
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'center',
                  transition: 'opacity 0.18s, transform 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {btn.label}
              </a>
            ))}
          </div>
          <a
            href={affiliateLinks[4].href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '13px',
              background: affiliateLinks[4].bg,
              color: '#FFFFFF',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '12px',
              transition: 'opacity 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {affiliateLinks[4].label}
          </a>

          <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', marginBottom: '24px' }}>
            * Affiliate-Links — für dich entstehen keine Mehrkosten
          </div>

          {/* Social share section */}
          <div
            style={{
              background: 'linear-gradient(135deg, #F8FAFF 0%, #F0F9FF 100%)',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '22px 24px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '4px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Teile dein Reise-Ich
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.55 }}>
              {cur.destination} wartet. Zeig anderen, wer du auf Reisen sein kannst.
            </div>
            <button
              onClick={onShare}
              onMouseEnter={() => setShareHovered(true)}
              onMouseLeave={() => setShareHovered(false)}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: `1.5px solid ${shareHovered ? color : `${color}40`}`,
                background: shareHovered ? `${color}12` : '#FFFFFF',
                color: shareHovered ? color : '#475569',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <Share2 size={15} strokeWidth={2} />
              Teilen
            </button>
          </div>

          {/* Reset */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onReset}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'inherit',
                padding: '8px',
              }}
            >
              ← Neu starten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
