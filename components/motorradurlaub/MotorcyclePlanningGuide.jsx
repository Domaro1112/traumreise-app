import Container from '@/components/layout/Container';

const PLANNING_POINTS = [
  {
    number: '01',
    question: 'Wie viele Kilometer pro Tag sind realistisch?',
    answer: '200 bis 350 km pro Tag sind für die meisten Motorradreisenden angenehm. Auf kurvenreichen Alpenstrecken kann schon weniger eine volle Tagesetappe bedeuten. Lieber kürzer und genussvoll fahren als hastig und erschöpft ankommen.',
  },
  {
    number: '02',
    question: 'Welche Route passt zum Fahrlevel?',
    answer: 'Pässe und enge Serpentinen verlangen Erfahrung und Konzentration. Für Einsteiger und Wiedereinsteiger eignen sich zunächst flachere Routen mit weniger Kurvenintensität. Mit wachsender Erfahrung steigt auch die Freude an anspruchsvolleren Strecken.',
  },
  {
    number: '03',
    question: 'Wie wichtig sind Kurven, Landschaft oder Entspannung?',
    answer: 'Jeder Motorradfahrer fährt anders. Für manche ist die kurvenreiche Strecke das Ziel, für andere die Aussicht oder die Ruhe am Zielort. Die Prioritäten bestimmen, welche Route und welches Reiseziel wirklich passen.',
  },
  {
    number: '04',
    question: 'Welche Unterkunft passt?',
    answer: 'Ein gesicherter Unterstellplatz, ein trockener Raum für die Ausrüstung und eine gute Erreichbarkeit sind die wichtigsten Kriterien. Bikerhotels, Pensionen mit Garage und Campingplätze direkt an der Strecke sind besonders beliebt.',
  },
  {
    number: '05',
    question: 'Wie viel Gepäck ist sinnvoll?',
    answer: 'Weniger ist mehr. Koffer, Tankrucksack und eine kleine Satteltasche reichen für die meisten Touren. Wasserabweisende Materialien schützen vor unerwarteten Schauern. Was nicht passt oder nicht gebraucht wird, bleibt besser zuhause.',
  },
  {
    number: '06',
    question: 'Welche Reisezeit ist ideal?',
    answer: 'In Mitteleuropa läuft die Motorradsaison von Mai bis Oktober. Alpenpässe öffnen je nach Wetter ab Mai oder Juni. Früh in der Saison und im Herbst ist es ruhiger auf den Strecken – dafür kühler am Morgen. Die richtige Zeit hängt vom Ziel und persönlichen Vorlieben ab.',
  },
];

export default function MotorcyclePlanningGuide() {
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
            Planungshilfe
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
            Was bei einem Motorradurlaub wichtig ist
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {PLANNING_POINTS.map(({ number, question, answer }) => (
            <div
              key={number}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '28px 24px',
              }}
            >
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#0EA5E9',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                marginBottom: '12px',
              }}>
                {number}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: '15px',
                fontWeight: 700,
                color: '#0F172A',
                margin: '0 0 12px',
                lineHeight: 1.35,
              }}>
                {question}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.70, margin: 0 }}>
                {answer}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
