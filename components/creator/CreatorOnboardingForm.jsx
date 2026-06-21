'use client';

import { useState } from 'react';

const CREATOR_TYPES = [
  'Reiseblogger', 'Instagram Creator', 'TikTok Creator', 'YouTube Creator',
  'UGC Creator', 'Camper / Vanlife', 'Familienreise', 'Urlaub mit Hund', 'Sonstiges',
];

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/deinname' },
  { key: 'tiktok',    label: 'TikTok',    placeholder: 'https://tiktok.com/@deinname'   },
  { key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@deinkanal'  },
  { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.de/deinprofil' },
  { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/deinname'  },
  { key: 'twitter',   label: 'Twitter/X', placeholder: 'https://x.com/deinname'         },
];

function emptyForm(profile) {
  return {
    display_name:      profile?.display_name      ?? '',
    slug:              profile?.slug               ?? '',
    creator_type:      profile?.creator_type       ?? '',
    short_bio:         profile?.short_bio          ?? '',
    bio:               profile?.bio                ?? '',
    profile_image_url: profile?.profile_image_url  ?? '',
    hero_image_url:    profile?.hero_image_url      ?? '',
    website_url:       profile?.website_url         ?? '',
    cta_label:         profile?.cta_label           ?? '',
    cta_url:           profile?.cta_url             ?? '',
    topics:            (profile?.topics        ?? []).join('\n'),
    destinations:      (profile?.destinations  ?? []).join('\n'),
    travel_styles:     (profile?.travel_styles ?? []).join('\n'),
    gallery_images:    (profile?.gallery_images ?? []).join('\n'),
    instagram:         profile?.social_links?.instagram ?? '',
    tiktok:            profile?.social_links?.tiktok    ?? '',
    youtube:           profile?.social_links?.youtube   ?? '',
    facebook:          profile?.social_links?.facebook  ?? '',
    twitter:           profile?.social_links?.twitter   ?? '',
    pinterest:         profile?.social_links?.pinterest ?? '',
  };
}

function splitLines(s) {
  return s.split('\n').map(l => l.trim()).filter(Boolean);
}

export default function CreatorOnboardingForm({ initialProfile, token }) {
  const [form,       setForm]       = useState(() => emptyForm(initialProfile));
  const [tips,       setTips]       = useState(initialProfile?.featured_tips ?? []);
  const [saving,     setSaving]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [done,       setDone]       = useState(false);
  const alreadySubmitted = initialProfile?.status === 'submitted';
  const isPublished      = initialProfile?.status === 'published';

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const buildPayload = (status) => ({
    display_name:      form.display_name.trim(),
    slug:              form.slug.trim().toLowerCase(),
    creator_type:      form.creator_type || null,
    short_bio:         form.short_bio.trim() || null,
    bio:               form.bio.trim() || null,
    profile_image_url: form.profile_image_url.trim() || null,
    hero_image_url:    form.hero_image_url.trim() || null,
    website_url:       form.website_url.trim() || null,
    cta_label:         form.cta_label.trim() || null,
    cta_url:           form.cta_url.trim() || null,
    topics:            splitLines(form.topics),
    destinations:      splitLines(form.destinations),
    travel_styles:     splitLines(form.travel_styles),
    gallery_images:    splitLines(form.gallery_images),
    featured_tips:     tips.filter(t => t.title.trim()),
    social_links: Object.fromEntries(
      SOCIAL_PLATFORMS
        .map(p => [p.key, form[p.key].trim()])
        .filter(([, v]) => v)
    ),
    status,
  });

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      if (!form.display_name.trim()) throw new Error('Bitte gib deinen Creator-Namen ein.');
      const res = await fetch(`/api/creator-onboarding/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload('draft')),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Fehler beim Speichern.');
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.display_name.trim()) { setError('Bitte gib deinen Creator-Namen ein.'); return; }
    if (!form.short_bio.trim())    { setError('Bitte füge eine kurze Beschreibung hinzu (max. 220 Zeichen).'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/creator-onboarding/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload('submitted')),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Fehler beim Einreichen.');
      setDone(true);
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  // Reisetipps-Helfer
  const addTip = () => setTips(prev => [...prev, { title: '', text: '', destination: '', url: '' }]);
  const removeTip = (i) => setTips(prev => prev.filter((_, idx) => idx !== i));
  const updateTip = (i, field, val) =>
    setTips(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  // Erfolgsscreen nach Einreichen
  if (done) {
    return (
      <PageShell>
        <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px' }}>🎉</div>
          <h1 style={headingStyle}>Danke, {form.display_name}!</h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7, margin: '0 0 32px' }}>
            Dein Profil wurde zur Prüfung eingereicht. ApeAround prüft deine Angaben und meldet sich bei dir, sobald dein Profil freigegeben wurde.
          </p>
          <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '20px 24px', border: '1px solid #BBF7D0' }}>
            <p style={{ fontSize: '14px', color: '#059669', margin: 0, fontWeight: 600 }}>
              Was passiert als Nächstes?
            </p>
            <p style={{ fontSize: '14px', color: '#475569', margin: '8px 0 0', lineHeight: 1.6 }}>
              Unser Team prüft dein Profil und meldet sich per E-Mail, sobald es veröffentlicht wurde. Das dauert in der Regel 1–3 Werktage.
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  // Already published
  if (isPublished) {
    return (
      <PageShell>
        <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px' }}>✨</div>
          <h1 style={headingStyle}>Dein Profil ist live!</h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7, margin: '0 0 28px' }}>
            Dein Creator-Profil auf ApeAround ist bereits veröffentlicht.
          </p>
          <a
            href={`/creator/${initialProfile.slug}`}
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}
          >
            Profil ansehen →
          </a>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 16px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '56px 16px 40px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', borderRadius: '16px', padding: '10px 20px', marginBottom: '20px' }}>
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ApeAround Creator Club
            </span>
          </div>
          <h1 style={{ ...headingStyle, fontSize: 'clamp(26px, 5vw, 38px)', marginBottom: '16px' }}>
            Willkommen im ApeAround Creator Club
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
            Fülle dein Profil aus. Nach dem Absenden prüfen wir deine Angaben und veröffentlichen dein Profil, wenn alles passt.
          </p>
        </div>

        {/* Bereits eingereicht Banner */}
        {alreadySubmitted && (
          <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>ℹ️</span>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0EA5E9', margin: '0 0 4px' }}>Bereits eingereicht</p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.55 }}>
                Dein Profil wurde bereits zur Prüfung eingereicht. Du kannst Angaben trotzdem noch bearbeiten und erneut einreichen.
              </p>
            </div>
          </div>
        )}

        {/* Fehlermeldung */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Basisdaten */}
          <FormSection title="Basisdaten" icon="👤">
            <FormField label="Creator-Name *">
              <FInput value={form.display_name} onChange={v => set('display_name', v)} placeholder="Dein Anzeigename, z.B. Lisa reist mit Kind" />
            </FormField>
            <FormField label={`Profil-Link (apearound.de/creator/${form.slug || 'dein-name'})`}>
              <FInput value={form.slug} onChange={v => set('slug', v.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-'))} placeholder="dein-name" mono />
              <p style={hintStyle}>Nur Kleinbuchstaben, Zahlen und Bindestriche. Wird nach Veröffentlichung fixiert.</p>
            </FormField>
            <FormField label="Creator-Art">
              <select
                value={form.creator_type}
                onChange={e => set('creator_type', e.target.value)}
                style={selectStyle}
              >
                <option value="">— auswählen —</option>
                {CREATOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label={`Kurzbeschreibung * (max. 220 Zeichen, ${form.short_bio.length}/220)`}>
              <FTextarea
                value={form.short_bio}
                onChange={v => set('short_bio', v)}
                rows={2}
                maxLength={220}
                placeholder="In einem Satz: Wer bist du und was machst du?"
              />
              <p style={hintStyle}>Erscheint im Profil-Header und in Suchmaschinen.</p>
            </FormField>
            <FormField label="Ausführliche Bio">
              <FTextarea
                value={form.bio}
                onChange={v => set('bio', v)}
                rows={6}
                maxLength={3000}
                placeholder="Erzähl von dir: Wie bist du zum Reisen gekommen? Was macht deine Reisen besonders?"
              />
            </FormField>
          </FormSection>

          {/* Reise-Schwerpunkte */}
          <FormSection title="Reise-Schwerpunkte" icon="🗺️">
            <FormField label="Themen (eine pro Zeile)">
              <FTextarea value={form.topics} onChange={v => set('topics', v)} rows={3} placeholder={"Familienurlaub\nNaturreisen\nKulturreisen"} />
            </FormField>
            <FormField label="Lieblingsziele (eine pro Zeile)">
              <FTextarea value={form.destinations} onChange={v => set('destinations', v)} rows={3} placeholder={"Mallorca\nKroatien\nÖsterreich"} />
            </FormField>
            <FormField label="Reisearten (eine pro Zeile)">
              <FTextarea value={form.travel_styles} onChange={v => set('travel_styles', v)} rows={3} placeholder={"Roadtrip\nStrandurlaub\nBudgetreise"} />
            </FormField>
          </FormSection>

          {/* Links */}
          <FormSection title="Deine Links" icon="🔗">
            <FormField label="Eigene Website / Blog">
              <FInput value={form.website_url} onChange={v => set('website_url', v)} placeholder="https://www.mein-reiseblog.de" />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {SOCIAL_PLATFORMS.map(p => (
                <FormField key={p.key} label={p.label}>
                  <FInput value={form[p.key]} onChange={v => set(p.key, v)} placeholder={p.placeholder} />
                </FormField>
              ))}
            </div>
          </FormSection>

          {/* Bilder */}
          <FormSection title="Profilbilder" icon="📸">
            <FormField label="Profilbild-URL">
              <FInput value={form.profile_image_url} onChange={v => set('profile_image_url', v)} placeholder="https://… (quadratisches Foto von dir)" />
              {form.profile_image_url && (
                <img src={form.profile_image_url} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginTop: '10px', border: '2px solid #E2E8F0' }} onError={e => { e.target.style.display = 'none'; }} />
              )}
            </FormField>
            <FormField label="Hero-Bild-URL (großes Banner-Bild)">
              <FInput value={form.hero_image_url} onChange={v => set('hero_image_url', v)} placeholder="https://… (breites Foto, z.B. 1600×600px)" />
              {form.hero_image_url && (
                <img src={form.hero_image_url} alt="Preview" style={{ width: '100%', maxHeight: '120px', borderRadius: '12px', objectFit: 'cover', marginTop: '10px', border: '2px solid #E2E8F0' }} onError={e => { e.target.style.display = 'none'; }} />
              )}
            </FormField>
            <FormField label="Galerie-Bilder (URLs, eine pro Zeile, max. 9)">
              <FTextarea
                value={form.gallery_images}
                onChange={v => set('gallery_images', v)}
                rows={4}
                placeholder={"https://images.unsplash.com/…\nhttps://…"}
              />
              <p style={hintStyle}>Zeige deine besten Reisemomente. Direkte Bild-URLs (enden auf .jpg / .png / .webp).</p>
            </FormField>
          </FormSection>

          {/* Reisetipps */}
          <FormSection title="Deine Reisetipps" icon="💡">
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 16px', lineHeight: 1.6 }}>
              Teile deine besten Reisetipps. Jeder Tipp erscheint als eigene Karte auf deinem Profil.
            </p>
            {tips.map((tip, i) => (
              <div key={i} style={{ background: '#F8FAFC', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '16px 18px', marginBottom: '10px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tipp {i + 1}</span>
                  <button
                    onClick={() => removeTip(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '13px', fontWeight: 600, padding: '2px 6px', borderRadius: '6px' }}
                  >
                    ✕ Entfernen
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <FormField label="Titel *">
                    <FInput value={tip.title} onChange={v => updateTip(i, 'title', v)} placeholder="z.B. Geheimtipp: Bucht nur mit Einheimischen" />
                  </FormField>
                  <FormField label="Reiseziel (optional)">
                    <FInput value={tip.destination ?? ''} onChange={v => updateTip(i, 'destination', v)} placeholder="z.B. Mallorca" />
                  </FormField>
                  <FormField label="Beschreibung (optional)">
                    <FTextarea value={tip.text ?? ''} onChange={v => updateTip(i, 'text', v)} rows={2} placeholder="Kurze Beschreibung…" />
                  </FormField>
                  <FormField label="Link (optional)">
                    <FInput value={tip.url ?? ''} onChange={v => updateTip(i, 'url', v)} placeholder="https://…" />
                  </FormField>
                </div>
              </div>
            ))}
            <button
              onClick={addTip}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', border: '2px dashed #CBD5E1', background: 'transparent', color: '#0EA5E9', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', justifyContent: 'center' }}
            >
              + Tipp hinzufügen
            </button>
          </FormSection>

          {/* CTA */}
          <FormSection title="Call-to-Action (optional)" icon="🎯">
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 12px' }}>Möchtest du Leser auf deine Website oder deinen Newsletter hinweisen?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <FormField label="Button-Text">
                <FInput value={form.cta_label} onChange={v => set('cta_label', v)} placeholder="z.B. Zum Blog" />
              </FormField>
              <FormField label="Button-Link">
                <FInput value={form.cta_url} onChange={v => set('cta_url', v)} placeholder="https://…" />
              </FormField>
            </div>
          </FormSection>

        </div>

        {/* Action Bar */}
        <div style={{ marginTop: '32px', background: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1.5px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 16px' }}>
            Speichere zwischendurch deine Fortschritte. Wenn du fertig bist, reiche dein Profil zur Prüfung ein.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={saving || submitting}
              style={{
                padding: '12px 24px', borderRadius: '12px', border: '2px solid #E2E8F0',
                background: '#FFFFFF', color: '#374151', fontSize: '15px', fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              {saving ? '⟳ Speichern…' : '💾 Zwischenspeichern'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || submitting}
              style={{
                padding: '12px 28px', borderRadius: '12px', border: 'none',
                background: submitting ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
                cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              {submitting ? '⟳ Einreichen…' : '✅ Zur Prüfung einreichen'}
            </button>
          </div>
        </div>

      </div>
    </PageShell>
  );
}

// ── Layout-Wrapper ────────────────────────────────────────────────────────────

function PageShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 60%)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {children}
      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 16px 40px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: '12px' }}>
        <a href="/" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>ApeAround</a>
        {' · '}
        <a href="/datenschutz" style={{ color: '#94A3B8', textDecoration: 'none' }}>Datenschutz</a>
        {' · '}
        <a href="/impressum" style={{ color: '#94A3B8', textDecoration: 'none' }}>Impressum</a>
      </div>
    </div>
  );
}

// ── Kleine UI-Bausteine ───────────────────────────────────────────────────────

function FormSection({ title, icon, children }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{icon}</span> {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function FInput({ value, onChange, placeholder, mono }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '11px 14px',
        borderRadius: '12px', border: '1.5px solid #E2E8F0',
        fontSize: '15px', color: '#0F172A', background: '#F8FAFF',
        outline: 'none', boxSizing: 'border-box',
        fontFamily: mono ? 'monospace' : 'inherit',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => { e.target.style.borderColor = '#0EA5E9'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
    />
  );
}

function FTextarea({ value, onChange, rows = 3, placeholder, maxLength }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '11px 14px',
        borderRadius: '12px', border: '1.5px solid #E2E8F0',
        fontSize: '15px', color: '#0F172A', background: '#F8FAFF',
        outline: 'none', resize: 'vertical', boxSizing: 'border-box',
        fontFamily: 'inherit', lineHeight: 1.6,
        transition: 'border-color 0.15s',
      }}
      onFocus={e => { e.target.style.borderColor = '#0EA5E9'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
    />
  );
}

const headingStyle = {
  fontWeight: 800, color: '#0F172A', margin: '0 0 8px',
  fontSize: 'clamp(22px, 4vw, 28px)', letterSpacing: '-0.02em',
};

const hintStyle = {
  fontSize: '12px', color: '#94A3B8', margin: '6px 0 0', lineHeight: 1.5,
};

const selectStyle = {
  width: '100%', padding: '11px 14px',
  borderRadius: '12px', border: '1.5px solid #E2E8F0',
  fontSize: '15px', color: '#0F172A', background: '#F8FAFF',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  cursor: 'pointer',
};
