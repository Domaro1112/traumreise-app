'use client';

import { useCallback, useRef, useState } from 'react';
import { Monitor, Smartphone, RotateCcw } from 'lucide-react';

const parse = f => {
  const m = /^(\d{1,3})% (\d{1,3})%$/.exec(f || '');
  return m ? [Number(m[1]), Number(m[2])] : [50, 50];
};
const fmt = (x, y) => `${Math.round(x)}% ${Math.round(y)}%`;
const clamp = v => Math.max(0, Math.min(100, v));

/**
 * Bildausschnitt für Hero-Bilder wählen.
 * Klick oder Ziehen im Bild setzt den Punkt, der sichtbar bleiben soll –
 * getrennt für Computer und Handy. Rechts sieht man, wie es auf der Seite wirkt.
 *
 * Props: image, value { desktop, mobile }, defaults { desktop, mobile }, onChange(value)
 */
export default function FocusPicker({ image, value, defaults, onChange }) {
  const [mode, setMode] = useState('desktop');
  const boxRef = useRef(null);
  const dragging = useRef(false);
  const focus = { desktop: value?.desktop || '50% 50%', mobile: value?.mobile || value?.desktop || '50% 50%' };
  const [fx, fy] = parse(focus[mode]);

  const setFromEvent = useCallback((e) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const p = 'touches' in e ? e.touches[0] : e;
    const x = clamp(((p.clientX - box.left) / box.width) * 100);
    const y = clamp(((p.clientY - box.top) / box.height) * 100);
    onChange({ ...focus, [mode]: fmt(x, y) });
  }, [focus, mode, onChange]);

  const tab = (m, Icon, label) => (
    <button type="button" onClick={() => setMode(m)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        border: mode === m ? '1.5px solid #0EA5E9' : '1.5px solid #E2E8F0', background: mode === m ? '#EFF6FF' : '#fff', color: mode === m ? '#0369A1' : '#475569' }}>
      <Icon size={13} strokeWidth={2.2} /> {label}
    </button>
  );

  if (!image) return <p style={{ fontSize: '12px', color: '#94A3B8' }}>Erst ein Bild hochladen, dann den Ausschnitt wählen.</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '18px', alignItems: 'start' }} className="focus-picker">
      <style>{`@media (max-width: 860px) { .focus-picker { grid-template-columns: 1fr !important; } }`}</style>

      {/* Ganzes Bild mit Fokuspunkt */}
      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {tab('desktop', Monitor, 'Computer')}
          {tab('mobile', Smartphone, 'Handy')}
          <button type="button" onClick={() => onChange({ ...focus, [mode]: defaults?.[mode] || '50% 50%' })}
            style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 10px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: '#fff', fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
            <RotateCcw size={12} /> Standard
          </button>
        </div>
        <div
          ref={boxRef}
          onMouseDown={e => { dragging.current = true; setFromEvent(e); }}
          onMouseMove={e => dragging.current && setFromEvent(e)}
          onMouseUp={() => { dragging.current = false; }}
          onMouseLeave={() => { dragging.current = false; }}
          onTouchStart={e => setFromEvent(e)}
          onTouchMove={e => { e.preventDefault(); setFromEvent(e); }}
          style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'crosshair', userSelect: 'none', touchAction: 'none', background: '#0F172A' }}
        >
          <img src={image} alt="" draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: `${fx}%`, top: `${fy}%`, width: '34px', height: '34px', marginLeft: '-17px', marginTop: '-17px', borderRadius: '50%',
            border: '3px solid #fff', boxShadow: '0 0 0 2px rgba(14,165,233,0.9), 0 4px 14px rgba(0,0,0,0.45)', pointerEvents: 'none' }} />
        </div>
        <p style={{ fontSize: '12px', color: '#64748B', margin: '8px 0 0', lineHeight: 1.5 }}>
          Klicke oder ziehe auf die Stelle, die immer sichtbar bleiben soll (z. B. das Gesicht). Gerade bearbeitet: <strong>{mode === 'desktop' ? 'Computer' : 'Handy'}</strong> · {focus[mode]}
        </p>
      </div>

      {/* Vorschau */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Vorschau Computer</div>
          <div style={{ aspectRatio: '1440 / 740', borderRadius: '10px', overflow: 'hidden', border: mode === 'desktop' ? '2px solid #0EA5E9' : '2px solid #E2E8F0' }}>
            <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus.desktop, display: 'block' }} />
          </div>
        </div>
        <div style={{ width: '92px', flexShrink: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Handy</div>
          <div style={{ aspectRatio: '390 / 600', borderRadius: '10px', overflow: 'hidden', border: mode === 'mobile' ? '2px solid #0EA5E9' : '2px solid #E2E8F0' }}>
            <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus.mobile, display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
