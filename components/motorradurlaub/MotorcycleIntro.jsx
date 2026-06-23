import Container from '@/components/layout/Container';

const ASPECTS = [
  { label: 'Route & Etappen', text: 'Welche Strecke passt, wie weit ist realistisch pro Tag?' },
  { label: 'Unterkunft', text: 'Motorradfreundliche Hotels, Campingplätze oder spontan?' },
  { label: 'Wetter & Saison', text: 'Wann ist die Region auf ihrer besten Seite?' },
  { label: 'Gepäck & Ausrüstung', text: 'Was passt aufs Motorrad, was bleibt zuhause?' },
  { label: 'Sicherheit', text: 'Schutzausrüstung, Pannenhilfe und Routenkenntnis.' },
  { label: 'Fahrgefühl', text: 'Kurven, Pässe, Küste – welche Landschaft begeistert?' },
];

export default function MotorcycleIntro() {
  return (
    <section style={{ background: '#FFFFFF', paddingTop: '72px', paddingBottom: '72px' }}>
      <Container>
        <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Left: main text */}
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0EA5E9',
              margin: '0 0 14px',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}>
              Freiheit auf zwei Rädern
            </p>
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 20px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}>
              Motorradurlaub ist mehr als eine Reise
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.75, margin: '0 0 18px' }}>
              Ein Motorradurlaub verbindet Fahrerlebnis, Landschaft und Abenteuer zu einem
              Ganzen. Die Route ist nicht nur Weg zum Ziel – sie ist das Ziel selbst.
              Jeder Pass, jede Küstenstraße und jede morgendliche Ausfahrt wird Teil
              der Erinnerung.
            </p>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
              Damit das Erlebnis wirklich gelingt, lohnt sich eine gute Vorbereitung.
              ApeAround hilft dir dabei, passende Routen, Reiseziele und Unterkünfte
              für deinen Motorradurlaub zu finden.
            </p>
          </div>

          {/* Right: aspects list */}
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <p style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0F172A',
              margin: '0 0 18px',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}>
              Das macht einen guten Motorradurlaub aus:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ASPECTS.map(({ label, text }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: '#F8FAFF',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#0EA5E9',
                    flexShrink: 0,
                    marginTop: '6px',
                  }} />
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                      {label}
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.55 }}>
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
