'use client';

import { useState } from 'react';

const STATUS_LABELS = {
  pending:      { label: 'Ausstehend',    bg: '#FEF3C7', color: '#92400E' },
  confirmed:    { label: 'Bestätigt',     bg: '#D1FAE5', color: '#065F46' },
  unsubscribed: { label: 'Abgemeldet',   bg: '#F1F5F9', color: '#64748B' },
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

function downloadCsv(subscribers) {
  const header = ['E-Mail', 'Status', 'Quelle', 'Erstellt', 'Bestätigt am', 'Abgemeldet am'];
  const rows = subscribers.map(s => [
    s.email,
    s.status,
    s.source ?? '',
    fmt(s.created_at),
    fmt(s.confirmed_at),
    fmt(s.unsubscribed_at),
  ]);
  const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `newsletter-abonnenten-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function NewsletterAdminClient({ subscribers: initialSubscribers, counts }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? initialSubscribers
    : initialSubscribers.filter(s => s.status === filter);

  const countMap = {
    pending:      counts.pending ?? 0,
    confirmed:    counts.confirmed ?? 0,
    unsubscribed: counts.unsubscribed ?? 0,
    all:          initialSubscribers.length,
  };

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
          Newsletter-Abonnenten
        </h1>
        <button
          onClick={() => downloadCsv(filtered)}
          style={{
            padding: '9px 18px', borderRadius: '10px', border: '1.5px solid #E2E8F0',
            background: '#F8FAFC', color: '#374151', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
          }}
        >
          ↓ CSV exportieren ({filtered.length})
        </button>
      </div>

      {/* Count chips */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { key: 'all',          label: 'Alle' },
          { key: 'confirmed',    label: 'Bestätigt' },
          { key: 'pending',      label: 'Ausstehend' },
          { key: 'unsubscribed', label: 'Abgemeldet' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '6px 14px', borderRadius: '999px', border: 'none', cursor: 'pointer',
              background: filter === key ? '#0EA5E9' : '#F1F5F9',
              color:      filter === key ? '#FFF'    : '#475569',
              fontWeight: 600, fontSize: '13px',
            }}
          >
            {label} <span style={{ opacity: 0.8 }}>({countMap[key]})</span>
          </button>
        ))}
      </div>

      {/* Table */}
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
                  {['E-Mail', 'Status', 'Quelle', 'Registriert', 'Bestätigt am'].map(col => (
                    <th key={col} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{col}</th>
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
                    <td style={{ padding: '11px 14px', color: '#64748B' }}>{s.source ?? '—'}</td>
                    <td style={{ padding: '11px 14px', color: '#64748B' }}>{fmt(s.created_at)}</td>
                    <td style={{ padding: '11px 14px', color: '#64748B' }}>{fmt(s.confirmed_at)}</td>
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
