'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Bucht ApeAround die Reise direkt?',
    a: 'Nein. ApeAround hilft dir bei der Inspiration und Vorauswahl. Die Buchung erfolgt direkt beim jeweiligen Anbieter — zum Beispiel bei Booking.com, Expedia oder HolidayCheck.',
  },
  {
    q: 'Sind die Hotelpreise live?',
    a: 'Preise und Verfügbarkeiten werden beim Anbieter geprüft. ApeAround leitet dich zur passenden Suche beim jeweiligen Partner weiter, wo du aktuelle Preise siehst.',
  },
  {
    q: 'Kostet ApeAround etwas?',
    a: 'Die Nutzung der Reiseplanung ist kostenlos. Einige ausgehende Links können Affiliate-Links sein. Für dich entstehen dadurch keine Mehrkosten.',
  },
  {
    q: 'Warum bekomme ich mehrere Reisevorschläge?',
    a: 'Weil Urlaub selten nur eine richtige Antwort hat. ApeAround zeigt dir mehrere passende Richtungen, damit du vergleichen kannst und die für dich stimmige Reiseidee findest.',
  },
  {
    q: 'Kann ich die Vorschläge direkt buchen?',
    a: 'Du kannst passende Angebote bei externen Partnern vergleichen und dort buchen. ApeAround leitet dich direkt zur passenden Suche beim jeweiligen Anbieter weiter.',
  },
  {
    q: 'Wie persönlich ist die Auswertung wirklich?',
    a: 'Die Auswertung basiert auf deinen Antworten zu Stimmung, Reisedauer, Budget und Interessen. Die KI erstellt daraus ein Reiseprofil und schlägt Ziele vor, die dazu passen — nicht willkürliche Pauschalangebote.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{
            background: '#FFFFFF',
            border: `1.5px solid ${open === i ? '#BFDBFE' : '#E2E8F0'}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: open === i ? '0 4px 20px rgba(14,165,233,0.10)' : '0 2px 8px rgba(15,23,42,0.04)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            aria-expanded={open === i}
          >
            <span style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              fontWeight: 600,
              color: '#0F172A',
              lineHeight: 1.4,
            }}>
              {faq.q}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: open === i ? '#EFF6FF' : '#F8FAFF',
              border: `1.5px solid ${open === i ? '#BFDBFE' : '#E2E8F0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease, background 0.2s, border-color 0.2s',
            }}>
              <ChevronDown size={16} strokeWidth={2} color={open === i ? '#0EA5E9' : '#94A3B8'} />
            </div>
          </button>

          {open === i && (
            <div style={{ padding: '0 24px 22px', borderTop: '1px solid #EFF6FF' }}>
              <p style={{
                fontSize: '15px',
                color: '#475569',
                lineHeight: 1.8,
                margin: '16px 0 0',
              }}>
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
