import SectionTitle from '@/components/ui/SectionTitle';

// Bilder liegen unter public/images/mietwagen/ (Format ca. 8:3)
const TIPS = [
  {
    image: '/images/mietwagen/mietwagen-frueh.jpg',
    title: 'Frühzeitig buchen',
    text: 'Wer einige Monate vor der Reise bucht, zahlt oft deutlich weniger. Kurz vor dem Reisetermin steigen die Preise meist stark an.',
  },
  {
    image: '/images/mietwagen/mietwagen-versicherung.jpg',
    title: 'Vollkasko ohne Selbstbeteiligung',
    text: 'CDW/LDW ohne Franchise schützt dich vor unerwarteten Kosten bei Schäden – lohnt sich fast immer.',
  },
  {
    image: '/images/mietwagen/mietwagen-kreditkarte.jpg',
    title: 'Kreditkarte bereithalten',
    text: 'Fast alle Vermieter verlangen eine echte Kreditkarte für die Kaution. EC-Karten werden selten akzeptiert.',
  },
  {
    image: '/images/mietwagen/mietwagen-tanken.jpg',
    title: 'Tankregelung beachten',
    text: '„Full to Full“ ist am fairsten: Voll abholen, voll zurückgeben – kein teurer Aufpreis an der Station.',
  },
  {
    image: '/images/mietwagen/mietwagen-fotos.jpg',
    title: 'Schäden dokumentieren',
    text: 'Fotografiere das Fahrzeug vor der Abfahrt von allen Seiten und bestehe auf einer schriftlichen Bestätigung.',
  },
  {
    image: '/images/mietwagen/mietwagen-zusatzfahrer.jpg',
    title: 'Zusatzfahrer vorab buchen',
    text: 'An der Station ist der Zusatzfahrer meist teurer. Vorab online hinzubuchen spart Geld.',
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

        <div className="mw-tips-grid">
          {TIPS.map(tip => (
            <article key={tip.title} className="mw-tip-card">
              <div style={{ overflow: 'hidden' }}>
                <img
                  src={tip.image}
                  alt={tip.title}
                  loading="lazy"
                  width={832}
                  height={310}
                  className="mw-tip-img"
                  style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '832 / 310', objectFit: 'cover', background: '#E2E8F0' }}
                />
              </div>
              <div style={{ padding: '18px 22px 22px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: '0 0 8px',
                }}>
                  {tip.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                  {tip.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
