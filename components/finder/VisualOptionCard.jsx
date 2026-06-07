'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

export default function VisualOptionCard({ imageUrl, Icon, label, subtitle, selected, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={selected}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `3px solid ${selected ? '#0EA5E9' : 'transparent'}`,
        cursor: 'pointer',
        background: 'none',
        padding: 0,
        aspectRatio: '4 / 3',
        width: '100%',
        display: 'block',
        outline: 'none',
        boxShadow: selected
          ? '0 0 0 3px rgba(14,165,233,0.25), 0 8px 32px rgba(14,165,233,0.22)'
          : hovered
          ? '0 10px 36px rgba(15,23,42,0.18)'
          : '0 2px 14px rgba(15,23,42,0.10)',
        transform: hovered ? 'translateY(-4px) scale(1.005)' : 'translateY(0) scale(1)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Background image with zoom on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Gradient overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Blue tint when selected */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(14,165,233,0.12)',
          }}
        />
      )}

      {/* Icon badge – top left */}
      {Icon && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: selected ? '#0EA5E9' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            transition: 'background 0.2s',
          }}
        >
          <Icon size={17} strokeWidth={2} color={selected ? '#FFFFFF' : '#374151'} />
        </div>
      )}

      {/* Checkmark – top right (only when selected) */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#0EA5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(14,165,233,0.45)',
          }}
        >
          <Check size={14} strokeWidth={3} color="#FFFFFF" />
        </div>
      )}

      {/* Label – bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '10px 13px 12px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#FFFFFF',
            textShadow: '0 1px 4px rgba(0,0,0,0.55)',
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.82)',
              marginTop: '2px',
              textShadow: '0 1px 3px rgba(0,0,0,0.45)',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
}
