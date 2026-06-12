'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

const ACCEPTED = '.jpg,.jpeg,.png,.webp';
const inp = {
  width: '100%', padding: '8px 11px', border: '1.5px solid #E2E8F0', borderRadius: '9px',
  fontSize: '12px', color: '#0F172A', background: '#FAFAFA', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
};

/**
 * Single-image upload widget with drag & drop, preview, replace, delete, alt text.
 *
 * Props:
 *   value       string  – current image URL (from DB or previous upload)
 *   alt         string  – current alt text
 *   onChange    (url, alt) => void
 *   onDelete    () => void
 *   slug        string  – destination slug (folder name in storage)
 *   type        'hero' | 'og' | 'twitter' | 'gallery'
 *   label       string
 *   altDefault  string  – alt text placeholder / suggestion
 */
export default function ImageUploader({ value, alt = '', onChange, onDelete, slug, type = 'gallery', label, altDefault = '' }) {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const [localAlt, setLocalAlt]   = useState(alt);
  const inputRef = useRef(null);

  const canUpload = !!slug?.trim();

  async function upload(file) {
    if (!canUpload) { setError('Bitte zuerst Slug/Basis-Daten speichern.'); return; }
    setError(''); setUploading(true);
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('image upload start', { type, slug, fileName: file.name, fileSize: file.size, fileType: file.type });
      }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slug', slug);
      fd.append('type', type);
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
      const text = await res.text();
      if (process.env.NODE_ENV === 'development') {
        console.log('image upload response', { status: res.status, body: text.slice(0, 200) });
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
      const newAlt = localAlt || altDefault || '';
      onChange(json.url, newAlt);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!value) return;
    setError('');
    try {
      await fetch('/api/admin/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }),
      });
    } catch { /* ignore storage error – still clear from form */ }
    onDelete();
  }

  const handleFiles = useCallback((files) => {
    const file = files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Nur JPG, PNG oder WebP erlaubt.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Datei zu groß (max. 10 MB).');
      return;
    }
    upload(file);
  }, [slug, type, localAlt]);

  // ── Drop zone ────────────────────────────────────────────────────────────────
  if (!value) {
    return (
      <div>
        <div
          onClick={() => canUpload && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          style={{
            border: `2px dashed ${dragging ? '#0EA5E9' : '#CBD5E1'}`,
            borderRadius: '14px',
            background: dragging ? '#EFF6FF' : '#FAFBFF',
            padding: '32px 24px',
            textAlign: 'center',
            cursor: canUpload ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <RefreshCw size={22} strokeWidth={1.5} color="#0EA5E9" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 600 }}>Wird hochgeladen…</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={20} strokeWidth={1.5} color="#0EA5E9" />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 3px' }}>
                  {canUpload ? 'Bild hierher ziehen oder klicken' : 'Slug erforderlich'}
                </p>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                  JPG, PNG, WebP · max. 10 MB · Empfohlen: 1920×1080 px
                </p>
                <p style={{ fontSize: '10px', color: '#CBD5E1', margin: '4px 0 0', fontStyle: 'italic' }}>
                  Dateinamen werden automatisch optimiert. Du musst die Bilder vorher nicht umbenennen.
                </p>
              </div>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED} style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
        {error && <ErrorMsg msg={error} />}
      </div>
    );
  }

  // ── Preview with controls ────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#F1F5F9', border: '1.5px solid #E2E8F0' }}>
        <img
          src={value}
          alt={localAlt || altDefault || label || 'Bild'}
          style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block' }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        {/* Overlay buttons */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => canUpload && inputRef.current?.click()}
            disabled={!canUpload || uploading}
            title="Ersetzen"
            style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.92)', border: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {uploading ? <RefreshCw size={12} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} strokeWidth={2} />}
            Ersetzen
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title="Entfernen"
            style={{ padding: '6px 8px', borderRadius: '8px', background: 'rgba(254,242,242,0.95)', border: '1px solid #FECACA', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <input ref={inputRef} type="file" accept={ACCEPTED} style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />

      {/* Alt text */}
      <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <ImageIcon size={13} strokeWidth={2} color="#94A3B8" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={localAlt}
          onChange={e => { setLocalAlt(e.target.value); onChange(value, e.target.value); }}
          placeholder={altDefault || 'Alt-Text für SEO & Barrierefreiheit…'}
          style={{ ...inp, fontSize: '12px' }}
        />
      </div>

      {error && <ErrorMsg msg={error} />}
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>
      <AlertCircle size={12} strokeWidth={2} />
      {msg}
    </div>
  );
}
