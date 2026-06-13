import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export const metadata = {
  title: 'Impressum – Traumreise',
  description: 'Impressum und rechtliche Angaben von Traumreise.',
};

export default function Impressum() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', background: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '100px' }}>
          <Container size="sm">
            <h1
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '48px',
                letterSpacing: '-0.02em',
              }}
            >
              Impressum
            </h1>

            <div
              style={{
                background: '#F8FAFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '36px',
              }}
            >
              {[
                { label: 'Angaben gemäß § 5 TMG', value: 'ApeAround\nMarkus Rothke\n[Straße Hausnummer]\nFreudenberg' },
                { label: 'Kontakt', value: 'E-Mail: kontakt@ApeAround.de\nTelefon: +49 (0) XXX XXXXXXXX' },
                { label: 'Umsatzsteuer-ID', value: 'USt-IdNr.: DE XXXXXXXXX' },
                { label: 'Verantwortlich für den Inhalt', value: 'Markus Rothke\n[Adresse wie oben]' },
                { label: 'Streitschlichtung', value: 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.' },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: '28px' }}>
                  <h2
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#0EA5E9',
                      marginBottom: '10px',
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}
                  >
                    {item.label}
                  </h2>
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#475569',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {item.value}
                  </p>
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
