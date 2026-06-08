'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Share2, CheckCircle2, MapPin,
  ArrowLeft, ArrowRight,
} from 'lucide-react';

function TypewriterText({ text, speed = 18, onDone }) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setShown('');
    setDone(false);
    idx.current = 0;
    const iv = setInterval(() => {
      idx.current++;
      setShown(text.slice(0, idx.current));
      if (idx.current >= text.length) {
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
      {!done && (
        <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
      )}
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

  const affiliateLinks = [
    {
      href: cur.trivagoUrl,
      label: 'Hotels auf Trivago',
      bg: 'linear-gradient(90deg,#d00e17,#ff4d57)',
    },
    {
      href: cur.bookingUrl,
      label: 'Hotel auf Booking.com',
      bg: 'linear-gradient(90deg,#003580,#0057b8)',
    },
    {
      href: cur.skyUrl,
      label: 'Flüge auf Skyscanner',
      bg: 'linear-gradient(90deg,#0770e3,#00a0de)',
    },
    {
      href: cur.gygUrl,
      label: 'Aktivitäten GetYourGuide',
      bg: 'linear-gradient(90deg,#FF5533,#FF8C00)',
    },
    {
      href: cur.check24Url,
      label: 'Pauschalreise CHECK24',
      bg: 'linear-gradient(90deg,#003399,#e30613)',
    },
  ];

  return (
    <div style={{ animation: 'fadeIn .5s ease' }}>
      {/* Story card */}
      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          border: `1.5px solid ${color}30`,
          boxShadow: `0 8px 48px ${color}1a, 0 2px 12px rgba(15,23,42,0.06)`,
          marginBottom: '20px',
          background: '#FFFFFF',
        }}
      >
        {/* Hero strip with vibe color + icon */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(140px, 18vw, 200px)',
            background: `linear-gradient(160deg, ${color}22 0%, ${color}12 50%, ${color}08 100%)`,
            borderBottom: `1px solid ${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Decorative radial glow */}
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Counter badge (top-left) */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '16px',
              padding: '5px 14px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: `1.5px solid ${color}30`,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              color,
              fontFamily: 'var(--font-heading)',
            }}
          >
            Dein Reise-Ich · #{idx + 1} von {total}
          </div>

          {/* Center: icon + name */}
          <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: `${color}18`,
                border: `2px solid ${color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: `0 6px 24px ${color}28`,
              }}
            >
              <VibeIcon size={28} strokeWidth={1.5} color={color} />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
              }}
            >
              {cur.destination}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                fontSize: '12px',
                color,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              <MapPin size={11} strokeWidth={2} />
              {cur.country}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
          {/* Identity title */}
          <div
            style={{
              borderLeft: `3px solid ${color}`,
              paddingLeft: '14px',
              fontSize: '16px',
              fontStyle: 'italic',
              color: '#475569',
              lineHeight: 1.5,
              marginBottom: '20px',
            }}
          >
            „{cur.identity_title}"
          </div>

          {/* Typewriter story */}
          <div
            style={{
              fontSize: '15px',
              lineHeight: 1.85,
              color: '#1E293B',
              marginBottom: '20px',
              minHeight: '80px',
            }}
          >
            <TypewriterText
              text={cur.story}
              speed={18}
              onDone={() => {
                setTextDone(true);
                setTimeout(() => setShowBtns(true), 400);
              }}
            />
          </div>

          {/* Magic moment */}
          {textDone && (
            <div
              style={{
                background: `${color}0e`,
                border: `1px solid ${color}2a`,
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'fadeUp .5s ease',
              }}
            >
              <Sparkles
                size={16}
                strokeWidth={2}
                color={color}
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <span
                style={{
                  fontSize: '15px',
                  color,
                  fontStyle: 'italic',
                  fontWeight: 600,
                  lineHeight: 1.6,
                }}
              >
                {cur.moment}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Result navigation (always visible when multiple results) ──────── */}
      {total > 1 && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
          }}
        >
          {/* Dot indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                title={`Reise-Ich ${i + 1}`}
                style={{
                  width: i === idx ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  background: i === idx ? color : '#CBD5E1',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Prev / counter / Next row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <button
              onClick={idx > 0 ? onPrev : undefined}
              disabled={idx === 0}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '11px 14px',
                borderRadius: '12px',
                border: `1.5px solid ${idx === 0 ? '#E2E8F0' : `${color}44`}`,
                background: idx === 0 ? '#F8FAFF' : `${color}08`,
                color: idx === 0 ? '#CBD5E1' : color,
                fontWeight: 700,
                fontSize: '13px',
                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                opacity: idx === 0 ? 0.5 : 1,
              }}
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              Vorheriges
            </button>

            <div
              style={{
                flexShrink: 0,
                fontSize: '12px',
                fontWeight: 700,
                color: '#64748B',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.5px',
              }}
            >
              {idx + 1} / {total}
            </div>

            <button
              onClick={idx < total - 1 ? onNext : undefined}
              disabled={idx === total - 1}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '11px 14px',
                borderRadius: '12px',
                border: `1.5px solid ${idx === total - 1 ? '#E2E8F0' : `${color}44`}`,
                background: idx === total - 1 ? '#F8FAFF' : `${color}08`,
                color: idx === total - 1 ? '#CBD5E1' : color,
                fontWeight: 700,
                fontSize: '13px',
                cursor: idx === total - 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                opacity: idx === total - 1 ? 0.5 : 1,
              }}
            >
              Nächstes
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Booking section */}
      {showBtns && (
        <div style={{ animation: 'fadeUp .5s ease' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: '#64748B',
              textAlign: 'center',
              marginBottom: '14px',
            }}
          >
            Buche dieses Leben
          </div>

          {/* 2-col affiliate grid */}
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
                  padding: '12px 10px',
                  background: btn.bg,
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'center',
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '.88';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {btn.label}
              </a>
            ))}
          </div>
          {/* Last button full-width */}
          <a
            href={affiliateLinks[4].href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              background: affiliateLinks[4].bg,
              color: '#FFFFFF',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {affiliateLinks[4].label}
          </a>

          {/* Note */}
          <div
            style={{
              fontSize: '11px',
              color: '#94A3B8',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            * Affiliate-Links — für dich entstehen keine Mehrkosten
          </div>

          {/* Action row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <button
              onClick={onShare}
              onMouseEnter={() => setShareHovered(true)}
              onMouseLeave={() => setShareHovered(false)}
              style={{
                flex: 1,
                padding: '13px',
                borderRadius: '12px',
                border: `2px solid ${shareHovered ? '#CBD5E1' : '#E2E8F0'}`,
                background: shareHovered ? '#F8FAFF' : '#FFFFFF',
                color: '#475569',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                transition: 'all 0.2s',
              }}
            >
              <Share2 size={14} strokeWidth={2} />
              Teilen
            </button>
          </div>

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
