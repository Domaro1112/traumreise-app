'use client';

import Container from '@/components/layout/Container';
import { partners } from '@/data/features';

export default function PartnerTrustSection() {
  return (
    <section
      style={{
        background: '#F8FAFF',
        paddingTop: '64px',
        paddingBottom: '64px',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <Container>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#94A3B8',
              marginBottom: '20px',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}
          >
            Wir vergleichen für dich die besten Anbieter
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '28px',
            }}
          >
            {partners.map((p) => (
              <span
                key={p.id}
                style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  fontWeight: 700,
                  color: '#CBD5E1',
                  letterSpacing: p.id === 'skyscanner' ? '-0.5px' : '0',
                  transition: 'color 0.2s',
                  cursor: 'default',
                  fontStyle: p.id === 'trivago' ? 'italic' : 'normal',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#475569')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
