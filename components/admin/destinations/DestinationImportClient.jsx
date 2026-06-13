'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Upload, CheckCircle, AlertTriangle, Copy, Check,
  FileJson, Image as ImageIcon, X, ChevronUp, ChevronDown,
  RefreshCw, AlertCircle, ExternalLink,
} from 'lucide-react';
import { validateDestinationImport } from '@/lib/validate-destination-import';
import { EXAMPLE_DESTINATION_JSON } from '@/lib/destination-import-example';

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1.5px solid #E2E8F0',
    padding: '24px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#64748B',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  },
  textarea: {
    width: '100%',
    minHeight: '320px',
    padding: '14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '12px',
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    color: '#0F172A',
    background: '#FAFBFF',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: 1.6,
  },
  inp: {
    width: '100%', padding: '7px 10px', border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '12px', color: '#0F172A', background: '#FAFAFA', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '10px 20px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(14,165,233,0.28)',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '9px 16px', borderRadius: '10px',
    background: '#F8FAFF', color: '#334155', border: '1.5px solid #E2E8F0',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnGreen: {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '10px 20px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(5,150,105,0.25)',
  },
  btnDisabled: { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' },
};

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 10 * 1024 * 1024;

// ── Claude Prompt Block ───────────────────────────────────────────────────────
const CLAUDE_PROMPT = `Erstelle ein vollständigesApeAround Reiseziel-JSON für [REISEZIEL] im Importformat. Gib ausschließlich gültiges JSON zurück, ohne Markdown, ohne Erklärung.

Pflichtfelder (alle snake_case, alle Texte auf Deutsch):
name, slug (lowercase, nur Bindestriche), country, region, continent,
hero_image (Pfad-Platzhalter ok), short_description, long_description, ai_summary,
best_travel_time, ideal_duration, travel_type (Array),
quick_facts (Objekt mit: currency, language, flightTime, timezone, visa, bestMonths),
highlights (mind. 5 Einträge als String-Array),
insider_tips (mind. 3 Einträge als String-Array),
faq (mind. 10 Einträge, je { "question": "...", "answer": "..." }),
seo_title, seo_description, affiliate_search_intent,
car_rental_recommended (boolean),
similar_destinations (Array mit 2–3 slugs ähnlicher Ziele),
llmo_entities (Array wichtiger Begriffe/Orte),
llmo_answer_block (2–3 Sätze für KI-Überblicksseiten),
llmo_quick_answer (1 prägnanter Satz für Featured Snippets).`;

function CopyBlock() {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try { await navigator.clipboard.writeText(CLAUDE_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { /* ignore */ }
  }
  return (
    <div style={S.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Prompt für Claude</span>
        <button onClick={handleCopy} style={{ ...S.btnSecondary, padding: '6px 12px', fontSize: '12px' }}>
          {copied ? <><Check size={12} strokeWidth={2.5} color="#059669" /> Kopiert</> : <><Copy size={12} strokeWidth={2} /> Kopieren</>}
        </button>
      </div>
      <pre style={{ fontSize: '11.5px', fontFamily: '"Cascadia Code", "Fira Code", monospace', background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', margin: 0, whiteSpace: 'pre-wrap', color: '#334155', lineHeight: 1.65 }}>
        {CLAUDE_PROMPT}
      </pre>
    </div>
  );
}

// ── Validation Result Display ─────────────────────────────────────────────────
function ValidationErrors({ errors, warnings }) {
  return (
    <div style={{ marginTop: '14px' }}>
      {errors.length > 0 && (
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FECACA', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '8px' }}>
            {errors.length} Fehler gefunden – Speichern nicht möglich
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {errors.map((e, i) => <li key={i} style={{ fontSize: '12px', color: '#B91C1C', marginBottom: '3px' }}>{e}</li>)}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', marginBottom: '8px' }}>
            {warnings.length} Warnung{warnings.length > 1 ? 'en' : ''} (blockieren nicht)
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {warnings.map((w, i) => <li key={i} style={{ fontSize: '12px', color: '#92400E', marginBottom: '3px' }}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

const AUTO_BADGE = (
  <span style={{ display: 'inline-block', fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '4px', padding: '1px 6px', marginLeft: '6px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
    AUTO
  </span>
);

// ── Preview Panel ─────────────────────────────────────────────────────────────
function PreviewPanel({ data, warnings, autogenerated }) {
  const autoSet = new Set(autogenerated ?? []);
  function Row({ label, field, value }) {
    if (!value && value !== false) return null;
    return (
      <div style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ width: '180px', flexShrink: 0, fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
          {label}{field && autoSet.has(field) && AUTO_BADGE}
        </div>
        <div style={{ fontSize: '12px', color: '#0F172A', flex: 1, wordBreak: 'break-all' }}>{String(value)}</div>
      </div>
    );
  }
  return (
    <div style={{ ...S.card, border: '1.5px solid #BBF7D0', background: '#F0FDF4' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <CheckCircle size={16} strokeWidth={2.5} color="#059669" />
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#065F46' }}>JSON gültig – Vorschau</span>
        {autogenerated?.length > 0 && <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>· {autogenerated.length} Felder automatisch generiert</span>}
      </div>
      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #D1FAE5', padding: '14px 16px' }}>
        <Row label="Name"                 value={data.name} />
        <Row label="Slug"                 value={`/reiseziele/${data.slug}`} />
        <Row label="Land"                 value={[data.country, data.region].filter(Boolean).join(' / ')} />
        <Row label="Kontinent"            value={data.continent} />
        <Row label="Kurzbeschreibung"     value={data.short_description?.slice(0, 120) + (data.short_description?.length > 120 ? '…' : '')} />
        <Row label="SEO-Titel"            value={data.seo_title} />
        <Row label="Meta Description"     value={data.seo_description?.slice(0, 100) + (data.seo_description?.length > 100 ? '…' : '')} />
        <Row label="Canonical URL"        field="canonical_url"          value={data.canonical_url} />
        <Row label="OG Bild"              field="open_graph_image"       value={data.open_graph_image} />
        <Row label="OG Titel"             field="open_graph_title"       value={data.open_graph_title} />
        <Row label="OG Beschreibung"      field="open_graph_description" value={data.open_graph_description?.slice(0, 80) + (data.open_graph_description?.length > 80 ? '…' : '')} />
        <Row label="Twitter Bild"         field="twitter_image"          value={data.twitter_image} />
        <Row label="Twitter Titel"        field="twitter_title"          value={data.twitter_title} />
        <Row label="Twitter Beschreibung" field="twitter_description"    value={data.twitter_description?.slice(0, 80) + (data.twitter_description?.length > 80 ? '…' : '')} />
        <Row label="AI Summary"           value={data.ai_summary?.slice(0, 120) + (data.ai_summary?.length > 120 ? '…' : '')} />
        <Row label="Highlights"           value={`${(data.highlights ?? []).length} Einträge`} />
        <Row label="Insider-Tipps"        value={`${(data.insider_tips ?? []).length} Einträge`} />
        <Row label="FAQ"                  value={`${(data.faq ?? []).length} Fragen`} />
        <Row label="LLMO-Entitäten"       value={(data.llmo_entities ?? []).join(', ')} />
        <Row label="Mietwagen"            value={data.car_rental_recommended ? 'Empfohlen' : 'Nicht empfohlen'} />
        <Row label="Affiliate Intent"     value={data.affiliate_search_intent} />
      </div>
      {warnings.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <AlertTriangle size={13} strokeWidth={2} color="#D97706" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#D97706' }}>{warnings.length} Hinweis{warnings.length > 1 ? 'e' : ''} (kein Blocker)</span>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {warnings.map((w, i) => <li key={i} style={{ fontSize: '12px', color: '#92400E', marginBottom: '3px' }}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── LocalFilePicker ───────────────────────────────────────────────────────────
// Holds a File object in the parent; shows preview from object URL.
function LocalFilePicker({ file, preview, alt, onPick, onAlt, onRemove, label, altPlaceholder }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [err, setErr] = useState('');

  function pickFiles(files) {
    const f = files?.[0];
    if (!f) return;
    if (!ACCEPTED_MIME.has(f.type)) { setErr('Nur JPG, PNG oder WebP erlaubt.'); return; }
    if (f.size > MAX_BYTES) { setErr('Datei zu groß (max. 10 MB).'); return; }
    setErr('');
    onPick(f, URL.createObjectURL(f));
  }

  if (preview) {
    return (
      <div>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#F1F5F9', border: '1.5px solid #E2E8F0' }}>
          <img src={preview} alt={alt || label} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
            <button type="button" onClick={() => inputRef.current?.click()}
              style={{ padding: '5px 10px', borderRadius: '7px', background: 'rgba(255,255,255,0.92)', border: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={11} strokeWidth={2} /> Ersetzen
            </button>
            <button type="button" onClick={() => { URL.revokeObjectURL(preview); onRemove(); }}
              style={{ padding: '5px 8px', borderRadius: '7px', background: 'rgba(254,242,242,0.95)', border: '1px solid #FECACA', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ImageIcon size={12} strokeWidth={2} color="#94A3B8" style={{ flexShrink: 0 }} />
          <input type="text" value={alt} onChange={e => onAlt(e.target.value)}
            placeholder={altPlaceholder || 'Alt-Text für SEO…'} style={S.inp} />
        </div>
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => pickFiles(e.target.files)} />
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); pickFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? '#0EA5E9' : '#CBD5E1'}`,
          borderRadius: '14px', background: dragging ? '#EFF6FF' : '#FAFBFF',
          padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={18} strokeWidth={1.5} color="#0EA5E9" />
          </div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Bild hierher ziehen oder klicken</p>
          <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>JPG, PNG, WebP · max. 10 MB · Empfohlen: 1920×1080 px</p>
          <p style={{ fontSize: '10px', color: '#CBD5E1', margin: '4px 0 0', fontStyle: 'italic' }}>Dateinamen werden automatisch optimiert.</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => pickFiles(e.target.files)} />
      {err && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px', color: '#DC2626' }}><AlertCircle size={12} strokeWidth={2} />{err}</div>}
    </div>
  );
}

// ── LocalGalleryPicker ────────────────────────────────────────────────────────
// Holds File objects in the parent; no upload happens here.
function LocalGalleryPicker({ items, onChange, destName }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [err, setErr] = useState('');

  function addFiles(files) {
    setErr('');
    const valid = Array.from(files).filter(f => ACCEPTED_MIME.has(f.type) && f.size <= MAX_BYTES);
    if (!valid.length) { setErr('Keine gültigen Bilder (JPG/PNG/WebP, max. 10 MB).'); return; }
    const next = [...items, ...valid.map((f, i) => ({
      localId: `${Date.now()}-${i}-${f.name}-${f.size}`,
      file: f,
      preview: URL.createObjectURL(f),
      alt: `${destName || 'Reiseziel'} Reisebild ${items.length + i + 1}`,
    }))];
    onChange(next);
  }

  function remove(i) {
    URL.revokeObjectURL(items[i].preview);
    onChange(items.filter((_, idx) => idx !== i));
  }
  function moveUp(i) {
    if (i === 0) return;
    const next = [...items]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next);
  }
  function moveDown(i) {
    if (i === items.length - 1) return;
    const next = [...items]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; onChange(next);
  }
  function updateAlt(i, val) {
    onChange(items.map((it, idx) => idx === i ? { ...it, alt: val } : it));
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? '#0EA5E9' : '#CBD5E1'}`,
          borderRadius: '12px', background: dragging ? '#EFF6FF' : '#FAFBFF',
          padding: '16px', textAlign: 'center', cursor: 'pointer', marginBottom: '12px', transition: 'all 0.15s',
        }}
      >
        <Upload size={16} strokeWidth={1.5} color="#94A3B8" style={{ marginBottom: '4px' }} />
        <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: 600 }}>Mehrere Bilder auswählen oder hierher ziehen</p>
        <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0' }}>JPG, PNG, WebP · max. 10 MB pro Bild</p>
      </div>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
      {err && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', color: '#DC2626' }}><AlertCircle size={12} strokeWidth={2} />{err}</div>}

      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {items.map((item, i) => (
            <div key={item.localId ?? item.preview} style={{ border: '1.5px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', background: '#FFFFFF' }}>
              <div style={{ position: 'relative', background: '#F1F5F9', aspectRatio: '4/3' }}>
                <img src={item.preview} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>{i + 1}</span>
              </div>
              <div style={{ padding: '7px' }}>
                <input type="text" value={item.alt} onChange={e => updateAlt(i, e.target.value)}
                  placeholder={`${destName || 'Bild'} ${i + 1}`} style={{ ...S.inp, marginBottom: '5px' }} />
                <div style={{ display: 'flex', gap: '3px' }}>
                  <BtnSmall onClick={() => moveUp(i)} disabled={i === 0} title="Nach oben"><ChevronUp size={11} strokeWidth={2.5} /></BtnSmall>
                  <BtnSmall onClick={() => moveDown(i)} disabled={i === items.length - 1} title="Nach unten"><ChevronDown size={11} strokeWidth={2.5} /></BtnSmall>
                  <BtnSmall onClick={() => remove(i)} danger title="Entfernen" style={{ marginLeft: 'auto' }}><X size={11} strokeWidth={2.5} /></BtnSmall>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {items.length === 0 && <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: 0 }}>Noch keine Galerie-Bilder ausgewählt.</p>}
    </div>
  );
}

function BtnSmall({ onClick, disabled, danger, title, children, style: extraStyle }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '24px', height: '24px', border: danger ? '1px solid #FECACA' : '1px solid #E2E8F0',
        borderRadius: '5px', background: danger ? '#FEF2F2' : disabled ? '#F8FAFF' : '#FFFFFF',
        color: danger ? '#DC2626' : disabled ? '#CBD5E1' : '#64748B',
        cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit', ...extraStyle,
      }}>
      {children}
    </button>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────
function SDiv({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0 10px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>{label}</p>
      <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DestinationImportClient() {
  // JSON state
  const [rawJson, setRawJson]   = useState('');
  const [result,  setResult]    = useState(null);
  const [checked, setChecked]   = useState(false);

  // Save state
  const [saving,     setSaving]     = useState(false);
  const [savingStep, setSavingStep] = useState('');
  const [saveErr,    setSaveErr]    = useState('');
  const [savedId,    setSavedId]    = useState(null);
  const [savedStatus,    setSavedStatus]    = useState(null);
  const [savedSlug,      setSavedSlug]      = useState('');
  const [savedHasImages, setSavedHasImages] = useState(false);

  // Media state (held locally, uploaded during save)
  const [heroFile,    setHeroFile]    = useState(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [heroAlt,     setHeroAlt]     = useState('');
  const [useHeroAsOg, setUseHeroAsOg] = useState(true);
  const [ogFile,    setOgFile]    = useState(null);
  const [ogPreview, setOgPreview] = useState('');
  const [useOgAsTwitter, setUseOgAsTwitter] = useState(true);
  const [twitterFile,    setTwitterFile]    = useState(null);
  const [twitterPreview, setTwitterPreview] = useState('');
  const [galleryItems, setGalleryItems] = useState([]); // [{file, preview, alt}]

  function resetMedia() {
    if (heroPreview)    URL.revokeObjectURL(heroPreview);
    if (ogPreview)      URL.revokeObjectURL(ogPreview);
    if (twitterPreview) URL.revokeObjectURL(twitterPreview);
    galleryItems.forEach(g => URL.revokeObjectURL(g.preview));
    setHeroFile(null); setHeroPreview(''); setHeroAlt('');
    setUseHeroAsOg(true); setOgFile(null); setOgPreview('');
    setUseOgAsTwitter(true); setTwitterFile(null); setTwitterPreview('');
    setGalleryItems([]);
  }

  async function uploadFile(file, slug, type, galleryIndex) {
    if (process.env.NODE_ENV === 'development') {
      console.log('import uploadFile', { type, galleryIndex, fileName: file.name, fileSize: file.size });
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('slug', slug);
    fd.append('type', type);
    if (typeof galleryIndex === 'number') fd.append('galleryIndex', String(galleryIndex));
    const res  = await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
    const text = await res.text();
    if (process.env.NODE_ENV === 'development') {
      console.log('import upload response', { status: res.status, body: text.slice(0, 200) });
    }
    let json;
    try { json = JSON.parse(text); } catch {
      throw new Error(
        res.status === 413
          ? 'Die Datei ist zu groß für den Upload. Bitte kleineres Bild verwenden.'
          : `Upload fehlgeschlagen (${res.status}).`
      );
    }
    if (!res.ok) throw new Error(json.error ?? `Upload fehlgeschlagen (${res.status}).`);
    return json;
  }

  const handleValidate = useCallback(() => {
    setSaveErr(''); setSavedId(null);
    const r = validateDestinationImport(rawJson);
    setResult(r); setChecked(true);
  }, [rawJson]);

  const handleExample = useCallback(() => {
    setRawJson(JSON.stringify(EXAMPLE_DESTINATION_JSON, null, 2));
    setResult(null); setChecked(false); setSaveErr(''); setSavedId(null);
    resetMedia();
  }, []);

  const handleSave = useCallback(async (targetStatus) => {
    if (!result?.valid || !result.normalized) return;
    setSaving(true); setSaveErr(''); setSavingStep('Reiseziel wird erstellt…');
    try {
      // ── Step 1: Create destination ──
      const body = {
        ...result.normalized,
        status: targetStatus,
        ...(targetStatus === 'published' ? { published_at: new Date().toISOString() } : {}),
      };
      const createRes  = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const createJson = await createRes.json().catch(() => ({}));
      if (!createRes.ok) { setSaveErr(createJson.error ?? 'Unbekannter Fehler beim Speichern.'); return; }

      const id       = createJson.destination?.id;
      const slug     = result.normalized.slug;
      const destName = result.normalized.name || 'Reiseziel';

      // ── Step 2: Upload images ──
      const imageUpdates = {};
      const altTexts     = {};
      let   uploadErr    = '';

      const hasImages = heroFile || (!useHeroAsOg && ogFile) || (!useOgAsTwitter && twitterFile) || galleryItems.length > 0;

      if (hasImages) {
        try {
          if (heroFile) {
            setSavingStep('Hero-Bild wird hochgeladen…');
            const r = await uploadFile(heroFile, slug, 'hero');
            imageUpdates.hero_image = r.url;
            altTexts.hero = heroAlt.trim() || `${destName} Urlaub – Titelbild`;
          }

          if (useHeroAsOg) {
            if (imageUpdates.hero_image) imageUpdates.open_graph_image = imageUpdates.hero_image;
          } else if (ogFile) {
            setSavingStep('OG-Bild wird hochgeladen…');
            const r = await uploadFile(ogFile, slug, 'og', undefined);
            imageUpdates.open_graph_image = r.url;
          }

          if (useOgAsTwitter) {
            const twitterFallback = imageUpdates.open_graph_image || imageUpdates.hero_image;
            if (twitterFallback) imageUpdates.twitter_image = twitterFallback;
          } else if (twitterFile) {
            setSavingStep('Twitter-Bild wird hochgeladen…');
            const r = await uploadFile(twitterFile, slug, 'twitter', undefined);
            imageUpdates.twitter_image = r.url;
          }

          if (galleryItems.length > 0) {
            const galleryUrls = [];
            for (let i = 0; i < galleryItems.length; i++) {
              setSavingStep(`Galerie-Bilder werden hochgeladen (${i + 1}/${galleryItems.length})…`);
              const r = await uploadFile(galleryItems[i].file, slug, 'gallery', i);
              galleryUrls.push(r.url);
              altTexts[`gallery_${i}`] = galleryItems[i].alt.trim() || `${destName} Reisebild ${i + 1}`;
            }
            imageUpdates.gallery_images = galleryUrls;
          }

          if (Object.keys(altTexts).length > 0) {
            imageUpdates.image_alt_texts = altTexts;
          }

          // ── Step 3: PATCH destination with image URLs ──
          if (Object.keys(imageUpdates).length > 0) {
            setSavingStep('Bildpfade werden gespeichert…');
            const patchRes = await fetch(`/api/admin/destinations/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(imageUpdates),
            });
            if (!patchRes.ok) {
              const pj = await patchRes.json().catch(() => ({}));
              uploadErr = pj.error ?? 'Bilder konnten nicht gespeichert werden. Bitte im Editor nachpflegen.';
            }
          }
        } catch (e) {
          uploadErr = 'Bild-Upload fehlgeschlagen: ' + e.message;
        }
      }

      setSavedId(id);
      setSavedStatus(targetStatus);
      setSavedSlug(slug);
      setSavedHasImages(Object.keys(imageUpdates).length > 0);
      if (uploadErr) setSaveErr(uploadErr);

    } finally {
      setSaving(false); setSavingStep('');
    }
  }, [result, heroFile, heroAlt, useHeroAsOg, ogFile, useOgAsTwitter, twitterFile, galleryItems]);

  const isValid   = result?.valid === true;
  const destName  = result?.normalized?.name || 'Reiseziel';

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link href="/admin/reiseziele" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
          <ArrowLeft size={13} strokeWidth={2} /> Reiseziele
        </Link>
        <span style={{ color: '#CBD5E1', fontSize: '13px' }}>/</span>
        <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>JSON importieren</span>
      </div>

      {/* ── Step indicator ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['1 Prompt kopieren', '2 JSON einfügen', '3 JSON prüfen', '4 Bilder auswählen', '5 Speichern'].map((step, i) => (
          <span key={step} style={{
            fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
            background: i < 3 ? '#F0F9FF' : i === 3 ? (isValid ? '#F0FDF4' : '#F8FAFF') : (savedId ? '#F0FDF4' : '#F8FAFF'),
            color: i < 3 ? '#0284C7' : i === 3 ? (isValid ? '#059669' : '#94A3B8') : (savedId ? '#059669' : '#94A3B8'),
            border: `1px solid ${i < 3 ? '#BAE6FD' : i === 3 ? (isValid ? '#A7F3D0' : '#E2E8F0') : (savedId ? '#A7F3D0' : '#E2E8F0')}`,
          }}>
            {step}
          </span>
        ))}
      </div>

      {/* ── 1. Claude Prompt ── */}
      <CopyBlock />

      {/* ── 2+3. JSON Input + Validate ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FileJson size={16} strokeWidth={2} color="#0EA5E9" />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>JSON einfügen</span>
        </div>
        <label style={S.label} htmlFor="json-input">Reiseziel-JSON</label>
        <textarea
          id="json-input"
          value={rawJson}
          onChange={e => { setRawJson(e.target.value); setChecked(false); setResult(null); setSaveErr(''); setSavedId(null); }}
          placeholder={'{\n  "name": "Reiseziel",\n  "slug": "reiseziel",\n  ...\n}'}
          style={S.textarea}
          spellCheck={false}
          autoComplete="off"
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
          <button onClick={handleValidate} disabled={!rawJson.trim()} style={{ ...S.btnPrimary, ...(!rawJson.trim() ? S.btnDisabled : {}) }}>
            <CheckCircle size={14} strokeWidth={2.5} /> JSON prüfen
          </button>
          <button onClick={handleExample} style={S.btnSecondary}>Beispiel anzeigen (Madeira)</button>
          {rawJson.trim() && (
            <button onClick={() => { setRawJson(''); setResult(null); setChecked(false); setSaveErr(''); setSavedId(null); resetMedia(); }} style={{ ...S.btnSecondary, color: '#94A3B8' }}>
              Leeren
            </button>
          )}
        </div>
        {checked && result && <ValidationErrors errors={result.errors ?? []} warnings={result.warnings ?? []} />}
      </div>

      {/* ── 4. Preview ── */}
      {isValid && result.normalized && (
        <PreviewPanel data={result.normalized} warnings={result.warnings ?? []} autogenerated={result.autogenerated ?? []} />
      )}

      {/* ── 4. Media Section ── */}
      {isValid && result.normalized && !savedId && (
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ImageIcon size={16} strokeWidth={2} color="#0EA5E9" />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Bilder hinzufügen</span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginLeft: '4px' }}>optional – kann auch später im Editor ergänzt werden</span>
          </div>
          <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 4px', fontStyle: 'italic' }}>
            Dateinamen werden automatisch optimiert. Du musst die Bilder vorher nicht umbenennen.
          </p>

          {/* Hero */}
          <SDiv label="Hero-Bild" />
          <LocalFilePicker
            file={heroFile} preview={heroPreview} alt={heroAlt}
            onPick={(f, p) => { setHeroFile(f); setHeroPreview(p); }}
            onAlt={setHeroAlt}
            onRemove={() => { setHeroFile(null); setHeroPreview(''); setHeroAlt(''); }}
            label="Hero-Bild"
            altPlaceholder={`${destName} Urlaub – Titelbild`}
          />

          {/* Open Graph */}
          <SDiv label="Open Graph Bild" />
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>
            <input type="checkbox" checked={useHeroAsOg} onChange={e => { setUseHeroAsOg(e.target.checked); if (e.target.checked) { setOgFile(null); URL.revokeObjectURL(ogPreview); setOgPreview(''); } }} style={{ width: '15px', height: '15px' }} />
            Hero-Bild als Open Graph Bild verwenden
          </label>
          {!useHeroAsOg && (
            <LocalFilePicker
              file={ogFile} preview={ogPreview} alt=""
              onPick={(f, p) => { setOgFile(f); setOgPreview(p); }}
              onAlt={() => {}}
              onRemove={() => { setOgFile(null); URL.revokeObjectURL(ogPreview); setOgPreview(''); }}
              label="Open Graph Bild"
              altPlaceholder={`${destName} – Open Graph`}
            />
          )}

          {/* Twitter */}
          <SDiv label="Twitter / X Bild" />
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>
            <input type="checkbox" checked={useOgAsTwitter} onChange={e => { setUseOgAsTwitter(e.target.checked); if (e.target.checked) { setTwitterFile(null); URL.revokeObjectURL(twitterPreview); setTwitterPreview(''); } }} style={{ width: '15px', height: '15px' }} />
            Open Graph Bild als Twitter / X Bild verwenden
          </label>
          {!useOgAsTwitter && (
            <LocalFilePicker
              file={twitterFile} preview={twitterPreview} alt=""
              onPick={(f, p) => { setTwitterFile(f); setTwitterPreview(p); }}
              onAlt={() => {}}
              onRemove={() => { setTwitterFile(null); URL.revokeObjectURL(twitterPreview); setTwitterPreview(''); }}
              label="Twitter-Bild"
              altPlaceholder={`${destName} – Twitter`}
            />
          )}

          {/* Gallery */}
          <SDiv label="Galerie-Bilder" />
          <LocalGalleryPicker items={galleryItems} onChange={setGalleryItems} destName={destName} />

          {/* Summary */}
          {(heroFile || galleryItems.length > 0) && (
            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #A7F3D0', fontSize: '12px', color: '#065F46', fontWeight: 600 }}>
              <CheckCircle size={12} strokeWidth={2.5} color="#059669" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              {[heroFile && 'Hero-Bild', galleryItems.length > 0 && `${galleryItems.length} Galerie-Bild${galleryItems.length > 1 ? 'er' : ''}`, !useHeroAsOg && ogFile && 'OG-Bild', !useOgAsTwitter && twitterFile && 'Twitter-Bild'].filter(Boolean).join(' · ')} ausgewählt
            </div>
          )}
          {!heroFile && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#92400E' }}>
              <AlertTriangle size={12} strokeWidth={2.5} color="#D97706" />
              Kein Hero-Bild ausgewählt. Du kannst es nach dem Speichern im Editor hinzufügen.
            </div>
          )}
        </div>
      )}

      {/* ── 5. Save ── */}
      {isValid && result.normalized && (
        <div style={S.card}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Speichern</div>

          {savedId ? (
            <div style={{ padding: '16px 18px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <CheckCircle size={18} strokeWidth={2.5} color="#059669" />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#065F46' }}>
                  {savedStatus === 'published' ? 'Reiseziel veröffentlicht!' : 'Entwurf gespeichert!'}
                  {savedHasImages && <span style={{ fontSize: '12px', fontWeight: 500, color: '#059669', marginLeft: '8px' }}>Bilder wurden hochgeladen.</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Link href={`/admin/reiseziele/${savedId}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', background: '#0EA5E9', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                  Im Editor öffnen
                </Link>
                {savedStatus === 'published' && savedSlug && (
                  <Link href={`/reiseziele/${savedSlug}`} target="_blank"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #A7F3D0', color: '#059669', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                    <ExternalLink size={12} strokeWidth={2.5} /> Öffentliche Seite ansehen
                  </Link>
                )}
                <Link href="/admin/reiseziele" style={{ color: '#64748B', textDecoration: 'none', fontSize: '13px', fontWeight: 500, padding: '7px 12px' }}>
                  Zur Liste
                </Link>
              </div>
              {!savedHasImages && (
                <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: '#FFF7ED', border: '1px solid #FED7AA', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#92400E' }}>
                  <AlertTriangle size={12} strokeWidth={2.5} color="#D97706" />
                  Noch keine Bilder hochgeladen.
                  <Link href={`/admin/reiseziele/${savedId}?tab=medien`} style={{ color: '#D97706', fontWeight: 700, textDecoration: 'none' }}>
                    Jetzt Bilder hinzufügen →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => handleSave('draft')} disabled={saving} style={{ ...S.btnSecondary, ...(saving ? S.btnDisabled : {}) }}>
                  {saving && savingStep ? savingStep : 'Als Entwurf speichern'}
                </button>
                <button onClick={() => handleSave('published')} disabled={saving} style={{ ...S.btnGreen, ...(saving ? S.btnDisabled : {}) }}>
                  {saving ? (
                    <><RefreshCw size={13} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />{savingStep || 'Wird gespeichert…'}</>
                  ) : (
                    <><Upload size={14} strokeWidth={2.5} /> Direkt veröffentlichen</>
                  )}
                </button>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  {heroFile || galleryItems.length > 0 ? `${[heroFile && 'Hero', galleryItems.length > 0 && `${galleryItems.length} Galerie-Bilder`].filter(Boolean).join(' + ')} werden beim Speichern hochgeladen` : 'Entwurf: jederzeit bearbeitbar · Veröffentlichen: sofort live'}
                </span>
              </div>
            </div>
          )}

          {saveErr && (
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', fontSize: '13px', color: '#DC2626', fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertCircle size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
              {saveErr}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
