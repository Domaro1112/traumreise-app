'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save, ArrowLeft, CheckCircle, Archive,
  AlertTriangle, Eye, Loader2, FileJson, Download, RefreshCw,
} from 'lucide-react';
import BlogImportModal  from '@/components/admin/blog/BlogImportModal';
import BlogSeoScore     from '@/components/admin/blog/BlogSeoScore';
import BlogExportModal  from '@/components/admin/blog/BlogExportModal';
import ImageUploader   from '@/components/admin/media/ImageUploader';
import GalleryEditor   from '@/components/admin/media/GalleryEditor';
import { generateTocFromSections, calcReadingTime } from '@/lib/blog-content-utils';

function uid() {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
}

const TABS = [
  { key: 'basis',  label: 'Basis'  },
  { key: 'inhalt', label: 'Inhalt' },
  { key: 'medien', label: 'Medien' },
  { key: 'seo',    label: 'SEO'    },
];

const CATEGORIES = [
  'Reisetipps', 'Inspiration', 'Strandurlaub',
  'Städtereisen', 'Familienurlaub', 'Budget', 'Roadtrips',
];

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, children, hint, action }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{label}</label>
        {action}
      </div>
      {children}
      {hint && <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #E2E8F0',
  background: '#FAFAFA',
  fontSize: '14px',
  color: '#0F172A',
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '120px',
  resize: 'vertical',
  fontFamily: 'inherit',
  lineHeight: 1.6,
};

const btnSmall = {
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  padding: '5px 11px', borderRadius: '7px',
  border: '1.5px solid #BAE6FD', background: '#F0F9FF',
  fontSize: '11px', fontWeight: 600, color: '#0284C7',
  cursor: 'pointer', whiteSpace: 'nowrap',
};

// ── Slug helper ───────────────────────────────────────────────────────────────
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BlogEditorClient({ isNew, initialData }) {
  const router    = useRouter();
  const articleId = initialData?.id ?? null;

  const [tab,         setTab]         = useState('basis');
  const [importOpen,  setImportOpen]  = useState(false);
  const [exportOpen,  setExportOpen]  = useState(false);
  const [isSaving,    setIsSaving]    = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isArchiving,  setIsArchiving]  = useState(false);
  const [toast,       setToast]       = useState(null);
  const [slugManual,  setSlugManual]  = useState(!isNew);

  // ── Form state ────────────────────────────────────────────────────────────
  const [f, setF] = useState({
    title:           initialData?.title          ?? '',
    slug:            initialData?.slug           ?? '',
    category:        initialData?.category       ?? '',
    tags:            (initialData?.tags ?? []).join(', '),
    author:          initialData?.author         ?? '',
    reading_time:    initialData?.reading_time   ?? '',
    date:            initialData?.date           ?? '',
    destination:     initialData?.destination    ?? '',
    country:         initialData?.country        ?? '',
    featured:        initialData?.featured       ?? false,
    excerpt:         initialData?.excerpt        ?? '',
    cover_image_url: initialData?.cover_image_url ?? '',
    hero_image_url:  initialData?.hero_image_url  ?? '',
    // gallery – stored as [{ localId, url, alt, title, caption }] in editor state
    gallery_items: Array.isArray(initialData?.gallery_images)
      ? initialData.gallery_images.map((g, i) => ({
          localId: `init-${i}`,
          url:     typeof g === 'string' ? g : (g.url ?? ''),
          alt:     typeof g === 'string' ? '' : (g.alt ?? ''),
          title:   typeof g === 'string' ? '' : (g.title ?? ''),
          caption: typeof g === 'string' ? '' : (g.caption ?? ''),
        }))
      : [],
    seo_title:       initialData?.seo_title       ?? '',
    seo_description: initialData?.seo_description ?? '',
    canonical_url:   initialData?.canonical_url   ?? '',
    table_of_contents: initialData?.table_of_contents
      ? JSON.stringify(initialData.table_of_contents, null, 2)
      : '',
    content_sections: initialData?.content_sections
      ? JSON.stringify(initialData.content_sections, null, 2)
      : '',
    faq: initialData?.faq
      ? JSON.stringify(initialData.faq, null, 2)
      : '',
  });

  function set(key, val) {
    setF(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'title' && !slugManual) {
        next.slug = toSlug(val);
      }
      return next;
    });
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Auto-generate TOC from content_sections ────────────────────────────────
  function handleGenerateToc() {
    try {
      const sections = JSON.parse(f.content_sections || '[]');
      const toc = generateTocFromSections(sections);
      if (!toc.length) {
        showToast('Keine Abschnitte mit Überschrift gefunden.', 'error');
        return;
      }
      set('table_of_contents', JSON.stringify(toc, null, 2));
      showToast(`Inhaltsverzeichnis mit ${toc.length} Einträgen erzeugt.`);
    } catch {
      showToast('Inhaltsbereiche enthalten kein gültiges JSON.', 'error');
    }
  }

  // ── Auto-calculate reading time ────────────────────────────────────────────
  function handleCalcReadingTime() {
    const result = calcReadingTime(f);
    set('reading_time', result);
    showToast(`Lesedauer berechnet: ${result}`);
  }

  // ── Handle JSON import ─────────────────────────────────────────────────────
  // `normalized` comes from validateBlogImport(); it matches the f state shape
  // except JSON arrays are stored with _ prefix and need serialising to string.
  function handleImport(normalized) {
    const sections = normalized._contentSections ?? [];
    const rawToc   = normalized._tableOfContents ?? [];

    // Auto-generate TOC if import didn't include one
    let tocStr = '';
    if (rawToc.length > 0) {
      tocStr = JSON.stringify(rawToc, null, 2);
    } else if (sections.length > 0) {
      const autoToc = generateTocFromSections(sections);
      if (autoToc.length > 0) {
        tocStr = JSON.stringify(autoToc, null, 2);
      }
    }

    // Auto-calculate reading time if import didn't include one
    let readingTime = normalized.reading_time || '';
    if (!readingTime && sections.length > 0) {
      const tempF = {
        excerpt:          normalized.excerpt,
        content_sections: JSON.stringify(sections),
        faq:              JSON.stringify(normalized._faq ?? []),
      };
      readingTime = calcReadingTime(tempF);
    }

    setF(prev => ({
      ...prev,
      title:           normalized.title,
      slug:            normalized.slug,
      excerpt:         normalized.excerpt,
      category:        normalized.category,
      tags:            normalized.tags,
      author:          normalized.author,
      reading_time:    readingTime || prev.reading_time,
      date:            normalized.date,
      destination:     normalized.destination,
      country:         normalized.country,
      featured:        normalized.featured,
      cover_image_url: normalized.cover_image_url || prev.cover_image_url,
      hero_image_url:  normalized.hero_image_url  || prev.hero_image_url,
      seo_title:       normalized.seo_title,
      seo_description: normalized.seo_description,
      canonical_url:   normalized.canonical_url,
      table_of_contents: tocStr || prev.table_of_contents,
      content_sections: sections.length > 0
        ? JSON.stringify(sections, null, 2)
        : prev.content_sections,
      faq: (normalized._faq ?? []).length > 0
        ? JSON.stringify(normalized._faq, null, 2)
        : prev.faq,
      gallery_items: (normalized._galleryImages ?? []).length > 0
        ? normalized._galleryImages.map((g, i) => ({
            localId: uid(),
            url:     g.url ?? '',
            alt:     g.alt ?? '',
            title:   g.title ?? '',
            caption: g.caption ?? '',
          }))
        : prev.gallery_items,
    }));

    setSlugManual(true);
    setImportOpen(false);
    setTab('basis');
    showToast('JSON wurde erfolgreich importiert.');
  }

  // ── Build save payload ─────────────────────────────────────────────────────
  function buildPayload() {
    const payload = {
      title:           f.title.trim(),
      slug:            f.slug.trim(),
      category:        f.category,
      tags:            f.tags.split(',').map(t => t.trim()).filter(Boolean),
      author:          f.author.trim(),
      reading_time:    f.reading_time.trim(),
      date:            f.date || undefined,
      destination:     f.destination.trim(),
      country:         f.country.trim(),
      featured:        f.featured,
      excerpt:         f.excerpt.trim(),
      cover_image_url: f.cover_image_url.trim(),
      hero_image_url:  f.hero_image_url.trim(),
      gallery_images:  f.gallery_items.map((item, i) => ({
        url:      item.url,
        fileName: item.url.split('/').pop() ?? `gallery-${String(i + 1).padStart(2, '0')}.jpg`,
        alt:      item.alt ?? '',
        title:    item.title ?? '',
        caption:  item.caption ?? '',
        order:    i,
      })),
      seo_title:       f.seo_title.trim()       || undefined,
      seo_description: f.seo_description.trim() || undefined,
      canonical_url:   f.canonical_url.trim()   || undefined,
    };
    try { if (f.table_of_contents.trim()) payload.table_of_contents = JSON.parse(f.table_of_contents); } catch {}
    try { if (f.content_sections.trim())  payload.content_sections  = JSON.parse(f.content_sections);  } catch {}
    try { if (f.faq.trim())               payload.faq               = JSON.parse(f.faq);               } catch {}
    return payload;
  }

  // ── Save / Create ──────────────────────────────────────────────────────────
  async function handleSave() {
    if (!f.title.trim() || !f.slug.trim()) {
      showToast('Titel und Slug sind Pflichtfelder.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const payload = buildPayload();
      const url  = isNew ? '/api/admin/blog' : `/api/admin/blog/${articleId}`;
      const meth = isNew ? 'POST' : 'PATCH';
      const res  = await fetch(url, {
        method: meth,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = JSON.parse(await res.text());
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      if (isNew) {
        showToast('Artikel erstellt.');
        router.push(`/admin/blog/${json.article.id}`);
      } else {
        showToast('Gespeichert.');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  // ── Publish ────────────────────────────────────────────────────────────────
  async function handlePublish() {
    if (!articleId) { showToast('Bitte zuerst speichern.', 'error'); return; }
    setIsPublishing(true);
    try {
      const res  = await fetch(`/api/admin/blog/${articleId}/publish`, { method: 'POST' });
      const json = JSON.parse(await res.text());
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      showToast('Artikel veröffentlicht.');
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsPublishing(false);
    }
  }

  // ── Archive ────────────────────────────────────────────────────────────────
  async function handleArchive() {
    if (!articleId) return;
    setIsArchiving(true);
    try {
      const res  = await fetch(`/api/admin/blog/${articleId}/archive`, { method: 'POST' });
      const json = JSON.parse(await res.text());
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      showToast('Artikel archiviert.');
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsArchiving(false);
    }
  }

  const busy   = isSaving || isPublishing || isArchiving;
  const status = initialData?.status ?? 'draft';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '32px', maxWidth: '960px', margin: '0 auto' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 300,
          padding: '14px 20px', borderRadius: '12px',
          background: toast.type === 'error' ? '#FEF2F2' : '#ECFDF5',
          border: `1.5px solid ${toast.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
          color: toast.type === 'error' ? '#DC2626' : '#059669',
          fontSize: '14px', fontWeight: 600,
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/admin/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '10px',
              border: '1.5px solid #E2E8F0', background: '#FFFFFF',
              color: '#475569', textDecoration: 'none',
            }}
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
              {isNew ? 'Neuer Artikel' : (f.title || 'Artikel bearbeiten')}
            </h1>
            {!isNew && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: '5px',
                  fontSize: '11px', fontWeight: 700,
                  background: status === 'published' ? '#ECFDF5' : status === 'archived' ? '#F1F5F9' : '#FEF2F2',
                  color:      status === 'published' ? '#059669' : status === 'archived' ? '#64748B' : '#DC2626',
                }}>
                  {status === 'published' ? 'Veröffentlicht' : status === 'archived' ? 'Archiviert' : 'Entwurf'}
                </span>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>{initialData?.slug}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* JSON Import */}
          <button
            onClick={() => setImportOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px', borderRadius: '10px',
              border: '1.5px solid #BAE6FD', background: '#F0F9FF',
              fontSize: '13px', fontWeight: 600, color: '#0284C7', cursor: 'pointer',
            }}
          >
            <FileJson size={14} />
            Importieren
          </button>

          {/* JSON Export */}
          <button
            onClick={() => setExportOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px', borderRadius: '10px',
              border: '1.5px solid #D1D5DB', background: '#F9FAFB',
              fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer',
            }}
          >
            <Download size={14} />
            Exportieren
          </button>

          {/* Preview */}
          {!isNew && status === 'published' && (
            <a
              href={`/reiseblog/${initialData?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '9px 14px', borderRadius: '10px',
                border: '1.5px solid #E2E8F0', background: '#FFFFFF',
                fontSize: '13px', fontWeight: 600, color: '#475569',
                textDecoration: 'none',
              }}
            >
              <Eye size={14} />
              Vorschau
            </a>
          )}

          {/* Archive */}
          {!isNew && status === 'published' && (
            <button
              onClick={handleArchive}
              disabled={busy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '9px 14px', borderRadius: '10px',
                border: '1.5px solid #E2E8F0', background: '#F1F5F9',
                fontSize: '13px', fontWeight: 600, color: '#64748B',
                cursor: busy ? 'not-allowed' : 'pointer',
              }}
            >
              {isArchiving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Archive size={14} />}
              Archivieren
            </button>
          )}

          {/* Publish */}
          {!isNew && status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={busy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '9px 14px', borderRadius: '10px',
                border: '1.5px solid #A7F3D0', background: '#ECFDF5',
                fontSize: '13px', fontWeight: 700, color: '#059669',
                cursor: busy ? 'not-allowed' : 'pointer',
              }}
            >
              {isPublishing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
              Veröffentlichen
            </button>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={busy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 20px', borderRadius: '10px', border: 'none',
              background: busy ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              fontSize: '14px', fontWeight: 700, color: '#FFFFFF',
              cursor: busy ? 'not-allowed' : 'pointer',
              boxShadow: busy ? 'none' : '0 4px 12px rgba(14,165,233,0.30)',
            }}
          >
            {isSaving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
            {isNew ? 'Erstellen' : 'Speichern'}
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E2E8F0', marginBottom: '32px' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 20px', border: 'none', background: 'transparent',
              fontSize: '14px', fontWeight: 600,
              color: tab === t.key ? '#0284C7' : '#64748B',
              cursor: 'pointer',
              borderBottom: tab === t.key ? '2px solid #0284C7' : '2px solid transparent',
              marginBottom: '-2px',
              transition: 'color 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ Tab: Basis ════════════════════════════════════════════════════════ */}
      {tab === 'basis' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Titel *">
              <input
                type="text"
                value={f.title}
                onChange={e => set('title', e.target.value)}
                style={inputStyle}
                placeholder="z. B. Die 10 besten Strände in Bali"
              />
            </Field>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Slug *" hint="URL-Pfad, z. B. bali-straende">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={f.slug}
                  onChange={e => { setSlugManual(true); set('slug', e.target.value); }}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="bali-straende"
                />
                {!slugManual && f.title && (
                  <span style={{ fontSize: '12px', color: '#0284C7', whiteSpace: 'nowrap' }}>auto</span>
                )}
                {slugManual && (
                  <button
                    onClick={() => { setSlugManual(false); set('slug', toSlug(f.title)); }}
                    style={{ fontSize: '12px', color: '#64748B', border: 'none', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Auto-reset
                  </button>
                )}
              </div>
            </Field>
          </div>

          <Field label="Kategorie">
            <select value={f.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
              <option value="">– keine –</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Tags" hint="Kommagetrennt: Bali, Strand, Asien">
            <input type="text" value={f.tags} onChange={e => set('tags', e.target.value)} style={inputStyle} placeholder="Bali, Strand, Asien" />
          </Field>

          <Field label="Autor">
            <input type="text" value={f.author} onChange={e => set('author', e.target.value)} style={inputStyle} placeholder="Name des Autors" />
          </Field>

          <Field
            label="Lesezeit"
            hint="z. B. 8 Min. Lesezeit"
            action={
              <button onClick={handleCalcReadingTime} style={btnSmall}>
                <RefreshCw size={11} strokeWidth={2.5} />
                Neu berechnen
              </button>
            }
          >
            <input
              type="text"
              value={f.reading_time}
              onChange={e => set('reading_time', e.target.value)}
              style={inputStyle}
              placeholder="6 Min. Lesezeit"
            />
          </Field>

          <Field label="Veröffentlichungsdatum" hint="ISO-Datum, z. B. 2025-06-01">
            <input type="date" value={f.date} onChange={e => set('date', e.target.value)} style={inputStyle} />
          </Field>

          <Field label="Destination">
            <input type="text" value={f.destination} onChange={e => set('destination', e.target.value)} style={inputStyle} placeholder="Bali" />
          </Field>

          <Field label="Land">
            <input type="text" value={f.country} onChange={e => set('country', e.target.value)} style={inputStyle} placeholder="Indonesien" />
          </Field>

          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Kurzbeschreibung (Excerpt)">
              <textarea
                value={f.excerpt}
                onChange={e => set('excerpt', e.target.value)}
                style={{ ...textareaStyle, minHeight: '90px' }}
                placeholder="Kurze Zusammenfassung für Listen und Social Sharing…"
              />
            </Field>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', gridColumn: '1 / -1' }}>
            <input
              type="checkbox"
              id="featured"
              checked={f.featured}
              onChange={e => set('featured', e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="featured" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              Featured Artikel (erscheint als Hauptartikel auf der Blogseite)
            </label>
          </div>

          {/* Leserfeedback */}
          {!isNew && (initialData?.helpful_count > 0 || initialData?.not_helpful_count > 0) && (() => {
            const h = initialData.helpful_count ?? 0;
            const n = initialData.not_helpful_count ?? 0;
            const total = h + n;
            const score = total > 0 ? Math.round((h / total) * 100) : null;
            return (
              <div style={{
                gridColumn: '1 / -1',
                padding: '20px 24px',
                borderRadius: '12px',
                background: '#F0FDF4',
                border: '1.5px solid #A7F3D0',
                marginBottom: '20px',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#065F46', marginBottom: '12px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                  Leserfeedback
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'Hilfreich', value: `${h} 👍` },
                    { label: 'Nicht hilfreich', value: `${n} 👎` },
                    { label: 'Hilfreichkeitsquote', value: score !== null ? `${score} %` : '–' },
                  ].map(item => (
                    <div key={item.label} style={{ background: '#FFFFFF', borderRadius: '8px', padding: '12px 14px', border: '1px solid #D1FAE5' }}>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#065F46' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══ Tab: Inhalt ═══════════════════════════════════════════════════════ */}
      {tab === 'inhalt' && (
        <div>
          <Field
            label="Inhaltsverzeichnis (JSON)"
            hint='Array von { "id": "section-id", "label": "Abschnittstitel" }'
            action={
              <button onClick={handleGenerateToc} style={btnSmall}>
                <RefreshCw size={11} strokeWidth={2.5} />
                Aus Abschnitten erzeugen
              </button>
            }
          >
            <textarea
              value={f.table_of_contents}
              onChange={e => set('table_of_contents', e.target.value)}
              style={{ ...textareaStyle, minHeight: '160px', fontFamily: 'monospace', fontSize: '13px' }}
              placeholder='[
  { "id": "einleitung", "label": "Einleitung" },
  { "id": "top-straende", "label": "Die besten Strände" }
]'
            />
          </Field>

          <Field label="Inhaltsbereiche (JSON)" hint="Array von contentSection-Objekten – gleiche Struktur wie in data/blogArticles.js">
            <textarea
              value={f.content_sections}
              onChange={e => set('content_sections', e.target.value)}
              style={{ ...textareaStyle, minHeight: '320px', fontFamily: 'monospace', fontSize: '13px' }}
              placeholder='[
  {
    "id": "einleitung",
    "heading": "Einleitung",
    "content": "...",
    "highlights": []
  }
]'
            />
          </Field>

          <Field label="FAQ (JSON)" hint='Array von { "question": "...", "answer": "..." }'>
            <textarea
              value={f.faq}
              onChange={e => set('faq', e.target.value)}
              style={{ ...textareaStyle, minHeight: '160px', fontFamily: 'monospace', fontSize: '13px' }}
              placeholder='[
  { "question": "Wann ist die beste Reisezeit?", "answer": "..." }
]'
            />
          </Field>
        </div>
      )}

      {/* ══ Tab: Medien ═══════════════════════════════════════════════════════ */}
      {tab === 'medien' && (
        <div>
          {/* Slug hint */}
          {!f.slug && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 16px', borderRadius: '10px',
              background: '#FFFBEB', border: '1.5px solid #FDE68A',
              fontSize: '13px', color: '#92400E', marginBottom: '24px',
            }}>
              <AlertTriangle size={14} strokeWidth={2} />
              Bitte zuerst Titel oder Slug eintragen, damit Bilder gespeichert werden können.
            </div>
          )}

          {/* ── Cover-Bild ──────────────────────────────────────────────────── */}
          <Field
            label="Cover-Bild"
            hint="Wird in Artikellisten und Social-Cards verwendet (3:2 empfohlen)"
          >
            <ImageUploader
              value={f.cover_image_url}
              alt=""
              slug={f.slug}
              type="cover"
              context="blog"
              label="Cover-Bild"
              altDefault={f.title ? `${f.title} – Cover` : 'Cover-Bild'}
              onChange={(url) => set('cover_image_url', url)}
              onDelete={() => set('cover_image_url', '')}
            />
          </Field>

          {/* ── Hero-Bild ───────────────────────────────────────────────────── */}
          <Field
            label="Hero-Bild"
            hint="Großes Bild oben auf der Artikelseite (16:9 empfohlen). Leer = Cover-Bild wird als Fallback genutzt."
          >
            <ImageUploader
              value={f.hero_image_url}
              alt=""
              slug={f.slug}
              type="hero"
              context="blog"
              label="Hero-Bild"
              altDefault={f.title ? `${f.title} – Hero` : 'Hero-Bild'}
              onChange={(url) => set('hero_image_url', url)}
              onDelete={() => set('hero_image_url', '')}
            />
          </Field>

          {/* ── Galerie ─────────────────────────────────────────────────────── */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                Galerie-Bilder
              </label>
              {f.gallery_items.length > 0 && (
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  {f.gallery_items.length} Bild{f.gallery_items.length !== 1 ? 'er' : ''}
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '10px', marginTop: 0 }}>
              Mehrere Bilder hochladen · Reihenfolge per Pfeiltasten ändern · Titel und Alt-Text pro Bild editierbar
            </p>
            <GalleryEditor
              items={f.gallery_items}
              onChange={(items) => set('gallery_items', items)}
              slug={f.slug}
              destName={f.title || f.destination || ''}
              context="blog"
              showTitle
              showCaption
            />
          </div>
        </div>
      )}

      {/* ══ Tab: SEO ══════════════════════════════════════════════════════════ */}
      {tab === 'seo' && (
        <div>
          {/* ── SEO Score Card ───────────────────────────────────────────── */}
          <BlogSeoScore f={f} initialData={initialData} />

          <Field label="SEO Titel" hint="Wird in <title> und OG:title verwendet. Leer = Artikel-Titel.">
            <input
              type="text"
              value={f.seo_title}
              onChange={e => set('seo_title', e.target.value)}
              style={inputStyle}
              placeholder="z. B. Die 10 besten Strände in Bali | Traumreise"
            />
            <p style={{ fontSize: '12px', color: f.seo_title.length > 60 ? '#DC2626' : '#94A3B8', marginTop: '4px' }}>
              {f.seo_title.length}/60 Zeichen
            </p>
          </Field>

          <Field label="SEO Beschreibung" hint="Meta-Description, OG:description. Empfohlen: 120–160 Zeichen.">
            <textarea
              value={f.seo_description}
              onChange={e => set('seo_description', e.target.value)}
              style={{ ...textareaStyle, minHeight: '90px' }}
              placeholder="Kurze, klickstarke Beschreibung des Artikels…"
            />
            <p style={{ fontSize: '12px', color: f.seo_description.length > 160 ? '#DC2626' : '#94A3B8', marginTop: '4px' }}>
              {f.seo_description.length}/160 Zeichen
            </p>
          </Field>

          <Field label="Canonical URL" hint="Nur ausfüllen wenn dieser Artikel auf einer anderen URL kanonisch ist.">
            <input type="url" value={f.canonical_url} onChange={e => set('canonical_url', e.target.value)} style={inputStyle} placeholder="https://traumreise.de/reiseblog/…" />
          </Field>

          {/* SERP preview */}
          {(f.seo_title || f.title) && (
            <div style={{ marginTop: '24px', padding: '20px 24px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>SERP-Vorschau</p>
              <p style={{ fontSize: '13px', color: '#0F9D58', marginBottom: '4px' }}>
                traumreise.de › reiseblog › {f.slug || '…'}
              </p>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#1A0DAB', marginBottom: '6px', lineHeight: 1.3 }}>
                {f.seo_title || f.title || '(kein Titel)'}
              </p>
              <p style={{ fontSize: '14px', color: '#4D5156', lineHeight: 1.5 }}>
                {f.seo_description || f.excerpt || '(keine Beschreibung)'}
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <BlogImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      <BlogExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        f={f}
        initialData={initialData}
      />
    </div>
  );
}
