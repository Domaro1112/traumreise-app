'use client';

import { useState } from 'react';
import { Hotel, Plane, Package, Car } from 'lucide-react';
import { buildCheck24CarRentalUrl } from '@/lib/car-rental-config';

function makeGoUrl(provider, rawUrl) {
  if (!rawUrl) return null;
  return `/go/${provider}?url=${encodeURIComponent(rawUrl)}`;
}

const LINK_CONFIGS = [
  {
    key:      'hotels',
    icon:     Hotel,
    label:    'Hotels vergleichen',
    provider: 'booking',
    getUrl:   dest => dest.bookingUrl,
    color:    '#1D4ED8',
  },
  {
    key:      'flights',
    icon:     Plane,
    label:    'Flüge finden',
    provider: 'skyscanner',
    getUrl:   dest => dest.skyUrl,
    color:    '#0EA5E9',
  },
  {
    key:      'package',
    icon:     Package,
    label:    'Reiseangebote suchen',
    provider: 'check24',
    getUrl:   dest => dest.check24Url,
    color:    '#E2001A',
  },
  {
    key:      'car',
    icon:     Car,
    label:    'Mietwagen prüfen',
    provider: 'check24_mietwagen',
    getUrl:   dest => buildCheck24CarRentalUrl({ pickupLocation: dest.destination }),
    color:    '#DC2626',
  },
];

export default function TravelOfferQuickLinks({ results }) {
  const [idx, setIdx] = useState(0);
  if (!results?.length) return null;

  const dest  = results[Math.min(idx, results.length - 1)];
  const links = LINK_CONFIGS
    .map(cfg => ({ ...cfg, href: makeGoUrl(cfg.provider, cfg.getUrl(dest)) }))
    .filter(l => l.href);

  if (!links.length) return null;

  const title = results.length > 1
    ? `Passende Angebote für ${dest.destination}`
    : 'Passende Angebote zu deiner Reise';

  return (
    <section
      aria-label="Passende Angebote"
      style={{
        background:    '#FFFFFF',
        border:        '1.5px solid #E2E8F0',
        borderRadius:  '20px',
        padding:       'clamp(16px,3vw,22px)',
        marginBottom:  '14px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <p style={{
          fontSize:      '11px',
          fontWeight:    700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         '#0EA5E9',
          margin:        '0 0 3px',
          fontFamily:    'var(--font-heading, "Poppins", system-ui, sans-serif)',
        }}>
          Schnellauswahl
        </p>
        <h2 style={{
          fontSize:      'clamp(15px,2vw,18px)',
          fontWeight:    800,
          color:         '#0F172A',
          margin:        '0 0 4px',
          fontFamily:    'var(--font-heading, "Poppins", system-ui, sans-serif)',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
          Vergleiche Hotels, Flüge und Extras direkt bei unseren Partnern.
        </p>
      </div>

      {/* Destination tab chips — only when >1 result */}
      {results.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              style={{
                padding:       '5px 14px',
                borderRadius:  '20px',
                border:        `1.5px solid ${i === idx ? '#0EA5E9' : '#E2E8F0'}`,
                background:    i === idx ? '#EFF6FF' : '#F8FAFC',
                color:         i === idx ? '#0284C7' : '#64748B',
                fontSize:      '13px',
                fontWeight:    i === idx ? 700 : 500,
                cursor:        'pointer',
                fontFamily:    'inherit',
                whiteSpace:    'nowrap',
              }}
            >
              {i + 1}. {r.destination}
            </button>
          ))}
        </div>
      )}

      {/* 4-column CTA grid (2-column on small screens via minmax) */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap:                 '10px',
      }}>
        {links.map(({ key, icon: Icon, label, href, color }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:         'flex',
              flexDirection:   'column',
              alignItems:      'center',
              gap:             '8px',
              padding:         '14px 10px',
              borderRadius:    '14px',
              background:      '#F8FAFC',
              border:          '1.5px solid #E2E8F0',
              textDecoration:  'none',
              color:           '#0F172A',
              textAlign:       'center',
            }}
          >
            <div style={{
              width:          '40px',
              height:         '40px',
              borderRadius:   '12px',
              background:     color + '12',
              border:         `1.5px solid ${color}25`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
            }}>
              <Icon size={18} strokeWidth={1.75} color={color} />
            </div>
            <span style={{
              fontSize:   '12px',
              fontWeight: 700,
              color:      '#0F172A',
              lineHeight: 1.3,
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}>
              {label}
            </span>
          </a>
        ))}
      </div>

      <p style={{
        fontSize:   '11px',
        color:      '#94A3B8',
        margin:     '12px 0 0',
        textAlign:  'right',
      }}>
        Einige Links können Affiliate-Links sein – für dich bleibt der Preis gleich.
      </p>
    </section>
  );
}
