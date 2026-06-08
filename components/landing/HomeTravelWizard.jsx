'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Plane, ShieldCheck, Star, Users,
  CalendarDays, Calendar, Wallet, MessageSquare, ChevronDown,
} from 'lucide-react';
import Container from '@/components/layout/Container';
import VisualOptionCard from '@/components/finder/VisualOptionCard';
import SelectionSummary from '@/components/finder/SelectionSummary';
import { moodOptions, seasonOptions, durationOptions, budgetOptions } from '@/data/finderOptions';

function SectionQuestion({ step, title, subtitle, Icon }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #EFF6FF, #ECFEFF)',
            border: '1.5px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {Icon && <Icon size={16} strokeWidth={2} color="#0EA5E9" />}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
          }}
        >
          {step}. {title}
        </h3>
      </div>
      {subtitle && (
        <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 0 44px' }}>{subtitle}</p>
      )}
    </div>
  );
}

export default function HomeTravelWizard() {
  const router = useRouter();
  const [interests, setInterests] = useState([]);
  const [season, setSeason] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [freeText, setFreeText] = useState('');
  const [showText, setShowText] = useState(false);
  const [textFocused, setTextFocused] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  const toggleMood = id =>
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length >= 3 ? prev : [...prev, id]
    );

  const canSubmit = interests.length > 0 && !!season && !!duration && !!budget;

  const handleSubmit = () => {
    if (!canSubmit) return;
    try {
      sessionStorage.setItem(
        'traumreise_finder_state',
        JSON.stringify({ interests, season, duration, budget, freeText })
      );
    } catch {}
    router.push('/finder');
  };

  return (
    <section id="wizard" style={{ background: '#FFFFFF', paddingBottom: '80px' }}>
      <Container>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow:
              '0 8px 48px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',
            padding: 'clamp(24px, 5vw, 44px)',
            marginTop: '-40px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '20px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#0284C7',
                marginBottom: '12px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              <Sparkles size={12} strokeWidth={2} />
              Deine Traumreise in 2 Minuten
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(20px, 3vw, 30px)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: '0 0 8px',
              }}
            >
              Beschreibe deine perfekte Reise
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: '#64748B',
                lineHeight: 1.65,
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              Wähle aus was zu dir passt – unsere Analyse findet deine 3 perfekten Reiseziele
              inkl. Hotels &amp; Flügen.
            </p>
          </div>

          {/* Main 2-column layout */}
          <div className="finder-wizard-layout">

            {/* Left: sections */}
            <div>

              {/* 1 – Stimmung */}
              <section style={{ marginBottom: '36px' }}>
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
                      onClick={() => toggleMood(opt.id)}
                    />
                  ))}
                </div>
              </section>

              {/* 2 – Reisezeit */}
              <section style={{ marginBottom: '36px' }}>
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
                      onClick={() => setSeason(season === opt.id ? '' : opt.id)}
                    />
                  ))}
                </div>
              </section>

              {/* 3 – Dauer */}
              <section style={{ marginBottom: '36px' }}>
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
                      onClick={() => setDuration(duration === opt.id ? '' : opt.id)}
                    />
                  ))}
                </div>
              </section>

              {/* 4 – Budget */}
              <section style={{ marginBottom: '28px' }}>
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
                      onClick={() => setBudget(budget === opt.id ? '' : opt.id)}
                    />
                  ))}
                </div>
              </section>

              {/* Optional: free text (collapsible) */}
              <div style={{ marginBottom: '28px' }}>
                <button
                  onClick={() => setShowText(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '13px',
                    color: '#64748B',
                    fontFamily: 'inherit',
                    fontWeight: 500,
                  }}
                >
                  <MessageSquare size={14} strokeWidth={2} color="#94A3B8" />
                  Zusätzliche Wünsche ergänzen <b>(optional)</b>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    color="#94A3B8"
                    style={{
                      transform: showText ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>

                {showText && (
                  <div
                    style={{
                      marginTop: '10px',
                      background: '#F8FAFF',
                      border: `1.5px solid ${textFocused ? '#0EA5E9' : '#E2E8F0'}`,
                      borderRadius: '14px',
                      padding: '14px 16px',
                      transition: 'border-color 0.2s',
                      animation: 'fadeUp 0.25s ease',
                    }}
                  >
                    <textarea
                      value={freeText}
                      onChange={e => setFreeText(e.target.value)}
                      onFocus={() => setTextFocused(true)}
                      onBlur={() => setTextFocused(false)}
                      rows={3}
                      placeholder="z.B. Ich möchte morgens am Meer aufwachen und gutes Essen erleben…"
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '14px',
                        color: '#0F172A',
                        lineHeight: 1.7,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Mobile summary */}
              <div className="finder-mobile-summary">
                <SelectionSummary
                  interests={interests}
                  season={season}
                  duration={duration}
                  budget={budget}
                />
              </div>

              {/* CTA */}
              <div
                style={{
                  paddingTop: '28px',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <button
                    onClick={canSubmit ? handleSubmit : undefined}
                    disabled={!canSubmit}
                    onMouseEnter={() => setCtaHovered(true)}
                    onMouseLeave={() => setCtaHovered(false)}
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
                      boxShadow: canSubmit && ctaHovered
                        ? '0 14px 44px rgba(14,165,233,0.48)'
                        : canSubmit
                        ? '0 6px 24px rgba(14,165,233,0.38)'
                        : 'none',
                      transform: canSubmit && ctaHovered ? 'translateY(-3px)' : 'translateY(0)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <Plane size={18} strokeWidth={2.5} />
                    Meine Traumreise finden
                    <Sparkles size={16} strokeWidth={2} />
                  </button>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#94A3B8',
                      marginTop: '10px',
                      marginBottom: 0,
                    }}
                  >
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
                    paddingTop: '14px',
                    borderTop: '1px solid #F8FAFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <ShieldCheck size={13} strokeWidth={2} color="#94A3B8" />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                        100% kostenlos & unverbindlich
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Deine Daten werden nie weitergegeben.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex' }}>
                      {['#0EA5E9', '#06B6D4', '#38BDF8', '#7DD3FC'].map((bg, i) => (
                        <div
                          key={i}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: bg,
                            border: '2px solid #FFFFFF',
                            marginLeft: i === 0 ? 0 : '-7px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Users size={10} strokeWidth={2} color="#FFFFFF" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
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
              </div>
            </div>

            {/* Right: sticky sidebar (desktop) */}
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
      </Container>
    </section>
  );
}
