'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, RefreshCw, Home, AlertCircle } from 'lucide-react';
import Container from '@/components/layout/Container';
import TravelFunnelLoading from '@/components/funnel/TravelFunnelLoading';
import TravelFunnelOptin from '@/components/funnel/TravelFunnelOptin';
import TravelResultCard from '@/components/funnel/TravelResultCard';
import CarRentalHint from '@/components/mietwagen/CarRentalHint';

// ── Hero image ────────────────────────────────────────────────────────────────
// File: public/images/results/reiseinspiration-hero.jpg
// Missing → gradient fallback (silent, no broken icon)
const HERO_IMAGE = '/images/results/reiseinspiration-hero.jpg';

// ── Hero — only shown in 'results' phase ──────────────────────────────────────
function ResultsHero() {
  return (
    <div
      className="results-hero"
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1E3A5F 0%, #0369A1 55%, #0EA5E9 100%)',
      }}
    >
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.50) 100%)',
        pointerEvents: 'none',
      }} />
      {/* "Auswahl ändern" pill overlaid on hero image */}
      <a
        href="/#wizard"
        style={{
          position: 'absolute', top: '16px', left: '16px', zIndex: 10,
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.92)',
          textDecoration: 'none',
          background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', padding: '7px 14px',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <ChevronLeft size={14} strokeWidth={2.5} />
        Auswahl ändern
      </a>
    </div>
  );
}

// ── White overlap panel — sits over the bottom of the hero ───────────────────
function OverlapPanel({ children }) {
  return (
    <div style={{
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
    }}>
      {children}
    </div>
  );
}

// ── Inline back link for non-results phases (no hero overlay) ────────────────
function InlineBackLink() {
  return (
    <a
      href="/#wizard"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '14px', fontWeight: 600, color: '#0284C7',
        textDecoration: 'none', marginBottom: '20px',
      }}
    >
      <ChevronLeft size={16} strokeWidth={2.5} />
      Auswahl ändern
    </a>
  );
}

function track(event, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
  } catch { /* analytics failure must never break the UI */ }
}

function slugify(str) {
  return (str ?? '').toLowerCase().trim()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function TravelResultsPage() {
  const searchParams = useSearchParams();
  const sessionId    = searchParams.get('session_id');

  const [phase,          setPhase]          = useState('loading');
  const [session,        setSession]        = useState(null);
  const [results,        setResults]        = useState([]);
  const [errorMsg,       setErrorMsg]       = useState('');
  const [publishedSlugs, setPublishedSlugs] = useState(new Set());

  // Fetch published slugs once so each result card can conditionally link
  // to /reiseziele/[slug] only when the page actually exists.
  useEffect(() => {
    fetch('/api/destinations/published-slugs')
      .then(r => r.ok ? r.json() : { slugs: [] })
      .then(d => setPublishedSlugs(new Set(d.slugs ?? [])))
      .catch(() => {});
  }, []);

  function getDestinationSlug(name) {
    const slug = slugify(name);
    return publishedSlugs.has(slug) ? slug : null;
  }

  const generate = useCallback(async (sess) => {
    const res = await fetch('/api/travel-finder/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        sessionId:    sess.id,
        moods:        sess.mood_selection ?? [],
        season:       sess.season,
        budget:       sess.budget,
        duration:     sess.duration,
        personalNote: sess.personal_note ?? undefined,
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

  // Affiliate clicks are now handled entirely inside TravelResultCard.

  // ── Loading — NO hero, just the card with carousel ───────────────────────
  if (phase === 'loading') {
    return (
      <Container>
        <div style={{ paddingBottom: '80px' }}>
          <InlineBackLink />
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 32px rgba(15,23,42,0.08)',
            overflow: 'hidden',
          }}>
            <TravelFunnelLoading />
          </div>
        </div>
      </Container>
    );
  }

  // ── Invalid ───────────────────────────────────────────────────────────────
  if (phase === 'invalid') {
    return (
      <Container>
        <div style={{ paddingBottom: '80px' }}>
          <InlineBackLink />
          <div style={{ textAlign: 'center', padding: 'clamp(32px, 6vw, 60px) 0' }}>
            <AlertCircle size={48} strokeWidth={1.5} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>
              Session nicht gefunden
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', margin: '0 auto 28px', maxWidth: '400px' }}>
              Der Link ist abgelaufen oder ungültig. Starte den Reisefinder einfach neu.
            </p>
            <a href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 24px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              color: '#fff', textDecoration: 'none',
              fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
              boxShadow: '0 6px 20px rgba(14,165,233,0.35)',
            }}>
              <Home size={16} strokeWidth={2} />
              Neu starten
            </a>
          </div>
        </div>
      </Container>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <Container>
        <div style={{ paddingBottom: '80px' }}>
          <InlineBackLink />
          <div style={{ textAlign: 'center', padding: 'clamp(32px, 6vw, 60px) 0' }}>
            <AlertCircle size={48} strokeWidth={1.5} color="#F87171" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>
              Etwas ist schiefgelaufen
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', margin: '0 auto 28px', maxWidth: '400px' }}>
              {errorMsg || 'Die Traumreisen konnten nicht geladen werden.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={load} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 24px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#fff', cursor: 'pointer',
                fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                boxShadow: '0 6px 20px rgba(14,165,233,0.35)',
              }}>
                <RefreshCw size={16} strokeWidth={2} />
                Nochmal versuchen
              </button>
              <a href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 24px', borderRadius: '14px',
                border: '1.5px solid #E2E8F0', background: '#fff',
                color: '#64748B', textDecoration: 'none',
                fontSize: '15px', fontWeight: 600,
              }}>
                <Home size={16} strokeWidth={2} />
                Startseite
              </a>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // ── Results — Hero + Overlap-Panel (optin FIRST, then cards) ─────────────
  return (
    <Container>
      <div style={{ position: 'relative' }}>
        {/* Hero with embedded "Auswahl ändern" pill — ONLY in results phase */}
        <ResultsHero />

        <OverlapPanel>
          {/* 1. Email opt-in — prominently at the top */}
          {session && (
            <div style={{ marginBottom: '40px' }}>
              <TravelFunnelOptin
                destinations={results.map(d => d.name)}
                moods={session.mood_selection ?? []}
                season={session.season}
                budget={session.budget}
                duration={session.duration}
                sessionId={sessionId}
                personalNote={session.personal_note ?? undefined}
              />
            </div>
          )}

          {/* 2. Heading */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(22px, 3.5vw, 34px)',
              fontWeight: 800, color: '#0F172A',
              letterSpacing: '-0.02em', margin: '0 0 8px',
            }}>
              Deine 3 Traumreisen
            </h1>
            <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
              Persönlich ausgewählt auf Basis deiner Wünsche
            </p>
          </div>

          {/* 3. Result cards — affiliate clicks handled inside TravelResultCard */}
          <div className="funnel-results-grid funnel-results-fade">
            {results.map((dest, i) => (
              <TravelResultCard
                key={i}
                destination={dest}
                index={i}
                sessionId={sessionId}
                destinationSlug={getDestinationSlug(dest.name)}
              />
            ))}
          </div>

          {/* 4. Car rental hint for eligible destinations */}
          <CarRentalHint destinations={results} />
        </OverlapPanel>
      </div>
    </Container>
  );
}
