'use client';

const CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ARROW_RIGHT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ARROW_LEFT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
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
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const isLast = stepIndex === totalSteps - 1;
  const cols = question.options.length > 4 ? 3 : 2;

  return (
    <>
      <style>{`
        .mqc-wrapper {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: clamp(24px, 5vw, 56px) clamp(16px, 4vw, 24px);
        }
        .mqc-card {
          background: #FFFFFF;
          border-radius: 24px;
          box-shadow: 0 4px 32px rgba(15,23,42,0.10);
          width: 100%;
          max-width: 640px;
          overflow: hidden;
        }
        .mqc-progress-bar {
          height: 4px;
          background: #E2E8F0;
        }
        .mqc-progress-fill {
          height: 100%;
          background: linear-gradient(to right, #0EA5E9, #06B6D4);
          transition: width 0.35s ease;
          border-radius: 0 2px 2px 0;
        }
        .mqc-body {
          padding: clamp(28px, 5vw, 44px);
        }
        .mqc-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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
          font-size: clamp(20px, 3.5vw, 26px);
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 10px;
          line-height: 1.22;
          letter-spacing: -0.02em;
        }
        .mqc-subtitle {
          font-size: 14px;
          color: #64748B;
          line-height: 1.65;
          margin: 0 0 28px;
        }
        .mqc-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 32px;
        }
        .mqc-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 32px;
        }
        .mqc-option {
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          background: #F8FAFC;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
          text-align: left;
          position: relative;
        }
        .mqc-option:hover {
          border-color: #BAE6FD;
          background: #F0F9FF;
        }
        .mqc-option.selected {
          border-color: #0EA5E9;
          background: rgba(14,165,233,0.06);
          box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
        }
        .mqc-option-label {
          font-family: var(--font-heading, "Poppins", system-ui, sans-serif);
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 3px;
          padding-right: 24px;
        }
        .mqc-option.selected .mqc-option-label {
          color: #0369A1;
        }
        .mqc-option-hint {
          font-size: 12px;
          color: #94A3B8;
          margin: 0;
        }
        .mqc-option-check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0EA5E9;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .mqc-option.selected .mqc-option-check {
          opacity: 1;
        }
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
          transform: none;
          filter: none;
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
        @media (max-width: 520px) {
          .mqc-grid-3 {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 400px) {
          .mqc-grid-2, .mqc-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="mqc-wrapper">
        <div className="mqc-card">
          {/* Progress bar */}
          <div className="mqc-progress-bar">
            <div className="mqc-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="mqc-body">
            {/* Meta row */}
            <div className="mqc-meta">
              <span className="mqc-step">Schritt {stepIndex + 1} von {totalSteps}</span>
              <span className="mqc-pct">{progress} %</span>
            </div>

            {/* Question */}
            <h2 className="mqc-title">{question.title}</h2>
            <p className="mqc-subtitle">{question.subtitle}</p>

            {/* Options */}
            <div className={cols === 3 ? 'mqc-grid-3' : 'mqc-grid-2'}>
              {question.options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`mqc-option${selected === opt.value ? ' selected' : ''}`}
                  onClick={() => onSelect(opt.value)}
                >
                  <p className="mqc-option-label">{opt.label}</p>
                  <p className="mqc-option-hint">{opt.hint}</p>
                  <div className="mqc-option-check" aria-hidden="true">{CHECK_ICON}</div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="mqc-nav">
              {stepIndex > 0 && (
                <button type="button" className="mqc-btn-back" onClick={onBack}>
                  {ARROW_LEFT} Zurück
                </button>
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
      </div>
    </>
  );
}
