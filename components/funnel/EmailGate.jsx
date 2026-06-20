'use client';

import { useState } from 'react';

const CONSENT_TEXT =
  'Ich möchte den ApeAround-Newsletter erhalten und gelegentlich Reiseideen, Tipps, ' +
  'Angebote und Neuigkeiten per E-Mail bekommen. Ich kann mich jederzeit wieder abmelden. ' +
  'Die Anmeldung wird erst nach Bestätigung per E-Mail aktiv.';

export default function EmailGate({ sessionId, onComplete }) {
  const [email,    setEmail]    = useState('');
  const [consent,  setConsent]  = useState(false); // newsletter opt-in, NOT pre-checked
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid) { setError('Bitte eine gültige E-Mail-Adresse eingeben.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/funnel/email', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ sessionId, email: email.trim(), newsletterConsent: consent }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.'); return; }
      onComplete({ email: email.trim(), newsletterQueued: data.newsletterQueued ?? false });
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #12324a 60%, #0c3a52 100%)',
      padding: '24px',
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '24px', maxWidth: '520px', width: '100%',
        padding: 'clamp(28px, 5vw, 48px) clamp(24px, 5vw, 40px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.30)',
      }}>
        {/* Icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px', marginBottom: '24px',
          background: 'linear-gradient(135deg, #EFF6FF, #ECFEFF)',
          border: '1.5px solid rgba(14,165,233,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 900,
          color: '#0F172A', margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-0.02em',
        }}>
          Deine persönliche Reiseauswertung ist bereit
        </h1>

        <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: '0 0 10px' }}>
          Wir haben deine Angaben analysiert und passende Reiseziele, Empfehlungen, Budget-Hinweise
          und erste Ideen für deine Traumreise vorbereitet. Gib deine E-Mail-Adresse ein, damit wir
          dir deinen persönlichen Ergebnis-Link zuordnen und du deine Auswertung später wieder öffnen kannst.
        </p>

        <div style={{
          padding: '12px 16px', borderRadius: '10px', marginBottom: '24px',
          background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)',
          fontSize: '13px', color: '#475569', lineHeight: 1.6,
        }}>
          <strong style={{ color: '#0F172A' }}>Hinweis:</strong>{' '}
          Deine E-Mail-Adresse verwenden wir zunächst nur für deine Reiseauswertung.
          Den ApeAround-Newsletter erhältst du nur, wenn du unten freiwillig zustimmst und
          deine Anmeldung anschließend per E-Mail bestätigst.
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* E-Mail */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '13px', fontWeight: 700,
              color: '#374151', marginBottom: '6px',
            }}>
              E-Mail-Adresse <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="deine@email.de"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 14px', borderRadius: '12px',
                border: `1.5px solid ${error ? '#EF4444' : emailValid && email ? '#0EA5E9' : '#E2E8F0'}`,
                background: '#F8FAFC', fontSize: '15px', color: '#0F172A',
                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
              Pflichtfeld für deine persönliche Auswertung
            </div>
          </div>

          {/* Newsletter opt-in — NOT pre-checked */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '20px' }}>
            <div
              onClick={() => !loading && setConsent(c => !c)}
              role="checkbox" aria-checked={consent}
              style={{
                width: '20px', height: '20px', minWidth: '20px', borderRadius: '6px',
                border: `2px solid ${consent ? '#0EA5E9' : '#CBD5E1'}`,
                background: consent ? '#EFF6FF' : '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '2px', cursor: 'pointer', flexShrink: 0,
              }}
            >
              {consent && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
              {CONSENT_TEXT}
            </span>
          </label>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)',
              color: '#DC2626', fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading || !emailValid}
            style={{
              width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
              background: loading || !emailValid
                ? '#E2E8F0'
                : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              color: loading || !emailValid ? '#94A3B8' : '#FFFFFF',
              fontSize: '16px', fontWeight: 700, cursor: loading || !emailValid ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              boxShadow: loading || !emailValid ? 'none' : '0 6px 24px rgba(14,165,233,0.35)',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'Einen Moment …' : 'Meine Reiseauswertung anzeigen'}
          </button>

          {/* Trust signals */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'Kein Spam' },
              { icon: '✉️', text: 'Newsletter nur nach Bestätigung' },
              { icon: '🇪🇺', text: 'DSGVO-konform' },
            ].map(({ icon, text }) => (
              <span key={text} style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {icon} {text}
              </span>
            ))}
          </div>

          <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: '12px 0 0', lineHeight: 1.5 }}>
            Deine Daten werden ausschließlich zur Nutzung von ApeAround verwendet.{' '}
            <a href="/datenschutz" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Datenschutzerklärung</a>
          </p>
        </form>
      </div>
    </div>
  );
}
