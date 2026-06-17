'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plane } from 'lucide-react';

const EDGE_FADE =
  'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 13%, rgba(255,255,255,0) 87%, rgba(255,255,255,0.92) 100%),' +
  'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 13%, rgba(255,255,255,0) 87%, rgba(255,255,255,0.92) 100%)';

export default function HowItWorksImage({
  src,
  alt,
  loading = 'lazy',
  variant = 'default',
  style = {},
}) {
  const [error, setError] = useState(false);
  const isStep = variant === 'step';

  // ── Fallback ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{
        width: '100%',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)',
        border: '1.5px solid #BFDBFE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '40px 20px',
        aspectRatio: isStep ? '1/1' : undefined,
        minHeight: isStep ? undefined : '180px',
        overflow: 'hidden',
        ...style,
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(14,165,233,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Plane size={26} strokeWidth={1.5} color="#0EA5E9" />
        </div>
        <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500, textAlign: 'center', maxWidth: '200px' }}>
          {alt}
        </span>
      </div>
    );
  }

  // ── Step variant: 1:1, contain, edge-fade overlay ─────────────────────────
  if (isStep) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#FFFFFF',
        ...style,
      }}>
        <Image
          src={src}
          alt={alt}
          fill
          loading={loading}
          onError={() => setError(true)}
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Soft edge-fade overlay — fades all four edges to white */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: EDGE_FADE,
          }}
        />
      </div>
    );
  }

  // ── Default variant: 16/9, cover ──────────────────────────────────────────
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',
      borderRadius: '20px',
      overflow: 'hidden',
      ...style,
    }}>
      <Image
        src={src}
        alt={alt}
        fill
        loading={loading}
        onError={() => setError(true)}
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
      />
    </div>
  );
}
