'use client';

import Link from 'next/link';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import { destinations } from '@/data/destinations';
import { formatPrice } from '@/lib/utils';

const BADGE_COLORS = {
  Beliebt: { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Neu: { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Exklusiv: { bg: '#EFF6FF', border: '#BFDBFE', color: '#0284C7' },
};

function DestinationCard({ destination }) {
  const badgeStyle = BADGE_COLORS[destination.badge] ?? BADGE_COLORS['Beliebt'];

  return (
    <div
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 16px rgba(15,23,42,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,165,233,0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(15,23,42,0.06)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: badgeStyle.bg,
            border: `1px solid ${badgeStyle.border}`,
            color: badgeStyle.color,
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          }}
        >
          {destination.badge}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 22px 24px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '19px',
            fontWeight: 700,
            color: '#0F172A',
            marginBottom: '3px',
          }}
        >
          {destination.name}
        </h3>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#0EA5E9',
            marginBottom: '10px',
          }}
        >
          {destination.country}
        </div>
        <p
          style={{
            fontSize: '14px',
            color: '#64748B',
            lineHeight: 1.6,
            marginBottom: '16px',
          }}
        >
          {destination.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>ab </span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
              {formatPrice(destination.priceFrom)} €
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}> p.P.</span>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(14,165,233,0.35)',
            }}
          >
            →
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
          label="Lass dich inspirieren"
          title="Traumziele, die zu dir"
          titleHighlight="passen könnten"
          subtitle="Von tropischen Stränden bis zu pulsierenden Metropolen — unsere KI kennt das perfekte Ziel für jeden Reisetyp."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button href="/inspiration" variant="secondary" size="lg">
            Mehr Inspiration entdecken ✈️
          </Button>
        </div>
      </Container>
    </section>
  );
}
