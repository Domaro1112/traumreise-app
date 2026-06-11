'use client';

import { useState } from 'react';
import { ChevronDown, Car } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { CAR_RENTAL_FAQ, CHECK24_CAR_RENTAL_AFFILIATE_URL } from '@/lib/car-rental-config';

export default function CarRentalFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={{ padding: 'clamp(60px, 7vw, 96px) 0', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        <SectionTitle
          label="FAQ"
          title="Häufige Fragen zum"
          titleHighlight="Mietwagen"
          subtitle="Alles, was du vor der Buchung wissen solltest – kurz und klar beantwortet."
          align="center"
        />

        <div style={{ maxWidth: '780px', margin: '40px auto 0' }}>
          {CAR_RENTAL_FAQ.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  marginBottom: '10px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '20px 22px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0F172A',
                    lineHeight: 1.4,
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{ flex: 1 }}>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    color="#94A3B8"
                    style={{
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 22px 20px',
                    fontSize: '14px',
                    color: '#475569',
                    lineHeight: 1.8,
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '18px', marginTop: 0 }}>
            Bereit für dein nächstes Mietwagen-Abenteuer?
          </p>
          <a
            href={CHECK24_CAR_RENTAL_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '15px 32px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 6px 24px rgba(249,115,22,0.35)',
            }}
          >
            <Car size={18} strokeWidth={2} />
            Jetzt Mietwagen vergleichen
          </a>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '10px', marginBottom: 0 }}>
            Weiterleitung zu CHECK24 · Für dich kostenlos
          </p>
        </div>
      </div>
    </section>
  );
}
