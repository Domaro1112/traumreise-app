import SectionTitle from '@/components/ui/SectionTitle';

const HINTS = [
  {
    image: '/images/mietwagen/hinweis-versicherung.jpg',
    title: 'Versicherung',
    text: 'Eine Vollkasko ohne Selbstbeteiligung gibt dir die meiste Ruhe. Prüfe vorab, ob deine Kreditkarte schon einen Mietwagen-Schutz enthält – das ist bei einigen Karten der Fall.',
  },
  {
    image: '/images/mietwagen/hinweis-maut.jpg',
    title: 'Maut',
    text: 'In vielen Ländern, etwa Österreich, Italien, Frankreich oder Portugal, fällt Maut an. Frag vorab, ob eine Vignette oder ein elektronischer Transponder im Auto ist.',
  },
  {
    image: '/images/mietwagen/hinweis-tanken.jpg',
    title: 'Tankregelung',
    text: '„Voll/Voll“ ist meist die fairste Variante: voll abholen, voll zurückgeben. Lässt du den Vermieter tanken, wird das oft deutlich teurer als an der Tankstelle.',
  },
  {
    image: '/images/mietwagen/hinweis-kaution.jpg',
    title: 'Kaution',
    text: 'Die meisten Vermieter blocken eine Kaution auf einer Kreditkarte, Debitkarten werden oft nicht akzeptiert. Je nach Fahrzeugklasse sind das oft mehrere hundert Euro, bei großen Autos auch mehr.',
  },
  {
    image: '/images/mietwagen/hinweis-zusatzfahrer.jpg',
    title: 'Zusatzfahrer',
    text: 'Wer fahren soll, muss im Vertrag eingetragen sein. Buch Zusatzfahrer am besten gleich online mit – an der Station ist der Aufpreis meist teurer.',
  },
  {
    image: '/images/mietwagen/hinweis-grenze.jpg',
    title: 'Grenzübertritt',
    text: 'Nicht jeder Vermieter erlaubt Fahrten ins Ausland automatisch. Kläre vorab, in welche Länder du darfst – manchmal kommen Gebühren oder ein angepasster Versicherungsschutz dazu.',
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

        <div className="bh-grid">
          {HINTS.map((hint) => (
            <article key={hint.title} className="bh-card">
              <div className="bh-img" style={{ backgroundImage: `url(${hint.image})` }} aria-hidden="true" />
              <div className="bh-body">
                <h3 className="bh-title">{hint.title}</h3>
                <p className="bh-text">{hint.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .bh-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
          gap: 20px;
          margin-top: 40px;
        }
        .bh-card {
          background: #FFFFFF;
          border-radius: 18px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 2px 8px rgba(15,23,42,0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .bh-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(15,23,42,0.10); }
        .bh-img {
          position: relative;
          aspect-ratio: 16 / 9;
          background-size: cover;
          background-position: center 30%;
        }
        .bh-img::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 45%, rgba(255,255,255,0.75) 80%, #FFFFFF 100%);
        }
        .bh-body { padding: 4px 22px 24px; margin-top: -18px; position: relative; }
        .bh-title {
          font-family: var(--font-heading);
          font-size: 17px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 8px;
        }
        .bh-text { font-size: 13.5px; color: #64748B; line-height: 1.75; margin: 0; }
        @media (max-width: 560px) {
          .bh-img { aspect-ratio: 2 / 1; }
          .bh-body { padding: 4px 18px 20px; }
        }
      `}</style>
    </section>
  );
}
