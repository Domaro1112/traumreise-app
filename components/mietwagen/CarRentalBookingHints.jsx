import SectionTitle from '@/components/ui/SectionTitle';

const HINTS = [
  {
    icon: '🛡️',
    title: 'Versicherung',
    text: 'Vollkaskoversicherung ohne Selbstbeteiligung (CDW ohne Franchise) ist empfehlenswert. Prüfe vorab, ob deine Kreditkarte bereits eine Mietwagen-Kaskoversicherung bietet – viele Premium-Kreditkarten schließen das ein.',
  },
  {
    icon: '🛣️',
    title: 'Maut',
    text: 'In Österreich, Italien, Frankreich und Portugal ist Maut Pflicht. Kläre vorab, ob das Fahrzeug mit Vignette ausgestattet ist oder ein elektronischer Transponder benötigt wird, um an Mautstationen durchzufahren.',
  },
  {
    icon: '⛽',
    title: 'Tankregelung',
    text: '"Full to Full" ist die fairste Variante: Voll abholen, voll zurückgeben. Bei "Full to Empty" berechnest du beim Vermieter oft deutlich überhöhte Treibstoffpreise – bis zu 50% mehr als an der Tankstelle.',
  },
  {
    icon: '💳',
    title: 'Kaution',
    text: 'Nahezu alle Vermieter blockieren eine Kaution auf der Kreditkarte (EC-Karten werden meist nicht akzeptiert). Der Betrag variiert je nach Fahrzeugklasse zwischen 200 und 2.000 Euro.',
  },
  {
    icon: '👤',
    title: 'Zusatzfahrer',
    text: 'Alle geplanten Fahrer müssen namentlich eingetragen sein. Vorab online buchen spart erheblich – an der Station ist der Aufpreis für Zusatzfahrer oft doppelt so hoch wie bei Online-Buchung.',
  },
  {
    icon: '🌍',
    title: 'Grenzübertritt',
    text: 'Nicht jeder Vermieter erlaubt Grenzübertritte automatisch. Kläre vorab, ob eine Auslandszulassung vorhanden ist. Für bestimmte Länder können Zusatzgebühren und Versicherungsanpassungen notwendig sein.',
  },
];

export default function CarRentalBookingHints() {
  return (
    <section style={{ padding: 'clamp(60px, 7vw, 96px) 0', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        <SectionTitle
          label="Wichtige Hinweise"
          title="Das solltest du vor der"
          titleHighlight="Buchung wissen"
          subtitle="Sechs Themen, die oft für Überraschungen sorgen – und wie du sie entspannt löst."
          align="center"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '40px',
        }}>
          {HINTS.map((hint, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px 22px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px', lineHeight: 1 }}>{hint.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0F172A',
                margin: '0 0 8px',
              }}>
                {hint.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.75, margin: 0 }}>
                {hint.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
