'use client';

import { useState } from 'react';

// ── VisualCard ──────────────────────────────────────────────────────────────
// Matches the card style used in HomeTravelWizard and PlanenFunnel.
// Height is controlled by the global .funnel-visual-card CSS class
// (140px → 160px → 180px at responsive breakpoints).

function VisualCard({ selected, onClick, img, fallbackImg, bg, label, hint }) {
  const [imgSrc, setImgSrc] = useState(img || fallbackImg || null);

  function handleError() {
    if (fallbackImg && imgSrc !== fallbackImg) setImgSrc(fallbackImg);
    else setImgSrc(null);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="funnel-visual-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        border: selected ? '2.5px solid #0EA5E9' : '2.5px solid transparent',
        padding: 0,
        display: 'block',
        width: '100%',
        cursor: 'pointer',
        backgroundColor: bg || '#162040',
        boxShadow: selected
          ? '0 0 0 3px rgba(14,165,233,0.50), 0 0 0 6px rgba(14,165,233,0.14), 0 10px 28px rgba(0,0,0,0.22)'
          : '0 3px 14px rgba(0,0,0,0.18)',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        textAlign: 'left',
        fontFamily: 'var(--font-heading,"Poppins",system-ui,sans-serif)',
      }}
    >
      {imgSrc && (
        <>
          {/* Hidden probe triggers onError fallback before the visible div loads */}
          <img
            key={imgSrc}
            src={imgSrc}
            alt=""
            aria-hidden="true"
            onError={handleError}
            style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-1px',
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </>
      )}

      {/* Dark gradient overlay — keeps text readable on any photo */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.42) 52%, rgba(0,0,0,0.12) 100%)',
      }} />

      {/* Label + hint */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '8px 12px 13px',
        zIndex: 2,
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.60)',
          lineHeight: 1.3,
          letterSpacing: '0.01em',
        }}>
          {label}
        </div>
        {hint && (
          <div style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.65)',
            marginTop: '2px',
            lineHeight: 1.2,
          }}>
            {hint}
          </div>
        )}
      </div>

      {/* Checkmark badge */}
      {selected && (
        <div style={{
          position: 'absolute',
          top: '8px', right: '8px',
          width: '22px', height: '22px',
          borderRadius: '50%',
          background: '#0EA5E9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(14,165,233,0.65)',
          zIndex: 3,
          fontSize: '13px', color: '#fff', fontWeight: 800, lineHeight: 1,
        }}>
          ✓
        </div>
      )}
    </button>
  );
}

// ── Grid class helper ───────────────────────────────────────────────────────

function gridClass(count) {
  if (count === 4) return 'mqc-grid mqc-grid-2';  // 2×2
  if (count === 3) return 'mqc-grid mqc-grid-3';  // 1×3
  return 'mqc-grid mqc-grid-3';                    // 3+n for 5 and 6
}

// ── Main component ──────────────────────────────────────────────────────────

const ARROW_RIGHT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ARROW_LEFT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function MotorcycleQuestionCard({
  question,
  selected,
  onSelect,
  onNext,
  onBack,
  stepIndex,
  totalSteps,
}) {
  const progress = Math.round(((stepIndex) / totalSteps) * 100);
  const isLast   = stepIndex === totalSteps - 1;

  return (
    <>
      <style>{`
        .mqc-outer {
          min-height: 100%;
          padding: clamp(32px, 5vw, 56px) clamp(16px, 4vw, 24px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mqc-inner {
          width: 100%;
          max-width: 720px;
        }
        .mqc-card {
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 24px rgba(15,23,42,0.07);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .mqc-progress-track {
          height: 5px;
          background: #E2E8F0;
        }
        .mqc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0EA5E9, #06B6D4);
          transition: width 0.4s ease;
          border-radius: 0 3px 3px 0;
        }
        .mqc-body {
          padding: clamp(24px, 4vw, 40px);
        }
        .mqc-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .mqc-step {
          font-size: 12px;
          font-weight: 700;
          color: #0EA5E9;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: var(--font-heading, "Poppins", system-ui, sans-serif);
        }
        .mqc-pct {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 500;
        }
        .mqc-title {
          font-family: var(--font-heading, "Poppins", system-ui, sans-serif);
          font-size: clamp(19px, 3.2vw, 24px);
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .mqc-subtitle {
          font-size: 13px;
          color: #94A3B8;
          margin: 0 0 24px;
          line-height: 1.6;
        }
        /* Grid variants */
        .mqc-grid {
          display: grid;
          gap: 10px;
        }
        .mqc-grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        .mqc-grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        /* Navigation */
        .mqc-nav {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .mqc-btn-next {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          font-family: var(--font-heading, "Poppins", system-ui, sans-serif);
          cursor: pointer;
          transition: filter 0.15s ease, transform 0.15s ease;
          box-shadow: 0 6px 20px rgba(14,165,233,0.30);
        }
        .mqc-btn-next:disabled {
          background: #E2E8F0;
          color: #94A3B8;
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.55;
        }
        .mqc-btn-next:not(:disabled):hover {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }
        .mqc-btn-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          color: #64748B;
          font-size: 14px;
          font-weight: 600;
          font-family: var(--font-heading, "Poppins", system-ui, sans-serif);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
        }
        .mqc-btn-back:hover {
          background: #F1F5F9;
          border-color: #CBD5E1;
        }
        /* Responsive */
        @media (max-width: 520px) {
          .mqc-grid-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 360px) {
          .mqc-grid-2, .mqc-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="mqc-outer">
        <div className="mqc-inner">
          <div className="mqc-card">
            {/* Progress bar */}
            <div className="mqc-progress-track">
              <div className="mqc-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="mqc-body">
              {/* Step meta */}
              <div className="mqc-meta">
                <span className="mqc-step">Schritt {stepIndex + 1} von {totalSteps}</span>
                <span className="mqc-pct">{progress} % abgeschlossen</span>
              </div>

              {/* Question */}
              <h2 className="mqc-title">{question.title}</h2>
              <p className="mqc-subtitle">{question.subtitle}</p>

              {/* Visual card grid */}
              <div className={gridClass(question.options.length)}>
                {question.options.map(opt => (
                  <VisualCard
                    key={opt.value}
                    selected={selected === opt.value}
                    onClick={() => onSelect(opt.value)}
                    img={opt.img}
                    fallbackImg={opt.fallbackImg}
                    bg={opt.bg}
                    label={opt.label}
                    hint={opt.hint}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mqc-nav">
            {stepIndex > 0 ? (
              <button type="button" className="mqc-btn-back" onClick={onBack}>
                {ARROW_LEFT} Zurück
              </button>
            ) : (
              <a
                href="/motorradurlaub"
                className="mqc-btn-back"
                style={{ textDecoration: 'none' }}
              >
                {ARROW_LEFT} Zur Übersicht
              </a>
            )}
            <button
              type="button"
              className="mqc-btn-next"
              disabled={!selected}
              onClick={onNext}
            >
              {isLast ? 'Ergebnis anzeigen' : 'Weiter'}
              {ARROW_RIGHT}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
