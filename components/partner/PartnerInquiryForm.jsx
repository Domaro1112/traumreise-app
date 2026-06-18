'use client';

import { useState } from 'react';

const PARTNER_TYPES = [
  'Hotel', 'Reiseanbieter', 'Tourenanbieter', 'Tourismusregion',
  'Mietwagenanbieter', 'Affiliate-Netzwerk', 'Sonstiges',
];
const COOPERATION_TYPES = [
  'Affiliate', 'Inspiration-Platzierung', 'Sponsored Card',
  'Content-Kooperation', 'Sonstiges',
];

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '12px',
  border: '1.5px solid #E2E8F0', background: '#FFFFFF',
  fontSize: '15px', color: '#0F172A', fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#374151', marginBottom: '6px',
};

export default function PartnerInquiryForm() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', website: '',
    partner_type: '', cooperation_type: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name ist ein Pflichtfeld.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Bitte eine gültige E-Mail-Adresse angeben.';
    }
    if (!form.message.trim()) e.message = 'Nachricht ist ein Pflichtfeld.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/partner-inquiries', {
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
          background: 'rgba(16,185,129,0.12)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px',
        }}>
          Anfrage erhalten!
        </h3>
        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.65, maxWidth: '460px', margin: '0 auto' }}>
          Vielen Dank für dein Interesse. Wir melden uns in der Regel innerhalb von 2–3 Werktagen bei dir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Name + Unternehmen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>
            Name <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Dein Name"
            style={{ ...inputStyle, borderColor: errors.name ? '#EF4444' : '#E2E8F0' }}
          />
          {errors.name && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.name}</div>}
        </div>
        <div>
          <label style={labelStyle}>Unternehmen / Organisation</label>
          <input
            type="text" value={form.company} onChange={e => set('company', e.target.value)}
            placeholder="Unternehmensname"
            style={inputStyle}
          />
        </div>
      </div>

      {/* E-Mail + Website */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>
            E-Mail <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="deine@email.de"
            style={{ ...inputStyle, borderColor: errors.email ? '#EF4444' : '#E2E8F0' }}
          />
          {errors.email && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.email}</div>}
        </div>
        <div>
          <label style={labelStyle}>Website</label>
          <input
            type="text" value={form.website} onChange={e => set('website', e.target.value)}
            placeholder="https://deine-website.de"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Partnertyp + Kooperation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Partnertyp</label>
          <select
            value={form.partner_type} onChange={e => set('partner_type', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: form.partner_type ? '#0F172A' : '#94A3B8' }}
          >
            <option value="">Bitte wählen …</option>
            {PARTNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Gewünschte Kooperationsart</label>
          <select
            value={form.cooperation_type} onChange={e => set('cooperation_type', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: form.cooperation_type ? '#0F172A' : '#94A3B8' }}
          >
            <option value="">Bitte wählen …</option>
            {COOPERATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Nachricht */}
      <div>
        <label style={labelStyle}>
          Nachricht <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <textarea
          value={form.message} onChange={e => set('message', e.target.value)}
          rows={5}
          placeholder="Erzähl uns kurz, was du anbietest und wie du dir eine Zusammenarbeit vorstellst …"
          style={{ ...inputStyle, resize: 'vertical', borderColor: errors.message ? '#EF4444' : '#E2E8F0' }}
        />
        {errors.message && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.message}</div>}
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
          alignSelf: 'flex-start',
          padding: '14px 32px', borderRadius: '14px', border: 'none',
          background: submitting
            ? '#94A3B8'
            : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          cursor: submitting ? 'not-allowed' : 'pointer',
          boxShadow: submitting ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
          transition: 'all 0.15s',
        }}
      >
        {submitting ? 'Wird gesendet …' : 'Partnerschaft anfragen'}
      </button>

      <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
        Mit dem Absenden stimmst du der Verarbeitung deiner Daten zur Bearbeitung deiner Anfrage zu.
        Eine Anfrage ist kostenlos und unverbindlich.
      </p>
    </form>
  );
}
