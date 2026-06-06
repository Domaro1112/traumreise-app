import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export const metadata = {
  title: 'Datenschutz – Traumreise',
  description: 'Datenschutzerklärung von Traumreise. Wir nehmen den Schutz deiner Daten ernst.',
};

export default function Datenschutz() {
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
              Datenschutzerklärung
            </h1>
            <p style={{ color: '#94A3B8', marginBottom: '48px', fontSize: '14px' }}>
              Stand: Januar 2024
            </p>

            {[
              {
                title: '1. Verantwortlicher',
                content:
                  'Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Traumreise, [Adresse], [Stadt]. Kontakt: datenschutz@traumreise.de',
              },
              {
                title: '2. Erhebung und Verarbeitung von Daten',
                content:
                  'Wir erheben nur die Daten, die für den Betrieb unseres Dienstes notwendig sind. Dazu gehören: E-Mail-Adresse (bei Newsletter-Anmeldung), anonyme Nutzungsdaten zur Verbesserung unseres Angebots.',
              },
              {
                title: '3. Newsletter',
                content:
                  'Wenn du unseren Newsletter abonnierst, speichern wir deine E-Mail-Adresse. Du kannst dich jederzeit abmelden. Deine Daten werden nicht an Dritte weitergegeben.',
              },
              {
                title: '4. Cookies',
                content:
                  'Wir verwenden nur technisch notwendige Cookies. Keine Tracking- oder Werbe-Cookies ohne deine ausdrückliche Zustimmung.',
              },
              {
                title: '5. Deine Rechte',
                content:
                  'Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten. Wende dich dazu an datenschutz@traumreise.de.',
              },
            ].map((section) => (
              <div
                key={section.title}
                style={{
                  marginBottom: '36px',
                  paddingBottom: '36px',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '12px',
                  }}
                >
                  {section.title}
                </h2>
                <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
                  {section.content}
                </p>
              </div>
            ))}
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
