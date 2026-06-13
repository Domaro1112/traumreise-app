'use client';

import { useState } from 'react';
import { Sparkles, MessageSquare, CheckCircle2, ChevronDown } from 'lucide-react';
import FutureVibeCard from '@/components/finder/FutureVibeCard';
import { zukunftVibeOptions } from '@/data/finderOptions';

const EXAMPLE_PILLS = [
  'Ich will endlich abschalten',
  'Ich brauche Abenteuer',
  'Ich will mich wieder lebendig fühlen',
];

export default function FutureSelfWizard({
  vibes,
  onToggleVibe,
  text,
  onTextChange,
  onSubmit,
  onBack,
  error,
}) {
  const [textFocused, setTextFocused] = useState(false);
  const [showText, setShowText] = useState(false);

  return (
    <div>
      {/* Emotional header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,4vw,36px)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '20px',
            background: '#F5F3FF',
            border: '1px solid #DDD6FE',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#7C3AED',
            marginBottom: '16px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          <Sparkles size={12} strokeWidth={2} />
          KI-Reise-Storytelling
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 12px',
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
          }}
        >
          Wie würde sich dein nächstes{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Reise-Ich
          </span>{' '}
          anfühlen?
        </h2>

        <p
          style={{
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            color: '#64748B',
            lineHeight: 1.72,
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          Wähle die Stimmung deiner Reise – unsere KI zeigt dir, wie sich dein
          alternatives Leben dort anfühlen könnte.
        </p>
      </div>

      {/* Vibe label */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#64748B',
          marginBottom: '14px',
          fontFamily: 'var(--font-heading)',
        }}
      >
        Welches Gefühl brauchst du?
      </div>

      {/* Vibe grid */}
      <div className="future-vibe-grid">
        {zukunftVibeOptions.map(opt => (
          <FutureVibeCard
            key={opt.id}
            imageUrl={opt.imageUrl}

            label={opt.label}
            subtitle={opt.subtitle}
            color={opt.color}
            selected={vibes.includes(opt.id)}
            onClick={() => onToggleVibe(opt.id)}
          />
        ))}
      </div>

      {/* Selection feedback */}
      <div style={{ minHeight: '28px', margin: '12px 0 24px' }}>
        {vibes.length > 0 && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#7C3AED',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={14} strokeWidth={2} color="#7C3AED" />
            {vibes.length === 1 ? '1 Stimmung ausgewählt' : `${vibes.length} Stimmungen ausgewählt`}
          </div>
        )}
      </div>

      {/* Optional text (collapsible) */}
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
            fontSize: '14px',
            fontWeight: 600,
            color: '#475569',
            fontFamily: 'inherit',
          }}
        >
          <MessageSquare size={15} strokeWidth={2} color="#A78BFA" />
          Was brauchst du gerade?
          <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: '13px' }}>
            (optional)
          </span>
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
              marginTop: '12px',
              animation: 'fadeUp 0.25s ease',
            }}
          >
            <div
              style={{
                background: '#FAFAF8',
                border: `2px solid ${textFocused ? '#A78BFA' : '#E2E8F0'}`,
                borderRadius: '16px',
                padding: '14px 16px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: textFocused ? '0 0 0 3px rgba(167,139,250,0.12)' : 'none',
              }}
            >
              <textarea
                value={text}
                onChange={e => onTextChange(e.target.value)}
                onFocus={() => setTextFocused(true)}
                onBlur={() => setTextFocused(false)}
                rows={3}
                placeholder="z.B. Ich brauche Abstand vom Alltag, Sonne im Gesicht, gutes Essen und einen Ort, an dem ich wieder durchatmen kann..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '14px',
                  color: '#0F172A',
                  lineHeight: 1.75,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Example pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              {EXAMPLE_PILLS.map(pill => (
                <button
                  key={pill}
                  onClick={() => onTextChange(pill)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: `1.5px solid ${text === pill ? '#A78BFA' : '#E2E8F0'}`,
                    background: text === pill ? '#F5F3FF' : '#F8FAFF',
                    color: text === pill ? '#7C3AED' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            color: '#DC2626',
            textAlign: 'center',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {/* CTAs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: '13px 24px',
            borderRadius: '12px',
            border: '2px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#475569',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.color = '#475569';
          }}
        >
          ← Zurück
        </button>

        <button
          onClick={vibes.length > 0 ? onSubmit : undefined}
          disabled={vibes.length === 0}
          style={{
            flex: 1,
            minWidth: '220px',
            padding: '16px 28px',
            borderRadius: '14px',
            border: 'none',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 700,
            background:
              vibes.length > 0
                ? 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)'
                : '#F1F5F9',
            color: vibes.length > 0 ? '#FFFFFF' : '#94A3B8',
            cursor: vibes.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow:
              vibes.length > 0 ? '0 6px 28px rgba(167,139,250,0.42)' : 'none',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            if (vibes.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 44px rgba(167,139,250,0.52)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              vibes.length > 0 ? '0 6px 28px rgba(167,139,250,0.42)' : 'none';
          }}
        >
          <Sparkles size={18} strokeWidth={2} />
          Zeig mir mein Reise-Ich
        </button>
      </div>
    </div>
  );
}
