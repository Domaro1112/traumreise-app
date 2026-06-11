import { CheckCircle2, AlertCircle } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';

const PROS = [
  'Maximale Flexibilität – spontane Stopps und eigene Zeitplanung',
  'Abgelegene Strände und ruhige Orte abseits der Touristenrouten',
  'Rundreisen einfacher planen – keine Abhängigkeit von Transfers',
  'Unabhängig von Bus- und Bahnverbindungen',
  'Ideal für Familien mit Gepäck oder Kinderwagen',
];

const CONS = [
  'Zusatzkosten: Treibstoff, Maut und Parkgebühren beachten',
  'Parkplatzsuche in Städten kann zeitaufwändig sein',
  'Verkehrsregeln und Straßenverhältnisse im Ausland variieren',
  'Kaution erfordert Kreditkarte mit ausreichend Limit',
  'Versicherungsbedingungen sorgfältig vergleichen und prüfen',
];

export default function CarRentalProsCons() {
  return (
    <section style={{ padding: 'clamp(60px, 7vw, 96px) 0', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        <SectionTitle
          label="Abwägung"
          title="Vor- und Nachteile"
          titleHighlight="eines Mietwagens"
          subtitle="Ein Mietwagen ist nicht für jedes Reiseziel sinnvoll. Hier findest du eine ehrliche Einschätzung."
          align="center"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '40px',
        }}>
          {/* Vorteile */}
          <div style={{
            background: '#F0FDF4',
            borderRadius: '20px',
            border: '1.5px solid #86EFAC',
            padding: '28px 26px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#22C55E', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <CheckCircle2 size={18} strokeWidth={2} color="#FFFFFF" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: '#14532D', margin: 0 }}>
                Vorteile
              </h3>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PROS.map((pro, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={14} strokeWidth={2.5} color="#22C55E" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#15803D', lineHeight: 1.65 }}>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nachteile */}
          <div style={{
            background: '#FFF7ED',
            borderRadius: '20px',
            border: '1.5px solid #FED7AA',
            padding: '28px 26px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#F97316', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <AlertCircle size={18} strokeWidth={2} color="#FFFFFF" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: '#7C2D12', margin: 0 }}>
                Nachteile
              </h3>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {CONS.map((con, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <AlertCircle size={14} strokeWidth={2.5} color="#F97316" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#9A3412', lineHeight: 1.65 }}>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
