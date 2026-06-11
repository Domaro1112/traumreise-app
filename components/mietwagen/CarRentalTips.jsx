import SectionTitle from '@/components/ui/SectionTitle';

const TIPS = [
  {
    icon: '⏰',
    title: 'Frühzeitig buchen',
    text: '3–6 Monate vor der Reise buchst du oft 30–50% günstiger. Preise steigen kurz vor dem Reisetermin stark an.',
  },
  {
    icon: '🛡️',
    title: 'Vollkasko ohne Selbstbeteiligung',
    text: 'CDW/LDW ohne Franchise schützt dich vor unerwarteten Kosten bei Schäden – lohnt sich fast immer.',
  },
  {
    icon: '💳',
    title: 'Kreditkarte bereithalten',
    text: 'Fast alle Vermieter verlangen eine echte Kreditkarte für die Kaution. EC-Karten werden selten akzeptiert.',
  },
  {
    icon: '⛽',
    title: 'Tankregelung beachten',
    text: '"Full to Full" ist am fairsten: Voll abholen, voll zurückgeben – kein teurer Aufpreis an der Station.',
  },
  {
    icon: '📸',
    title: 'Schäden dokumentieren',
    text: 'Fotografiere das Fahrzeug vor der Abfahrt von allen Seiten und bestehe auf einer schriftlichen Bestätigung.',
  },
  {
    icon: '👤',
    title: 'Zusatzfahrer vorab buchen',
    text: 'An der Station kostet der Zusatzfahrer oft doppelt so viel. Vorab online hinzubuchen spart erheblich.',
  },
];

export default function CarRentalTips() {
  return (
    <section style={{ padding: 'clamp(60px, 7vw, 96px) 0', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        <SectionTitle
          label="Insider-Tipps"
          title="So sparst du beim"
          titleHighlight="Mietwagen"
          subtitle="Diese 6 Tipps helfen dir, beim nächsten Mietwagen Zeit, Geld und Ärger zu sparen."
          align="center"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '40px',
        }}>
          {TIPS.map((tip, i) => (
            <div
              key={i}
              style={{
                background: '#F8FAFC',
                borderRadius: '18px',
                padding: '26px 24px',
                border: '1.5px solid #E2E8F0',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '14px', lineHeight: 1 }}>{tip.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '17px',
                fontWeight: 700,
                color: '#0F172A',
                margin: '0 0 8px',
              }}>
                {tip.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.75, margin: 0 }}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
