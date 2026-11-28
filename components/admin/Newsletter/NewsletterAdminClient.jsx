'use client';

import { useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';

const STATUS_LABELS = {
  pending:      { label: 'Ausstehend',    bg: '#FEF3C7', color: '#92400E' },
  confirmed:    { label: 'Bestätigt',     bg: '#D1FAE5', color: '#065F46' },
  unsubscribed: { label: 'Abgemeldet',    bg: '#F1F5F9', color: '#64748B' },
};

// Wo sich jemand angemeldet hat – lesbar statt technischer Kennung
const SOURCE_LABELS = {
  landing_page:   'Startseite / Blog',
  travel_funnel:  'Reisefinder',
  single_parent:  'Planer Alleinerziehende',
};

function StatusChip({ status }) {
  const s = STATUS_LABELS[status] ?? { label: status, bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '999px',
      background: s.bg, color: s.color,
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const sourceLabel = (s) => (s ? SOURCE_LABELS[s] ?? s : '—');

function downloadCsv(subscribers) {
  const header = ['E-Mail', 'Status', 'Quelle', 'Erstellt', 'Bestätigt am', 'Abgemeldet am'];
  const rows = subscribers.map(s => [
    s.email,
    STATUS_LABELS[s.status]?.label ?? s.status,
    sourceLabel(s.source),
    fmt(s.created_at),
    fmt(s.confirmed_at),
    fmt(s.unsubscribed_at),
  ]);
  const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `newsletter-abonnenten-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function NewsletterAdminClient({ subscribers: initialSubscribers }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [filter, setFilter] = useState('all');
  const [query, setQuery]   = useState('');
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState({ text: '', error: false });

  const countMap = useMemo(() => ({
    all:          subscribers.length,
    confirmed:    subscribers.filter(s => s.status === 'confirmed').length,
    pending:      subscribers.filter(s => s.status === 'pending').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
  }), [subscribers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscribers.filter(s =>
      (filter === 'all' || s.status === filter) &&
      (!q || s.email.toLowerCase().includes(q)));
  }, [subscribers, filter, query]);

  async function remove(s) {
    const ok = window.confirm(
      `${s.email} endgültig löschen?\n\nDer Eintrag wird komplett entfernt, auch der Nachweis der Einwilligung. ` +
      'Das lässt sich nicht rückgängig machen.\n\nNur abmelden reicht meist – endgültig löschen ist für Löschanfragen gedacht.',
    );
    if (!ok) return;
    setBusyId(s.id); setMessage({ text: '', error: false });
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${s.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Löschen fehlgeschlagen.');
      setSubscribers(list => list.filter(x => x.id !== s.id));
      setMessage({ text: `${s.email} wurde gelöscht.`, error: false });
    } catch (err) {
      setMessage({ text: err.message, error: true });
    }
    setBusyId(null);
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Filter, Suche, Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[
          { key: 'all',          label: 'Alle' },
          { key: 'confirmed',    label: 'Bestätigt' },
          { key: 'pending',      label: 'Ausstehend' },
          { key: 'unsubscribed', label: 'Abgemeldet' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            style={{
              padding: '6px 14px', borderRadius: '999px', border: 'none', cursor: 'pointer',
              background: filter === key ? '#0EA5E9' : '#F1F5F9',
              color:      filter === key ? '#FFF'    : '#475569',
              fontWeight: 600, fontSize: '13px', fontFamily: 'inherit',
            }}
          >
            {label} <span style={{ opacity: 0.8 }}>({countMap[key]})</span>
          </button>
        ))}

        <span style={{ flex: 1 }} />

        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '11px', pointerEvents: 'none' }} />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="E-Mail suchen …"
            aria-label="E-Mail suchen"
            style={{ padding: '8px 12px 8px 32px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', fontFamily: 'inherit', width: '220px' }}
          />
        </label>
        <button
          type="button"
          onClick={() => downloadCsv(filtered)}
          style={{
            padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0',
            background: '#F8FAFC', color: '#374151', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'inherit',
          }}
        >
          ↓ CSV exportieren ({filtered.length})
        </button>
      </div>

      {message.text && (
        <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: message.error ? '#B91C1C' : '#15803D' }}>{message.text}</p>
      )}

      {/* Tabelle */}
      {filtered.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '15px', background: '#F8FAFC', borderRadius: '16px', border: '1.5px dashed #E2E8F0' }}>
          Keine Einträge gefunden.
        </div>
      ) : (
        <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', background: '#FFF' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                  {['E-Mail', 'Status', 'Quelle', 'Registriert', 'Bestätigt am', ''].map((col, i) => (
                    <th key={i} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none',
                    background:   i % 2 === 0 ? '#FFF' : '#FAFBFF',
                  }}>
                    <td style={{ padding: '11px 14px', color: '#0F172A', fontWeight: 500 }}>{s.email}</td>
                    <td style={{ padding: '11px 14px' }}><StatusChip status={s.status} /></td>
                    <td style={{ padding: '11px 14px', color: '#64748B' }}>{sourceLabel(s.source)}</td>
                    <td style={{ padding: '11px 14px', color: '#64748B' }}>{fmt(s.created_at)}</td>
                    <td style={{ padding: '11px 14px', color: '#64748B' }}>{fmt(s.confirmed_at)}</td>
                    <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => remove(s)}
                        disabled={busyId === s.id}
                        title="Endgültig löschen"
                        aria-label={`${s.email} löschen`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '8px',
                          border: '1.5px solid #FECACA', background: '#FFF', color: '#B91C1C', fontSize: '12px', fontWeight: 600,
                          cursor: busyId === s.id ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: busyId === s.id ? 0.6 : 1,
                        }}
                      >
                        <Trash2 size={13} /> {busyId === s.id ? 'Löscht …' : 'Löschen'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
