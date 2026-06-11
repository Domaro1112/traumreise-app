'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, RefreshCw, Home, AlertCircle } from 'lucide-react';
import Container from '@/components/layout/Container';
import TravelFunnelLoading from '@/components/funnel/TravelFunnelLoading';
import TravelFunnelOptin from '@/components/funnel/TravelFunnelOptin';
import TravelResultCard from '@/components/funnel/TravelResultCard';

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

  const [phase,       setPhase]       = useState('loading'); // 'loading' | 'results' | 'error' | 'invalid'
  const [session,     setSession]     = useState(null);
  const [results,     setResults]     = useState([]);
  const [errorMsg,    setErrorMsg]    = useState('');

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
      // 1. Fetch session
      const sessRes = await fetch(`/api/travel-finder/session?session_id=${encodeURIComponent(sessionId)}`);
      if (sessRes.status === 404 || sessRes.status === 400) { setPhase('invalid'); return; }
      if (!sessRes.ok) throw new Error('Session konnte nicht geladen werden.');
      const sess = await sessRes.json();
      setSession(sess);

      // 2. Use cached results or generate fresh
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
    }).catch(() => {/* fire-and-forget */});
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [sessionId]);

  // ── Shared back link ──────────────────────────────────────────────────────
  const BackLink = () => (
    <a
      href="/#wizard"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '14px', fontWeight: 600, color: '#0284C7',
        textDecoration: 'none', marginBottom: '28px',
      }}
    >
      <ChevronLeft size={16} strokeWidth={2.5} />
      Auswahl ändern
    </a>
  );

  // ── Invalid ───────────────────────────────────────────────────────────────
  if (phase === 'invalid') {
    return (
      <Container>
        <div style={{ padding: 'clamp(40px, 8vw, 80px) 0', textAlign: 'center' }}>
          <AlertCircle size={48} strokeWidth={1.5} color="#94A3B8" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>
            Session nicht gefunden
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
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
      </Container>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <Container>
        <div style={{ padding: 'clamp(40px, 8vw, 80px) 0', textAlign: 'center' }}>
          <AlertCircle size={48} strokeWidth={1.5} color="#F87171" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>
            Etwas ist schiefgelaufen
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
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
      </Container>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <Container>
        <div style={{ padding: 'clamp(32px, 6vw, 60px) 0' }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 48px rgba(15,23,42,0.10)',
            padding: 'clamp(24px, 5vw, 44px)',
          }}>
            <BackLink />
            <TravelFunnelLoading />
          </div>
        </div>
      </Container>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  return (
    <Container>
      <div style={{ padding: 'clamp(32px, 6vw, 60px) 0' }}>
        <BackLink />

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
            color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 10px',
          }}>
            Deine 3 Traumreisen
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', margin: 0 }}>
            Persönlich ausgewählt auf Basis deiner Wünsche
          </p>
        </div>

        {/* Result cards */}
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

        {/* Email opt-in */}
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
      </div>
    </Container>
  );
}
