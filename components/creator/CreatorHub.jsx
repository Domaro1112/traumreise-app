'use client';

import { useState } from 'react';
import Link from 'next/link';
import CreatorGalleryUploader from '@/components/creator/CreatorGalleryUploader';
import CreatorImageUploader   from '@/components/creator/CreatorImageUploader';

const TYPE_META = {
  guide: { label: 'Reiseguide', color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', emoji: '📖' },
  tip:   { label: 'Reisetipp',  color: '#0EA5E9', bg: 'rgba(14,165,233,0.10)', emoji: '💡' },
  route: { label: 'Reiseroute', color: '#059669', bg: 'rgba(5,150,105,0.10)',  emoji: '🗺️' },
};

const STATUS_META = {
  draft:     { label: 'Entwurf',        color: '#D97706', bg: 'rgba(245,158,11,0.12)'  },
  submitted: { label: 'Zur Prüfung',    color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)'  },
  published: { label: 'Veröffentlicht', color: '#059669', bg: 'rgba(5,150,105,0.12)'   },
  rejected:  { label: 'Abgelehnt',      color: '#EF4444', bg: 'rgba(239,68,68,0.10)'   },
  archived:  { label: 'Archiviert',     color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
}

function TypeBadge({ type }) {
  const m = TYPE_META[type] ?? TYPE_META.guide;
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', background: m.bg, color: m.color }}>
      {m.emoji} {m.label}
    </span>
  );
}

function inp(extra = {}) {
  return {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #E2E8F0', fontSize: '14px', color: '#0F172A',
    background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', ...extra,
  };
}

function Label({ children, hint }) {
  return (
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
      {children}
      {hint && <span style={{ fontWeight: 400, color: '#94A3B8', marginLeft: '6px' }}>{hint}</span>}
    </label>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <Label hint={hint}>{label}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 16px' }}>
      {children}
    </p>
  );
}

const EMPTY_FORM = {
  title: '', excerpt: '', destination: '', country: '', category: '',
  tagsRaw: '', images: [], content: '',
  tipText: '', tipUrl: '',
  routeStart: '', routeEnd: '', routeDuration: '', routeTravelType: '',
  stops: [],
};

function formFromSubmission(s) {
  if (!s) return EMPTY_FORM;
  return {
    title:          s.title ?? '',
    excerpt:        s.excerpt ?? '',
    destination:    s.destination ?? '',
    country:        s.country ?? '',
    category:       s.category ?? '',
    tagsRaw:        (s.tags ?? []).join(', '),
    images:         Array.isArray(s.images) ? s.images : [],
    content:        s.content ?? '',
    tipText:        s.tip_data?.text ?? '',
    tipUrl:         s.tip_data?.url ?? '',
    routeStart:     s.route_data?.start ?? '',
    routeEnd:       s.route_data?.end ?? '',
    routeDuration:  s.route_data?.duration ?? '',
    routeTravelType:s.route_data?.travel_type ?? '',
    stops:          s.route_data?.stops ?? [],
  };
}

function buildPayload(form, type) {
  const tags   = form.tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const images = Array.isArray(form.images) ? form.images.filter(Boolean) : [];
  const base = {
    title:       form.title,
    excerpt:     form.excerpt || null,
    destination: form.destination || null,
    country:     form.country || null,
    category:    form.category || null,
    tags,
    images,
  };
  if (type === 'guide') return { ...base, content: form.content || null };
  if (type === 'tip')   return { ...base, tip_data: { text: form.tipText, url: form.tipUrl || null } };
  if (type === 'route') return {
    ...base,
    route_data: {
      start:       form.routeStart || null,
      end:         form.routeEnd || null,
      duration:    form.routeDuration || null,
      travel_type: form.routeTravelType || null,
      stops:       form.stops,
    },
  };
  return base;
}

export default function CreatorHub({ profile, initialSubmissions, token }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [activeTab, setActiveTab]     = useState('content');
  const [editingId, setEditingId]     = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const [successMsg, setSuccessMsg]   = useState('');

  const TABS = [
    { id: 'content', label: 'Meine Inhalte' },
    { id: 'guide',   label: '📖 Guide' },
    { id: 'tip',     label: '💡 Tipp' },
    { id: 'route',   label: '🗺️ Route' },
  ];

  const isFormTab = ['guide', 'tip', 'route'].includes(activeTab);

  function openNewForm(type) {
    setEditingId(null);
    setEditingType(type);
    setForm(EMPTY_FORM);
    setError('');
    setSuccessMsg('');
    setActiveTab(type);
  }

  function openEditForm(submission) {
    setEditingId(submission.id);
    setEditingType(submission.type);
    setForm(formFromSubmission(submission));
    setError('');
    setSuccessMsg('');
    setActiveTab(submission.type);
  }

  function cancelForm() {
    setEditingId(null);
    setEditingType(null);
    setForm(EMPTY_FORM);
    setError('');
    setActiveTab('content');
  }

  async function handleSave(status) {
    setError('');
    setSuccessMsg('');
    setSaving(true);
    try {
      const type = editingType ?? activeTab;
      const payload = { ...buildPayload(form, type), type, status };
      let res;
      if (editingId) {
        res = await fetch(`/api/creator-onboarding/${token}/submissions/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/creator-onboarding/${token}/submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Fehler beim Speichern.');
      const saved = data.submission;
      if (editingId) {
        setSubmissions(prev => prev.map(s => s.id === editingId ? saved : s));
      } else {
        setSubmissions(prev => [saved, ...prev]);
      }
      if (status === 'submitted') {
        setSuccessMsg('✅ Inhalt wurde zur Prüfung eingereicht! ApeAround meldet sich bei dir.');
        setTimeout(() => { setSuccessMsg(''); cancelForm(); }, 3000);
      } else {
        setSuccessMsg('Entwurf gespeichert.');
        setEditingId(saved.id);
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Diesen Entwurf wirklich löschen?')) return;
    try {
      const res = await fetch(`/api/creator-onboarding/${token}/submissions/${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  const publishedCount  = submissions.filter(s => s.status === 'published').length;
  const submittedCount  = submissions.filter(s => s.status === 'submitted').length;
  const draftCount      = submissions.filter(s => s.status === 'draft').length;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {profile.profile_image_url && (
          <img
            src={profile.profile_image_url}
            alt={profile.display_name}
            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0', flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#0F172A', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
            Creator-Hub
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>{profile.display_name}</p>
        </div>
        <Link
          href={`/creator-onboarding/${token}`}
          style={{ padding: '8px 16px', borderRadius: '10px', background: '#F1F5F9', color: '#0F172A', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Mein Profil bearbeiten
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Veröffentlicht', val: publishedCount, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
          { label: 'Zur Prüfung',    val: submittedCount, color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
          { label: 'Entwürfe',       val: draftCount,     color: '#D97706', bg: 'rgba(245,158,11,0.08)'  },
        ].map(({ label, val, color, bg }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${color}22`, borderRadius: '12px', padding: '12px 16px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: 800, color }}>{val}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '2px solid #F1F5F9', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => {
              if (['guide', 'tip', 'route'].includes(t.id) && activeTab !== t.id) openNewForm(t.id);
              else setActiveTab(t.id);
            }}
            style={{
              padding: '9px 16px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeTab === t.id ? 700 : 500,
              background: activeTab === t.id ? '#FFFFFF' : 'transparent',
              color: activeTab === t.id ? '#0EA5E9' : '#64748B',
              fontFamily: 'inherit',
              borderBottom: activeTab === t.id ? '2px solid #0EA5E9' : '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content: Meine Inhalte */}
      {activeTab === 'content' && (
        <div>
          {/* Quick-create buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {[
              { type: 'guide', label: '📖 Neuen Guide schreiben' },
              { type: 'tip',   label: '💡 Neuen Tipp schreiben' },
              { type: 'route', label: '🗺️ Neue Route planen' },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => openNewForm(type)}
                style={{
                  padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  color: '#FFFFFF', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', color: '#94A3B8', fontSize: '14px' }}>
              Noch keine Inhalte. Erstelle deinen ersten Guide, Tipp oder eine Route!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {submissions.map(s => (
                <div key={s.id} style={{
                  background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px',
                  padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap',
                  borderLeftColor: s.status === 'submitted' ? '#0EA5E9'
                    : s.status === 'published' ? '#059669'
                    : s.status === 'rejected' ? '#EF4444' : '#E2E8F0',
                  borderLeftWidth: ['submitted','published','rejected'].includes(s.status) ? '3px' : '1.5px',
                }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <TypeBadge type={s.type} />
                      <StatusBadge status={s.status} />
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{s.title}</p>
                    {s.destination && <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>📍 {s.destination}</p>}
                    {s.status === 'rejected' && s.rejection_reason && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#EF4444', fontWeight: 600 }}>Ablehnungsgrund:</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#374151' }}>{s.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'center' }}>
                    {s.status === 'published' && (
                      <a
                        href={s.type === 'guide' ? `/reiseguides/${s.slug}` : s.type === 'tip' ? `/reisetipps/${s.slug}` : `/reiserouten/${s.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '6px 14px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
                      >
                        Ansehen →
                      </a>
                    )}
                    {['draft', 'rejected'].includes(s.status) && (
                      <button
                        onClick={() => openEditForm(s)}
                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#F1F5F9', color: '#0F172A', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Bearbeiten
                      </button>
                    )}
                    {s.status === 'draft' && (
                      <button
                        onClick={() => handleDelete(s.id)}
                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Löschen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form tabs */}
      {isFormTab && (
        <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: 'clamp(20px, 4vw, 32px)' }}>
          {editingId
            ? <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                {TYPE_META[editingType]?.label} bearbeiten
              </h2>
            : <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                {activeTab === 'guide' ? '📖 Neuen Reiseguide schreiben'
                  : activeTab === 'tip' ? '💡 Neuen Reisetipp schreiben'
                  : '🗺️ Neue Reiseroute planen'}
              </h2>
          }

          {/* Basis */}
          <SectionTitle>Grundinformationen</SectionTitle>

          <Field label="Titel *">
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder={activeTab === 'guide' ? 'z.B. Mein perfektes Wochenende in Lissabon' : activeTab === 'tip' ? 'z.B. Der beste Strandtipp auf Mallorca' : 'z.B. Von München nach Wien mit dem Fahrrad'}
              style={inp()}
            />
          </Field>

          <Field label="Kurzbeschreibung" hint="max. 300 Zeichen">
            <textarea
              value={form.excerpt}
              onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
              placeholder="Kurze Zusammenfassung für die Übersicht…"
              rows={2}
              style={inp({ resize: 'vertical' })}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <Field label="Reiseziel">
              <input type="text" value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} placeholder="z.B. Lissabon" style={inp()} />
            </Field>
            <Field label="Land">
              <input type="text" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="z.B. Portugal" style={inp()} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <Field label="Kategorie">
              <input type="text" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="z.B. Städtereise" style={inp()} />
            </Field>
            <Field label="Tags" hint="kommagetrennt">
              <input type="text" value={form.tagsRaw} onChange={e => setForm(p => ({ ...p, tagsRaw: e.target.value }))} placeholder="z.B. Europa, Städtereise, Sommer" style={inp()} />
            </Field>
          </div>

          {/* Typ-spezifische Felder */}
          {activeTab === 'guide' && (
            <>
              <SectionTitle>Inhalt</SectionTitle>
              <Field label="Vollständiger Text *">
                <textarea
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Schreibe hier deinen vollständigen Reiseguide…"
                  rows={12}
                  style={inp({ resize: 'vertical', lineHeight: '1.7' })}
                />
              </Field>
            </>
          )}

          {activeTab === 'tip' && (
            <>
              <SectionTitle>Tipp-Details</SectionTitle>
              <Field label="Dein Tipp *">
                <textarea
                  value={form.tipText}
                  onChange={e => setForm(p => ({ ...p, tipText: e.target.value }))}
                  placeholder="Teile deinen besten Reisetipp…"
                  rows={5}
                  style={inp({ resize: 'vertical' })}
                />
              </Field>
              <Field label="Link" hint="optional">
                <input type="url" value={form.tipUrl} onChange={e => setForm(p => ({ ...p, tipUrl: e.target.value }))} placeholder="https://…" style={inp()} />
              </Field>
            </>
          )}

          {activeTab === 'route' && (
            <>
              <SectionTitle>Routendetails</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <Field label="Startpunkt">
                  <input type="text" value={form.routeStart} onChange={e => setForm(p => ({ ...p, routeStart: e.target.value }))} placeholder="z.B. München" style={inp()} />
                </Field>
                <Field label="Endpunkt">
                  <input type="text" value={form.routeEnd} onChange={e => setForm(p => ({ ...p, routeEnd: e.target.value }))} placeholder="z.B. Wien" style={inp()} />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <Field label="Dauer">
                  <input type="text" value={form.routeDuration} onChange={e => setForm(p => ({ ...p, routeDuration: e.target.value }))} placeholder="z.B. 7 Tage" style={inp()} />
                </Field>
                <Field label="Reiseart">
                  <input type="text" value={form.routeTravelType} onChange={e => setForm(p => ({ ...p, routeTravelType: e.target.value }))} placeholder="z.B. Roadtrip, Fahrrad, Zug" style={inp()} />
                </Field>
              </div>

              <SectionTitle>Stationen</SectionTitle>
              {form.stops.map((stop, i) => (
                <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>Station {i + 1}</span>
                    <button
                      onClick={() => setForm(p => ({ ...p, stops: p.stops.filter((_, idx) => idx !== i) }))}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}
                    >
                      Entfernen
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input type="text" value={stop.title} onChange={e => setForm(p => ({ ...p, stops: p.stops.map((s, idx) => idx === i ? { ...s, title: e.target.value } : s) }))} placeholder="Name der Station" style={inp()} />
                    <input type="text" value={stop.place} onChange={e => setForm(p => ({ ...p, stops: p.stops.map((s, idx) => idx === i ? { ...s, place: e.target.value } : s) }))} placeholder="Ort / Adresse" style={inp()} />
                  </div>
                  <textarea value={stop.description} onChange={e => setForm(p => ({ ...p, stops: p.stops.map((s, idx) => idx === i ? { ...s, description: e.target.value } : s) }))} placeholder="Was gibt es hier zu erleben?" rows={2} style={inp({ resize: 'vertical', marginBottom: '10px' })} />
                  {editingId ? (
                    <CreatorImageUploader
                      value={stop.image ?? ''}
                      onChange={url => setForm(p => ({ ...p, stops: p.stops.map((s, idx) => idx === i ? { ...s, image: url } : s) }))}
                      token={token}
                      targetType="routeStation"
                      submissionId={editingId}
                      stationIndex={i}
                      label={`Stationsbild ${i + 1} (optional)`}
                      aspectRatio="16/7"
                    />
                  ) : (
                    <input type="url" value={stop.image ?? ''} onChange={e => setForm(p => ({ ...p, stops: p.stops.map((s, idx) => idx === i ? { ...s, image: e.target.value } : s) }))} placeholder="Bild-URL (optional)" style={inp()} />
                  )}
                </div>
              ))}
              <button
                onClick={() => setForm(p => ({ ...p, stops: [...p.stops, { title: '', place: '', description: '', image: '' }] }))}
                style={{ padding: '9px 18px', borderRadius: '10px', border: '1.5px dashed #CBD5E1', background: 'transparent', color: '#64748B', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '24px', width: '100%' }}
              >
                + Station hinzufügen
              </button>
            </>
          )}

          {/* Bilder */}
          <SectionTitle>Bilder</SectionTitle>
          {/* Rechtlicher Hinweis */}
          <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#475569', lineHeight: 1.55, marginBottom: '16px' }}>
            🔐 <strong>Bildrechte:</strong> Mit dem Hochladen bestätigst du, dass du die Rechte an den Bildern besitzt und ApeAround sie im Rahmen deiner eingereichten Inhalte verwenden darf.
          </div>
          <CreatorGalleryUploader
            images={Array.isArray(form.images) ? form.images : []}
            onChange={imgs => setForm(p => ({ ...p, images: imgs }))}
            token={token}
            targetType="submission"
            submissionId={editingId ?? undefined}
            maxImages={8}
            disabled={!editingId}
            disabledHint={!editingId ? {
              primary: activeTab === 'guide'
                ? 'Speichere deinen Reiseguide zuerst als Entwurf. Danach kannst du Bilder hinzufügen.'
                : activeTab === 'tip'
                  ? 'Speichere deinen Reisetipp zuerst als Entwurf. Danach kannst du Bilder hinzufügen.'
                  : 'Speichere deine Route zuerst als Entwurf. Danach kannst du Bilder und Stationsbilder hinzufügen.',
              secondary: 'Klicke auf „Als Entwurf speichern" — danach wird der Bild-Upload automatisch aktiviert.',
            } : null}
          />

          {/* Fehler / Erfolg */}
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          {successMsg && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', color: '#059669', fontSize: '14px', marginBottom: '16px' }}>
              {successMsg}
            </div>
          )}

          {/* Buttons */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              style={{ padding: '11px 22px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#F8FAFC', color: '#374151', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? '…' : 'Als Entwurf speichern'}
            </button>
            <button
              onClick={() => handleSave('submitted')}
              disabled={saving}
              style={{ padding: '11px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? '…' : 'Zur Prüfung einreichen'}
            </button>
            <button
              onClick={cancelForm}
              disabled={saving}
              style={{ padding: '11px 16px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#94A3B8', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Abbrechen
            </button>
            </div>
            {!editingId && !saving && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>
                Nach dem Speichern kannst du Bilder hinzufügen.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
