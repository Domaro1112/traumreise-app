'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarClock, Copy, FilePen, Plus, Send, Trash2, Users } from 'lucide-react';
import { STATUS_LABELS } from '@/lib/newsletter/blocks';

const fmtDate = (s) => s ? new Date(s).toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' Uhr' : '';

function Chip({ status }) {
  const s = STATUS_LABELS[status] ?? { label: status, bg: '#F1F5F9', color: '#475569' };
  return <span style={{ padding: '3px 10px', borderRadius: '999px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.label}</span>;
}

const btn = (primary) => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: primary ? '10px 16px' : '7px 11px',
  borderRadius: '10px', border: primary ? 'none' : '1.5px solid #E2E8F0', cursor: 'pointer',
  background: primary ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#FFFFFF',
  color: primary ? '#FFFFFF' : '#334155', fontSize: primary ? '14px' : '12.5px', fontWeight: 700, fontFamily: 'inherit', textDecoration: 'none',
});

function Row({ c, onDuplicate, onDelete, busy }) {
  const when = c.status === 'scheduled' ? `Geht raus: ${fmtDate(c.scheduled_at)}`
    : c.status === 'sent' ? `Versendet: ${fmtDate(c.sent_at)}`
    : c.status === 'sending' ? 'Versand läuft …'
    : c.status === 'failed' ? `Fehler: ${c.last_error ?? 'unbekannt'}`
    : `Zuletzt bearbeitet: ${fmtDate(c.updated_at)}`;
  const deletable = ['draft', 'scheduled', 'failed'].includes(c.status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 280px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <Link href={`/admin/newsletter/kampagnen/${c.id}`} style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>{c.title || 'Ohne Namen'}</Link>
          <Chip status={c.status} />
        </div>
        <div style={{ fontSize: '13px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {c.subject ? `Betreff: ${c.subject}` : <em>Noch kein Betreff</em>}
        </div>
        <div style={{ fontSize: '12px', color: c.status === 'failed' ? '#B91C1C' : '#94A3B8', marginTop: '2px' }}>
          {when}{(c.stats?.sent > 0 || c.stats?.failed > 0) && ` · ${c.stats.sent} versendet${c.stats.failed ? `, ${c.stats.failed} fehlgeschlagen` : ''}`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <Link href={`/admin/newsletter/kampagnen/${c.id}`} style={btn(false)}><FilePen size={13} /> {['sent', 'sending'].includes(c.status) ? 'Ansehen' : 'Bearbeiten'}</Link>
        <button type="button" disabled={busy} onClick={() => onDuplicate(c)} style={btn(false)} title="Als neuen Entwurf kopieren"><Copy size={13} /> Kopieren</button>
        {deletable && <button type="button" disabled={busy} onClick={() => onDelete(c)} style={{ ...btn(false), color: '#B91C1C' }} title="Löschen"><Trash2 size={13} /></button>}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, items, empty, ...rest }) {
  return (
    <section style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', marginBottom: '18px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 18px', background: '#F8FAFC' }}>
        <Icon size={16} color="#0EA5E9" />
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{title}</h3>
        <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>{items.length}</span>
      </div>
      {items.length ? items.map(c => <Row key={c.id} c={c} {...rest} />) : <p style={{ margin: 0, padding: '14px 18px', fontSize: '13px', color: '#94A3B8', borderTop: '1px solid #F1F5F9' }}>{empty}</p>}
    </section>
  );
}

export default function CampaignListClient({ initialCampaigns, recipients, disabled }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function call(url, init) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Aktion fehlgeschlagen.');
    return data;
  }

  async function create() {
    setBusy(true); setErr('');
    try {
      const { campaign } = await call('/api/admin/newsletter/campaigns', { method: 'POST', body: JSON.stringify({}) });
      router.push(`/admin/newsletter/kampagnen/${campaign.id}`);
    } catch (e) { setErr(e.message); setBusy(false); }
  }

  async function duplicate(c) {
    setBusy(true); setErr('');
    try {
      const { campaign } = await call(`/api/admin/newsletter/campaigns/${c.id}/action`, { method: 'POST', body: JSON.stringify({ action: 'duplicate' }) });
      router.push(`/admin/newsletter/kampagnen/${campaign.id}`);
    } catch (e) { setErr(e.message); setBusy(false); }
  }

  async function remove(c) {
    if (!window.confirm(`„${c.title || 'Ohne Namen'}“ wirklich löschen? Das lässt sich nicht rückgängig machen.`)) return;
    setBusy(true); setErr('');
    try {
      await call(`/api/admin/newsletter/campaigns/${c.id}`, { method: 'DELETE' });
      setCampaigns(cs => cs.filter(x => x.id !== c.id));
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  const scheduled = campaigns.filter(c => c.status === 'scheduled' || c.status === 'sending')
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  const drafts = campaigns.filter(c => c.status === 'draft');
  const done = campaigns.filter(c => c.status === 'sent' || c.status === 'failed')
    .sort((a, b) => new Date(b.sent_at || b.updated_at) - new Date(a.sent_at || a.updated_at));
  const rest = { onDuplicate: duplicate, onDelete: remove, busy };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button type="button" onClick={create} disabled={busy || disabled} style={btn(true)}><Plus size={16} /> Neuer Newsletter</button>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', background: '#F1F5F9', padding: '7px 12px', borderRadius: '999px', fontWeight: 600 }}>
          <Users size={14} /> {recipients} bestätigte Abonnent{recipients === 1 ? '' : 'en'}
        </span>
      </div>
      {err && <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#B91C1C' }}>{err}</p>}
      <Section title="Geplant" icon={CalendarClock} items={scheduled} empty="Kein Newsletter geplant." {...rest} />
      <Section title="Entwürfe" icon={FilePen} items={drafts} empty="Keine Entwürfe." {...rest} />
      <Section title="Versendet" icon={Send} items={done} empty="Noch nichts versendet." {...rest} />
    </div>
  );
}
