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
        background: 'linear-gradient(180deg, #0a0e1a 0%, #07070f 100%)',
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
    >
      <Container>
        <SectionTitle
          label="So funktioniert's"
          title="In 3 einfachen Schritten"
          titleHighlight="zu deiner Traumreise"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '56px',
            position: 'relative',
          }}
        >
          {howItWorksSteps.map((step, idx) => (
            <div key={step.step} style={{ position: 'relative' }}>
              {/* Connector line (desktop only) */}
              {idx < howItWorksSteps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '-12px',
                    width: '24px',
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(255,215,0,0.4), rgba(255,215,0,0.1))',
                    zIndex: 1,
                  }}
                  aria-hidden="true"
                />
              )}

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '20px',
                  padding: '36px 28px',
                  height: '100%',
                  transition: 'border-color 0.3s, background 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,215,0,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                {/* Step number */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,215,0,0.4)',
                      background: 'rgba(255,215,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#FFD700',
                      flexShrink: 0,
                    }}
                  >
                    {step.step}
                  </div>
                  <div style={{ fontSize: '32px' }}>{step.icon}</div>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '12px',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
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
