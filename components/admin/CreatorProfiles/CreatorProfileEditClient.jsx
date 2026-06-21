'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save, CheckCircle, AlertCircle, RefreshCw,
  ChevronLeft, ExternalLink, Trash2,
} from 'lucide-react';

const CREATOR_TYPES = [
  'Reiseblogger', 'Instagram Creator', 'TikTok Creator', 'YouTube Creator',
  'UGC Creator', 'Camper / Vanlife', 'Familienreise', 'Urlaub mit Hund', 'Sonstiges',
];

const STATUS_META = {
  draft:     { label: 'Entwurf',        color: '#D97706' },
  submitted: { label: 'Eingereicht',    color: '#0EA5E9' },
  published: { label: 'Veröffentlicht', color: '#059669' },
  archived:  { label: 'Archiviert',     color: '#64748B' },
};

const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'pinterest'];

function empty(profile) {
  return {
    display_name:      profile?.display_name      ?? '',
    slug:              profile?.slug               ?? '',
    contact_email:     profile?.contact_email      ?? '',
    creator_type:      profile?.creator_type       ?? '',
    short_bio:         profile?.short_bio          ?? '',
    bio:               profile?.bio                ?? '',
    profile_image_url: profile?.profile_image_url  ?? '',
    hero_image_url:    profile?.hero_image_url      ?? '',
    website_url:       profile?.website_url         ?? '',
    cta_label:         profile?.cta_label           ?? '',
    cta_url:           profile?.cta_url             ?? '',
    internal_notes:    profile?.internal_notes      ?? '',
    status:            profile?.status              ?? 'draft',
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
    featured_tips_raw: profile?.featured_tips?.length
      ? JSON.stringify(profile.featured_tips, null, 2)
      : '',
  };
}

function splitLines(s) {
  return s.split('\n').map(l => l.trim()).filter(Boolean);
}

export default function CreatorProfileEditClient({ initialProfile, isNew }) {
  const router = useRouter();
  const [form,      setForm]      = useState(() => empty(initialProfile));
  const [saving,    setSaving]    = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errorMsg,  setErrorMsg]  = useState('');
  const [deleting,  setDeleting]  = useState(false);

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const buildPayload = () => {
    // Parse featured_tips
    let featured_tips = [];
    if (form.featured_tips_raw.trim()) {
      try {
        featured_tips = JSON.parse(form.featured_tips_raw);
      } catch {
        throw new Error('Reisetipps: Ungültiges JSON-Format. Bitte prüfen.');
      }
    }

    return {
      display_name:      form.display_name.trim(),
      slug:              form.slug.trim().toLowerCase(),
      contact_email:     form.contact_email.trim() || null,
      creator_type:      form.creator_type || null,
      short_bio:         form.short_bio.trim() || null,
      bio:               form.bio.trim() || null,
      profile_image_url: form.profile_image_url.trim() || null,
      hero_image_url:    form.hero_image_url.trim() || null,
      website_url:       form.website_url.trim() || null,
      cta_label:         form.cta_label.trim() || null,
      cta_url:           form.cta_url.trim() || null,
      internal_notes:    form.internal_notes.trim() || null,
      status:            form.status,
      topics:            splitLines(form.topics),
      destinations:      splitLines(form.destinations),
      travel_styles:     splitLines(form.travel_styles),
      gallery_images:    splitLines(form.gallery_images),
      featured_tips,
      social_links: Object.fromEntries(
        SOCIAL_PLATFORMS
          .map(p => [p, form[p].trim()])
          .filter(([, v]) => v)
      ),
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    setErrorMsg('');
    try {
      const payload = buildPayload();
      const method  = isNew ? 'POST' : 'PATCH';
      const url     = isNew
        ? '/api/creator-profiles'
        : `/api/creator-profiles/${initialProfile.id}`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Fehler beim Speichern.');

      setSaveStatus('success');
      if (isNew && json.profile?.id) {
        router.push(`/admin/creator-profiles/${json.profile.id}`);
      }
    } catch (e) {
      setSaveStatus('error');
      setErrorMsg(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Profil wirklich löschen? Dies kann nicht rückgängig gemacht werden.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/creator-profiles/${initialProfile.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Fehler beim Löschen.');
      router.push('/admin/creator-profiles');
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link href="/admin/creator-profiles" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>
          <ChevronLeft size={14} strokeWidth={2} />
          Creator-Profile
        </Link>
        <span style={{ color: '#CBD5E1' }}>·</span>
        <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>
          {isNew ? 'Neues Profil' : (initialProfile?.display_name ?? 'Profil bearbeiten')}
        </span>
        {!isNew && initialProfile?.status === 'published' && (
          <a
            href={`/creator/${initialProfile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#0EA5E9', textDecoration: 'none' }}
          >
            <ExternalLink size={12} strokeWidth={2} />
            Öffentlich anzeigen
          </a>
        )}
      </div>

      {/* Status Quick-Actions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#64748B' }}>Status:</span>
        {Object.entries(STATUS_META).map(([s, m]) => (
          <button
            key={s}
            onClick={() => set('status', s)}
            style={{
              padding: '6px 16px', borderRadius: '20px', border: 'none',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              background: form.status === s ? m.color : '#F1F5F9',
              color: form.status === s ? '#FFFFFF' : '#64748B',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Grunddaten */}
        <Section title="Grunddaten">
          <Row>
            <Field label="Anzeigename *">
              <Input value={form.display_name} onChange={v => set('display_name', v)} placeholder="z.B. Lisa reist mit Kind" />
            </Field>
            <Field label="Slug *">
              <Input value={form.slug} onChange={v => set('slug', v.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="lisa-reist-mit-kind" mono />
            </Field>
          </Row>
          <Row>
            <Field label="Creator-Typ">
              <select
                value={form.creator_type}
                onChange={e => set('creator_type', e.target.value)}
                style={selectStyle}
              >
                <option value="">— auswählen —</option>
                {CREATOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Kontakt-E-Mail">
              <Input value={form.contact_email} onChange={v => set('contact_email', v)} placeholder="creator@example.com" />
            </Field>
          </Row>
        </Section>

        {/* Bilder */}
        <Section title="Bilder (URLs)">
          <Field label="Profilbild-URL">
            <Input value={form.profile_image_url} onChange={v => set('profile_image_url', v)} placeholder="https://…" />
          </Field>
          <Field label="Hero-Bild-URL">
            <Input value={form.hero_image_url} onChange={v => set('hero_image_url', v)} placeholder="https://… (Großes Banner-Bild)" />
          </Field>
        </Section>

        {/* Texte */}
        <Section title="Texte">
          <Field label="Kurzbeschreibung (max. 400 Z., für Hero + SEO)">
            <Textarea value={form.short_bio} onChange={v => set('short_bio', v)} rows={2} placeholder="In einem Satz: Wer ist dieser Creator?" maxLength={400} />
          </Field>
          <Field label="Bio (ausführlich)">
            <Textarea value={form.bio} onChange={v => set('bio', v)} rows={6} placeholder="Ausführliche Vorstellung des Creators…" />
          </Field>
        </Section>

        {/* Themen & Schwerpunkte */}
        <Section title="Themen & Schwerpunkte">
          <Row>
            <Field label="Themen (eine pro Zeile)">
              <Textarea value={form.topics} onChange={v => set('topics', v)} rows={4} placeholder="Familienurlaub&#10;Alleinerziehende mit Kind&#10;Camper & Roadtrips" />
            </Field>
            <Field label="Lieblingsziele (eine pro Zeile)">
              <Textarea value={form.destinations} onChange={v => set('destinations', v)} rows={4} placeholder="Mallorca&#10;Österreich&#10;Kroatien" />
            </Field>
          </Row>
          <Field label="Reisearten (eine pro Zeile)">
            <Textarea value={form.travel_styles} onChange={v => set('travel_styles', v)} rows={3} placeholder="Familienreise&#10;Budgetreise&#10;Abenteuer" />
          </Field>
        </Section>

        {/* Online-Präsenz */}
        <Section title="Online-Präsenz">
          <Field label="Website">
            <Input value={form.website_url} onChange={v => set('website_url', v)} placeholder="https://www.mein-blog.de" />
          </Field>
          <Row>
            {SOCIAL_PLATFORMS.map(p => (
              <Field key={p} label={p.charAt(0).toUpperCase() + p.slice(1)}>
                <Input value={form[p]} onChange={v => set(p, v)} placeholder={`https://${p}.com/…`} />
              </Field>
            ))}
          </Row>
        </Section>

        {/* Galerie */}
        <Section title="Galerie (Bild-URLs, eine pro Zeile)">
          <Textarea value={form.gallery_images} onChange={v => set('gallery_images', v)} rows={4} placeholder="https://images.unsplash.com/…&#10;https://…" />
        </Section>

        {/* Reisetipps */}
        <Section title="Reisetipps (JSON)">
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: 0, marginBottom: '8px' }}>
            Array von Objekten mit den Feldern: title (Pflicht), text, destination, url
          </p>
          <Textarea
            value={form.featured_tips_raw}
            onChange={v => set('featured_tips_raw', v)}
            rows={8}
            mono
            placeholder={`[\n  {\n    "title": "Tipp 1",\n    "text": "Beschreibung…",\n    "destination": "Mallorca",\n    "url": "https://…"\n  }\n]`}
          />
        </Section>

        {/* CTA */}
        <Section title="Call-to-Action (optional)">
          <Row>
            <Field label="CTA-Label">
              <Input value={form.cta_label} onChange={v => set('cta_label', v)} placeholder="Reise planen mit Lisa" />
            </Field>
            <Field label="CTA-URL">
              <Input value={form.cta_url} onChange={v => set('cta_url', v)} placeholder="https://… oder /#reiseplaner" />
            </Field>
          </Row>
        </Section>

        {/* Interne Notizen */}
        <Section title="Interne Notizen (nicht öffentlich)">
          <Textarea value={form.internal_notes} onChange={v => set('internal_notes', v)} rows={3} placeholder="Notizen, Kommunikationshistorie, Absprachen…" />
        </Section>

      </div>

      {/* Save Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '32px', flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 28px', borderRadius: '12px',
            background: saving ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
            border: 'none', cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit',
          }}
        >
          {saving
            ? <RefreshCw size={14} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
            : <Save size={14} strokeWidth={2} />
          }
          {saving ? 'Speichern…' : isNew ? 'Profil erstellen' : 'Änderungen speichern'}
        </button>

        {saveStatus === 'success' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#059669', fontWeight: 600 }}>
            <CheckCircle size={15} strokeWidth={2} /> Gespeichert
          </span>
        )}
        {saveStatus === 'error' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#DC2626', fontWeight: 600 }}>
            <AlertCircle size={15} strokeWidth={2} /> {errorMsg || 'Fehler beim Speichern'}
          </span>
        )}

        {!isNew && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px', borderRadius: '12px', border: 'none',
              background: 'rgba(239,68,68,0.08)', color: '#EF4444',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              marginLeft: 'auto',
            }}
          >
            <Trash2 size={14} strokeWidth={2} />
            Profil löschen
          </button>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Kleine UI-Bausteine ────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px 22px' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 16px' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, mono }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '8px 12px',
        borderRadius: '10px', border: '1.5px solid #E2E8F0',
        fontSize: '14px', color: '#0F172A', background: '#F8FAFF',
        outline: 'none', boxSizing: 'border-box',
        fontFamily: mono ? 'monospace' : 'inherit',
      }}
    />
  );
}

function Textarea({ value, onChange, rows = 3, placeholder, mono, maxLength }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '8px 12px',
        borderRadius: '10px', border: '1.5px solid #E2E8F0',
        fontSize: '14px', color: '#0F172A', background: '#F8FAFF',
        outline: 'none', resize: 'vertical', boxSizing: 'border-box',
        fontFamily: mono ? 'monospace' : 'inherit',
        lineHeight: 1.6,
      }}
    />
  );
}

const selectStyle = {
  width: '100%', padding: '8px 12px',
  borderRadius: '10px', border: '1.5px solid #E2E8F0',
  fontSize: '14px', color: '#0F172A', background: '#F8FAFF',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  cursor: 'pointer',
};
