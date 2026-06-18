'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildProviderTargetUrl, buildHomepageSuggestionHref, normalizeImageUrl, isValidImageUrl } from '@/lib/homepage-suggestions';

const BADGE_OPTIONS = ['Beliebt', 'Traumziel', 'Geheimtipp', 'Trending'];
const PROVIDER_OPTIONS = [
  { value: 'booking',           label: 'Booking.com' },
  { value: 'expedia',           label: 'Expedia' },
  { value: 'check24_hotel',     label: 'CHECK24 Hotel' },
  { value: 'check24_urlaub',    label: 'CHECK24 Urlaub / Pauschalreise' },
  { value: 'check24_mietwagen', label: 'CHECK24 Mietwagen' },
  { value: 'trivago',           label: 'Trivago' },
  { value: 'holidaycheck',      label: 'HolidayCheck' },
  { value: 'getyourguide',      label: 'GetYourGuide' },
];
const LINK_MODE_OPTIONS = [
  { value: 'affiliate', label: 'Affiliate-Link (/go/[provider])' },
  { value: 'internal',  label: 'Interner Link (Next.js-Seite)' },
  { value: 'funnel',    label: 'Zum Reiseplaner (/#reiseplaner)' },
];

const FIELD_STYLE = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1.5px solid #E2E8F0',
  background: '#F8FAFF',
  color: '#0F172A',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
};

const LABEL_STYLE = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: '#475569',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '6px',
};

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={LABEL_STYLE}>{label}</label>
      {hint && <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 6px' }}>{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '40px', height: '22px',
          borderRadius: '11px',
          background: checked ? '#0EA5E9' : '#CBD5E1',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '16px', height: '16px',
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ fontSize: '14px', color: '#475569' }}>{label}</span>
    </label>
  );
}

const EMPTY = {
  title: '',
  country: '',
  badge: '',
  description: '',
  image_url: '',
  image_alt: '',
  sort_order: 0,
  is_active: true,
  is_featured: false,
  provider_key: 'booking',
  affiliate_target_url: '',
  search_query: '',
  link_mode: 'affiliate',
  open_in_new_tab: true,
  href: '',
};

export default function SuggestionFormClient({ initial }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const normalizedInitial = initial
    ? { ...initial, image_url: normalizeImageUrl(initial.image_url ?? '') }
    : undefined;
  const [form, setForm] = useState({ ...EMPTY, ...normalizedInitial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const val = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const previewHref = buildHomepageSuggestionHref(form);
  const generatedTargetUrl = buildProviderTargetUrl(form.provider_key, form.search_query);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedImageUrl = normalizeImageUrl(form.image_url);
    if (!isValidImageUrl(normalizedImageUrl)) {
      setError('Bitte nutze einen lokalen Pfad wie /images/... oder eine vollständige https:// Bild-URL.');
      return;
    }

    setSaving(true);
    const payload = { ...form, image_url: normalizedImageUrl };

    const url    = isEdit ? `/api/admin/homepage-suggestions/${initial.id}` : '/api/admin/homepage-suggestions';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Fehler beim Speichern');
      setForm(prev => ({ ...prev, image_url: normalizedImageUrl }));
      router.push('/admin/homepage-suggestions');
      router.refresh();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Section: Inhalt */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 20px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
          Inhalt
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <Field label="Titel *">
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              required
              placeholder="z.B. Bali"
              style={FIELD_STYLE}
            />
          </Field>

          <Field label="Land">
            <input
              type="text"
              value={form.country}
              onChange={set('country')}
              placeholder="z.B. Indonesien"
              style={FIELD_STYLE}
            />
          </Field>
        </div>

        <Field label="Badge">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {BADGE_OPTIONS.map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, badge: prev.badge === b ? '' : b }))}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid',
                  borderColor: form.badge === b ? '#0EA5E9' : '#E2E8F0',
                  background: form.badge === b ? '#EFF6FF' : '#F8FAFF',
                  color: form.badge === b ? '#0284C7' : '#64748B',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Beschreibung">
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="z.B. Entspannung, Kultur & tropische Strände"
            rows={2}
            style={{ ...FIELD_STYLE, resize: 'vertical' }}
          />
        </Field>

        <Field label="Reihenfolge" hint="Niedrigere Zahl = weiter vorne">
          <input
            type="number"
            value={form.sort_order}
            onChange={set('sort_order')}
            min={0}
            style={{ ...FIELD_STYLE, width: '120px' }}
          />
        </Field>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Toggle checked={form.is_active} onChange={(v) => setForm(p => ({ ...p, is_active: v }))} label="Aktiv (auf Startseite sichtbar)" />
          <Toggle checked={form.is_featured} onChange={(v) => setForm(p => ({ ...p, is_featured: v }))} label="Featured" />
        </div>
      </div>

      {/* Section: Bild */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 20px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
          Bild
        </h3>

        <Field label="Bild-URL *" hint="Lokaler Pfad: /images/reisevorschlag/bali.jpg · Externe URL: https://example.com/bild.jpg">
          <input
            type="text"
            value={form.image_url}
            onChange={set('image_url')}
            placeholder="/images/reisevorschlag/bali.jpg"
            style={FIELD_STYLE}
          />
        </Field>

        <Field label="Alt-Text">
          <input
            type="text"
            value={form.image_alt}
            onChange={set('image_alt')}
            placeholder="z.B. Bali, Indonesien"
            style={FIELD_STYLE}
          />
        </Field>

        {form.image_url && (
          <div style={{ marginTop: '4px' }}>
            <img
              src={form.image_url}
              alt="Vorschau"
              style={{ width: '100%', maxWidth: '320px', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid #E2E8F0' }}
            />
          </div>
        )}
      </div>

      {/* Section: Link & Affiliate */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 20px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
          Link & Affiliate
        </h3>

        <Field label="Link-Modus">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {LINK_MODE_OPTIONS.map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '10px 12px', borderRadius: '8px', border: `1.5px solid ${form.link_mode === opt.value ? '#BAE6FD' : '#E2E8F0'}`, background: form.link_mode === opt.value ? '#EFF6FF' : '#F8FAFF' }}>
                <input
                  type="radio"
                  name="link_mode"
                  value={opt.value}
                  checked={form.link_mode === opt.value}
                  onChange={() => setForm(p => ({ ...p, link_mode: opt.value }))}
                  style={{ marginTop: '2px' }}
                />
                <span style={{ fontSize: '14px', color: form.link_mode === opt.value ? '#0284C7' : '#475569', fontWeight: form.link_mode === opt.value ? 600 : 400 }}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </Field>

        {form.link_mode === 'affiliate' && (
          <>
            <Field label="Anbieter">
              <select value={form.provider_key} onChange={set('provider_key')} style={FIELD_STYLE}>
                <option value="">— kein Anbieter —</option>
                {PROVIDER_OPTIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Suchbegriff" hint="Wird automatisch in eine Such-URL umgewandelt">
              <input
                type="text"
                value={form.search_query}
                onChange={set('search_query')}
                placeholder="z.B. Bali Indonesien"
                style={FIELD_STYLE}
              />
            </Field>

            {generatedTargetUrl && (
              <div style={{ marginBottom: '18px', padding: '10px 12px', borderRadius: '8px', background: '#F0FDF4', border: '1.5px solid #BBF7D0', fontSize: '12px', color: '#15803D', wordBreak: 'break-all' }}>
                Generierte Such-URL: {generatedTargetUrl}
              </div>
            )}

            <Field label="Affiliate-URL überschreiben" hint="Leer lassen = Such-URL wird automatisch verwendet">
              <input
                type="text"
                value={form.affiliate_target_url}
                onChange={set('affiliate_target_url')}
                placeholder="https://www.booking.com/..."
                style={FIELD_STYLE}
              />
            </Field>

            <div style={{ marginBottom: '18px' }}>
              <Toggle checked={form.open_in_new_tab} onChange={(v) => setForm(p => ({ ...p, open_in_new_tab: v }))} label="In neuem Tab öffnen" />
            </div>
          </>
        )}

        {form.link_mode === 'internal' && (
          <Field label="Interner Pfad" hint="z.B. /inspiration oder /reiseziele/bali">
            <input
              type="text"
              value={form.href}
              onChange={set('href')}
              placeholder="/inspiration"
              style={FIELD_STYLE}
            />
          </Field>
        )}

        {/* Preview */}
        {previewHref && previewHref !== '/' && (
          <div style={{ padding: '12px 14px', borderRadius: '10px', background: '#F8FAFF', border: '1.5px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Vorschau-Link
            </div>
            <code style={{ fontSize: '13px', color: '#0F172A', wordBreak: 'break-all' }}>
              {previewHref}
            </code>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/admin/homepage-suggestions')}
          disabled={saving}
          style={{ padding: '11px 22px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{ padding: '11px 22px', borderRadius: '10px', border: 'none', background: saving ? '#BAE6FD' : 'linear-gradient(135deg, #0EA5E9, #06B6D4)', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: saving ? 'none' : '0 2px 8px rgba(14,165,233,0.30)' }}
        >
          {saving ? 'Wird gespeichert…' : isEdit ? 'Speichern' : 'Karte anlegen'}
        </button>
      </div>
    </form>
  );
}
