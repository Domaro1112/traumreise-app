'use client';

import { useState } from 'react';
import { QUESTIONS } from '@/lib/motorradurlaub-funnel';
import MotorcycleQuestionCard from './MotorcycleQuestionCard';
import MotorcycleResultView from './MotorcycleResultView';

export default function MotorcycleFunnel() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUESTIONS[step];
  const isDone = step >= QUESTIONS.length;

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
  };

  if (isDone) {
    return <MotorcycleResultView answers={answers} onReset={handleReset} />;
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
