'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowDown, ArrowLeft, ArrowUp, CalendarClock, Copy, Eye, Monitor, Plus, Power, Save, Send,
  Smartphone, Sparkles, Trash2, X,
} from 'lucide-react';
import ImageUploader from '@/components/admin/media/ImageUploader';
import { BLOCK_TYPES, BLOCK_LABELS, STATUS_LABELS, MONTH_NAMES, MONTH_SEASON, createBlock } from '@/lib/newsletter/blocks';

// ─────────────────────────────────────────────────────────────────────────────
// Editor für Newsletter-Kampagnen und die Willkommensmail.
// Links Bausteine, rechts Live-Vorschau. Unten Speichern, Testmail, Planen,
// Senden.
// ─────────────────────────────────────────────────────────────────────────────

const withIds = (blocks) => (Array.isArray(blocks) ? blocks : []).map(b => ({ ...b, _id: b._id || Math.random().toString(36).slice(2, 10) }));
const strip = (blocks) => blocks.map(({ _id, ...b }) => b);
const fmtDate = (s) => s ? new Date(s).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' Uhr' : '';

// datetime-local braucht Ortszeit im Format JJJJ-MM-TTTHH:MM
function toLocalInput(date) {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function defaultScheduleValue() {
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0);
  return toLocalInput(d);
}

const S = {
  card: { background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '18px 20px', marginBottom: '16px' },
  h3: { margin: '0 0 14px', fontSize: '15px', fontWeight: 800, color: '#0F172A' },
  label: { display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', margin: '0 0 5px' },
  hint: { fontSize: '11.5px', color: '#94A3B8', margin: '4px 0 0', lineHeight: 1.5 },
  input: { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', color: '#0F172A', background: '#FFFFFF', boxSizing: 'border-box' },
  field: { marginBottom: '12px' },
};
const btn = (kind = 'ghost', extra = {}) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px',
  fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
  border: kind === 'ghost' ? '1.5px solid #E2E8F0' : 'none',
  background: kind === 'primary' ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : kind === 'danger' ? '#FEE2E2' : kind === 'dark' ? '#0F172A' : '#FFFFFF',
  color: kind === 'primary' || kind === 'dark' ? '#FFFFFF' : kind === 'danger' ? '#B91C1C' : '#334155',
  ...extra,
});

function Field({ label, hint, children }) {
  return <div style={S.field}>{label && <label style={S.label}>{label}</label>}{children}{hint && <p style={S.hint}>{hint}</p>}</div>;
}
function Text({ value, onChange, ...p }) {
  return <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} style={S.input} {...p} />;
}
function Area({ value, onChange, rows = 4, ...p }) {
  return <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows} style={{ ...S.input, resize: 'vertical', lineHeight: 1.55 }} {...p} />;
}

// ── Auswahl mehrerer Ziele/Artikel ───────────────────────────────────────────
function MultiPick({ options, value, max, onChange, placeholder }) {
  const chosen = value.map(v => options.find(o => o.value === v) ?? { value: v, label: `${v} (nicht gefunden)` });
  const free = options.filter(o => !value.includes(o.value));
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: chosen.length ? '8px' : 0 }}>
        {chosen.map((o, i) => (
          <span key={o.value} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 6px 4px 10px', borderRadius: '999px', background: '#E0F2FE', color: '#0369A1', fontSize: '12.5px', fontWeight: 600 }}>
            {i + 1}. {o.label}
            <button type="button" onClick={() => onChange(value.filter(v => v !== o.value))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#0369A1', padding: '0 2px', display: 'flex' }} aria-label="Entfernen"><X size={13} /></button>
          </span>
        ))}
      </div>
      {value.length < max && (
        <select value="" onChange={e => e.target.value && onChange([...value, e.target.value])} style={S.input}>
          <option value="">{placeholder}</option>
          {free.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
    </div>
  );
}

// ── Ein Baustein ─────────────────────────────────────────────────────────────
function BlockEditor({ block, index, total, content, readOnly, onChange, onMove, onRemove }) {
  const set = (k, v) => onChange({ ...block, [k]: v });
  const destOptions = content.destinations.map(d => ({ value: d.slug, label: `${d.name}${d.country ? ` (${d.country})` : ''}` }));
  const artOptions = content.articles.map(a => ({ value: a.slug, label: a.title }));
  const [month, setMonth] = useState(() => (new Date().getMonth() + 1) % 12);

  function suggestForMonth() {
    const season = MONTH_SEASON[month];
    const picks = content.destinations.filter(d => d.idealSeasons?.includes(season));
    // Zufällig mischen, damit nicht jeden Monat dieselben Ziele kommen
    const shuffled = [...picks].sort(() => Math.random() - 0.5).slice(0, 4).map(d => d.slug);
    onChange({ ...block, heading: `Wohin im ${MONTH_NAMES[month]}?`, slugs: shuffled });
  }

  let body = null;
  switch (block.type) {
    case 'text':
      body = <>
        <Field label="Überschrift (optional)"><Text value={block.heading} onChange={v => set('heading', v)} /></Field>
        <Field label="Text" hint="Leerzeile = neuer Absatz · **fett** · [Linktext](https://apearound.de/…)"><Area rows={6} value={block.body} onChange={v => set('body', v)} /></Field>
      </>;
      break;
    case 'destination':
      body = <>
        <Field label="Reiseziel">
          <select value={block.slug} onChange={e => set('slug', e.target.value)} style={S.input}>
            <option value="">– Reiseziel wählen –</option>
            {destOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Kleine Überschrift darüber"><Text value={block.heading} onChange={v => set('heading', v)} /></Field>
        <Field label="Eigener Text (optional)" hint="Leer lassen = Kurzbeschreibung des Reiseziels wird genommen."><Area value={block.text} onChange={v => set('text', v)} /></Field>
      </>;
      break;
    case 'destinations':
      body = <>
        <Field label="Überschrift"><Text value={block.heading} onChange={v => set('heading', v)} placeholder="z. B. Wohin im März?" /></Field>
        <Field label="Reiseziele (2–4)"><MultiPick options={destOptions} value={block.slugs ?? []} max={4} onChange={v => set('slugs', v)} placeholder="+ Reiseziel hinzufügen" /></Field>
        {!readOnly && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ ...S.input, width: 'auto' }}>
              {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <button type="button" onClick={suggestForMonth} style={btn('ghost')}><Sparkles size={14} /> Passende Ziele vorschlagen</button>
          </div>
        )}
      </>;
      break;
    case 'articles':
      body = <>
        <Field label="Überschrift"><Text value={block.heading} onChange={v => set('heading', v)} /></Field>
        <Field label="Artikel (1–3)"><MultiPick options={artOptions} value={block.slugs ?? []} max={3} onChange={v => set('slugs', v)} placeholder="+ Artikel hinzufügen" /></Field>
        {!readOnly && <button type="button" onClick={() => set('slugs', content.articles.slice(0, 3).map(a => a.slug))} style={btn('ghost')}><Sparkles size={14} /> Die 3 neuesten nehmen</button>}
      </>;
      break;
    case 'tip':
      body = <>
        <Field label="Überschrift"><Text value={block.heading} onChange={v => set('heading', v)} /></Field>
        <Field label="Text" hint="**fett** und [Links](https://…) gehen auch hier."><Area value={block.body} onChange={v => set('body', v)} /></Field>
      </>;
      break;
    case 'image':
      body = <>
        <Field label="Bild">
          <ImageUploader value={block.url} alt={block.alt} slug={`newsletter-${block._id}`} type="cover" context="blog" label="Bild"
            onChange={(url, alt) => onChange({ ...block, url, alt: alt ?? block.alt })} onDelete={() => set('url', '')} />
        </Field>
        <Field label="Oder Bild-Adresse"><Text value={block.url} onChange={v => set('url', v)} placeholder="https://…" /></Field>
        <Field label="Beschreibung (Alt-Text)"><Text value={block.alt} onChange={v => set('alt', v)} /></Field>
        <Field label="Link beim Klick (optional)"><Text value={block.link} onChange={v => set('link', v)} placeholder="/reiseziele/… oder https://…" /></Field>
      </>;
      break;
    case 'button':
      body = <>
        <Field label="Beschriftung"><Text value={block.label} onChange={v => set('label', v)} /></Field>
        <Field label="Link" hint="Eigene Seiten mit / anfangen, z. B. /finder oder /reiseblog"><Text value={block.url} onChange={v => set('url', v)} /></Field>
      </>;
      break;
    case 'offer':
      body = <>
        <p style={{ ...S.hint, margin: '0 0 12px', color: '#92400E', background: '#FFFBEB', padding: '8px 10px', borderRadius: '8px' }}>Dieser Kasten wird in der Mail automatisch als „Anzeige“ gekennzeichnet.</p>
        <Field label="Überschrift"><Text value={block.heading} onChange={v => set('heading', v)} /></Field>
        <Field label="Text"><Area value={block.body} onChange={v => set('body', v)} /></Field>
        <Field label="Button-Beschriftung"><Text value={block.label} onChange={v => set('label', v)} /></Field>
        <Field label="Link (z. B. dein Affiliate-Link)"><Text value={block.url} onChange={v => set('url', v)} placeholder="https://…" /></Field>
        <Field label="Bild (optional)">
          <ImageUploader value={block.image} alt="" slug={`newsletter-${block._id}`} type="cover" context="blog" label="Bild"
            onChange={(url) => set('image', url)} onDelete={() => set('image', '')} />
        </Field>
      </>;
      break;
    default:
      body = <p style={S.hint}>Unbekannter Baustein.</p>;
  }

  return (
    <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '14px', marginBottom: '12px', background: '#FFFFFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRadius: '14px 14px 0 0' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8' }}>{index + 1}</span>
        <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>{BLOCK_LABELS[block.type] ?? block.type}</span>
        {!readOnly && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            <button type="button" onClick={() => onMove(-1)} disabled={index === 0} style={btn('ghost', { padding: '5px 7px', opacity: index === 0 ? 0.4 : 1 })} aria-label="Nach oben"><ArrowUp size={13} /></button>
            <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} style={btn('ghost', { padding: '5px 7px', opacity: index === total - 1 ? 0.4 : 1 })} aria-label="Nach unten"><ArrowDown size={13} /></button>
            <button type="button" onClick={onRemove} style={btn('ghost', { padding: '5px 7px', color: '#B91C1C' })} aria-label="Entfernen"><Trash2 size={13} /></button>
          </div>
        )}
      </div>
      <fieldset disabled={readOnly} style={{ border: 'none', margin: 0, padding: '14px 14px 4px' }}>{body}</fieldset>
    </div>
  );
}

// ── Vorlage für einen Monats-Newsletter ──────────────────────────────────────
function monthlyTemplate(content) {
  const now = new Date();
  const m = (now.getMonth() + 1) % 12;
  const season = MONTH_SEASON[m];
  const seasonal = content.destinations.filter(d => d.idealSeasons?.includes(season));
  const top = seasonal[0] ?? content.destinations[0];
  const more = seasonal.filter(d => d.slug !== top?.slug).slice(0, 4).map(d => d.slug);
  return withIds([
    { type: 'text', heading: `Hallo und willkommen im ${MONTH_NAMES[m]}!`, body: 'Ein, zwei persönliche Sätze zum Einstieg: Was steht an, worauf freust du dich, was erwartet die Leser in dieser Ausgabe?' },
    { type: 'destination', slug: top?.slug ?? '', heading: 'Reiseziel des Monats', text: '' },
    { type: 'destinations', heading: `Wohin im ${MONTH_NAMES[m]}?`, slugs: more },
    { type: 'articles', heading: 'Neu im Reiseblog', slugs: content.articles.slice(0, 3).map(a => a.slug) },
    { type: 'tip', heading: 'Tipp des Monats', body: 'Ein kurzer, praktischer Tipp – zum Sparen, Packen oder Planen.' },
    { type: 'button', label: 'Reisefinder starten', url: '/finder' },
  ]);
}

// ── Editor ───────────────────────────────────────────────────────────────────
export default function CampaignEditorClient({ initial, recipients, adminEmail }) {
  const router = useRouter();
  const isWelcome = initial.kind === 'welcome';
  const [c, setC] = useState(initial);
  const [title, setTitle] = useState(initial.title ?? '');
  const [subject, setSubject] = useState(initial.subject ?? '');
  const [preheader, setPreheader] = useState(initial.preheader ?? '');
  const [blocks, setBlocks] = useState(() => withIds(initial.blocks));
  const [saved, setSaved] = useState(() => JSON.stringify({ t: initial.title ?? '', s: initial.subject ?? '', p: initial.preheader ?? '', b: initial.blocks ?? [] }));
  const [content, setContent] = useState({ destinations: [], articles: [], loaded: false });
  const [previewHtml, setPreviewHtml] = useState('');
  const [device, setDevice] = useState('desktop');
  const [testTo, setTestTo] = useState(adminEmail || '');
  const [when, setWhen] = useState(() => (initial.scheduled_at ? toLocalInput(initial.scheduled_at) : defaultScheduleValue()));
  const [state, setState] = useState({ busy: '', msg: '', err: '' });
  const [confirmSend, setConfirmSend] = useState(false);
  const [adding, setAdding] = useState(false);

  const readOnly = ['sending', 'sent'].includes(c.status);
  const current = useMemo(() => JSON.stringify({ t: title, s: subject, p: preheader, b: strip(blocks) }), [title, subject, preheader, blocks]);
  const dirty = !readOnly && current !== saved;

  // Inhalte für die Auswahl laden
  useEffect(() => {
    fetch('/api/admin/newsletter/content').then(r => r.json()).then(d => {
      setContent({ destinations: d.destinations ?? [], articles: d.articles ?? [], loaded: true });
    }).catch(() => setContent(x => ({ ...x, loaded: true })));
  }, []);

  // Live-Vorschau (kurz verzögert, damit nicht jeder Tastendruck rendert)
  useEffect(() => {
    const t = setTimeout(() => {
      fetch('/api/admin/newsletter/preview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, preheader, blocks: strip(blocks) }),
      }).then(r => r.json()).then(d => d.html && setPreviewHtml(d.html)).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [title, subject, preheader, blocks]);

  // Warnung beim Verlassen mit ungespeicherten Änderungen
  useEffect(() => {
    const h = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  // Während des Versands regelmäßig den Stand holen
  useEffect(() => {
    if (c.status !== 'sending') return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/admin/newsletter/campaigns/${c.id}`).then(x => x.json()).catch(() => null);
      if (r?.campaign) setC(r.campaign);
    }, 4000);
    return () => clearInterval(t);
  }, [c.status, c.id]);

  async function api(url, init) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Aktion fehlgeschlagen.');
    return data;
  }

  const save = useCallback(async (silent = false) => {
    const payload = { title, subject, preheader, blocks: strip(blocks) };
    const { campaign } = await api(`/api/admin/newsletter/campaigns/${c.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    setC(x => ({ ...x, ...campaign }));
    setSaved(JSON.stringify({ t: campaign.title ?? '', s: campaign.subject ?? '', p: campaign.preheader ?? '', b: campaign.blocks ?? [] }));
    if (!silent) setState({ busy: '', msg: 'Gespeichert.', err: '' });
    return campaign;
  }, [title, subject, preheader, blocks, c.id]);

  async function run(label, fn) {
    setState({ busy: label, msg: '', err: '' });
    try { await fn(); } catch (e) { setState({ busy: '', msg: '', err: e.message }); return; }
    setState(s => (s.busy ? { ...s, busy: '' } : s));
  }

  const doSave = () => run('save', () => save());
  const doTest = () => run('test', async () => {
    await api('/api/admin/newsletter/test', { method: 'POST', body: JSON.stringify({ email: testTo, title, subject, preheader, blocks: strip(blocks) }) });
    setState({ busy: '', msg: `Testmail an ${testTo} verschickt.`, err: '' });
  });
  const action = (name, extra = {}) => api(`/api/admin/newsletter/campaigns/${c.id}/action`, { method: 'POST', body: JSON.stringify({ action: name, ...extra }) });
  const doSchedule = () => run('schedule', async () => {
    if (dirty) await save(true);
    const { campaign } = await action('schedule', { scheduled_at: new Date(when).toISOString() });
    setC(x => ({ ...x, ...campaign }));
    setState({ busy: '', msg: `Geplant für ${fmtDate(campaign.scheduled_at)}.`, err: '' });
  });
  const doUnschedule = () => run('unschedule', async () => {
    const { campaign } = await action('unschedule');
    setC(x => ({ ...x, ...campaign }));
    setState({ busy: '', msg: 'Planung aufgehoben – der Newsletter ist wieder ein Entwurf.', err: '' });
  });
  const doSendNow = () => run('send', async () => {
    setConfirmSend(false);
    if (dirty) await save(true);
    const { campaign } = await action('send_now');
    setC(x => ({ ...x, ...campaign }));
    setState({ busy: '', msg: 'Der Versand läuft. Du kannst die Seite offen lassen oder schließen.', err: '' });
  });
  const doRetry = () => run('retry', async () => {
    const { campaign } = await action('retry');
    setC(x => ({ ...x, ...campaign }));
    setState({ busy: '', msg: 'Versand wird fortgesetzt.', err: '' });
  });
  const doDuplicate = () => run('dup', async () => {
    const { campaign } = await action('duplicate');
    router.push(`/admin/newsletter/kampagnen/${campaign.id}`);
  });
  const doToggleWelcome = () => run('welcome', async () => {
    if (dirty) await save(true);
    const { campaign } = await action(c.status === 'active' ? 'deactivate' : 'activate');
    setC(x => ({ ...x, ...campaign }));
    setState({ busy: '', msg: campaign.status === 'active' ? 'Willkommensmail ist eingeschaltet.' : 'Willkommensmail ist ausgeschaltet.', err: '' });
  });

  const updateBlock = (i, b) => setBlocks(bs => bs.map((x, j) => (j === i ? b : x)));
  const moveBlock = (i, d) => setBlocks(bs => { const n = [...bs]; const [x] = n.splice(i, 1); n.splice(i + d, 0, x); return n; });
  const removeBlock = (i) => setBlocks(bs => bs.filter((_, j) => j !== i));
  const addBlock = (type) => { setBlocks(bs => [...bs, createBlock(type)]); setAdding(false); };

  const status = STATUS_LABELS[c.status] ?? { label: c.status, bg: '#F1F5F9', color: '#475569' };
  const busy = !!state.busy;

  return (
    <div>
      <style>{`
        .nl-editor-grid { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }
        @media (min-width: 1280px) {
          .nl-editor-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .nl-preview-col { position: sticky; top: 16px; }
        }
        .nl-actionbar { position: sticky; bottom: 0; z-index: 20; background: rgba(255,255,255,0.97); border: 1.5px solid #E2E8F0;
          border-radius: 16px; padding: 12px 16px; margin-top: 8px; box-shadow: 0 -6px 24px rgba(15,23,42,0.08); }
      `}</style>
      {/* Kopf */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {!isWelcome && <Link href="/admin/newsletter/kampagnen" style={btn('ghost', { textDecoration: 'none' })}><ArrowLeft size={14} /> Alle Kampagnen</Link>}
        <span style={{ padding: '4px 12px', borderRadius: '999px', background: status.bg, color: status.color, fontSize: '12px', fontWeight: 700 }}>{status.label}</span>
        {c.status === 'scheduled' && <span style={{ fontSize: '13px', color: '#0369A1', fontWeight: 600 }}>Geht raus: {fmtDate(c.scheduled_at)}</span>}
        {(c.status === 'sending' || c.status === 'sent' || c.status === 'failed') && (
          <span style={{ fontSize: '13px', color: '#475569' }}>
            {c.stats?.sent ?? 0} versendet{c.stats?.failed ? `, ${c.stats.failed} fehlgeschlagen` : ''}
            {c.status === 'sent' && c.sent_at && ` · fertig am ${fmtDate(c.sent_at)}`}
          </span>
        )}
        {dirty && <span style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>● Ungespeicherte Änderungen</span>}
      </div>

      {c.status === 'failed' && (
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#991B1B', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span><strong>Der Versand wurde angehalten:</strong> {c.last_error || 'unbekannter Fehler'}</span>
          <button type="button" onClick={doRetry} disabled={busy} style={btn('danger')}>Fehler behoben – weiter versenden</button>
        </div>
      )}
      {readOnly && (
        <div style={{ background: '#F0F9FF', border: '1.5px solid #BAE6FD', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#0369A1', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>{c.status === 'sending' ? 'Dieser Newsletter wird gerade versendet und kann nicht mehr geändert werden.' : 'Dieser Newsletter ist versendet und kann nicht mehr geändert werden.'}</span>
          <button type="button" onClick={doDuplicate} disabled={busy} style={btn('ghost')}><Copy size={13} /> Als neuen Entwurf kopieren</button>
        </div>
      )}

      <div className="nl-editor-grid">
        {/* ── Links: Inhalt ── */}
        <div>
          <section style={S.card}>
            <h3 style={S.h3}>Allgemein</h3>
            <fieldset disabled={readOnly} style={{ border: 'none', margin: 0, padding: 0 }}>
              {!isWelcome && <Field label="Interner Name" hint="Nur für dich, z. B. „März 2027“."><Text value={title} onChange={setTitle} /></Field>}
              <Field label="Betreff" hint={`${subject.length} Zeichen · ideal sind 30–50, damit er auf dem Handy nicht abgeschnitten wird.`}>
                <Text value={subject} onChange={setSubject} placeholder="z. B. Wohin im März? 5 Ziele für den Frühling 🌸" />
              </Field>
              <Field label="Vorschauzeile" hint="Grauer Text, den man im Postfach neben dem Betreff sieht.">
                <Text value={preheader} onChange={setPreheader} placeholder="z. B. Plus: unser Tipp für günstige Flüge" />
              </Field>
            </fieldset>
          </section>

          <section style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <h3 style={{ ...S.h3, margin: 0 }}>Inhalt</h3>
              {!readOnly && blocks.length === 0 && content.loaded && (
                <button type="button" onClick={() => setBlocks(monthlyTemplate(content))} style={btn('ghost', { marginLeft: 'auto' })}><Sparkles size={14} /> Vorlage Monats-Newsletter</button>
              )}
            </div>
            {blocks.length === 0 && <p style={{ ...S.hint, margin: '0 0 12px', fontSize: '13px' }}>Noch keine Bausteine. Nimm die Vorlage oder füge Bausteine einzeln hinzu.</p>}
            {blocks.map((b, i) => (
              <BlockEditor key={b._id} block={b} index={i} total={blocks.length} content={content} readOnly={readOnly}
                onChange={nb => updateBlock(i, nb)} onMove={d => moveBlock(i, d)} onRemove={() => removeBlock(i)} />
            ))}
            {!readOnly && (adding ? (
              <div style={{ border: '1.5px dashed #BAE6FD', borderRadius: '14px', padding: '12px', background: '#F8FAFC' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '8px' }}>
                  {BLOCK_TYPES.map(t => (
                    <button key={t.type} type="button" onClick={() => addBlock(t.type)}
                      style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{t.label}</span>
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>{t.hint}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setAdding(false)} style={btn('ghost', { marginTop: '10px' })}>Abbrechen</button>
              </div>
            ) : (
              <button type="button" onClick={() => setAdding(true)} style={btn('ghost', { width: '100%', borderStyle: 'dashed', padding: '12px' })}><Plus size={15} /> Baustein hinzufügen</button>
            ))}
          </section>
        </div>

        {/* ── Rechts: Vorschau ── */}
        <div className="nl-preview-col">
          <section style={{ ...S.card, padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Eye size={15} color="#0EA5E9" />
              <h3 style={{ ...S.h3, margin: 0 }}>Vorschau</h3>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                <button type="button" onClick={() => setDevice('desktop')} style={btn(device === 'desktop' ? 'dark' : 'ghost', { padding: '6px 10px' })}><Monitor size={14} /> Computer</button>
                <button type="button" onClick={() => setDevice('mobile')} style={btn(device === 'mobile' ? 'dark' : 'ghost', { padding: '6px 10px' })}><Smartphone size={14} /> Handy</button>
              </div>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject || '(ohne Betreff)'}</div>
              <div style={{ fontSize: '12px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preheader || 'Keine Vorschauzeile'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', background: '#E2E8F0', borderRadius: '10px', padding: device === 'mobile' ? '14px 0' : 0 }}>
              <iframe title="Vorschau" srcDoc={previewHtml} sandbox="allow-popups"
                style={{ width: device === 'mobile' ? '375px' : '100%', height: '780px', border: 'none', borderRadius: '8px', background: '#F1F5F9' }} />
            </div>
          </section>
        </div>
      </div>

      {/* ── Aktionsleiste ── */}
      <div className="nl-actionbar">
        {state.err && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#B91C1C', fontWeight: 600 }}>{state.err}</p>}
        {state.msg && !state.err && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#15803D', fontWeight: 600 }}>{state.msg}</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {!readOnly && <button type="button" onClick={doSave} disabled={busy || !dirty} style={btn(dirty ? 'primary' : 'ghost')}><Save size={14} /> {state.busy === 'save' ? 'Speichert …' : 'Speichern'}</button>}

          <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <input type="email" value={testTo} onChange={e => setTestTo(e.target.value)} placeholder="Test an …" style={{ ...S.input, width: '210px' }} />
            <button type="button" onClick={doTest} disabled={busy || !testTo} style={btn('ghost')}><Send size={14} /> {state.busy === 'test' ? 'Sendet …' : 'Testmail'}</button>
          </span>

          <span style={{ flex: 1 }} />

          {isWelcome ? (
            <button type="button" onClick={doToggleWelcome} disabled={busy} style={btn(c.status === 'active' ? 'ghost' : 'primary')}>
              <Power size={14} /> {c.status === 'active' ? 'Ausschalten' : 'Einschalten'}
            </button>
          ) : c.status === 'draft' || c.status === 'scheduled' ? (
            <>
              <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                <input type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} style={{ ...S.input, width: 'auto' }} />
                <button type="button" onClick={doSchedule} disabled={busy || !when} style={btn('ghost')}>
                  <CalendarClock size={14} /> {c.status === 'scheduled' ? 'Neu planen' : 'Planen'}
                </button>
              </span>
              {c.status === 'scheduled' && <button type="button" onClick={doUnschedule} disabled={busy} style={btn('ghost')}>Planung aufheben</button>}
              <button type="button" onClick={() => setConfirmSend(true)} disabled={busy} style={btn('primary')}><Send size={14} /> Jetzt senden</button>
            </>
          ) : null}
        </div>
      </div>

      {/* ── Sicherheitsabfrage vor dem Senden ── */}
      {confirmSend && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '26px', maxWidth: '440px', width: '100%' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Newsletter jetzt versenden?</h3>
            <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              „{subject || '(ohne Betreff)'}“ geht sofort an <strong>{recipients} bestätigte Abonnent{recipients === 1 ? '' : 'en'}</strong>.
            </p>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#B45309', lineHeight: 1.6 }}>Ein Versand lässt sich nicht zurückholen. Schick dir vorher am besten eine Testmail.</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setConfirmSend(false)} style={btn('ghost')}>Abbrechen</button>
              <button type="button" onClick={doSendNow} style={btn('primary')}><Send size={14} /> Ja, jetzt senden</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
