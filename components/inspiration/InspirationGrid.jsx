'use client';

import { useState } from 'react';
import { buildInspirationHref, getCtaLabel, PROVIDER_LABELS, INSPIRATION_CATEGORIES } from '@/lib/inspiration-items';

const BADGE_STYLES = {
  Beliebt:    { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Traumziel:  { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  Geheimtipp: { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Trending:   { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
  Luxus:      { bg: '#FEF9C3', border: '#FDE68A', color: '#A16207' },
};
const DEFAULT_BADGE = { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };

const FILTERS = ['Alle', ...INSPIRATION_CATEGORIES];

function InspirationCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const badge = BADGE_STYLES[item.badge] ?? DEFAULT_BADGE;
  const href = buildInspirationHref(item);
  const isExt = href.startsWith('/go/');
  const target = item.open_in_new_tab !== false && isExt ? '_blank' : '_self';
  const ctaLabel = getCtaLabel(item);
  const providerLabel = PROVIDER_LABELS[item.provider_key];

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
      itemScope
      itemType="https://schema.org/TouristDestination"
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '240px', overflow: 'hidden', flexShrink: 0 }}>
        {!imgError ? (
          <img
            src={item.image_url}
            alt={item.image_alt || `${item.title}${item.country ? ', ' + item.country : ''}`}
            loading="lazy"
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              display: 'block',
              transition: 'transform 0.55s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #6366F1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.15) 0%, transparent 40%, rgba(15,23,42,0.18) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        {item.badge && (
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            padding: '5px 12px', borderRadius: '20px',
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color,
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            backdropFilter: 'blur(6px)',
          }}>
            {item.badge}
          </div>
        )}

        {/* Category pill */}
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          padding: '4px 10px', borderRadius: '20px',
          fontSize: '10px', fontWeight: 600,
          background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)',
          color: '#E0F2FE',
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        }}>
          {item.category}
        </div>

        {/* Country pill */}
        {(item.destination || item.country) && (
          <div style={{
            position: 'absolute', bottom: '14px', right: '14px',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            color: '#0EA5E9',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          }}>
            {item.destination || item.country}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          itemProp="name"
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '18px', fontWeight: 700, color: '#0F172A',
            marginBottom: '6px', lineHeight: 1.25,
          }}
        >
          {item.title}
        </h3>

        {(item.subtitle || item.description) && (
          <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.65, marginBottom: '0', flex: 1 }}>
            {item.subtitle || item.description}
          </p>
        )}

        {/* Meta hints */}
        {(item.price_hint || item.duration_hint) && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
            {item.price_hint && (
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0EA5E9', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                {item.price_hint}
              </span>
            )}
            {item.duration_hint && (
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>{item.duration_hint}</span>
            )}
          </div>
        )}

        <div style={{ height: '1px', background: '#F1F5F9', margin: '14px 0' }} />

        {/* Provider + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {providerLabel && (
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
              {providerLabel}
            </span>
          )}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '12px',
              background: hovered ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' : '#F0F9FF',
              border: `1.5px solid ${hovered ? 'transparent' : '#BAE6FD'}`,
              color: hovered ? '#FFFFFF' : '#0284C7',
              fontSize: '12px', fontWeight: 700,
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              letterSpacing: '0.01em',
              boxShadow: hovered ? '0 4px 14px rgba(14,165,233,0.35)' : 'none',
              marginLeft: providerLabel ? 'auto' : undefined,
            }}
          >
            {ctaLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

function FeaturedCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const badge = BADGE_STYLES[item.badge] ?? DEFAULT_BADGE;
  const href = buildInspirationHref(item);
  const isExt = href.startsWith('/go/');
  const target = item.open_in_new_tab !== false && isExt ? '_blank' : '_self';
  const ctaLabel = getCtaLabel(item);
  const providerLabel = PROVIDER_LABELS[item.provider_key];

  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        textDecoration: 'none',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: `1px solid ${hovered ? '#BAE6FD' : '#E2E8F0'}`,
        boxShadow: hovered
          ? '0 28px 80px rgba(14,165,233,0.22), 0 6px 20px rgba(14,165,233,0.12)'
          : '0 4px 20px rgba(15,23,42,0.08)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        cursor: 'pointer',
        marginBottom: '40px',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', minHeight: '360px', overflow: 'hidden' }}>
        {!imgError ? (
          <img
            src={item.image_url}
            alt={item.image_alt || item.title}
            loading="eager"
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center', display: 'block',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', minHeight: '360px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #6366F1 100%)',
          }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, rgba(255,255,255,0.06) 100%)', pointerEvents: 'none' }} />
        {item.badge && (
          <div style={{
            position: 'absolute', top: '20px', left: '20px',
            padding: '6px 14px', borderRadius: '20px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color,
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          }}>
            {item.badge}
          </div>
        )}
        <div style={{
          position: 'absolute', top: '20px', right: '20px',
          padding: '6px 14px', borderRadius: '20px',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
          background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)',
          color: '#FFFFFF', backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        }}>
          ★ Featured
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: '12px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
          {item.category}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
          color: '#0F172A', lineHeight: 1.2, marginBottom: '14px',
          letterSpacing: '-0.02em',
        }}>
          {item.title}
        </h2>

        {(item.subtitle || item.description) && (
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, marginBottom: '24px' }}>
            {item.subtitle || item.description}
          </p>
        )}

        {(item.destination || item.country) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
              {[item.destination, item.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {(item.price_hint || item.duration_hint) && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            {item.price_hint && (
              <div style={{ padding: '8px 16px', borderRadius: '10px', background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Ab</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1D4ED8', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{item.price_hint}</div>
              </div>
            )}
            {item.duration_hint && (
              <div style={{ padding: '8px 16px', borderRadius: '10px', background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Dauer</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#15803D', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>{item.duration_hint}</div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 24px', borderRadius: '14px',
              background: hovered ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              color: '#FFFFFF', fontSize: '14px', fontWeight: 700,
              boxShadow: hovered ? '0 8px 24px rgba(14,165,233,0.45)' : '0 4px 14px rgba(14,165,233,0.30)',
              transition: 'box-shadow 0.25s ease',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}
          >
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          {providerLabel && (
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>via {providerLabel}</span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function InspirationGrid({ items = [] }) {
  const [activeFilter, setActiveFilter] = useState('Alle');

  const featuredItem = items.find(i => i.is_featured);
  const filtered = activeFilter === 'Alle'
    ? items
    : items.filter(i => i.category === activeFilter);

  const gridItems = activeFilter === 'Alle' && featuredItem
    ? filtered.filter(i => i.id !== featuredItem.id)
    : filtered;

  return (
    <>
      {/* Category filter chips */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          marginBottom: '40px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {FILTERS.map(f => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '9px 18px',
                borderRadius: '40px',
                border: '1.5px solid',
                borderColor: active ? 'transparent' : '#E2E8F0',
                background: active
                  ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                  : '#FFFFFF',
                color: active ? '#FFFFFF' : '#475569',
                fontSize: '13px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                transition: 'all 0.2s ease',
                boxShadow: active ? '0 4px 14px rgba(14,165,233,0.35)' : '0 1px 4px rgba(15,23,42,0.06)',
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Featured card */}
      {activeFilter === 'Alle' && featuredItem && (
        <FeaturedCard item={featuredItem} />
      )}

      {/* Card grid */}
      {gridItems.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '28px',
            marginBottom: '60px',
          }}
        >
          {gridItems.map(item => (
            <InspirationCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#94A3B8', fontSize: '15px' }}>
          Keine Einträge in dieser Kategorie.
        </div>
      )}

      {/* Reisemonkey Banner */}
      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0EA5E9 100%)',
          padding: '48px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap',
          marginBottom: '48px',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 80% 50%, rgba(6,182,212,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38BDF8', marginBottom: '10px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
            KI-Reiseplaner
          </div>
          <h3 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
            color: '#FFFFFF', margin: '0 0 12px', lineHeight: 1.25, letterSpacing: '-0.02em',
          }}>
            Noch unsicher? Lass ApeAround<br />deine passende Reiseidee finden.
          </h3>
          <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
            Apo - unser KI-Reiseplaner analysiert deine Wünsche und findet das perfekte Reiseziel — kostenlos und in Sekunden.
          </p>
        </div>

        <a
          href="/#reiseplaner"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '15px 28px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            color: '#FFFFFF', textDecoration: 'none',
            fontSize: '15px', fontWeight: 700,
            boxShadow: '0 6px 24px rgba(14,165,233,0.45)',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            position: 'relative',
          }}
        >
          Traumurlaub planen
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Affiliate disclaimer */}
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#CBD5E1', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>
        Einige Links auf dieser Seite können Affiliate-Links sein. Du zahlst dabei keinen Cent mehr — wir erhalten lediglich eine kleine Provision vom Anbieter, wenn du eine Buchung abschließt.
      </p>
    </>
  );
}
