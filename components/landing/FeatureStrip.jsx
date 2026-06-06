import { Bot, Globe, Wallet, UserCheck } from 'lucide-react';
import Container from '@/components/layout/Container';
import { features } from '@/data/features';

const ICON_MAP = { Bot, Globe, Wallet, UserCheck };

export default function FeatureStrip() {
  return (
    <section
      style={{
        background: '#F8FAFF',
        paddingTop: '72px',
        paddingBottom: '72px',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
          }}
        >
          {features.map((feature) => {
            const Icon = ICON_MAP[feature.icon] || Globe;
            return (
              <div key={feature.id} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)',
                    border: '1px solid #BFDBFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px',
                    boxShadow: '0 2px 12px rgba(14,165,233,0.12)',
                  }}
                >
                  <Icon size={28} strokeWidth={1.5} color="#0EA5E9" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '10px',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748B',
                    lineHeight: 1.7,
                    maxWidth: '220px',
                    margin: '0 auto',
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
