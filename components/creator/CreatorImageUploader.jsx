'use client';

import { useState, useRef } from 'react';

/**
 * Einfacher Bild-Uploader für Creator (kein Admin).
 * Nutzt /api/creator-media/upload mit Token-Auth.
 *
 * Props:
 *   value        string          – aktuelle Bild-URL
 *   onChange     (url) => void
 *   token        string          – Creator-Token
 *   targetType   'profile'|'hero' – Upload-Ziel
 *   label        string
 *   hint         string
 *   aspectRatio  string          – CSS aspect-ratio für Preview (z.B. '1/1', '16/6')
 */
export default function CreatorImageUploader({
  value,
  onChange,
  token,
  targetType,
  submissionId,
  stationIndex,
  label,
  hint,
  aspectRatio = '16/7',
}) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [dragging,  setDragging]  = useState(false);
  const inputRef = useRef(null);

  async function upload(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Nur JPG, PNG oder WebP erlaubt.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Datei zu groß (max. 5 MB).');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file',       file);
      fd.append('token',      token);
      fd.append('targetType', targetType);
      if (submissionId)  fd.append('submissionId',  submissionId);
      if (stationIndex != null) fd.append('stationIndex', String(stationIndex));

      const res  = await fetch('/api/creator-media/upload', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Upload fehlgeschlagen (${res.status}).`);
      onChange(json.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files) {
    const file = files?.[0];
    if (file) upload(file);
  }

  const dropProps = {
    onDragOver:  e => { e.preventDefault(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop:      e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); },
  };

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
          {label}
        </label>
      )}

      {value ? (
        /* Preview */
        <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid #E2E8F0', background: '#F1F5F9' }}>
          <img
            src={value}
            alt=""
            style={{ width: '100%', aspectRatio, objectFit: 'cover', display: 'block' }}
            onError={e => { e.currentTarget.style.opacity = '0.3'; }}
          />
          {/* Overlay */}
          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.92)', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 700, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {uploading ? '…' : '↺ Ersetzen'}
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ padding: '6px 8px', borderRadius: '8px', background: 'rgba(254,242,242,0.95)', border: '1px solid #FECACA', color: '#DC2626', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
              title="Entfernen"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        /* Drop Zone */
        <div
          {...dropProps}
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#0EA5E9' : '#CBD5E1'}`,
            borderRadius: '14px',
            background: dragging ? '#EFF6FF' : '#FAFBFF',
            padding: '28px 20px',
            textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {uploading ? (
            <p style={{ margin: 0, fontSize: '13px', color: '#0EA5E9', fontWeight: 600 }}>⟳ Wird hochgeladen…</p>
          ) : (
            <>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '18px' }}>
                📤
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Bild hochladen
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>
                JPG, PNG, WebP · max. 5 MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      {error && (
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#DC2626' }}>{error}</p>
      )}
      {hint && (
        <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#94A3B8', lineHeight: 1.5 }}>{hint}</p>
      )}
    </div>
  );
}
