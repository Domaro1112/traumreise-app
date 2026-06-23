import Container from '@/components/layout/Container';

const BENEFITS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17l4-8 4 4 4-6 4 10" /><path d="M21 17H3" />
      </svg>
    ),
    title: 'Kurvenreiche Routen entdecken',
    text: 'Von Alpenpässen bis zu Küstenstraßen – finde Routen, die wirklich Fahrspaß bieten und nicht nur von A nach B führen.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Tagesetappen besser planen',
    text: 'Realistische Etappenlängen, Pausen und Sehenswürdigkeiten auf dem Weg – damit der Urlaub entspannt bleibt.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" /><path d="M9 22V12h6v10" /><path d="M12 6V2" />
      </svg>
    ),
    title: 'Motorradfreundliche Unterkünfte finden',
    text: 'Hotels und Pensionen mit gesichertem Unterstellplatz, Werkzeugverleih und Biker-Atmosphäre.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    title: 'Wetter und Saison beachten',
    text: 'Wann sind Pässe offen, welche Küste hat die beste Jahreszeit – damit du nicht gegen die Bedingungen fährst.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2" /><path d="M8 7V5a2 2 0 0 0-4 0v2" />
      </svg>
    ),
    title: 'Gepäck und Pausen realistisch planen',
    text: 'Was passt aufs Motorrad, wo sind gute Stopps – damit du leicht unterwegs bist und nichts Wichtiges vermisst.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    title: 'Reiseziele nach Fahrgefühl auswählen',
    text: 'Kurven, Weite, Küste oder Berge – finde Reiseziele, die zu deiner Art zu fahren passen.',
  },
];

export default function MotorcycleBenefits() {
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
            Was ApeAround dir bietet
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(22px, 3.5vw, 34px)',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 auto',
            maxWidth: '540px',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}>
            Den Motorradurlaub besser vorbereiten
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {BENEFITS.map(({ icon, title, text }) => (
            <div
              key={title}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '28px 24px',
                transition: 'box-shadow 0.18s',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0EA5E9',
                marginBottom: '18px',
              }}>
                {icon}
              </div>
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
