'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Bildergalerie eines Reiseziels mit Vollbild-Ansicht.
 * Klick auf ein Bild öffnet es groß; Pfeile, Tastatur (← → Esc) und Wischen blättern.
 *
 * @param {{ images: { url: string, alt: string }[] }} props
 */
export default function DestinationGallery({ images = [] }) {
  const [open, setOpen] = useState(null); // Index des geöffneten Bildes
  const touchX = useRef(null);
  const count = images.length;

  const close = useCallback(() => setOpen(null), []);
  const prev  = useCallback(() => setOpen(i => (i === null ? i : (i - 1 + count) % count)), [count]);
  const next  = useCallback(() => setOpen(i => (i === null ? i : (i + 1) % count)), [count]);

  useEffect(() => {
    if (open === null) return;
    const onKey = e => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [open, close, prev, next]);

  if (!count) return null;
  const cur = open !== null ? images[open] : null;

  const navBtn = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: '48px', height: '48px', borderRadius: '50%', border: 'none',
    background: 'rgba(255,255,255,0.14)', color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)',
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`${img.alt} vergrößern`}
            className="dest-gallery-thumb"
            style={{ padding: 0, border: 'none', borderRadius: '12px', overflow: 'hidden', background: '#F1F5F9', aspectRatio: '4/3', cursor: 'zoom-in', display: 'block', width: '100%' }}
          >
            <img src={img.url} alt={img.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' }} />
          </button>
        ))}
      </div>

      {cur && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={cur.alt}
          onClick={close}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? prev() : next());
            touchX.current = null;
          }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,6,23,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 4vw, 48px)' }}
        >
          <figure onClick={e => e.stopPropagation()} style={{ margin: 0, maxWidth: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={cur.url}
              alt={cur.alt}
              style={{ maxWidth: 'min(1400px, 100%)', maxHeight: 'calc(100vh - 120px)', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'block' }}
            />
            <figcaption style={{ marginTop: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', textAlign: 'center' }}>
              {cur.alt}{count > 1 && <span style={{ opacity: 0.6 }}> · {open + 1} / {count}</span>}
            </figcaption>
          </figure>

          <button type="button" onClick={e => { e.stopPropagation(); close(); }} aria-label="Schließen"
            style={{ ...navBtn, top: '20px', right: '20px', transform: 'none', width: '42px', height: '42px' }}>
            <X size={20} strokeWidth={2.5} />
          </button>
          {count > 1 && (
            <>
              <button type="button" onClick={e => { e.stopPropagation(); prev(); }} aria-label="Vorheriges Bild" style={{ ...navBtn, left: 'clamp(8px, 2vw, 24px)' }}>
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <button type="button" onClick={e => { e.stopPropagation(); next(); }} aria-label="Nächstes Bild" style={{ ...navBtn, right: 'clamp(8px, 2vw, 24px)' }}>
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
