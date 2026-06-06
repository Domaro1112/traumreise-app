'use client';

import Link from 'next/link';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import { destinations } from '@/data/destinations';
import { formatPrice } from '@/lib/utils';

function DestinationCard({ destination }) {
  return (
    <div
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 24px 60px rgba(255,180,0,0.12)';
        e.currentTarget.style.border = '1px solid rgba(255,215,0,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
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
        {/* Gradient overlay on image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, transparent 50%, rgba(7,7,15,0.7) 100%)',
          }}
        />
        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            background: 'rgba(255,215,0,0.15)',
            border: '1px solid rgba(255,215,0,0.4)',
            color: '#FFD700',
            backdropFilter: 'blur(8px)',
          }}
        >
          {destination.badge}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 22px 24px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '4px',
          }}
        >
          {destination.name}
        </h3>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#FFD700',
            marginBottom: '10px',
          }}
        >
          {destination.country}
        </div>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.6,
            marginBottom: '16px',
          }}
        >
          {destination.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>ab </span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {formatPrice(destination.priceFrom)} €
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}> p.P.</span>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,215,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFD700',
              fontSize: '16px',
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
        background: 'linear-gradient(180deg, #07070f 0%, #0a0e1a 100%)',
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
    >
      <Container>
        <SectionTitle
          label="Lass dich inspirieren"
          title="Traumziele, die zu dir"
          titleHighlight="passen könnten"
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
