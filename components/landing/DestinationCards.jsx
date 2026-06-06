'use client';

import { useState } from 'react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import { destinations } from '@/data/destinations';
import { formatPrice } from '@/lib/utils';

const BADGE_STYLES = {
  Beliebt:    { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Traumziel:  { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  Geheimtipp: { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Trending:   { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
};

const DEFAULT_BADGE = { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };

function DestinationCard({ destination }) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE_STYLES[destination.badge] ?? DEFAULT_BADGE;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: `1px solid ${hovered ? '#BAE6FD' : '#E2E8F0'}`,
        boxShadow: hovered
          ? '0 20px 60px rgba(14,165,233,0.20), 0 4px 16px rgba(14,165,233,0.10)'
          : '0 2px 12px rgba(15,23,42,0.06)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image — 62 % of card height */}
      <div
        style={{
          position: 'relative',
          height: '260px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition: 'transform 0.55s ease',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Subtle gradient so badge is always legible */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(15,23,42,0.18) 0%, transparent 40%, rgba(15,23,42,0.12) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            background: badge.bg,
            border: `1px solid ${badge.border}`,
            color: badge.color,
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {destination.badge}
        </div>

        {/* Country pill — bottom-right of image */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '14px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            color: '#0EA5E9',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          }}
        >
          {destination.country}
        </div>
      </div>

      {/* Content — flex: 1 ensures equal height across all cards */}
      <div
        style={{
          padding: '20px 22px 22px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Name */}
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '20px',
            fontWeight: 700,
            color: '#0F172A',
            marginBottom: '6px',
            lineHeight: 1.25,
          }}
        >
          {destination.name}
        </h3>

        {/* Description — flex: 1 pushes price to the bottom */}
        <p
          style={{
            fontSize: '13px',
            color: '#64748B',
            lineHeight: 1.65,
            marginBottom: '0',
            flex: 1,
          }}
        >
          {destination.description}
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: '#F1F5F9',
            margin: '16px 0',
          }}
        />

        {/* Price + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Price block */}
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginBottom: '3px' }}>
              ab
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#0F172A',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {formatPrice(destination.priceFrom)}
              </span>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>€</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginTop: '2px' }}>
              pro Person
            </div>
          </div>

          {/* CTA pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '11px 18px',
              borderRadius: '14px',
              background: hovered
                ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                : '#F0F9FF',
              border: `1.5px solid ${hovered ? 'transparent' : '#BAE6FD'}`,
              color: hovered ? '#FFFFFF' : '#0284C7',
              fontSize: '13px',
              fontWeight: 700,
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              letterSpacing: '0.01em',
              boxShadow: hovered ? '0 4px 16px rgba(14,165,233,0.35)' : 'none',
            }}
          >
            Entdecken
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DestinationCards() {
  return (
    <section
      style={{
        background: '#FFFFFF',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      <Container>
        <SectionTitle
          label="Lass dich von uns inspirieren"
          title="Traumziele, die zu dir"
          titleHighlight="passen könnten"
          subtitle="Von tropischen Stränden bis zu pulsierenden Metropolen — wir kennen das perfekte Ziel für jeden Reisetyp."
        />

        <div className="destinations-grid">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button href="/inspiration" variant="secondary" size="lg">
            Zeig mir mehr Inspiration →
          </Button>
        </div>
      </Container>
    </section>
  );
}
