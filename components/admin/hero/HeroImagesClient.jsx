'use client';

import { useState } from 'react';
import { Check, ExternalLink, Save } from 'lucide-react';
import FocusPicker from '@/components/admin/media/FocusPicker';

function HeroCard({ item }) {
  const [focus, setFocus] = useState(item.focus);
  const [saved, setSaved] = useState(item.focus);
  const [state, setState] = useState({ busy: false, msg: '', err: '' });
  const dirty = focus.desktop !== saved.desktop || focus.mobile !== saved.mobile;

  async function save() {
    setState({ busy: true, msg: '', err: '' });
    try {
      const res = await fetch('/api/admin/hero-images', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_key: item.key, focus_desktop: focus.desktop, focus_mobile: focus.mobile }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Speichern fehlgeschlagen.');
      setSaved(focus);
      setState({ busy: false, msg: 'Gespeichert – die Seite zeigt den neuen Ausschnitt innerhalb einer Minute.', err: '' });
    } catch (e) {
      setState({ busy: false, msg: '', err: e.message });
    }
  }

  return (
    <section style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px 22px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>{item.label}</h3>
        <a href={item.path} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#0EA5E9', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
          {item.path} <ExternalLink size={11} />
        </a>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {state.msg && !dirty && <span style={{ fontSize: '12px', color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={13} /> {state.msg}</span>}
          <button type="button" onClick={save} disabled={!dirty || state.busy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: 700,
              cursor: dirty ? 'pointer' : 'default', background: dirty ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F1F5F9', color: dirty ? '#fff' : '#94A3B8' }}>
            <Save size={14} /> {state.busy ? 'Speichert …' : 'Speichern'}
          </button>
        </div>
      </div>
      {state.err && <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#B91C1C' }}>{state.err}</p>}
      <FocusPicker image={item.image} value={focus} defaults={{ desktop: item.desktop, mobile: item.mobile }} onChange={setFocus} />
    </section>
  );
}

export default function HeroImagesClient({ items, loadError }) {
  return (
    <div>
      {loadError && (
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '14px 16px', marginBottom: '18px', fontSize: '13px', color: '#991B1B', lineHeight: 1.6 }}>
          <strong>Die Tabelle für die Hero-Bilder fehlt noch.</strong> Bitte die Datei <code>supabase/hero-bilder.sql</code> einmal im Supabase SQL Editor ausführen.
          Bis dahin werden die Standard-Ausschnitte angezeigt und Speichern funktioniert nicht.
        </div>
      )}
      {items.map(item => <HeroCard key={item.key} item={item} />)}
    </div>
  );
}
