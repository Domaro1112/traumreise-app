import Container from '@/components/layout/Container';
import { MOTORCYCLE_FAQ } from '@/lib/motorradurlaub-config';

export default function MotorcycleFAQ() {
  return (
    <section style={{ background: '#F8FAFF', paddingTop: '72px', paddingBottom: '72px' }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0EA5E9',
            margin: '0 0 14px',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          }}>
            Häufige Fragen
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(22px, 3.5vw, 34px)',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 auto',
            maxWidth: '520px',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}>
            Fragen zum Motorradurlaub
          </h2>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {MOTORCYCLE_FAQ.map(({ question, answer }) => (
            <div
              key={question}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '24px 26px',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: '15px',
                fontWeight: 700,
                color: '#0F172A',
                margin: '0 0 12px',
                lineHeight: 1.35,
              }}>
                {question}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.75, margin: 0 }}>
                {answer}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
