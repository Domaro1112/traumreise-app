import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Über uns – Traumreise',
  description: 'Wir sind ein Team von Reise-Enthusiasten und KI-Experten. Unser Ziel: die perfekte Reise für jeden.',
};

export default function UeberUns() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '100px' }}>
          <Container size="sm">
            <SectionTitle
              label="Über uns"
              title="Traumreisen für"
              titleHighlight="echte Menschen"
              subtitle="Wir glauben, dass jeder eine Reise verdient, die wirklich zu ihm passt."
            />

            <div
              style={{
                background: '#F8FAFF',
                border: '1px solid #E2E8F0',
                borderRadius: '24px',
                padding: 'clamp(32px, 5vw, 56px)',
                marginBottom: '40px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(20px, 3vw, 26px)',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '20px',
                }}
              >
                Unsere Mission
              </h2>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                Traumreise wurde gegründet, weil wir es leid waren, stundenlang in Reisebüros zu sitzen oder
                unzählige Webseiten zu vergleichen – nur um am Ende mit einem Standardpaket abzureisen, das
                sich wie eine Massenware anfühlt.
              </p>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                Wir nutzen modernste KI-Technologie, um deine Persönlichkeit, deine Wünsche und deinen Stil
                zu verstehen – und finden dann das Reiseziel, das wirklich zu dir passt. Inkl. Hotels,
                Flügen und Aktivitäten.
              </p>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8 }}>
                Das alles{' '}
                <strong style={{ color: '#0EA5E9', fontWeight: 700 }}>100% kostenlos</strong> und ohne
                versteckte Gebühren. Wir verdienen durch Partner-Provisionen, wenn du über unsere Links
                buchst – ohne Mehrkosten für dich.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '48px',
              }}
            >
              {[
                { number: '50.000+', label: 'Reisen geplant' },
                { number: '4,8/5', label: 'Bewertung' },
                { number: '120+', label: 'Reiseziele' },
                { number: '100%', label: 'Kostenlos' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: 'center',
                    padding: '28px 20px',
                    borderRadius: '16px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '32px',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '8px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button href="/finder" size="lg">
                Jetzt deine Traumreise finden ✈️
              </Button>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
