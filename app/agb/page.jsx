import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export const metadata = {
  title: 'AGB | Reisemonkey',
  description: 'Allgemeine Geschäftsbedingungen von Reisemonkey.',
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    heading: '§ 1 Geltungsbereich',
    items: [
      'Reisemonkey (reisemonkey.de) ist eine unabhängige Reise-Inspirations- und Vergleichsplattform.',
      'Reisemonkey vermittelt keine Reisen, Hotels, Flüge, Mietwagen oder Aktivitäten und erbringt selbst keine Reiseleistungen.',
      'Durch die Nutzung von Reisemonkey kommt kein Reisevertrag zwischen dem Nutzer und Reisemonkey zustande.',
      'Diese Allgemeinen Geschäftsbedingungen regeln das Nutzungsverhältnis zwischen dem Nutzer und dem Betreiber von Reisemonkey.',
    ],
  },
  {
    heading: '§ 2 Leistungen von Reisemonkey',
    intro: 'Reisemonkey stellt folgende Leistungen kostenlos zur Verfügung:',
    list: [
      'Bereitstellung redaktioneller Reiseinformationen und Reisetipps',
      'Reiseinspirationen und Destinationsempfehlungen',
      'KI-gestützte, personalisierte Reisevorschläge',
      'Vergleich und Gegenüberstellung externer Reiseanbieter',
      'Weiterleitung zu externen Buchungsplattformen über Affiliate-Links',
    ],
    outro: 'Die Leistungen von Reisemonkey sind unverbindlich und dienen ausschließlich der Inspiration und Orientierung.',
  },
  {
    heading: '§ 3 Vertragsverhältnis bei Buchungen',
    items: [
      'Klickt ein Nutzer auf einen Affiliate-Link und bucht ein Reiseprodukt bei einem externen Anbieter, kommt ein Vertrag ausschließlich zwischen dem Nutzer und dem jeweiligen externen Anbieter zustande.',
      'Reisemonkey ist nicht Vertragspartei solcher Buchungen und übernimmt weder Rechte noch Pflichten aus diesen Verträgen.',
      'Für Stornierungen, Umbuchungen, Reklamationen oder sonstige Ansprüche aus gebuchten Reiseleistungen ist ausschließlich der jeweilige Anbieter zuständig.',
    ],
  },
  {
    heading: '§ 4 Preise und Verfügbarkeit',
    items: [
      'Alle Preis- und Verfügbarkeitsangaben auf Reisemonkey sind unverbindlich und können sich jederzeit ohne vorherige Ankündigung ändern.',
      'Reisemonkey übernimmt keine Gewähr für die Aktualität, Richtigkeit oder Vollständigkeit der angezeigten Preis- und Verfügbarkeitsdaten.',
      'Maßgeblich sind stets die Angaben des jeweiligen Anbieters zum Zeitpunkt der Buchung.',
    ],
  },
  {
    heading: '§ 5 Haftung',
    items: [
      'Reisemonkey haftet nicht für die Inhalte, Leistungen oder das Verhalten externer Anbieter, zu denen über Affiliate-Links weitergeleitet wird.',
      'Reisemonkey haftet nicht für Schäden, die aus Buchungen, Stornierungen, Leistungsänderungen oder der Nichtdurchführung von Reisen durch externe Anbieter entstehen.',
      'Eine Haftung von Reisemonkey besteht nur bei vorsätzlichem oder grob fahrlässigem Handeln. Bei leichter Fahrlässigkeit haftet Reisemonkey nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), und in diesem Fall begrenzt auf den vorhersehbaren vertragstypischen Schaden.',
      'Die Haftungsbeschränkung gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Ansprüche nach dem Produkthaftungsgesetz.',
    ],
  },
  {
    heading: '§ 6 Affiliate-Links und Werbung',
    items: [
      'Reisemonkey betreibt Affiliate-Partnerschaften mit externen Reiseanbietern. Bei Klicks auf bestimmte Links und daraus resultierenden Buchungen kann Reisemonkey eine Provisionsvergütung erhalten.',
      'Für den Nutzer entstehen durch die Nutzung von Affiliate-Links keine zusätzlichen Kosten. Der Preis für ein Reiseprodukt ist für den Nutzer identisch, unabhängig davon, ob er den Link über Reisemonkey oder direkt beim Anbieter aufruft.',
      'Affiliate-Links und kommerzielle Inhalte sind auf Reisemonkey entsprechend gekennzeichnet.',
    ],
  },
  {
    heading: '§ 7 KI-gestützte Reisevorschläge',
    items: [
      'Reisemonkey nutzt Technologien künstlicher Intelligenz, um personalisierte Reisevorschläge zu erstellen. Die Empfehlungen werden auf Basis der vom Nutzer angegebenen Präferenzen automatisiert generiert.',
      'Die KI-Reisevorschläge dienen ausschließlich der Inspiration und sind unverbindlich. Sie stellen keine Reisevermittlung und keine verbindliche Buchungsempfehlung dar.',
      'Reisemonkey übernimmt keine Garantie für die Vollständigkeit, Eignung, Richtigkeit oder Aktualität der generierten Empfehlungen.',
      'Der Nutzer ist selbst dafür verantwortlich, reiserelevante Informationen wie Einreisebestimmungen, Reisewarnungen oder Gesundheitshinweise bei offiziellen Stellen zu überprüfen.',
    ],
  },
  {
    heading: '§ 8 Datenschutz',
    items: [
      'Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung von Reisemonkey, die jederzeit unter /datenschutz abrufbar ist.',
    ],
  },
  {
    heading: '§ 9 Schlussbestimmungen',
    items: [
      'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.',
      'Ist der Nutzer Verbraucher mit Wohnsitz in einem anderen EU-Mitgliedstaat, gelten zusätzlich die zwingenden Verbraucherschutzvorschriften seines Heimatlandes.',
      'Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt (salvatorische Klausel). Die unwirksame Bestimmung ist durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.',
      'Gerichtsstand für Kaufleute sowie für Personen ohne allgemeinen Gerichtsstand in Deutschland ist der Sitz von Reisemonkey.',
    ],
  },
];

const headingStyle = {
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#0EA5E9',
  marginBottom: '10px',
  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
};

const textStyle = {
  fontSize: '15px',
  color: '#475569',
  lineHeight: 1.8,
  margin: '0 0 10px',
};

export default function AgbPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '100px' }}>
          <Container size="sm">
            <h1
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              Allgemeine Geschäftsbedingungen (AGB)
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '48px' }}>
              Letzte Aktualisierung: 11. Juni 2026
            </p>

            <div
              style={{
                background: '#F8FAFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '36px',
              }}
            >
              {SECTIONS.map((section, i) => (
                <div
                  key={section.heading}
                  style={{ marginBottom: i < SECTIONS.length - 1 ? '36px' : 0 }}
                >
                  <h2 style={headingStyle}>{section.heading}</h2>

                  {section.intro && (
                    <p style={textStyle}>{section.intro}</p>
                  )}

                  {section.list && (
                    <ul style={{ margin: '0 0 10px', paddingLeft: '20px' }}>
                      {section.list.map((item, j) => (
                        <li key={j} style={{ ...textStyle, margin: '0 0 4px' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.outro && (
                    <p style={textStyle}>{section.outro}</p>
                  )}

                  {section.items?.map((item, j) => (
                    <p key={j} style={textStyle}>{item}</p>
                  ))}
                </div>
              ))}
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
