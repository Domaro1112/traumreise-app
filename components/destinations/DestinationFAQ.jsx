'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function DestinationFAQ({ faq, destinationName }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faq || faq.length === 0) return null;

  return (
    <section aria-label={`FAQ ${destinationName}`} style={{ marginBottom: '40px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: '22px',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '6px',
          letterSpacing: '-0.02em',
        }}
      >
        Häufige Fragen zu {destinationName}
      </h2>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
        Antworten auf die wichtigsten Fragen rund um deinen Urlaub in {destinationName}.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {faq.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              style={{
                border: `1.5px solid ${isOpen ? '#BAE6FD' : '#E2E8F0'}`,
                borderRadius: '14px',
                background: isOpen ? '#F0F9FF' : '#FFFFFF',
                overflow: 'hidden',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '16px 18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>
                  {item.question}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  color="#94A3B8"
                  style={{
                    flexShrink: 0,
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>
              {isOpen && (
                <div style={{ padding: '0 18px 18px' }}>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
