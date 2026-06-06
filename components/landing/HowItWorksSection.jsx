'use client';

import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import { howItWorksSteps } from '@/data/features';

export default function HowItWorksSection() {
  return (
    <section
      id="so-funktionierts"
      style={{
        background: '#F8FAFF',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      <Container>
        <SectionTitle
          label="So funktioniert's"
          title="In 3 einfachen Schritten"
          titleHighlight="zu deiner Traumreise"
          subtitle="Keine langen Formulare, kein Stress. Einfach erzählen, KI starten, Traumreise finden."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '56px',
          }}
        >
          {howItWorksSteps.map((step, idx) => (
            <div key={step.step} style={{ position: 'relative' }}>
              {/* Connector line (desktop) */}
              {idx < howItWorksSteps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '-12px',
                    width: '24px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #0EA5E9, rgba(14,165,233,0.2))',
                    zIndex: 1,
                  }}
                  aria-hidden="true"
                />
              )}

              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '36px 28px',
                  height: '100%',
                  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                  boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0EA5E9';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(14,165,233,0.14)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Step number + icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}
                  >
                    {step.step}
                  </div>
                  <div style={{ fontSize: '32px' }}>{step.icon}</div>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '19px',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '12px',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748B',
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button href="/finder" size="lg">
            Jetzt kostenlos starten ✈️
          </Button>
        </div>
      </Container>
    </section>
  );
}
