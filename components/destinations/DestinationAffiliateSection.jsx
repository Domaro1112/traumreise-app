'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, Car, Hotel, Plane, Map, Package } from 'lucide-react';

const PROVIDERS = [
  { id: 'booking',      name: 'Booking.com',   label: 'Hotels ansehen',        color: '#003580', bgColor: '#EEF3FB', icon: Hotel   },
  { id: 'trivago',      name: 'trivago',        label: 'Hotels vergleichen',    color: '#007DB8', bgColor: '#EEF7FB', icon: Hotel   },
  { id: 'skyscanner',   name: 'Skyscanner',     label: 'Flüge suchen',          color: '#0770E3', bgColor: '#EEF4FF', icon: Plane   },
  { id: 'getyourguide', name: 'GetYourGuide',   label: 'Aktivitäten ansehen',   color: '#FF5533', bgColor: '#FFF3F0', icon: Map     },
  { id: 'check24',      name: 'CHECK24',        label: 'Reiseangebote ansehen', color: '#E2001A', bgColor: '#FEF2F2', icon: Package },
];

const CAR_PROVIDER = { id: 'check24_car_rental', name: 'CHECK24 Mietwagen', label: 'Mietwagen vergleichen', color: '#E2001A', bgColor: '#FEF2F2', icon: Car };

function track(event, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
  } catch { /* analytics failure must never break the UI */ }
}

export default function DestinationAffiliateSection({ destination }) {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleClick = async (providerId) => {
    if (loadingProvider) return;
    setLoadingProvider(providerId);

    const win = window.open('', '_blank');
    if (win) { try { win.opener = null; } catch (_) {} }

    track('affiliate_click', {
      provider:    providerId,
      destination: destination.name,
      country:     destination.country,
      source:      'seo_destination_page',
    });

    try {
      const res = await fetch('/api/travel-finder/affiliate-click', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          destination: {
            name:                  destination.name,
            country:               destination.country,
            region:                destination.region,
            affiliateSearchIntent: destination.affiliateSearchIntent,
          },
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
      console.error('[affiliate-seo] error', err);
      if (win) win.close();
    } finally {
      setLoadingProvider(null);
    }
  };

  const providers = destination.carRentalRecommended
    ? [...PROVIDERS, CAR_PROVIDER]
    : PROVIDERS;

  return (
    <section
      aria-label="Buchungsangebote"
      style={{
        background: 'linear-gradient(135deg, #F0F9FF 0%, #F8FAFF 100%)',
        borderRadius: '24px',
        border: '1.5px solid #BAE6FD',
        padding: 'clamp(24px, 4vw, 40px)',
        marginBottom: '40px',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: '20px',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '6px',
          letterSpacing: '-0.02em',
        }}
      >
        Angebote für {destination.name}
      </h2>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.6 }}>
        Direkt zu den besten Buchungsplattformen für Hotels, Flüge, Aktivitäten und Mietwagen.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {providers.map(p => {
          const isLoading = loadingProvider === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => handleClick(p.id)}
              disabled={!!loadingProvider}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1.5px solid rgba(0,0,0,0.08)',
                background: p.bgColor,
                color: p.color,
                fontSize: '13px',
                fontWeight: 700,
                cursor: loadingProvider ? (isLoading ? 'wait' : 'not-allowed') : 'pointer',
                fontFamily: 'inherit',
                opacity: loadingProvider && !isLoading ? 0.55 : 1,
                transition: 'filter 0.15s ease, transform 0.12s ease, opacity 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!loadingProvider) { e.currentTarget.style.filter = 'brightness(0.93)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              {isLoading
                ? <Loader2 size={13} strokeWidth={2} style={{ animation: 'spin 0.8s linear infinite' }} />
                : <Icon size={13} strokeWidth={2} />
              }
              {p.label}
              {!isLoading && <ExternalLink size={11} strokeWidth={2.5} style={{ marginLeft: '2px', opacity: 0.6 }} />}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
        Einige Links sind Affiliate-Links. Wenn du darüber buchst, erhalten wir möglicherweise eine Provision – für dich entstehen keine zusätzlichen Kosten.{' '}
        <a href="/affiliate-hinweis" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Mehr erfahren</a>
      </p>
    </section>
  );
}
