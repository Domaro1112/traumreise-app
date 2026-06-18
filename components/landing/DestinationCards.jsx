'use client';

import { useState } from 'react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import { buildHomepageSuggestionHref } from '@/lib/homepage-suggestions';

const BADGE_STYLES = {
  Beliebt:    { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Traumziel:  { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  Geheimtipp: { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Trending:   { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
};

const DEFAULT_BADGE = { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };

function DestinationCard({ suggestion }) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE_STYLES[suggestion.badge] ?? DEFAULT_BADGE;

  const href   = buildHomepageSuggestionHref(suggestion);
  const isExt  = href.startsWith('http') || href.startsWith('/go/');
  const target = suggestion.open_in_new_tab !== false && isExt ? '_blank' : '_self';

  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
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
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          height: '260px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src={suggestion.image_url}
          alt={suggestion.image_alt || `${suggestion.title}, ${suggestion.country}`}
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
        {suggestion.badge && (
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
            {suggestion.badge}
          </div>
        )}

        {/* Country pill */}
        {suggestion.country && (
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
            {suggestion.country}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '20px 22px 22px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
          {suggestion.title}
        </h3>

        {suggestion.description && (
          <p
            style={{
              fontSize: '13px',
              color: '#64748B',
              lineHeight: 1.65,
              marginBottom: '0',
              flex: 1,
            }}
          >
            {suggestion.description}
          </p>
        )}

        <div
          style={{
            height: '1px',
            background: '#F1F5F9',
            margin: '16px 0',
          }}
        />

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    </a>
  );
}

export default function DestinationCards({ suggestions = [] }) {
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
          title="Traumziele, die dir"
          titleHighlight="gefallen könnten"
          subtitle="Von tropischen Stränden bis zu pulsierenden Metropolen — wir kennen das perfekte Ziel für jeden Reisetyp."
        />

        <div className="destinations-grid">
          {suggestions.map((s) => (
            <DestinationCard key={s.id} suggestion={s} />
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
