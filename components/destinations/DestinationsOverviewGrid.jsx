'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
const TRAVEL_TYPES = ['Strand', 'Stadt', 'Natur', 'Abenteuer', 'Familie', 'Luxus'];

function DestinationCard({ dest }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/reiseziele/${dest.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          boxShadow: hovered ? '0 16px 48px rgba(15,23,42,0.14)' : '0 4px 20px rgba(15,23,42,0.07)',
          transform: hovered ? 'translateY(-5px)' : 'none',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image / Gradient */}
        <div
          style={{
            height: '180px',
            backgroundImage: `url('${dest.heroImage}'), ${dest.heroGradient}`,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.28)' }} />

          {/* Travel type chips */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {dest.travelType.slice(0, 2).map(t => (
              <span
                key={t}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.92)',
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '20px',
                  padding: '3px 9px',
                  letterSpacing: '0.5px',
                }}
              >
                {t}
              </span>
            ))}
            {dest.isPlaceholder && (
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.80)', background: 'rgba(0,0,0,0.30)', borderRadius: '20px', padding: '3px 9px' }}>
                Demnächst
              </span>
            )}
          </div>

          {/* Name at bottom */}
          <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: '22px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {dest.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <MapPin size={11} strokeWidth={2} color="rgba(255,255,255,0.80)" />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {dest.country}
                {dest.region ? ` · ${dest.region}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: '0 0 14px' }}>
            {dest.shortDescription}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0EA5E9', fontSize: '13px', fontWeight: 700 }}>
            {dest.isPlaceholder ? 'Bald verfügbar' : 'Ziel entdecken'}
            <ArrowRight size={13} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DestinationsOverviewGrid({ destinations }) {
  const [activeFilter, setActiveFilter] = useState('Alle');

  const filtered = activeFilter === 'Alle'
    ? destinations
    : destinations.filter(d => d.travelType.includes(activeFilter));

  const filters = ['Alle', ...TRAVEL_TYPES];

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: activeFilter === f ? '2px solid #0EA5E9' : '1.5px solid #E2E8F0',
              background: activeFilter === f ? '#EFF6FF' : '#FFFFFF',
              color: activeFilter === f ? '#0284C7' : '#64748B',
              fontSize: '13px',
              fontWeight: activeFilter === f ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            {f}
            {f !== 'Alle' && (
              <span style={{ marginLeft: '5px', fontSize: '11px', opacity: 0.7 }}>
                ({destinations.filter(d => d.travelType.includes(f)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {filtered.map(dest => (
          <DestinationCard key={dest.slug} dest={dest} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
          <p style={{ fontSize: '16px' }}>Keine Reiseziele für diesen Filter gefunden.</p>
        </div>
      )}
    </div>
  );
}
