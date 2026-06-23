import Container from '@/components/layout/Container';

const TRIP_TYPES = [
  {
    title: 'Alpenpässe',
    text: 'Großglockner, Stilfserjoch, Timmelsjoch – die Klassiker für kurvenbegeisterte Fahrer.',
    accent: '#0EA5E9',
  },
  {
    title: 'Küstenstraßen',
    text: 'Atlantikküste, Amalfi, Nordseeküste – Weite, Meeresluft und entspanntes Gleiten.',
    accent: '#06B6D4',
  },
  {
    title: 'Wochenendtouren',
    text: 'Kurztrips ab Freitagnachmittag – maximal 2–3 Tage, minimaler Aufwand, maximales Fahrerlebnis.',
    accent: '#3B82F6',
  },
  {
    title: 'Motorradurlaub mit Hotel',
    text: 'Komfortabel unterwegs: Bikerhotels mit Unterstellplatz, gutem Frühstück und Gepäcktransfer.',
    accent: '#8B5CF6',
  },
  {
    title: 'Motorradurlaub mit Camping',
    text: 'Minimalistisch und naturnah – nur das Zelt, das Motorrad und die Straße vor dir.',
    accent: '#10B981',
  },
  {
    title: 'Motorradurlaub in Gruppen',
    text: 'Gemeinsam unterwegs: Route abstimmen, Pausen koordinieren, Erlebnisse teilen.',
    accent: '#F59E0B',
  },
  {
    title: 'Alleine mit dem Motorrad reisen',
    text: 'Vollständige Freiheit: eigenes Tempo, spontane Umwege, keine Kompromisse.',
    accent: '#EF4444',
  },
];

export default function MotorcycleTripTypes() {
  return (
    <section style={{ background: '#FFFFFF', paddingTop: '72px', paddingBottom: '72px' }}>
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
            Reisearten
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
            Welche Art von Motorradurlaub passt zu dir?
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {TRIP_TYPES.map(({ title, text, accent }) => (
            <div
              key={title}
              style={{
                background: '#F8FAFF',
                border: '1px solid #E2E8F0',
                borderLeft: `3px solid ${accent}`,
                borderRadius: '14px',
                padding: '22px 20px',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: '15px',
                fontWeight: 700,
                color: '#0F172A',
                margin: '0 0 10px',
              }}>
                {title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
