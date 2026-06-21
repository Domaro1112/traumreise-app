'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Search } from 'lucide-react';

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

function TypeBadge({ type }) {
  const m = TYPE_META[type] ?? TYPE_META.guide;
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', background: m.bg, color: m.color }}>
      {m.emoji} {m.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
}

const quickBtn = (color, bg) => ({
  padding: '5px 12px', borderRadius: '20px', border: 'none',
  fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  background: bg, color,
});

export default function CreatorSubmissionsListClient({ initialSubmissions }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [loading, setLoading]         = useState(null);
  const [rejectId, setRejectId]       = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = submissions.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (typeFilter   !== 'all' && s.type   !== typeFilter)   return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = s.creator_profiles?.display_name?.toLowerCase() ?? '';
      return s.title.toLowerCase().includes(q) || name.includes(q) || (s.destination ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  async function changeStatus(id, status, extra = {}) {
    setLoading(id + '_' + status);
    try {
      const res = await fetch(`/api/admin/creator-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const { submission } = await res.json();
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...submission } : s));
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  }

  async function handleReject() {
    if (!rejectReason.trim()) { alert('Bitte einen Ablehnungsgrund angeben.'); return; }
    await changeStatus(rejectId, 'rejected', { rejection_reason: rejectReason });
    setRejectId(null);
    setRejectReason('');
  }

  async function handleDelete(id) {
    if (!confirm('Diesen Inhalt wirklich löschen?')) return;
    setLoading(id + '_del');
    try {
      const res = await fetch(`/api/admin/creator-submissions/${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  }

  const publicUrl = (s) => s.type === 'guide' ? `/reiseguides/${s.slug}` : s.type === 'tip' ? `/reisetipps/${s.slug}` : `/reiserouten/${s.slug}`;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          <input
            type="text" placeholder="Titel, Creator oder Ziel suchen…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', color: '#0F172A', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['all', 'draft', 'submitted', 'published', 'rejected', 'archived'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '7px 12px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: statusFilter === s ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', background: statusFilter === s ? '#0EA5E9' : '#F1F5F9', color: statusFilter === s ? '#FFFFFF' : '#64748B' }}>
              {s === 'all' ? 'Alle' : STATUS_META[s]?.label ?? s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'guide', 'tip', 'route'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: '7px 12px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: typeFilter === t ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', background: typeFilter === t ? '#0F172A' : '#F1F5F9', color: typeFilter === t ? '#FFFFFF' : '#64748B' }}>
              {t === 'all' ? 'Alle Typen' : TYPE_META[t]?.label ?? t}
            </button>
          ))}
        </div>
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Inhalt ablehnen</h3>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 16px' }}>Bitte einen Ablehnungsgrund angeben. Dieser wird dem Creator angezeigt.</p>
            <textarea
              value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="z.B. Inhalt entspricht nicht unseren Richtlinien…"
              rows={4}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', color: '#0F172A', background: '#F8FAFC', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleReject} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#EF4444', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Ablehnen
              </button>
              <button onClick={() => { setRejectId(null); setRejectReason(''); }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '14px' }}>
          {submissions.length === 0 ? 'Noch keine Creator-Inhalte vorhanden.' : 'Keine Inhalte für diesen Filter gefunden.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(s => {
            const isLoading = loading?.startsWith(s.id);
            const creator = s.creator_profiles;
            return (
              <div
                key={s.id}
                id={s.status === 'submitted' ? 'submitted-items' : undefined}
                style={{
                  background: s.status === 'submitted' ? 'linear-gradient(135deg, rgba(14,165,233,0.04) 0%, #FFFFFF 100%)' : '#FFFFFF',
                  border: s.status === 'submitted' ? '1.5px solid rgba(14,165,233,0.35)' : '1.5px solid #E2E8F0',
                  borderRadius: '14px', padding: '14px 18px',
                  display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap',
                  opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.15s',
                  boxShadow: s.status === 'submitted' ? '0 0 0 3px rgba(14,165,233,0.08)' : 'none',
                }}
              >
                {/* Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <TypeBadge type={s.type} />
                    <StatusBadge status={s.status} />
                  </div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{s.title}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: '#94A3B8' }}>
                    {creator?.display_name && (
                      <Link href={`/admin/creator-profiles/${creator.id}`} style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>
                        {creator.display_name}
                      </Link>
                    )}
                    {s.destination && <span>📍 {s.destination}</span>}
                    {s.submitted_at && <span>Eingereicht: {new Date(s.submitted_at).toLocaleDateString('de-DE')}</span>}
                  </div>
                  {s.status === 'rejected' && s.rejection_reason && (
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#EF4444' }}>
                      Grund: {s.rejection_reason}
                    </p>
                  )}
                </div>

                {/* Quick actions */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0, alignItems: 'center' }}>
                  {s.status !== 'published' && s.status !== 'archived' && (
                    <button onClick={() => changeStatus(s.id, 'published')} disabled={!!loading} style={quickBtn('#059669', '#ECFDF5')}>
                      Veröffentlichen
                    </button>
                  )}
                  {s.status === 'submitted' && (
                    <button onClick={() => { setRejectId(s.id); setRejectReason(s.rejection_reason ?? ''); }} disabled={!!loading} style={quickBtn('#EF4444', 'rgba(239,68,68,0.08)')}>
                      Ablehnen
                    </button>
                  )}
                  {s.status === 'published' && (
                    <button onClick={() => changeStatus(s.id, 'draft')} disabled={!!loading} style={quickBtn('#D97706', '#FFFBEB')}>
                      Zurückziehen
                    </button>
                  )}
                  {s.status !== 'archived' && (
                    <button onClick={() => changeStatus(s.id, 'archived')} disabled={!!loading} style={quickBtn('#64748B', '#F1F5F9')}>
                      Archivieren
                    </button>
                  )}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'center' }}>
                  {s.status === 'published' && (
                    <a href={publicUrl(s)} target="_blank" rel="noopener noreferrer" title="Öffentliche Seite" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#0EA5E9', textDecoration: 'none' }}>
                      <ExternalLink size={14} strokeWidth={2} />
                    </a>
                  )}
                  <button onClick={() => handleDelete(s.id)} disabled={!!loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
