'use client';

import { useState } from 'react';
import { matchFerienparkProviders } from '@/lib/ferienpark-config';

function buildGoUrl(providerKey, holidayParkUrls) {
  const searchUrl = holidayParkUrls?.[providerKey];
  if (!searchUrl) return undefined;
  return `/go/${providerKey}?url=${encodeURIComponent(searchUrl)}`;
}

function ProviderLogo({ providerKey, name, color }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: color + '20', border: `2px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 800, color, textAlign: 'center',
        lineHeight: 1.1, flexShrink: 0,
      }}>
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={`/images/providers/${providerKey}.png`}
      alt={name}
      onError={() => setFailed(true)}
      style={{
        width: '48px', height: '48px', borderRadius: '14px',
        objectFit: 'contain', background: '#FFFFFF',
        border: '1.5px solid #E2E8F0', flexShrink: 0,
      }}
    />
  );
}

/**
 * Zeigt 2–3 passende Ferienpark-/Familienurlaub-Anbieter im Funnel-Ergebnis.
 * Wird nur gerendert, wenn mindestens ein Anbieter matcht.
 *
 * @param {{ interests: string[], destination: object, budget: string|null }} props
 */
export default function FerienparkSection({ interests, destination, budget, holidayParkUrls }) {
  const matched = matchFerienparkProviders(interests, destination, budget);
  if (!matched.length) return null;
  // Defensive guard: only render for single-parent sessions.
  // holidayParkUrls is null for regular sessions — this prevents the section
  // from appearing in the normal travel funnel even if matchFerienparkProviders matches.
  if (!holidayParkUrls || Object.keys(holidayParkUrls).length === 0) return null;

  return (
    <section
      aria-label="Passende Ferienparks & Familienunterkünfte"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '20px',
        padding: 'clamp(16px,3vw,24px)',
        marginBottom: '12px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 4px',
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        }}>
          Familienurlaub &amp; Ferienparks
        </p>
        <h2 style={{
          fontSize: 'clamp(16px,2vw,20px)', fontWeight: 800, color: '#0F172A',
          margin: 0, fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          letterSpacing: '-0.02em',
        }}>
          Passende Ferienparks &amp; Familienunterkünfte
        </h2>
      </div>

      {/* Provider cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {matched.map((p) => {
          const href = buildGoUrl(p.key, holidayParkUrls);

          return (
            <div
              key={p.key}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '14px 16px',
                background: p.bgColor,
                border: `1.5px solid ${p.color}30`,
                borderRadius: '14px',
              }}
            >
              <ProviderLogo providerKey={p.key} name={p.name} color={p.color} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '14px', fontWeight: 800, color: '#0F172A',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    {p.name}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: p.color,
                    background: p.color + '18', padding: '2px 8px',
                    borderRadius: '20px', letterSpacing: '0.05em',
                  }}>
                    {p.category}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 6px', lineHeight: 1.5 }}>
                  {p.description}
                </p>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontStyle: 'italic' }}>
                  ✓ {p.reason}
                </p>
              </div>

              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '9px 14px', borderRadius: '10px',
                    background: p.color, color: '#FFFFFF',
                    textDecoration: 'none', fontSize: '12px', fontWeight: 700,
                    whiteSpace: 'nowrap', flexShrink: 0,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  Ansehen →
                </a>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '11px', color: '#94A3B8', margin: '12px 0 0', textAlign: 'right' }}>
        * Affiliate-Links · Für dich kostenlos
      </p>
    </section>
  );
}
