'use client';

import Container from '@/components/layout/Container';
import { partners } from '@/data/features';

function StarRating({ rating = 4.8 }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i < full || (i === full && hasHalf) ? '#00B67A' : 'rgba(255,255,255,0.15)'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function PartnerTrustSection() {
  return (
    <section
      style={{
        background: '#07070f',
        paddingTop: '72px',
        paddingBottom: '72px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '40px',
          }}
        >
          {/* Partners */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '24px',
              }}
            >
              Wir vergleichen für dich die besten Anbieter
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              {partners.map((p) => (
                <span
                  key={p.id}
                  style={{
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: p.id === 'skyscanner' ? '-0.5px' : '0',
                    transition: 'color 0.2s',
                    cursor: 'default',
                    fontStyle: p.id === 'trivago' ? 'italic' : 'normal',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')
                  }
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Trustpilot badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
              padding: '24px 28px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              minWidth: '200px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Trustpilot star icon */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  background: '#00B67A',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '1px',
                }}
              >
                Trustpilot
              </span>
            </div>
            <StarRating rating={4.8} />
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#fff',
                  display: 'block',
                }}
              >
                4,8/5
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                basierend auf 1.200+ Bewertungen
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
