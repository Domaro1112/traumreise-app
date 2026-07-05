'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TravelResultView from '@/components/finder/TravelResultView';
import TravelOfferQuickLinks from '@/components/finder/TravelOfferQuickLinks';
import EmailGate from '@/components/funnel/EmailGate';
import { Mail, CheckCircle2 } from 'lucide-react';

/* ─── optional newsletter popup (kept unchanged) ───────────────────────── */
function EmailPopup({ destination, onClose }) {
  const [email,  setEmail]  = useState('');
  const [agreed, setAgreed] = useState(false);
  const [done,   setDone]   = useState(false);
  const valid = email.includes('@') && email.includes('.') && agreed;

  if (done) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15,23,42,0.20)', maxWidth: '420px', width: '100%', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '1.5px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={28} strokeWidth={1.5} color="#0EA5E9" />
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Fast geschafft!</h3>
        <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>Wir haben dir eine <strong style={{ color: '#0EA5E9' }}>Bestätigungsmail</strong> geschickt.</p>
        <button type="button" onClick={onClose} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
          Alles klar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15,23,42,0.20)', maxWidth: '420px', width: '100%', padding: '36px 32px', position: 'relative' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#94A3B8', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Reise-Inspiration ins Postfach</h3>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>
            {destination ? `Erhalte deinen ${destination}-Reiseplan + wöchentlich die besten Deals.` : 'Wöchentlich die besten Deals & Inspiration.'}
          </p>
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de"
          style={{ width: '100%', boxSizing: 'border-box', background: '#F8FAFF', border: `2px solid ${email.includes('@') ? '#0EA5E9' : '#E2E8F0'}`, borderRadius: '12px', padding: '13px 16px', color: '#0F172A', fontSize: '15px', outline: 'none', marginBottom: '14px', fontFamily: 'inherit' }} />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
          <div onClick={() => setAgreed(a => !a)} style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '5px', border: `2px solid ${agreed ? '#0EA5E9' : '#CBD5E1'}`, background: agreed ? '#EFF6FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px', cursor: 'pointer' }}>
            {agreed && <span style={{ color: '#0EA5E9', fontSize: '13px', fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6 }}>
            Ich bin einverstanden, Reise-Inspiration & Angebote per Mail zu erhalten. Abmeldung jederzeit möglich.
          </span>
        </label>
        <button type="button" onClick={() => valid && setDone(true)} disabled={!valid}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: valid ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F1F5F9', color: valid ? '#fff' : '#94A3B8', fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Mail size={16} strokeWidth={2} />
          Kostenlos anmelden
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '12px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={11} strokeWidth={2} /> DSGVO-konform
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Kein Spam</span>
        </div>
      </div>
    </div>
  );
}

/* ─── newsletter confirmation banner ───────────────────────────────────── */
function NewsletterBanner({ email, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid rgba(14,165,233,0.25)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.14)', zIndex: 150,
      padding: '14px 20px', maxWidth: '480px', width: 'calc(100% - 32px)',
      display: 'flex', alignItems: 'flex-start', gap: '12px',
    }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: 'rgba(14,165,233,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mail size={18} strokeWidth={1.8} color="#0EA5E9" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>Bestätigungsmail wurde gesendet</div>
        <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
          Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet.
          Bitte bestätige deine Newsletter-Anmeldung.
        </div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>×</button>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────────── */
export default function ResultPageClient({
  sessionId, results: initialResults, personality, interests,
  packingList: initialPackingList, surprise, duration, budget,
  needsEmailGate,
}) {
  const router = useRouter();

  // All hooks must be declared before any conditional return (Rules of Hooks)
  const [showEmail,        setShowEmail]        = useState(false);
  const [gatePassed,       setGatePassed]       = useState(!needsEmailGate);
  const [newsletterEmail,  setNewsletterEmail]  = useState(null);
  const [showNewsBanner,   setShowNewsBanner]   = useState(false);
  const [results,          setResults]          = useState(initialResults);
  const [packingList,      setPackingList]       = useState(initialPackingList);
  const [phase2Loading,    setPhase2Loading]    = useState(false);
  const phase2Triggered = useRef(false);

  // Phase 2 fetch — only runs after the email gate is passed
  useEffect(() => {
    if (!gatePassed) return;
    const phase2Complete = (results?.[0]?.hotels?.length ?? 0) > 0;
    if (phase2Complete || !sessionId || phase2Triggered.current) return;

    phase2Triggered.current = true;
    setPhase2Loading(true);

    fetch('/api/ai/travel-details', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: sessionId }),
    })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => {
        if (!data.destinations?.length) return;
        setResults(prev =>
          prev.map((dest, i) => {
            const p2 = data.destinations[i];
            if (!p2) return dest;
            return { ...dest, hotels: p2.hotels ?? dest.hotels, activities: p2.activities ?? dest.activities, itinerary: p2.itinerary ?? dest.itinerary };
          }),
        );
        if (data.packingList) setPackingList(data.packingList);
      })
      .catch(err => console.error('[ResultPageClient] Phase 2 fetch error:', err))
      .finally(() => setPhase2Loading(false));
  }, [sessionId, gatePassed]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Gate: render before results ────────────────────────────────────────
  if (!gatePassed) {
    return (
      <EmailGate
        sessionId={sessionId}
        onComplete={({ email, newsletterQueued }) => {
          setGatePassed(true);
          if (newsletterQueued) {
            setNewsletterEmail(email);
            setShowNewsBanner(true);
          }
        }}
      />
    );
  }

  // ── Results ────────────────────────────────────────────────────────────
  return (
    <>
      <TravelOfferQuickLinks results={results} />
      <TravelResultView
        results={results}
        personality={personality}
        interests={interests}
        packingList={packingList}
        surprise={surprise}
        duration={duration}
        budget={budget}
        phase2Loading={phase2Loading}
        onReset={() => router.push('/')}
        onEmail={() => setShowEmail(true)}
      />

      {showEmail && (
        <EmailPopup
          destination={results?.[0]?.destination || ''}
          onClose={() => setShowEmail(false)}
        />
      )}

      {showNewsBanner && newsletterEmail && (
        <NewsletterBanner
          email={newsletterEmail}
          onClose={() => setShowNewsBanner(false)}
        />
      )}
    </>
  );
}
