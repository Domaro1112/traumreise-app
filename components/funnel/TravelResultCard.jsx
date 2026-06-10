'use client';

import { MapPin, Clock, Wallet, CheckCircle2, ExternalLink, Plane, Hotel } from 'lucide-react';
import { getPrimaryProviders } from '@/lib/affiliate-config';

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
  'linear-gradient(135deg, #059669 0%, #34D399 100%)',
];

export default function TravelResultCard({ destination, index, sessionId, onAffiliateClick }) {
  const providers = getPrimaryProviders(
    destination.affiliateSearchIntent || destination.name,
    destination.country
  );

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: CARD_GRADIENTS[index % 3],
          padding: '24px 24px 20px',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '3px 10px',
            fontSize: '10px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Vorschlag {index + 1}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(20px, 3.5vw, 26px)',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
          }}
        >
          {destination.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} strokeWidth={2} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            {destination.country}
            {destination.region ? ` · ${destination.region}` : ''}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Why it fits */}
        <div
          style={{
            background: '#F8FAFF',
            borderRadius: '12px',
            padding: '12px 16px',
            borderLeft: '3px solid #0EA5E9',
          }}
        >
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            {destination.fitReason}
          </p>
        </div>

        {/* Story */}
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.8, margin: 0 }}>
          {destination.story}
        </p>

        {/* Highlights */}
        {destination.highlights?.length > 0 && (
          <div>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Highlights
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {destination.highlights.map((h, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 11px',
                    borderRadius: '20px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    fontSize: '12px',
                    color: '#0284C7',
                    fontWeight: 500,
                  }}
                >
                  <CheckCircle2 size={10} strokeWidth={2.5} color="#0EA5E9" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
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

        {/* Affiliate disclaimer */}
        <p
          style={{
            fontSize: '10px',
            color: '#CBD5E1',
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid #F1F5F9',
            lineHeight: 1.5,
          }}
        >
          Einige Links können Affiliate-Links sein. Für dich entstehen keine Mehrkosten.
        </p>
      </div>

      {/* ── CTAs ── */}
      <div style={{ padding: '0 24px 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {providers.map(p => (
          <button
            key={p.id}
            onClick={() => onAffiliateClick(p.id, destination.name, p.url)}
            style={{
              flex: 1,
              minWidth: '110px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px 14px',
              borderRadius: '12px',
              border: `1.5px solid ${p.color}33`,
              background: p.bgColor,
              color: p.color,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'filter 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.94)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            {p.id === 'booking' ? <Hotel size={13} strokeWidth={2} /> : <Plane size={13} strokeWidth={2} />}
            {p.label}
            <ExternalLink size={11} strokeWidth={2} />
          </button>
        ))}
      </div>
    </div>
  );
}
