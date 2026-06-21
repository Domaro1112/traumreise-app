'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Edit2, Trash2, Plus, Search } from 'lucide-react';

const STATUS_META = {
  draft:     { label: 'Entwurf',        color: '#D97706', bg: 'rgba(245,158,11,0.10)'  },
  submitted: { label: 'Eingereicht',    color: '#0EA5E9', bg: 'rgba(14,165,233,0.10)'  },
  published: { label: 'Veröffentlicht', color: '#059669', bg: 'rgba(5,150,105,0.10)'   },
  archived:  { label: 'Archiviert',     color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span style={{
      fontSize: '11px', fontWeight: 700,
      padding: '2px 10px', borderRadius: '20px',
      background: m.bg, color: m.color,
    }}>
      {m.label}
    </span>
  );
}

export default function CreatorProfilesListClient({ initialProfiles }) {
  const [profiles, setProfiles]       = useState(initialProfiles);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading]         = useState(null);

  const filtered = profiles.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.display_name.toLowerCase().includes(q) || p.slug.includes(q);
    }
    return true;
  });

  const handleDelete = async (id) => {
    if (!confirm('Profil wirklich löschen? Dies kann nicht rückgängig gemacht werden.')) return;
    setLoading(id + '_del');
    try {
      const res = await fetch(`/api/creator-profiles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Fehler beim Löschen.');
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(id + '_status');
    try {
      const res = await fetch(`/api/creator-profiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Fehler beim Aktualisieren.');
      const { profile } = await res.json();
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...profile } : p));
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {/* Suche */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Name oder Slug suchen…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              borderRadius: '10px', border: '1.5px solid #E2E8F0',
              fontSize: '14px', color: '#0F172A', background: '#FFFFFF',
              outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Status-Filter */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['all', 'draft', 'submitted', 'published', 'archived'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 14px', borderRadius: '10px', border: 'none',
                fontSize: '13px', fontWeight: statusFilter === s ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                background: statusFilter === s ? '#0EA5E9' : '#F1F5F9',
                color: statusFilter === s ? '#FFFFFF' : '#64748B',
              }}
            >
              {s === 'all' ? 'Alle' : STATUS_META[s]?.label ?? s}
            </button>
          ))}
        </div>

        {/* Neu-Button */}
        <Link
          href="/admin/creator-profiles/neu"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            color: '#FFFFFF', fontSize: '14px', fontWeight: 700,
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Neues Profil
        </Link>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          background: '#F8FAFC', borderRadius: '16px',
          border: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '14px',
        }}>
          {profiles.length === 0
            ? 'Noch keine Creator-Profile vorhanden. Erstelle das erste Profil oder verwende „Creator-Profil erstellen" in einer angenommenen Bewerbung.'
            : 'Keine Profile für diesen Filter gefunden.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(p => {
            const isLoading = loading?.startsWith(p.id);
            return (
              <div
                key={p.id}
                id={p.status === 'submitted' ? 'submitted-profiles' : undefined}
                style={{
                  background: p.status === 'submitted' ? 'linear-gradient(135deg, rgba(14,165,233,0.04) 0%, #FFFFFF 100%)' : '#FFFFFF',
                  border: p.status === 'submitted' ? '1.5px solid rgba(14,165,233,0.35)' : '1.5px solid #E2E8F0',
                  borderRadius: '14px', padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
                  opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.15s',
                  boxShadow: p.status === 'submitted' ? '0 0 0 3px rgba(14,165,233,0.08)' : 'none',
                }}
              >
                {/* Info */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{p.display_name}</span>
                    <StatusBadge status={p.status} />
                    {p.creator_type && (
                      <span style={{ fontSize: '11px', color: '#94A3B8', padding: '1px 8px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        {p.creator_type}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    /{p.slug}
                    {p.short_bio && (
                      <span style={{ fontFamily: 'inherit', marginLeft: '8px' }}>
                        · {p.short_bio.slice(0, 60)}{p.short_bio.length > 60 ? '…' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick-Status */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                  {p.status !== 'published' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'published')}
                      disabled={!!loading}
                      style={quickBtn('#059669', '#ECFDF5')}
                    >
                      Veröffentlichen
                    </button>
                  )}
                  {p.status === 'published' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'draft')}
                      disabled={!!loading}
                      style={quickBtn('#D97706', '#FFFBEB')}
                    >
                      Entwurf
                    </button>
                  )}
                  {p.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'archived')}
                      disabled={!!loading}
                      style={quickBtn('#64748B', '#F1F5F9')}
                    >
                      Archivieren
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {p.status === 'published' && (
                    <a
                      href={`/creator/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={iconBtn('#0EA5E9', '#EFF6FF')}
                      title="Öffentliche Seite anzeigen"
                    >
                      <ExternalLink size={14} strokeWidth={2} />
                    </a>
                  )}
                  <Link
                    href={`/admin/creator-profiles/${p.id}`}
                    style={iconBtn('#0F172A', '#F1F5F9')}
                    title="Bearbeiten"
                  >
                    <Edit2 size={14} strokeWidth={2} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={!!loading}
                    style={iconBtn('#EF4444', 'rgba(239,68,68,0.08)')}
                    title="Löschen"
                  >
                    <Trash2 size={14} strokeWidth={2} />
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

const quickBtn = (color, bg) => ({
  padding: '5px 12px', borderRadius: '20px', border: 'none',
  fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  background: bg, color,
});

const iconBtn = (color, bg) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '32px', height: '32px', borderRadius: '8px',
  border: 'none', cursor: 'pointer', background: bg, color,
  textDecoration: 'none', flexShrink: 0,
});
