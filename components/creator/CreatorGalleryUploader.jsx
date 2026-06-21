'use client';

import { useState, useRef } from 'react';
import { Info } from 'lucide-react';

/**
 * Galerie-Uploader für Creator.
 * Nutzt /api/creator-media/upload mit Token-Auth.
 *
 * Props:
 *   images       string[]         – aktuelle Bild-URLs
 *   onChange     (string[]) => void
 *   token        string           – Creator-Token
 *   targetType   'gallery'|'submission' – Upload-Ziel
 *   submissionId string           – required when targetType === 'submission'
 *   maxImages    number           – max. Anzahl Bilder (default 8)
 *   disabled     boolean          – wenn true: Upload-Button deaktiviert (z.B. neue Submission noch nicht gespeichert)
 *   disabledHint string           – Hinweistext wenn disabled
 */
export default function CreatorGalleryUploader({
  images = [],
  onChange,
  token,
  targetType,
  submissionId,
  maxImages = 8,
  disabled = false,
  disabledHint = '',
}) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [dragging,  setDragging]  = useState(false);
  const inputRef = useRef(null);

  const canUpload = !disabled && images.length < maxImages;

  async function uploadFile(file, index) {
    const fd = new FormData();
    fd.append('file',        file);
    fd.append('token',       token);
    fd.append('targetType',  targetType);
    fd.append('galleryIndex', String(index));
    if (submissionId) fd.append('submissionId', submissionId);

    const res  = await fetch('/api/creator-media/upload', { method: 'POST', body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error ?? `Upload fehlgeschlagen (${res.status}).`);
    return json.url;
  }

  async function handleFiles(files) {
    if (!canUpload) return;
    setError('');

    const valid = Array.from(files).filter(f => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) return false;
      if (f.size > 5 * 1024 * 1024) return false;
      return true;
    });

    if (!valid.length) {
      setError('Keine gültigen Bilder (JPG/PNG/WebP, max. 5 MB).');
      return;
    }

    const allowed = valid.slice(0, maxImages - images.length);
    setUploading(true);
    try {
      const newUrls = [];
      for (let i = 0; i < allowed.length; i++) {
        const url = await uploadFile(allowed[i], images.length + i);
        newUrls.push(url);
      }
      onChange([...images, ...newUrls]);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  const showDisabledHint = disabled && disabledHint;

  const dropProps = canUpload ? {
    onDragOver:  e => { e.preventDefault(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop:      e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); },
  } : {};

  return (
    <div>
      {/* Info-Hinweis wenn Upload deaktiviert (noch keine submissionId) */}
      {showDisabledHint && (
        <div style={{
          display: 'flex', gap: '12px', alignItems: 'flex-start',
          background: '#F0F9FF', border: '1px solid #BAE6FD',
          borderRadius: '12px', padding: '14px 16px', marginBottom: '12px',
        }}>
          <Info size={16} color="#0EA5E9" style={{ marginTop: '1px', flexShrink: 0 }} />
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
              {disabledHint.primary}
            </p>
            {disabledHint.secondary && (
              <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.55 }}>
                {disabledHint.secondary}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!disabled && (
      <div
        {...dropProps}
        onClick={() => canUpload && !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#0EA5E9' : canUpload ? '#CBD5E1' : '#E2E8F0'}`,
          borderRadius: '12px',
          background: dragging ? '#EFF6FF' : canUpload ? '#FAFBFF' : '#F8FAFC',
          padding: '18px 20px',
          textAlign: 'center',
          cursor: canUpload && !uploading ? 'pointer' : 'default',
          marginBottom: '12px',
          transition: 'all 0.15s',
        }}
      >
        {uploading ? (
          <p style={{ margin: 0, fontSize: '13px', color: '#0EA5E9', fontWeight: 600 }}>Wird hochgeladen…</p>
        ) : images.length >= maxImages ? (
          <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>Maximum erreicht ({maxImages} Bilder)</p>
        ) : (
          <>
            <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
              Bilder hochladen · {images.length}/{maxImages}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>
              JPG, PNG, WebP · max. 5 MB pro Bild
            </p>
          </>
        )}
      </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      {error && (
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#DC2626' }}>{error}</p>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #E2E8F0', aspectRatio: '4/3', background: '#F1F5F9' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.opacity = '0.3'; }} />
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.55)', color: '#FFFFFF', cursor: 'pointer', fontSize: '13px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Bild entfernen"
              >
                ✕
              </button>
              <span style={{ position: 'absolute', bottom: '4px', left: '5px', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px' }}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
