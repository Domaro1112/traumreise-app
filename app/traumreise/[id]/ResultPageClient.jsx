'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TravelResultView from '@/components/finder/TravelResultView';
import TravelOfferQuickLinks from '@/components/finder/TravelOfferQuickLinks';
import EmailGate from '@/components/funnel/EmailGate';
import { Mail, CheckCircle2 } from 'lucide-react';

/* ─── optionales Newsletter-Popup (Double-Opt-in über /api/funnel/email) ─── */
function EmailPopup({ sessionId, onClose }) {
  const [email,   setEmail]   = useState('');
  const [agreed,  setAgreed]  = useState(false);
  const [done,    setDone]    = useState(false);
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState('');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && agreed;

  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    setError('');
    try {
      const res  = await fetch('/api/funnel/email', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ sessionId, email: email.trim(), newsletterConsent: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || 'Das hat leider nicht geklappt. Bitte versuche es erneut.'); return; }
      if (data.alreadySubscribed) { setDone('already'); return; }
      if (!data.newsletterQueued) { setError('Die Bestätigungsmail konnte gerade nicht versendet werden. Bitte versuche es später erneut.'); return; }
      setDone(true);
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSending(false);
    }
  };

  if (done) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15,23,42,0.20)', maxWidth: '420px', width: '100%', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '1.5px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={28} strokeWidth={1.5} color="#0EA5E9" />
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>{done === 'already' ? 'Du bist schon dabei!' : 'Fast geschafft!'}</h3>
        {done === 'already'
          ? <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>Diese Adresse ist bereits für den Newsletter angemeldet und bestätigt.</p>
          : <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>Wir haben dir eine <strong style={{ color: '#0EA5E9' }}>Bestätigungsmail</strong> geschickt. Erst wenn du den Link darin anklickst, ist die Anmeldung aktiv.</p>}
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
            Gelegentlich neue Reiseideen, Tipps und Angebote von ApeAround – kostenlos und jederzeit abbestellbar.
          </p>
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de"
          style={{ width: '100%', boxSizing: 'border-box', background: '#F8FAFF', border: `2px solid ${email.includes('@') ? '#0EA5E9' : '#E2E8F0'}`, borderRadius: '12px', padding: '13px 16px', color: '#0F172A', fontSize: '15px', outline: 'none', marginBottom: '14px', fontFamily: 'inherit' }} />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
          <div onClick={() => setAgreed(a => !a)} style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '5px', border: `2px solid ${agreed ? '#0EA5E9' : '#CBD5E1'}`, background: agreed ? '#EFF6FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px', cursor: 'pointer' }}>
            {agreed && <span style={{ color: '#0EA5E9', fontSize: '13px', fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6 }}>
            Ich möchte den ApeAround-Newsletter mit Reiseideen, Tipps und Angeboten per E-Mail erhalten. Abmeldung jederzeit möglich. Hinweise in der <a href="/datenschutz" target="_blank" rel="noopener noreferrer" style={{ color: '#0EA5E9' }}>Datenschutzerklärung</a>.
          </span>
        </label>
        {error && <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#B91C1C' }}>{error}</p>}
        <button type="button" onClick={submit} disabled={!valid || sending}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: valid ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F1F5F9', color: valid ? '#fff' : '#94A3B8', fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Mail size={16} strokeWidth={2} />
          {sending ? 'Wird gesendet …' : 'Kostenlos anmelden'}
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '12px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={11} strokeWidth={2} /> Double-Opt-in
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
  needsEmailGate, funnelType = null,
}) {
  const router = useRouter();

  // All hooks must be declared before any conditional return (Rules of Hooks)
  const [showEmail,        setShowEmail]        = useState(false);
  const [gatePassed,       setGatePassed]       = useState(!needsEmailGate);
  const [newsletterEmail,  setNewsletterEmail]  = useState(null);
  const [showNewsBanner,   setShowNewsBanner]   = useState(false);
  const results     = initialResults;
  const packingList = initialPackingList;

  // ── Gate: render before results ────────────────────────────────────────
  if (!gatePassed) {
    return (
      <EmailGate
        sessionId={sessionId}
        funnelType={funnelType}
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
      <TravelResultView
        results={results}
        personality={personality}
        interests={interests}
        packingList={packingList}
        surprise={surprise}
        duration={duration}
        budget={budget}
        phase2Loading={false}
        onReset={() => router.push('/')}
        onEmail={() => setShowEmail(true)}
        renderAfterHero={<TravelOfferQuickLinks results={results} />}
        showHotelSection={false}
      />

      {showEmail && (
        <EmailPopup
          sessionId={sessionId}
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
