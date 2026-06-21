'use client';

import { useState } from 'react';

const CREATOR_TYPES = [
  'Reiseblogger', 'Instagram Creator', 'TikTok Creator', 'YouTube Creator',
  'UGC Creator', 'Camper / Vanlife', 'Familienreise', 'Urlaub mit Hund', 'Sonstiges',
];

const TOPICS = [
  'Familienurlaub', 'Alleinerziehende mit Kind', 'Camper & Roadtrips',
  'Urlaub mit Hund', 'Städtereisen', 'Strandurlaub', 'Wellness & Romantik',
  'Aktivurlaub', 'Budgetreisen', 'Luxusreisen',
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

function ErrMsg({ msg }) {
  if (!msg) return null;
  return <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{msg}</div>;
}

export default function CreatorApplicationForm() {
  const [form, setForm] = useState({
    name: '', email: '', profile_url: '', creator_type: '', topics: [], message: '', consent: false,
  });
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const toggleTopic = (topic) => {
    setForm(f => ({
      ...f,
      topics: f.topics.includes(topic)
        ? f.topics.filter(t => t !== topic)
        : [...f.topics, topic],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name  = 'Name ist ein Pflichtfeld.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Bitte eine gültige E-Mail-Adresse angeben.';
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
      const res = await fetch('/api/creator-applications', {
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
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'rgba(16,185,129,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px',
        }}>
          Danke für deine Bewerbung!
        </h3>
        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto' }}>
          Wir prüfen deine Angaben und melden uns bei dir, wenn dein Profil zu ApeAround passt.
        </p>
      </div>
    );
  }

  const border = (k) => ({ ...inputStyle, borderColor: errors[k] ? '#EF4444' : '#E2E8F0' });

  return (
    <form id="creator-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* Name + E-Mail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle} htmlFor="ca-name">Name {req}</label>
          <input
            id="ca-name" type="text" value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Dein Name" style={border('name')}
            autoComplete="name"
          />
          <ErrMsg msg={errors.name} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="ca-email">E-Mail {req}</label>
          <input
            id="ca-email" type="email" value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="deine@email.de" style={border('email')}
            autoComplete="email"
          />
          <ErrMsg msg={errors.email} />
        </div>
      </div>

      {/* Social-/Blog-Link + Creator-Art */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle} htmlFor="ca-profile">Social-Media-Link oder Blog-Link</label>
          <input
            id="ca-profile" type="url" value={form.profile_url}
            onChange={e => set('profile_url', e.target.value)}
            placeholder="https://instagram.com/dein-profil"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="ca-type">Creator-Art</label>
          <select
            id="ca-type" value={form.creator_type}
            onChange={e => set('creator_type', e.target.value)}
            style={{
              ...inputStyle, appearance: 'none', cursor: 'pointer',
              color: form.creator_type ? '#0F172A' : '#94A3B8',
            }}
          >
            <option value="">Bitte wählen …</option>
            {CREATOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Themenschwerpunkte */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ ...labelStyle, marginBottom: '12px' }}>Themenschwerpunkte</legend>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
        }}>
          {TOPICS.map(topic => {
            const checked = form.topics.includes(topic);
            return (
              <label
                key={topic}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                  border: `1.5px solid ${checked ? '#0EA5E9' : '#E2E8F0'}`,
                  background: checked ? 'rgba(14,165,233,0.06)' : '#FFFFFF',
                  transition: 'all 0.12s',
                  fontSize: '14px', color: checked ? '#0EA5E9' : '#374151',
                  fontWeight: checked ? 600 : 400,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTopic(topic)}
                  style={{ accentColor: '#0EA5E9', width: '15px', height: '15px', flexShrink: 0 }}
                />
                {topic}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Kurzbeschreibung */}
      <div>
        <label style={labelStyle} htmlFor="ca-message">Nachricht / Kurzvorstellung</label>
        <textarea
          id="ca-message" value={form.message}
          onChange={e => set('message', e.target.value)}
          rows={5}
          placeholder="Erzähl uns kurz, was du machst, welche Reichweite du hast und wie du dir eine Zusammenarbeit mit ApeAround vorstellst …"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Einwilligung */}
      <div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox" checked={form.consent}
            onChange={e => set('consent', e.target.checked)}
            style={{ marginTop: '3px', flexShrink: 0, accentColor: '#0EA5E9', width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '13px', color: errors.consent ? '#EF4444' : '#64748B', lineHeight: 1.55 }}>
            Ich bin damit einverstanden, dass ApeAround meine Angaben zur Prüfung einer möglichen Zusammenarbeit verarbeitet.{' '}
            <a href="/datenschutz" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Datenschutz</a>
          </span>
        </label>
        <ErrMsg msg={errors.consent} />
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
          alignSelf: 'flex-start', padding: '15px 36px', borderRadius: '14px', border: 'none',
          background: submitting ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          cursor: submitting ? 'not-allowed' : 'pointer',
          boxShadow: submitting ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
        }}
      >
        {submitting ? 'Wird gesendet …' : 'Bewerbung absenden'}
      </button>

      <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
        Deine Angaben werden ausschließlich zur Prüfung deiner Creator-Bewerbung verwendet.{' '}
        Weitere Informationen in unserer{' '}
        <a href="/datenschutz" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Datenschutzerklärung</a>.
      </p>
    </form>
  );
}
