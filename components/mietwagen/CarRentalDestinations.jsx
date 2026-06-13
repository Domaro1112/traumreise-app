'use client';

import SectionTitle from '@/components/ui/SectionTitle';
import { CAR_RENTAL_DESTINATIONS, buildCheck24CarRentalUrl } from '@/lib/car-rental-config';

export default function CarRentalDestinations() {
  return (
    <section style={{ padding: 'clamp(60px, 7vw, 96px) 0', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        <SectionTitle
          label="Beliebte Ziele"
          title="Mietwagen-Reiseziele"
          titleHighlight="weltweit"
          subtitle="Diese Ziele sind besonders beliebt bei Mietwagen-Urlaubern – entdecke sie auf eigene Faust."
          align="center"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
          marginTop: '40px',
        }}>
          {CAR_RENTAL_DESTINATIONS.map((dest) => {
            const carUrl = buildCheck24CarRentalUrl({ pickupLocation: dest.searchQuery });
            const href = `/go/check24?url=${encodeURIComponent(carUrl)}`;
            return (
              <a
                key={dest.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '22px 20px',
                  border: '1.5px solid #E2E8F0',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(15,23,42,0.12)';
                  e.currentTarget.style.borderColor = '#BAE6FD';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.06)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px', lineHeight: 1 }}>{dest.flag}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                  {dest.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, marginBottom: '10px' }}>
                  {dest.country}
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7, margin: '0 0 14px' }}>
                  {dest.description}
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>
                  Mietwagen suchen →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
