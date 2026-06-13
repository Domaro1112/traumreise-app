'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Trash2, Image as ImageIcon, AlertCircle, FolderOpen } from 'lucide-react';

const inp = {
  width: '100%', padding: '8px 11px', border: '1.5px solid #E2E8F0', borderRadius: '9px',
  fontSize: '13px', color: '#0F172A', background: '#FAFAFA', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
};

export default function MediaLibraryClient() {
  const [slug, setSlug]       = useState('');
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [deleting, setDeleting] = useState(null);

  const loadFiles = useCallback(async (targetSlug) => {
    const q = targetSlug?.trim().toLowerCase();
    if (!q || !/^[a-z0-9-]+$/.test(q)) { setError('Gültiger Slug erforderlich (a-z, 0-9, -)'); return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`/api/admin/media/list?slug=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Fehler beim Laden.');
      setFiles(json.files ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (path) => {
    if (!confirm('Bild wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    setDeleting(path);
    try {
      await fetch('/api/admin/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      setFiles(prev => prev.filter(f => f.path !== path));
    } catch {
      setError('Löschen fehlgeschlagen.');
    } finally {
      setDeleting(null);
    }
  }, []);

  return (
    <div>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Reiseziel-Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadFiles(slug)}
            placeholder="z.B. mallorca"
            style={inp}
          />
        </div>
        <button
          type="button"
          onClick={() => loadFiles(slug)}
          disabled={loading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(14,165,233,0.25)',
          }}
        >
          {loading ? <RefreshCw size={14} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} strokeWidth={2.5} />}
          Laden
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px', padding: '10px 14px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', fontSize: '13px', color: '#DC2626' }}>
          <AlertCircle size={14} strokeWidth={2} />
          {error}
        </div>
      )}

      {/* File grid */}
      {files.length > 0 ? (
        <div>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px', fontWeight: 600 }}>
            {files.length} Datei{files.length !== 1 ? 'en' : ''} in <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>{slug}</code>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {files.map(file => (
              <div key={file.path} style={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
                {/* Preview */}
                <div style={{ position: 'relative', background: '#F1F5F9', aspectRatio: '4/3' }}>
                  {file.url ? (
                    <img src={file.url} alt={file.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <ImageIcon size={24} strokeWidth={1.5} color="#94A3B8" />
                    </div>
                  )}
                </div>
                {/* Meta + actions */}
                <div style={{ padding: '10px' }}>
                  {/* Display name (from alt text or readable fallback) */}
                  <p
                    title={file.displayName ?? file.name}
                    style={{
                      fontSize: '12px', fontWeight: 700, color: '#0F172A',
                      margin: '0 0 3px', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {file.displayName ?? file.name}
                  </p>
                  {/* Alt text hint — only if it differs from displayName */}
                  {file.altText && file.altText !== file.displayName && (
                    <p style={{
                      fontSize: '10px', color: '#7C3AED', margin: '0 0 3px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }} title={`Alt: ${file.altText}`}>
                      alt: {file.altText}
                    </p>
                  )}
                  {/* Technical filename */}
                  <p style={{
                    fontSize: '10px', color: '#94A3B8', margin: '0 0 3px',
                    fontFamily: 'monospace', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }} title={file.name}>
                    {file.name}
                  </p>
                  {/* Size + date */}
                  <p style={{ fontSize: '10px', color: '#CBD5E1', margin: '0 0 8px' }}>
                    {file.size ? `${Math.round(file.size / 1024)} KB` : '—'}
                    {file.created_at ? ` · ${new Date(file.created_at).toLocaleDateString('de-DE')}` : ''}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(file.path)}
                    disabled={deleting === file.path}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '7px',
                      border: '1px solid #FECACA',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: deleting === file.path ? 'wait' : 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {deleting === file.path
                      ? <RefreshCw size={10} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
                      : <Trash2 size={10} strokeWidth={2.5} />
                    }
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !loading && slug && (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <FolderOpen size={32} strokeWidth={1.2} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>Keine Dateien gefunden</p>
          <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '4px 0 0' }}>Noch keine Bilder für <strong>{slug}</strong> hochgeladen.</p>
        </div>
      )}

      {!slug && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <Search size={28} strokeWidth={1.2} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>Slug eingeben um Bilder zu laden</p>
          <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '4px 0 0' }}>z.B. <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px' }}>mallorca</code></p>
        </div>
      )}
    </div>
  );
}
