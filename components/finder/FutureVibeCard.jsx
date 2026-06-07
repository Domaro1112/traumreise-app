'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function FutureVibeCard({ imageUrl, Icon, label, subtitle, color, selected, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={selected}
      style={{
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        border: `2.5px solid ${selected ? color : hovered ? `${color}66` : '#E2E8F0'}`,
        cursor: 'pointer',
        padding: 0,
        background: 'none',
        fontFamily: 'inherit',
        display: 'block',
        width: '100%',
        aspectRatio: '4/3',
        boxShadow: selected
          ? `0 8px 32px ${color}44, 0 0 0 3px ${color}18`
          : hovered
          ? `0 6px 24px ${color}28`
          : '0 2px 12px rgba(15,23,42,0.06)',
        transform: hovered || selected ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        outline: 'none',
      }}
    >
      {/* Background image with hover zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.55s ease',
        }}
      />

      {/* Dark gradient for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* Selected color wash */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `${color}22`,
          }}
        />
      )}

      {/* Check mark (top-right) */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 10px ${color}70`,
          }}
        >
          <CheckCircle2 size={16} strokeWidth={2.5} color="#FFFFFF" />
        </div>
      )}

      {/* Label + icon (bottom) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '9px',
        }}
      >
        {/* Icon bubble */}
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: selected ? color : 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.25s ease',
          }}
        >
          {Icon && <Icon size={17} strokeWidth={1.5} color="#FFFFFF" />}
        </div>

        <div style={{ textAlign: 'left', minWidth: 0 }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 1px 5px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {label}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.78)',
                fontWeight: 500,
                marginTop: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
