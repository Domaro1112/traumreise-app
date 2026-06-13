'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { buildExportJson } from '@/lib/blog-content-utils';

export default function BlogExportModal({ open, onClose, f, initialData }) {
  const [copied, setCopied] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Reset copy state when reopened
  useEffect(() => {
    if (open) setCopied(false);
  }, [open]);

  const jsonText = useMemo(() => {
    if (!open) return '';
    return JSON.stringify(buildExportJson(f, initialData), null, 2);
  }, [open, f, initialData]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  function handleDownload() {
    const slug = (f.slug || 'artikel').trim();
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(15,23,42,0.50)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '32px 16px',
        overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '740px',
        boxShadow: '0 24px 80px rgba(15,23,42,0.22)',
        overflow: 'hidden',
        marginBottom: '32px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1.5px solid #F1F5F9',
          background: '#FAFBFF',
        }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              JSON exportieren
            </p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
              Aktueller Artikelstand im Import-Format
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '8px',
              border: '1.5px solid #E2E8F0', background: '#FFFFFF',
              color: '#64748B', cursor: 'pointer',
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', gap: '10px', padding: '14px 24px',
          borderBottom: '1px solid #F1F5F9',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          <button
            onClick={handleCopy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '10px',
              background: copied
                ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                : 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#FFFFFF', border: 'none',
              fontSize: '13px', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(14,165,233,0.25)',
              transition: 'background 0.2s',
            }}
          >
            {copied
              ? <><Check size={14} strokeWidth={2.5} /> Kopiert</>
              : <><Copy size={14} strokeWidth={2} /> JSON kopieren</>}
          </button>

          <button
            onClick={handleDownload}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '10px',
              background: '#F8FAFF', color: '#334155',
              border: '1.5px solid #E2E8F0',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={14} strokeWidth={2} />
            Download .json
          </button>

          <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: 'auto' }}>
            {jsonText.split('\n').length} Zeilen · {(jsonText.length / 1024).toFixed(1)} KB
          </span>
        </div>

        {/* JSON textarea */}
        <div style={{ padding: '20px 24px' }}>
          <textarea
            readOnly
            value={jsonText}
            style={{
              width: '100%',
              minHeight: '380px',
              maxHeight: '60vh',
              padding: '14px',
              border: '1.5px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '12px',
              fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
              color: '#0F172A',
              background: '#F8FAFF',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              lineHeight: 1.6,
            }}
            onClick={e => e.target.select()}
          />
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
            Klicke ins Textfeld um alles zu markieren. Dieses JSON kann direkt in „JSON importieren" eingefügt werden.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1.5px solid #F1F5F9',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px', borderRadius: '10px',
              border: '1.5px solid #E2E8F0', background: '#FFFFFF',
              fontSize: '13px', fontWeight: 600, color: '#475569',
              cursor: 'pointer',
            }}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
