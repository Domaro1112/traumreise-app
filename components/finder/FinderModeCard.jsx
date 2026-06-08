'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinderModeCard({
  imageUrl,
  color,
  badge,
  title,
  description,
  ctaLabel,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#FFFFFF',
        borderRadius: '24px',
        overflow: 'hidden',
        border: `2px solid ${hovered ? color : '#E2E8F0'}`,
        cursor: 'pointer',
        textAlign: 'left',
        padding: 0,
        fontFamily: 'inherit',
        display: 'block',
        width: '100%',
        boxShadow: hovered
          ? `0 24px 64px ${color}28, 0 6px 24px rgba(15,23,42,0.08)`
          : '0 2px 20px rgba(15,23,42,0.07)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        outline: 'none',
      }}
    >
      {/* Image section */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(180px, 22vw, 260px)',
          overflow: 'hidden',
        }}
      >
        {/* Background image with zoom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.55s ease',
          }}
        />

        {/* Bottom gradient for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {/* Color tint overlay on hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `${color}22`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Badge (top-right) */}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              padding: '4px 14px',
              borderRadius: '20px',
              background: color,
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
            }}
          >
            {badge}
          </div>
        )}


      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px 26px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(17px, 2vw, 20px)',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 8px',
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#64748B',
            lineHeight: 1.68,
            margin: '0 0 18px',
          }}
        >
          {description}
        </p>

        {/* CTA row */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            borderRadius: '12px',
            background: hovered ? color : `${color}12`,
            border: `1.5px solid ${hovered ? color : `${color}28`}`,
            fontSize: '13px',
            fontWeight: 700,
            color: hovered ? '#FFFFFF' : color,
            transition: 'all 0.25s ease',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {ctaLabel}
          <ArrowRight
            size={14}
            strokeWidth={2.5}
            style={{
              transform: hovered ? 'translateX(3px)' : 'translateX(0)',
              transition: 'transform 0.25s ease',
            }}
          />
        </div>
      </div>
    </button>
  );
}
