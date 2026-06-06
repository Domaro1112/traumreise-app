import Container from '@/components/layout/Container';
import { features } from '@/data/features';

export default function FeatureStrip() {
  return (
    <section
      style={{
        background: '#07070f',
        paddingTop: '80px',
        paddingBottom: '80px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
          }}
        >
          {features.map((feature) => (
            <div key={feature.id} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '36px',
                  marginBottom: '16px',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '10px',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.7,
                  maxWidth: '220px',
                  margin: '0 auto',
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
