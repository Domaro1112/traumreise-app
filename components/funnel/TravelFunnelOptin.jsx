'use client';

import { useState } from 'react';
import { Bell, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function TravelFunnelOptin({ destinations, moods, season, budget, sessionId }) {
  const [email,       setEmail]       = useState('');
  const [consent,     setConsent]     = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !consent || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/travel-finder/lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email, consent, sessionId,
          destinations, moods, season, budget,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Fehler');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Anmeldung fehlgeschlagen. Bitte versuche es nochmals.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
          border: '1.5px solid #BBF7D0',
          borderRadius: '20px',
          padding: 'clamp(24px, 4vw, 36px)',
          textAlign: 'center',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <CheckCircle2 size={40} strokeWidth={2} color="#16A34A" />
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(16px, 2.5vw, 19px)',
            fontWeight: 700,
            color: '#15803D',
            margin: 0,
          }}
        >
          Dein Reisemonkey-Wecker ist aktiviert!
        </h3>
        <p style={{ fontSize: '14px', color: '#166534', lineHeight: 1.7, margin: 0, maxWidth: '440px' }}>
          Wir melden uns, sobald eines deiner Traumziele besonders interessant wird.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 60%, #0369A1 100%)',
        borderRadius: '20px',
        padding: 'clamp(22px, 4vw, 36px)',
        marginBottom: '32px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Bell size={20} strokeWidth={2} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(15px, 2.5vw, 19px)',
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 5px',
            }}
          >
            Willst du wissen, wann deine Traumziele am günstigsten sind?
          </h3>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, margin: 0 }}>
            Trag deine E-Mail ein – wir sagen dir Bescheid, wann deine ausgewählten Reiseziele
            besonders attraktiv sind und wann die beste Reisezeit beginnt.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="deine@email.de"
            required
            style={{
              flex: 1,
              minWidth: '190px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.96)',
              color: '#0F172A',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!email || !consent || submitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '12px 22px',
              borderRadius: '12px',
              border: 'none',
              background: (!email || !consent || submitting) ? 'rgba(255,255,255,0.35)' : '#FFFFFF',
              color: (!email || !consent || submitting) ? 'rgba(255,255,255,0.55)' : '#0284C7',
              fontSize: '14px',
              fontWeight: 700,
              cursor: (!email || !consent || submitting) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            {submitting
              ? <Loader2 size={15} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
              : <Bell size={15} strokeWidth={2} />}
            {submitting ? 'Wird aktiviert…' : 'Reisewecker aktivieren'}
          </button>
        </div>

        {/* Consent */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            style={{ marginTop: '2px', width: '15px', height: '15px', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            Ich möchte den kostenlosen Reisezeit- und Preiswecker erhalten und akzeptiere die{' '}
            <a href="/datenschutz" style={{ color: '#fff', textDecoration: 'underline' }}>
              Datenschutzhinweise
            </a>.
          </span>
        </label>

        {error && (
          <p style={{ fontSize: '13px', color: '#FEF08A', marginTop: '8px', margin: '8px 0 0' }}>
            {error}
          </p>
        )}
      </form>

      {/* Trust */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '14px' }}>
        <ShieldCheck size={12} strokeWidth={2} color="rgba(255,255,255,0.6)" />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
          Kein Spam. Jederzeit abbestellbar. DSGVO-konform.
        </span>
      </div>
    </div>
  );
}
