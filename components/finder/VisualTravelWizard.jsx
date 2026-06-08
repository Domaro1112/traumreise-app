'use client';

import { useState } from 'react';
import {
  Sparkles, Plane, ShieldCheck, Star, Users,
  CalendarDays, Calendar, Wallet, MessageSquare,
} from 'lucide-react';
import VisualOptionCard from './VisualOptionCard';
import WizardProgress from './WizardProgress';
import SelectionSummary from './SelectionSummary';
import { moodOptions, seasonOptions, durationOptions, budgetOptions } from '@/data/finderOptions';

const EXAMPLES = [
  'Morgens am Meer aufwachen, gutes Essen und nicht zu touristisch…',
  'Städte, in denen man sich verlaufen kann und es gut ist…',
  'Essen probieren, das ich zuhause nie finden würde…',
];

function SectionQuestion({ step, title, subtitle, Icon }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #EFF6FF, #ECFEFF)',
            border: '1.5px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {Icon && <Icon size={17} strokeWidth={2} color="#0EA5E9" />}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
          }}
        >
          {step}. {title}
        </h3>
      </div>
      {subtitle && (
        <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 0 46px' }}>{subtitle}</p>
      )}
    </div>
  );
}

function CTASection({ canSubmit, onSubmit, onBack }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ marginTop: '48px', paddingTop: '36px', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <button
          onClick={canSubmit ? onSubmit : undefined}
          disabled={!canSubmit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '18px clamp(28px, 5vw, 56px)',
            borderRadius: '16px',
            border: 'none',
            fontSize: 'clamp(15px, 2vw, 17px)',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.01em',
            background: canSubmit
              ? 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
              : '#E2E8F0',
            color: canSubmit ? '#FFFFFF' : '#94A3B8',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            boxShadow: canSubmit && hovered
              ? '0 14px 44px rgba(14,165,233,0.48)'
              : canSubmit
              ? '0 6px 24px rgba(14,165,233,0.38)'
              : 'none',
            transform: canSubmit && hovered ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.25s ease',
          }}
        >
          <Plane size={18} strokeWidth={2.5} />
          Meine Traumreise finden
          <Sparkles size={16} strokeWidth={2} />
        </button>

        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '12px', marginBottom: 0 }}>
          In weniger als 2 Minuten zu deiner perfekten Reise
        </p>
      </div>

      {/* Trust row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid #F8FAFF',
        }}
      >
        {/* Data security */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={14} strokeWidth={2} color="#94A3B8" />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
              Deine Daten sind sicher
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              Wir geben deine Daten niemals weiter.
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex' }}>
            {['#0EA5E9', '#06B6D4', '#38BDF8', '#7DD3FC'].map((bg, i) => (
              <div
                key={i}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: bg,
                  border: '2px solid #FFFFFF',
                  marginLeft: i === 0 ? 0 : '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={11} strokeWidth={2} color="#FFFFFF" />
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '2px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} strokeWidth={0} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
              4,9/5 aus 2.847 Bewertungen
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textDecoration: 'underline',
            padding: '4px 8px',
          }}
        >
          ← Zurück zur Übersicht
        </button>
      </div>
    </div>
  );
}

export default function VisualTravelWizard({
  freeText,
  onFreeTextChange,
  interests,
  onToggleMood,
  season,
  onSeasonChange,
  duration,
  onDurationChange,
  budget,
  onBudgetChange,
  currentStep,
  canSubmit,
  onSubmit,
  onBack,
  error,
}) {
  const [textareaFocused, setTextareaFocused] = useState(false);

  return (
    <div style={{ animation: 'fadeUp 0.5s ease both' }}>
      <WizardProgress currentStep={currentStep} />

      {/* Page header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#0284C7',
            marginBottom: '16px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          <Sparkles size={12} strokeWidth={2} />
          Dein Reisefinder
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 10px',
            lineHeight: 1.15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          Beschreibe deine Traumreise
          <Sparkles size={22} strokeWidth={2} color="#0EA5E9" />
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#64748B',
            lineHeight: 1.65,
            maxWidth: '480px',
            margin: '0 auto',
          }}
        >
          Wähle einfach aus, was am besten zu dir passt – wir kümmern uns um den Rest.
        </p>
      </div>

      {/* Optional free text */}
      <div
        style={{
          marginBottom: '40px',
          background: '#F8FAFF',
          border: `1.5px solid ${textareaFocused ? '#0EA5E9' : '#E2E8F0'}`,
          borderRadius: '20px',
          padding: '20px 22px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: textareaFocused ? '0 0 0 3px rgba(14,165,233,0.10)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <MessageSquare size={14} strokeWidth={2} color="#0EA5E9" />
          <label
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0F172A',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Erzähl uns, was dir wichtig ist{' '}
            <span style={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8' }}>(optional)</span>
          </label>
        </div>

        <textarea
          value={freeText}
          onChange={e => onFreeTextChange(e.target.value)}
          onFocus={() => setTextareaFocused(true)}
          onBlur={() => setTextareaFocused(false)}
          rows={3}
          placeholder="z.B. Ich möchte morgens am Meer aufwachen, gutes Essen erleben und nicht zu touristisch reisen…"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            fontSize: '14px',
            color: '#0F172A',
            lineHeight: 1.7,
            fontFamily: 'var(--font-body)',
            outline: 'none',
            resize: 'none',
            marginBottom: '10px',
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => onFreeTextChange(ex)} className="finder-example-pill">
              {ex.length > 46 ? ex.slice(0, 46) + '…' : ex}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-column layout: sections + sidebar */}
      <div className="finder-wizard-layout">

        {/* Left: question sections */}
        <div>

          {/* 1 – Stimmung */}
          <section style={{ marginBottom: '48px' }}>
            <SectionQuestion
              step={1}
              title="Was ist deine Lieblingsstimmung?"
              subtitle="Wähle bis zu 3 Optionen"
              Icon={Sparkles}
            />
            <div className="finder-grid-6">
              {moodOptions.map(opt => (
                <VisualOptionCard
                  key={opt.id}
                  imageUrl={opt.imageUrl}

                  label={opt.label}
                  subtitle={opt.subtitle}
                  selected={interests.includes(opt.id)}
                  onClick={() => onToggleMood(opt.id)}
                />
              ))}
            </div>
          </section>

          {/* 2 – Reisezeit */}
          <section style={{ marginBottom: '48px' }}>
            <SectionQuestion
              step={2}
              title="Wann möchtest du reisen?"
              subtitle="Wähle eine Option"
              Icon={CalendarDays}
            />
            <div className="finder-grid-4">
              {seasonOptions.map(opt => (
                <VisualOptionCard
                  key={opt.id}
                  imageUrl={opt.imageUrl}

                  label={opt.label}
                  selected={season === opt.id}
                  onClick={() => onSeasonChange(season === opt.id ? '' : opt.id)}
                />
              ))}
            </div>
          </section>

          {/* 3 – Dauer */}
          <section style={{ marginBottom: '48px' }}>
            <SectionQuestion
              step={3}
              title="Wie lange möchtest du verreisen?"
              subtitle="Wähle eine Option"
              Icon={Calendar}
            />
            <div className="finder-grid-4">
              {durationOptions.map(opt => (
                <VisualOptionCard
                  key={opt.id}
                  imageUrl={opt.imageUrl}

                  label={opt.label}
                  subtitle={opt.subtitle}
                  selected={duration === opt.id}
                  onClick={() => onDurationChange(duration === opt.id ? '' : opt.id)}
                />
              ))}
            </div>
          </section>

          {/* 4 – Budget */}
          <section style={{ marginBottom: '32px' }}>
            <SectionQuestion
              step={4}
              title="Welches Budget passt zu dir?"
              subtitle="Wähle eine Option"
              Icon={Wallet}
            />
            <div className="finder-grid-3">
              {budgetOptions.map(opt => (
                <VisualOptionCard
                  key={opt.id}
                  imageUrl={opt.imageUrl}

                  label={opt.label}
                  subtitle={opt.subtitle}
                  selected={budget === opt.id}
                  onClick={() => onBudgetChange(budget === opt.id ? '' : opt.id)}
                />
              ))}
            </div>
          </section>

          {/* Mobile-only summary */}
          <div className="finder-mobile-summary">
            <SelectionSummary
              interests={interests}
              season={season}
              duration={duration}
              budget={budget}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '14px 18px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#DC2626',
                marginTop: '20px',
              }}
            >
              {error}
            </div>
          )}

          {/* CTA */}
          <CTASection canSubmit={canSubmit} onSubmit={onSubmit} onBack={onBack} />
        </div>

        {/* Right: sticky sidebar (desktop only) */}
        <div className="finder-wizard-sidebar">
          <SelectionSummary
            interests={interests}
            season={season}
            duration={duration}
            budget={budget}
          />
        </div>
      </div>
    </div>
  );
}
