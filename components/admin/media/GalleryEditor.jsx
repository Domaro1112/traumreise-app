'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ChevronUp, ChevronDown, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';

const ACCEPTED = '.jpg,.jpeg,.png,.webp';

function uid() {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
}

const inp = {
  width: '100%', padding: '7px 10px', border: '1.5px solid #E2E8F0', borderRadius: '8px',
  fontSize: '11.5px', color: '#0F172A', background: '#FAFAFA', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
};

/**
 * Multi-image gallery editor.
 *
 * Props:
 *   items       [{ url, alt }]  – current gallery items
 *   onChange    ([{ url, alt }]) => void
 *   slug        string
 *   destName    string  – used for alt text suggestions
 */
export default function GalleryEditor({ items = [], onChange, slug, destName = '', context = 'destination', showTitle = false, showCaption = false }) {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const inputRef = useRef(null);

  const canUpload = !!slug?.trim();

  async function uploadFile(file, galleryIndex) {
    if (process.env.NODE_ENV === 'development') {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const n = String(galleryIndex + 1).padStart(2, '0');
      console.log('gallery upload item', {
        galleryIndex,
        fileName: file.name,
        fileSize: file.size,
        lastModified: file.lastModified,
        targetPath: `destinations/${slug}/gallery-${n}.${ext}`,
      });
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('slug', slug);
    fd.append('type', 'gallery');
    fd.append('context', context);
    fd.append('galleryIndex', String(galleryIndex));
    const res = await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
    const text = await res.text();
    if (process.env.NODE_ENV === 'development') {
      console.log('gallery upload response', { status: res.status, body: text.slice(0, 200) });
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

  async function handleFiles(files) {
    if (!canUpload) { setError('Bitte zuerst Slug/Basis-Daten speichern.'); return; }
    setError(''); setUploading(true);
    try {
      const valid = Array.from(files).filter(f => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) return false;
        if (f.size > 10 * 1024 * 1024) return false;
        return true;
      });
      if (!valid.length) { setError('Keine gültigen Bilder (JPG/PNG/WebP, max. 10 MB).'); return; }

      const startIdx = items.length;
      const newItems = [];
      // Sequential — each file gets its own request so no race condition on path assignment
      for (let i = 0; i < valid.length; i++) {
        const galleryIndex = startIdx + i;
        const result = await uploadFile(valid[i], galleryIndex);
        newItems.push({
          localId: uid(),
          url: result.url,
          alt: `${destName} Reisebild ${galleryIndex + 1}`.trim(),
        });
      }
      onChange([...items, ...newItems]);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  const updateItem = useCallback((i, field, val) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    onChange(next);
  }, [items, onChange]);

  const removeItem = useCallback(async (i) => {
    const item = items[i];
    if (item?.url) {
      await fetch('/api/admin/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url }),
      }).catch(() => {});
    }
    onChange(items.filter((_, idx) => idx !== i));
  }, [items, onChange]);

  const moveUp   = useCallback((i) => {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }, [items, onChange]);

  const moveDown = useCallback((i) => {
    if (i === items.length - 1) return;
    const next = [...items];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    onChange(next);
  }, [items, onChange]);

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => canUpload && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? '#0EA5E9' : '#CBD5E1'}`,
          borderRadius: '12px',
          background: dragging ? '#EFF6FF' : '#FAFBFF',
          padding: '20px',
          textAlign: 'center',
          cursor: canUpload ? 'pointer' : 'not-allowed',
          marginBottom: '14px',
          transition: 'all 0.15s',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RefreshCw size={16} strokeWidth={2} color="#0EA5E9" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 600 }}>Wird hochgeladen…</span>
          </div>
        ) : (
          <>
            <Upload size={18} strokeWidth={1.5} color="#94A3B8" style={{ marginBottom: '6px' }} />
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontWeight: 600 }}>
              {canUpload ? 'Mehrere Bilder auswählen oder hierher ziehen' : 'Slug erforderlich'}
            </p>
            <p style={{ fontSize: '11px', color: '#94A3B8', margin: '3px 0 0' }}>
              JPG, PNG, WebP · max. 10 MB pro Bild
            </p>
            <p style={{ fontSize: '10px', color: '#CBD5E1', margin: '4px 0 0', fontStyle: 'italic' }}>
              Dateinamen werden automatisch optimiert (gallery-01.jpg, gallery-02.jpg …)
            </p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept={ACCEPTED} multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '12px', color: '#DC2626' }}>
          <AlertCircle size={12} strokeWidth={2} /> {error}
        </div>
      )}

      {/* Gallery grid */}
      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {items.map((item, i) => (
            <div
              key={item.localId ?? item.url ?? `idx-${i}`}
              style={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', background: '#F1F5F9', aspectRatio: '4/3' }}>
                {item.url ? (
                  <img
                    src={item.localId ? `${item.url}?v=${item.localId}` : item.url}
                    alt={item.alt || `Galerie ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <ImageIcon size={24} strokeWidth={1.5} color="#94A3B8" />
                  </div>
                )}
                {/* Badge */}
                <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '5px' }}>
                  {i + 1}
                </span>
              </div>

              {/* Controls */}
              <div style={{ padding: '8px' }}>
                {showTitle && (
                  <input
                    type="text"
                    value={item.title ?? ''}
                    onChange={e => updateItem(i, 'title', e.target.value)}
                    placeholder="Titel…"
                    style={{ ...inp, marginBottom: '4px' }}
                  />
                )}
                <input
                  type="text"
                  value={item.alt ?? ''}
                  onChange={e => updateItem(i, 'alt', e.target.value)}
                  placeholder={`Alt-Text – ${destName || 'Bild'} ${i + 1}`}
                  style={inp}
                />
                {showCaption && (
                  <input
                    type="text"
                    value={item.caption ?? ''}
                    onChange={e => updateItem(i, 'caption', e.target.value)}
                    placeholder="Bildunterschrift (optional)…"
                    style={{ ...inp, marginTop: '4px' }}
                  />
                )}
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
                    title="Nach oben" style={btnSmall(i === 0)}>
                    <ChevronUp size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === items.length - 1}
                    title="Nach unten" style={btnSmall(i === items.length - 1)}>
                    <ChevronDown size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => removeItem(i)} title="Entfernen"
                    style={{ ...btnSmall(false), marginLeft: 'auto', color: '#DC2626', background: '#FEF2F2', borderColor: '#FECACA' }}>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !uploading && (
        <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: 0 }}>
          Noch keine Galerie-Bilder hinzugefügt.
        </p>
      )}
    </div>
  );
}

function btnSmall(disabled) {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '26px', height: '26px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    background: disabled ? '#F8FAFF' : '#FFFFFF',
    color: disabled ? '#CBD5E1' : '#64748B',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit',
  };
}
