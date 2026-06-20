import Container from '@/components/layout/Container';

export default function AlleinerziehendeTeaserSection() {
  return (
    <section style={{ background: '#F8FAFF', paddingTop: '64px', paddingBottom: '64px' }}>
      <Container>
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #12324a 60%, #0d3a52 100%)',
          borderRadius: '28px',
          padding: 'clamp(32px, 5vw, 56px)',
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '-30%', right: '-5%',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{
            flexShrink: 0,
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'rgba(14,165,233,0.14)',
            border: '1px solid rgba(14,165,233,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#38BDF8',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 8l-4 4-4-4"/>
              <path d="M18 4v8"/>
            </svg>
          </div>

          {/* Text */}
          <div style={{ flex: '1 1 280px', minWidth: 0, position: 'relative', zIndex: 1 }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 10px',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}>
              Für Alleinerziehende
            </p>
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(19px, 2.5vw, 26px)', fontWeight: 800,
              color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.2,
            }}>
              Urlaub für Alleinerziehende
            </h2>
            <p style={{
              fontSize: '15px', color: '#94A3B8', lineHeight: 1.65, margin: 0,
            }}>
              Stressfreier reisen mit Kind: ApeAround zeigt dir Reiseideen mit kurzen Wegen, familienfreundlichen Unterkünften und fairer Budgetplanung.
            </p>
          </div>

          {/* CTA */}
          <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <a
              href="/urlaub-fuer-alleinerziehende"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF', textDecoration: 'none',
                fontSize: '14px', fontWeight: 700,
                boxShadow: '0 6px 20px rgba(14,165,233,0.35)',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              Mehr erfahren
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
