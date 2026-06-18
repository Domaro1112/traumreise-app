'use client';

import { useState } from 'react';

const INQUIRY_TYPES = [
  'Allgemeine Frage', 'Feedback', 'Technisches Problem',
  'Presse', 'Kooperation', 'Sonstiges',
];

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '12px',
  border: '1.5px solid #E2E8F0', background: '#FFFFFF',
  fontSize: '15px', color: '#0F172A', fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#374151', marginBottom: '6px',
};

const req = <span style={{ color: '#EF4444' }}>*</span>;

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', inquiry_type: '', message: '', consent: false,
  });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name = 'Name ist ein Pflichtfeld.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Bitte eine gültige E-Mail-Adresse angeben.';
    if (!form.subject.trim()) e.subject = 'Betreff ist ein Pflichtfeld.';
    if (!form.inquiry_type)   e.inquiry_type = 'Bitte ein Anliegen wählen.';
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = 'Nachricht muss mindestens 10 Zeichen lang sein.';
    if (!form.consent) e.consent = 'Bitte stimme der Verarbeitung deiner Daten zu.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/contact-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error || 'Ein Fehler ist aufgetreten.'); return; }
      setSuccess(true);
    } catch {
      setServerError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{
        padding: '48px 32px', textAlign: 'center',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFEFF 100%)',
        borderRadius: '20px', border: '1.5px solid rgba(16,185,129,0.20)',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'rgba(16,185,129,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px',
        }}>
          Nachricht erhalten!
        </h3>
        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto' }}>
          Danke für deine Nachricht. Wir haben deine Anfrage erhalten und melden uns so schnell wie möglich zurück.
        </p>
      </div>
    );
  }

  const fieldBorder = (key) => ({ ...inputStyle, borderColor: errors[key] ? '#EF4444' : '#E2E8F0' });
  const errMsg = (key) => errors[key] && (
    <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors[key]}</div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Name + E-Mail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Name {req}</label>
          <input
            type="text" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Dein Name" style={fieldBorder('name')}
          />
          {errMsg('name')}
        </div>
        <div>
          <label style={labelStyle}>E-Mail {req}</label>
          <input
            type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="deine@email.de" style={fieldBorder('email')}
          />
          {errMsg('email')}
        </div>
      </div>

      {/* Betreff + Anliegen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Betreff {req}</label>
          <input
            type="text" value={form.subject} onChange={e => set('subject', e.target.value)}
            placeholder="Worum geht es?" style={fieldBorder('subject')}
          />
          {errMsg('subject')}
        </div>
        <div>
          <label style={labelStyle}>Anliegen {req}</label>
          <select
            value={form.inquiry_type} onChange={e => set('inquiry_type', e.target.value)}
            style={{ ...fieldBorder('inquiry_type'), appearance: 'none', cursor: 'pointer', color: form.inquiry_type ? '#0F172A' : '#94A3B8' }}
          >
            <option value="">Bitte wählen …</option>
            {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errMsg('inquiry_type')}
        </div>
      </div>

      {/* Nachricht */}
      <div>
        <label style={labelStyle}>Nachricht {req}</label>
        <textarea
          value={form.message} onChange={e => set('message', e.target.value)}
          rows={5} placeholder="Wie können wir dir helfen?"
          style={{ ...fieldBorder('message'), resize: 'vertical' }}
        />
        {errMsg('message')}
      </div>

      {/* Einwilligung */}
      <div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)}
            style={{ marginTop: '3px', flexShrink: 0, accentColor: '#0EA5E9', width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '13px', color: errors.consent ? '#EF4444' : '#64748B', lineHeight: 1.55 }}>
            Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert und verarbeitet werden.{' '}
            <a href="/datenschutz" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Datenschutz</a>
          </span>
        </label>
        {errMsg('consent')}
      </div>

      {serverError && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px',
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)',
          color: '#DC2626', fontSize: '14px',
        }}>
          {serverError}
        </div>
      )}

      <button
        type="submit" disabled={submitting}
        style={{
          alignSelf: 'flex-start', padding: '14px 32px',
          borderRadius: '14px', border: 'none',
          background: submitting ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          cursor: submitting ? 'not-allowed' : 'pointer',
          boxShadow: submitting ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
        }}
      >
        {submitting ? 'Wird gesendet …' : 'Nachricht senden'}
      </button>

      <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
        Deine Angaben werden ausschließlich zur Bearbeitung deiner Anfrage verwendet.{' '}
        Weitere Informationen findest du in unserer{' '}
        <a href="/datenschutz" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Datenschutzerklärung</a>.
      </p>
    </form>
  );
}
