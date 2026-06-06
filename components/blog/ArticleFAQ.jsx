import { HelpCircle } from 'lucide-react';

export default function ArticleFAQ({ faq, destination }) {
  if (!faq?.length) return null;

  return (
    <section
      id="faq"
      style={{
        marginTop: '64px',
        marginBottom: '48px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
          paddingBottom: '16px',
          borderBottom: '2px solid #EFF6FF',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <HelpCircle size={20} strokeWidth={2} color="#0EA5E9" />
        </div>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(20px, 2.5vw, 26px)',
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Häufige Fragen zu {destination}
          </h2>
        </div>
      </div>

      {/* FAQ items as native details/summary for SEO + no-JS accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faq.map((item, i) => (
          <details
            key={i}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '20px 22px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                userSelect: 'none',
              }}
            >
              <span>{item.question}</span>
              <span
                style={{
                  fontSize: '20px',
                  color: '#0EA5E9',
                  flexShrink: 0,
                  lineHeight: 1,
                  transition: 'transform 0.25s',
                }}
              >
                +
              </span>
            </summary>

            <div
              style={{
                padding: '0 22px 20px',
                fontSize: '15px',
                color: '#475569',
                lineHeight: 1.8,
                borderTop: '1px solid #F1F5F9',
                paddingTop: '16px',
              }}
            >
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
