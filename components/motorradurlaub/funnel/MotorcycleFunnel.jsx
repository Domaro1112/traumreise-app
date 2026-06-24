'use client';

import { useState, useEffect } from 'react';
import { QUESTIONS, computeResult } from '@/lib/motorradurlaub-funnel';
import MotorcycleQuestionCard from './MotorcycleQuestionCard';
import MotorcycleResultView from './MotorcycleResultView';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 24px)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #0e2d46 55%, #0d3a52 100%)',
        borderRadius: '24px',
        padding: 'clamp(36px, 5vw, 56px)',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-30%', right: '-8%',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            border: '3px solid rgba(14,165,233,0.20)',
            borderTopColor: '#0EA5E9',
            animation: 'mf-spin 0.9s linear infinite',
          }} />
        </div>
        <style>{`@keyframes mf-spin { to { transform: rotate(360deg); } }`}</style>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(20px, 3vw, 26px)',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: '0 0 14px',
          letterSpacing: '-0.02em',
          position: 'relative', zIndex: 1,
        }}>
          Deine Motorradtour wird geplant …
        </h2>
        <p style={{
          fontSize: 'clamp(13px, 1.8vw, 15px)',
          color: 'rgba(255,255,255,0.70)',
          lineHeight: 1.65,
          margin: 0,
          position: 'relative', zIndex: 1,
        }}>
          Wir prüfen passende Regionen, Routen, Tagesetappen, Unterkünfte und Sicherheitshinweise.
        </p>
      </div>
    </div>
  );
}

export default function MotorcycleFunnel() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const currentQuestion = QUESTIONS[step];
  const isDone = step >= QUESTIONS.length;

  useEffect(() => {
    if (step < QUESTIONS.length) return;

    let cancelled = false;
    setAiLoading(true);
    setAiResult(null);
    setAiError(false);

    const fallbackResult = computeResult(answers);

    fetch('/api/ai/motorcycle-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration:      answers.duration,
        dailyKm:       answers.dailyKm,
        style:         answers.style,
        destination:   answers.destination,
        accommodation: answers.accommodation,
        parking:       answers.parking,
        fallbackResult,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) { setAiResult(data); setAiLoading(false); }
      })
      .catch(err => {
        console.error('[MotorcycleFunnel] AI call failed:', err);
        if (!cancelled) { setAiError(true); setAiLoading(false); }
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => Math.max(0, s - 1));
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setAiResult(null);
    setAiLoading(false);
    setAiError(false);
  };

  if (isDone) {
    if (aiLoading) return <LoadingScreen />;
    return (
      <MotorcycleResultView
        answers={answers}
        onReset={handleReset}
        aiResult={aiResult}
        aiError={aiError}
      />
    );
  }

  return (
    <MotorcycleQuestionCard
      question={currentQuestion}
      selected={answers[currentQuestion.id]}
      onSelect={handleSelect}
      onNext={handleNext}
      onBack={handleBack}
      stepIndex={step}
      totalSteps={QUESTIONS.length}
    />
  );
}
