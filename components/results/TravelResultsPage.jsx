'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, RefreshCw, Home, AlertCircle } from 'lucide-react';
import Container from '@/components/layout/Container';
import TravelFunnelLoading from '@/components/funnel/TravelFunnelLoading';
import TravelFunnelOptin from '@/components/funnel/TravelFunnelOptin';
import TravelResultCard from '@/components/funnel/TravelResultCard';

// ── Hero image ────────────────────────────────────────────────────────────────
// Place the file at: public/images/results/reiseinspiration-hero.jpg
// Missing file → gradient fallback (no broken icon, silent)
const HERO_IMAGE = '/images/results/reiseinspiration-hero.jpg';

// ── Page-level hero — always shown at the top of every phase ─────────────────
function ResultsHero() {
  return (
    <div
      className="results-hero"
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '28px',
        overflow: 'hidden',
        // fallback gradient while / if image is absent
        background: 'linear-gradient(135deg, #1E3A5F 0%, #0369A1 55%, #0EA5E9 100%)',
      }}
    >
      {/* Image layer — silently ignored when file is missing */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark vignette at bottom — makes the white overlap section look like it floats */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.50) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ── Back navigation ───────────────────────────────────────────────────────────
function BackLink() {
  return (
    <a
      href="/#wizard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.90)',
        textDecoration: 'none',
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
        background: 'rgba(0,0,0,0.28)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        padding: '7px 14px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.18)',
      }}
    >
      <ChevronLeft size={14} strokeWidth={2.5} />
      Auswahl ändern
    </a>
  );
}

// ── White overlap panel ───────────────────────────────────────────────────────
// Pulls up over the bottom of the hero with negative margin.
// z-index must be > 0 but below the fixed header (z-index 100).
function OverlapPanel({ children }) {
  return (
    <div
      style={{
        marginTop: '-88px',
        position: 'relative',
        zIndex: 5,
        background: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -6px 32px rgba(15,23,42,0.10)',
        paddingTop: 'clamp(28px, 4vw, 40px)',
        paddingBottom: '80px',
        paddingLeft: 'clamp(16px, 3vw, 32px)',
        paddingRight: 'clamp(16px, 3vw, 32px)',
      }}
    >
      {children}
    </div>
  );
}

function track(event, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
  } catch { /* analytics failure must never break the UI */ }
}

export default function TravelResultsPage() {
  const searchParams = useSearchParams();
  const sessionId    = searchParams.get('session_id');

  const [phase,    setPhase]    = useState('loading');
  const [session,  setSession]  = useState(null);
  const [results,  setResults]  = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const generate = useCallback(async (sess) => {
    const res = await fetch('/api/travel-finder/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        sessionId: sess.id,
        moods:     sess.mood_selection ?? [],
        season:    sess.season,
        budget:    sess.budget,
        duration:  sess.duration,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Generierung fehlgeschlagen.');
    return Array.isArray(json.destinations) ? json.destinations : [];
  }, []);

  const load = useCallback(async () => {
    if (!sessionId) { setPhase('invalid'); return; }
    setPhase('loading');
    setErrorMsg('');
    try {
      const sessRes = await fetch(`/api/travel-finder/session?session_id=${encodeURIComponent(sessionId)}`);
      if (sessRes.status === 404 || sessRes.status === 400) { setPhase('invalid'); return; }
      if (!sessRes.ok) throw new Error('Session konnte nicht geladen werden.');
      const sess = await sessRes.json();
      setSession(sess);

      let destinations;
      if (Array.isArray(sess.generated_destinations) && sess.generated_destinations.length > 0) {
        destinations = sess.generated_destinations;
      } else {
        destinations = await generate(sess);
      }

      setResults(destinations);
      setPhase('results');
      track('result_view', {
        session_id: sess.id,
        moods:      (sess.mood_selection ?? []).join(','),
        season:     sess.season,
        budget:     sess.budget,
        duration:   sess.duration,
      });
    } catch (err) {
      console.error('[TravelResultsPage]', err);
      setErrorMsg(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
      setPhase('error');
    }
  }, [sessionId, generate]);

  useEffect(() => { load(); }, [load]);

  const handleAffiliateClick = useCallback((provider, destinationName, url) => {
    track('affiliate_click', { provider, destination: destinationName, session_id: sessionId });
    fetch('/api/travel-finder/affiliate-click', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ sessionId, destinationName, provider, affiliateUrl: url }),
    }).catch(() => {});
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [sessionId]);

  // ── Invalid ───────────────────────────────────────────────────────────────
  if (phase === 'invalid') {
    return (
      <Container>
        <div style={{ position: 'relative' }}>
          <ResultsHero />
          <BackLink />
          <OverlapPanel>
            <div style={{ textAlign: 'center', padding: 'clamp(20px, 4vw, 40px) 0' }}>
              <AlertCircle size={48} strokeWidth={1.5} color="#94A3B8" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>
                Session nicht gefunden
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', margin: '0 auto 28px', maxWidth: '400px' }}>
                Der Link ist abgelaufen oder ungültig. Starte den Reisefinder einfach neu.
              </p>
              <a
                href="/"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 24px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  color: '#fff', textDecoration: 'none',
                  fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                  boxShadow: '0 6px 20px rgba(14,165,233,0.35)',
                }}
              >
                <Home size={16} strokeWidth={2} />
                Neu starten
              </a>
            </div>
          </OverlapPanel>
        </div>
      </Container>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <Container>
        <div style={{ position: 'relative' }}>
          <ResultsHero />
          <BackLink />
          <OverlapPanel>
            <div style={{ textAlign: 'center', padding: 'clamp(20px, 4vw, 40px) 0' }}>
              <AlertCircle size={48} strokeWidth={1.5} color="#F87171" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>
                Etwas ist schiefgelaufen
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', margin: '0 auto 28px', maxWidth: '400px' }}>
                {errorMsg || 'Die Traumreisen konnten nicht geladen werden.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={load}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '13px 24px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#fff', cursor: 'pointer',
                    fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                    boxShadow: '0 6px 20px rgba(14,165,233,0.35)',
                  }}
                >
                  <RefreshCw size={16} strokeWidth={2} />
                  Nochmal versuchen
                </button>
                <a
                  href="/"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '13px 24px', borderRadius: '14px',
                    border: '1.5px solid #E2E8F0', background: '#fff',
                    color: '#64748B', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 600,
                  }}
                >
                  <Home size={16} strokeWidth={2} />
                  Startseite
                </a>
              </div>
            </div>
          </OverlapPanel>
        </div>
      </Container>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <Container>
        <div style={{ position: 'relative' }}>
          <ResultsHero />
          <BackLink />
          <OverlapPanel>
            <TravelFunnelLoading />
          </OverlapPanel>
        </div>
      </Container>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  return (
    <Container>
      <div style={{ position: 'relative' }}>
        <ResultsHero />
        <BackLink />

        <OverlapPanel>
          {/* Heading in the transition zone */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(22px, 3.5vw, 34px)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
            }}>
              Deine 3 Traumreisen
            </h1>
            <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
              Persönlich ausgewählt auf Basis deiner Wünsche
            </p>
          </div>

          {/* Result cards — inherit Container's horizontal rhythm */}
          <div className="funnel-results-grid funnel-results-fade" style={{ marginBottom: '40px' }}>
            {results.map((dest, i) => (
              <TravelResultCard
                key={i}
                destination={dest}
                index={i}
                sessionId={sessionId}
                onAffiliateClick={handleAffiliateClick}
              />
            ))}
          </div>

          {session && (
            <TravelFunnelOptin
              destinations={results.map(d => d.name)}
              moods={session.mood_selection ?? []}
              season={session.season}
              budget={session.budget}
              duration={session.duration}
              sessionId={sessionId}
            />
          )}
        </OverlapPanel>
      </div>
    </Container>
  );
}
