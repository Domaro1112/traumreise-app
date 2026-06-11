'use client';

import { MapPin, Clock, Wallet, CheckCircle2, ExternalLink } from 'lucide-react';
import { getAllProviders } from '@/lib/affiliate-config';

const CARD_THEMES = [
  {
    gradient: 'linear-gradient(160deg, #0369A1 0%, #0EA5E9 55%, #38BDF8 100%)',
    accent: '#0EA5E9',
    accentBg: '#EFF6FF',
    accentBorder: '#BFDBFE',
    accentText: '#0284C7',
  },
  {
    gradient: 'linear-gradient(160deg, #5B21B6 0%, #7C3AED 55%, #A78BFA 100%)',
    accent: '#7C3AED',
    accentBg: '#F5F3FF',
    accentBorder: '#DDD6FE',
    accentText: '#6D28D9',
  },
  {
    gradient: 'linear-gradient(160deg, #064E3B 0%, #059669 55%, #34D399 100%)',
    accent: '#059669',
    accentBg: '#ECFDF5',
    accentBorder: '#A7F3D0',
    accentText: '#065F46',
  },
];

export default function TravelResultCard({ destination, index, sessionId, onAffiliateClick }) {
  const theme     = CARD_THEMES[index % 3];
  const providers = getAllProviders(
    destination.affiliateSearchIntent || destination.name,
    destination.country
  );

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '22px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(15,23,42,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(15,23,42,0.08)';
      }}
    >
      {/* ── Hero banner ── */}
      <div
        style={{
          background: theme.gradient,
          padding: '32px 26px 24px',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-20px', left: '-20px',
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(4px)',
            borderRadius: '8px',
            padding: '3px 10px',
            fontSize: '10px', fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            marginBottom: '12px', alignSelf: 'flex-start',
          }}
        >
          Vorschlag {index + 1}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 800, color: '#FFFFFF',
            margin: '0 0 8px', letterSpacing: '-0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}
        >
          {destination.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={13} strokeWidth={2} color="rgba(255,255,255,0.85)" />
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
            {destination.country}
            {destination.region ? ` · ${destination.region}` : ''}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Why it fits */}
        <div
          style={{
            background: theme.accentBg, borderRadius: '12px',
            padding: '13px 16px', borderLeft: `3px solid ${theme.accent}`,
          }}
        >
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
            {destination.fitReason}
          </p>
        </div>

        {/* Story */}
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.85, margin: 0 }}>
          {destination.story}
        </p>

        {/* Highlights */}
        {destination.highlights?.length > 0 && (
          <div>
            <p
              style={{
                fontSize: '10px', fontWeight: 700, color: '#94A3B8',
                letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px',
              }}
            >
              Highlights
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {destination.highlights.map((h, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px', borderRadius: '20px',
                    background: theme.accentBg, border: `1px solid ${theme.accentBorder}`,
                    fontSize: '12px', color: theme.accentText, fontWeight: 500,
                  }}
                >
                  <CheckCircle2 size={10} strokeWidth={2.5} color={theme.accent} />
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {destination.bestTravelTime && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} strokeWidth={2} color="#94A3B8" />
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                <strong style={{ color: '#475569' }}>Beste Zeit:</strong>{' '}
                {destination.bestTravelTime}
              </span>
            </div>
          )}
          {destination.budgetHint && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wallet size={12} strokeWidth={2} color="#94A3B8" />
              <span style={{ fontSize: '12px', color: '#64748B' }}>{destination.budgetHint}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Provider CTAs ── */}
      <div
        style={{
          padding: '16px 20px 22px',
          borderTop: '1px solid #F1F5F9',
        }}
      >
        <p
          style={{
            fontSize: '10px', fontWeight: 700, color: '#94A3B8',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Passende Angebote anzeigen:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {providers.map(p => (
            <button
              key={p.id}
              onClick={() => onAffiliateClick(p.id, destination.name, p.url)}
              title={p.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 13px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.07)',
                background: p.bgColor,
                color: p.color,
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'filter 0.15s ease, transform 0.15s ease',
                lineHeight: 1,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter = 'brightness(0.93)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {p.name}
              <ExternalLink size={10} strokeWidth={2.5} />
            </button>
          ))}
        </div>

        <p style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '12px', lineHeight: 1.5 }}>
          Einige Links können Affiliate-Links sein. Für dich entstehen keine Mehrkosten.
        </p>
      </div>
    </div>
  );
}
