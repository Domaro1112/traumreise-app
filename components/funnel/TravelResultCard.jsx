'use client';

import { useState } from 'react';
import { MapPin, Clock, Wallet, CheckCircle2, ExternalLink, Loader2, Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getProviderDisplayList } from '@/lib/affiliate-config';
import { isCarRentalEligible } from '@/lib/car-rental-config';

const CARD_THEMES = [
  {
    gradient: 'linear-gradient(160deg, #0369A1 0%, #0EA5E9 55%, #38BDF8 100%)',
    accent: '#0EA5E9', accentBg: '#EFF6FF', accentBorder: '#BFDBFE', accentText: '#0284C7',
  },
  {
    gradient: 'linear-gradient(160deg, #5B21B6 0%, #7C3AED 55%, #A78BFA 100%)',
    accent: '#7C3AED', accentBg: '#F5F3FF', accentBorder: '#DDD6FE', accentText: '#6D28D9',
  },
  {
    gradient: 'linear-gradient(160deg, #064E3B 0%, #059669 55%, #34D399 100%)',
    accent: '#059669', accentBg: '#ECFDF5', accentBorder: '#A7F3D0', accentText: '#065F46',
  },
];

// Provider display data only — no URLs on the client
const PROVIDERS = getProviderDisplayList();

const CAR_RENTAL_FALLBACK_REASON = 'Mit einem Mietwagen kannst du die Region flexibler erkunden und erreichst auch ruhigere Orte abseits der typischen Touristenrouten.';

function track(event, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
  } catch { /* analytics failure must never break the UI */ }
}

// destinationSlug: passed from parent if a published /reiseziele/[slug] page exists.
// When null/undefined the "Mehr über X erfahren" link is hidden.
export default function TravelResultCard({ destination, index, sessionId, destinationSlug }) {
  const theme = CARD_THEMES[index % 3];
  const [loadingProvider,  setLoadingProvider]  = useState(null);
  const [carRentalLoading, setCarRentalLoading] = useState(false);

  const showCarRental = !!(destination.carRentalRecommended || isCarRentalEligible(destination.name));

  const handleChipClick = async (providerId) => {
    if (loadingProvider) return;
    setLoadingProvider(providerId);

    // Open blank tab immediately on user gesture to avoid popup blockers.
    // IMPORTANT: do NOT pass 'noopener' or 'noreferrer' as window.open features —
    // those make win.location inaccessible from the opener, so the redirect silently fails.
    // We break the back-reference manually below for equivalent security.
    const win = window.open('', '_blank');
    if (win) {
      try { win.opener = null; } catch (_) { /* read-only in some browsers, safe to ignore */ }
    }

    track('affiliate_click', {
      provider:    providerId,
      destination: destination.name,
      country:     destination.country,
      session_id:  sessionId,
    });

    const payload = {
      provider:    providerId,
      destination: {
        name:                  destination.name,
        country:               destination.country,
        region:                destination.region,
        affiliateSearchIntent: destination.affiliateSearchIntent,
      },
      sessionId: sessionId ?? undefined,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[affiliate] click payload', payload);
    }

    try {
      const res = await fetch('/api/travel-finder/affiliate-click', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('[affiliate] API error', res.status, errData);
        if (win) win.close();
        return;
      }

      const data = await res.json();

      if (process.env.NODE_ENV === 'development') {
        console.log('[affiliate] redirect url', data.redirectUrl);
      }

      if (data.redirectUrl && win) {
        win.location.href = data.redirectUrl;
      } else {
        console.error('[affiliate] missing redirectUrl in response', data);
        if (win) win.close();
      }
    } catch (err) {
      console.error('[affiliate] fetch error', err);
      if (win) win.close();
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleCarRentalClick = async () => {
    if (carRentalLoading) return;
    setCarRentalLoading(true);

    const win = window.open('', '_blank');
    if (win) { try { win.opener = null; } catch (_) {} }

    track('car_rental_click', {
      destination: destination.name,
      country:     destination.country,
      session_id:  sessionId,
    });

    try {
      const res = await fetch('/api/travel-finder/affiliate-click', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          provider:    'check24_car_rental',
          destination: {
            name:    destination.name,
            country: destination.country,
            region:  destination.region,
          },
          sessionId: sessionId ?? undefined,
        }),
      });

      if (!res.ok) { if (win) win.close(); return; }

      const data = await res.json();
      if (data.redirectUrl && win) {
        win.location.href = data.redirectUrl;
      } else {
        if (win) win.close();
      }
    } catch (err) {
      console.error('[car-rental] fetch error', err);
      if (win) win.close();
    } finally {
      setCarRentalLoading(false);
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '22px',
        overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(15,23,42,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(15,23,42,0.08)';
      }}
    >
      {/* ── Hero banner ── */}
      <div style={{
        background: theme.gradient, padding: '32px 26px 24px',
        minHeight: '180px', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', borderRadius: '8px', padding: '3px 10px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', alignSelf: 'flex-start' }}>
          Vorschlag {index + 1}
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em', textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
          {destination.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={13} strokeWidth={2} color="rgba(255,255,255,0.85)" />
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
            {destination.country}
            {destination.region ? ` · ${destination.region}` : ''}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: theme.accentBg, borderRadius: '12px', padding: '13px 16px', borderLeft: `3px solid ${theme.accent}` }}>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
            {destination.fitReason}
          </p>
        </div>

        {destinationSlug && (
          <Link
            href={`/reiseziele/${destinationSlug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 700,
              color: theme.accentText,
              textDecoration: 'none',
              padding: '5px 0',
            }}
          >
            Mehr über {destination.name} erfahren
            <ArrowRight size={11} strokeWidth={2.5} />
          </Link>
        )}

        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.85, margin: 0 }}>
          {destination.story}
        </p>

        {destination.highlights?.length > 0 && (
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Highlights
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {destination.highlights.map((h, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', background: theme.accentBg, border: `1px solid ${theme.accentBorder}`, fontSize: '12px', color: theme.accentText, fontWeight: 500 }}>
                  <CheckCircle2 size={10} strokeWidth={2.5} color={theme.accent} />
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {destination.bestTravelTime && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} strokeWidth={2} color="#94A3B8" />
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                <strong style={{ color: '#475569' }}>Beste Zeit:</strong>{' '}
                {destination.bestTravelTime}
              </span>
            </div>
          )}
          {destination.budgetHint && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wallet size={12} strokeWidth={2} color="#94A3B8" />
              <span style={{ fontSize: '12px', color: '#64748B' }}>{destination.budgetHint}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Provider CTAs ── */}
      <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #F1F5F9' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Passende Angebote suchen bei:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {PROVIDERS.map(p => {
            const isLoading = loadingProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleChipClick(p.id)}
                disabled={!!loadingProvider}
                title={`Angebote für ${destination.name} bei ${p.name} ansehen`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '7px 13px', borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.07)',
                  background: p.bgColor, color: p.color,
                  fontSize: '12px', fontWeight: 700,
                  cursor: loadingProvider ? (isLoading ? 'wait' : 'not-allowed') : 'pointer',
                  fontFamily: 'inherit', whiteSpace: 'nowrap',
                  opacity: loadingProvider && !isLoading ? 0.55 : 1,
                  transition: 'filter 0.15s ease, transform 0.15s ease, opacity 0.15s',
                  lineHeight: 1,
                }}
                onMouseEnter={e => {
                  if (!loadingProvider) {
                    e.currentTarget.style.filter = 'brightness(0.93)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {isLoading
                  ? <Loader2 size={11} strokeWidth={2} style={{ animation: 'spin 0.8s linear infinite' }} />
                  : <ExternalLink size={10} strokeWidth={2.5} />
                }
                {p.name}
              </button>
            );
          })}
        </div>

        <p style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '12px', lineHeight: 1.5 }}>
          Einige Links sind Affiliate-Links. Wenn du darüber buchst, erhalten wir möglicherweise eine Provision – für dich entstehen keine zusätzlichen Kosten.{' '}
          <a href="/affiliate-hinweis" style={{ color: '#CBD5E1', textDecoration: 'underline' }}>Mehr erfahren</a>
        </p>
      </div>

      {/* ── Car rental recommendation ── */}
      {showCarRental && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            borderRadius: '12px',
            border: '1px solid #BAE6FD',
            padding: '14px 15px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 3px 8px rgba(14,165,233,0.28)',
              }}>
                <Car size={16} strokeWidth={2} color="#FFFFFF" />
              </div>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                  Mietwagen empfohlen
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  {destination.carRentalReason || CAR_RENTAL_FALLBACK_REASON}
                </p>
              </div>
            </div>
            <button
              onClick={handleCarRentalClick}
              disabled={carRentalLoading}
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: '9px',
                border: 'none',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: carRentalLoading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 3px 10px rgba(14,165,233,0.28)',
                transition: 'filter 0.15s ease',
              }}
              onMouseEnter={e => { if (!carRentalLoading) e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
            >
              {carRentalLoading
                ? <Loader2 size={12} strokeWidth={2} style={{ animation: 'spin 0.8s linear infinite' }} />
                : <Car size={12} strokeWidth={2} />
              }
              Mietwagen für {destination.name} vergleichen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
