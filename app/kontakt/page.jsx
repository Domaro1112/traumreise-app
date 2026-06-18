import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import ContactForm from '@/components/contact/ContactForm';
import ContactHeroImage from '@/components/contact/ContactHeroImage';

export const metadata = {
  title: 'Kontakt | ApeAround',
  description:
    'Kontaktiere ApeAround bei Fragen, Feedback, technischen Hinweisen, Presseanfragen oder Kooperationsideen.',
  openGraph: {
    title: 'Kontakt | ApeAround',
    description: 'Schreib uns — bei Fragen, Feedback, Technischem oder Kooperationen.',
    url: 'https://apearound.de/kontakt',
    siteName: 'ApeAround',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://apearound.de/#organization',
      name: 'ApeAround',
      url: 'https://apearound.de',
      logo: { '@type': 'ImageObject', url: 'https://apearound.de/images/logo/reisemonkey-logo.png' },
    },
    {
      '@type': 'ContactPage',
      '@id': 'https://apearound.de/kontakt',
      url: 'https://apearound.de/kontakt',
      name: 'Kontakt | ApeAround',
      description: 'Allgemeine Kontaktseite für Fragen, Feedback, Presse und Kooperationen.',
      isPartOf: { '@id': 'https://apearound.de/#organization' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Wie kann ich ApeAround kontaktieren?',
          acceptedAnswer: { '@type': 'Answer', text: 'Du kannst ApeAround über das Kontaktformular auf dieser Seite erreichen. Füll einfach das Formular aus und sende deine Anfrage — wir melden uns so schnell wie möglich zurück.' },
        },
        {
          '@type': 'Question',
          name: 'Kann ich Feedback zur Plattform senden?',
          acceptedAnswer: { '@type': 'Answer', text: 'Ja. Wähle beim Anliegen „Feedback" und beschreibe deinen Verbesserungsvorschlag oder deine Idee. Wir freuen uns über jedes Feedback.' },
        },
        {
          '@type': 'Question',
          name: 'Wo kann ich eine Kooperation anfragen?',
          acceptedAnswer: { '@type': 'Answer', text: 'Für Kooperationen, Hotels, Reiseanbieter und Affiliate-Partnerschaften gibt es eine eigene Seite: apearound.de/partner-werden. Alternativ kannst du auch das allgemeine Kontaktformular nutzen.' },
        },
        {
          '@type': 'Question',
          name: 'Kann ich technische Probleme melden?',
          acceptedAnswer: { '@type': 'Answer', text: 'Ja. Wähle beim Anliegen „Technisches Problem" und beschreibe, was nicht funktioniert. Wir schauen uns das schnellstmöglich an.' },
        },
        {
          '@type': 'Question',
          name: 'Wie schnell erhalte ich eine Antwort?',
          acceptedAnswer: { '@type': 'Answer', text: 'Wir bemühen uns, alle Anfragen innerhalb von 2–3 Werktagen zu beantworten.' },
        },
        {
          '@type': 'Question',
          name: 'Werden meine Angaben gespeichert?',
          acceptedAnswer: { '@type': 'Answer', text: 'Deine Angaben werden ausschließlich zur Bearbeitung deiner Anfrage gespeichert und verarbeitet. Weitere Informationen findest du in unserer Datenschutzerklärung.' },
        },
      ],
    },
  ],
};

const CONTACT_CARDS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: 'Allgemeine Fragen',
    text: 'Fragen zur Plattform, zur Nutzung oder zu ApeAround allgemein.',
    accent: '#0EA5E9',
    link: null,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Feedback & Ideen',
    text: 'Du hast Verbesserungsvorschläge oder eine Idee für neue Funktionen?',
    accent: '#06B6D4',
    link: null,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Kooperationen',
    text: 'Für Hotels, Reiseanbieter, Regionen und Partner gibt es zusätzlich unsere Partner-Seite.',
    accent: '#8B5CF6',
    link: { href: '/partner-werden', label: 'Zur Partner-Seite →' },
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: 'Technische Hinweise',
    text: 'Du hast einen Fehler entdeckt oder etwas funktioniert nicht wie erwartet?',
    accent: '#F59E0B',
    link: null,
  },
];

const FAQ_ITEMS = [
  { q: 'Wie kann ich ApeAround kontaktieren?', a: 'Über das Kontaktformular auf dieser Seite — einfach ausfüllen und absenden. Wir melden uns so schnell wie möglich zurück.' },
  { q: 'Kann ich Feedback zur Plattform senden?', a: 'Ja. Wähle beim Anliegen „Feedback" und beschreibe deinen Vorschlag oder deine Idee. Wir freuen uns über jedes Feedback.' },
  { q: 'Wo kann ich eine Kooperation anfragen?', a: 'Für Kooperationen gibt es eine eigene Seite: /partner-werden. Alternativ kannst du auch das allgemeine Kontaktformular nutzen.' },
  { q: 'Kann ich technische Probleme melden?', a: 'Ja. Wähle beim Anliegen „Technisches Problem" und beschreibe, was nicht funktioniert.' },
  { q: 'Wie schnell erhalte ich eine Antwort?', a: 'Wir bemühen uns, alle Anfragen innerhalb von 2–3 Werktagen zu beantworten.' },
  { q: 'Werden meine Angaben gespeichert?', a: 'Deine Angaben werden ausschließlich zur Bearbeitung deiner Anfrage gespeichert. Weitere Informationen findest du in der Datenschutzerklärung.' },
];

export default function KontaktPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          paddingTop: 'calc(80px + 80px)',
          paddingBottom: '80px',
          background: 'linear-gradient(135deg, #0F172A 0%, #12324a 60%, #0EA5E9 160%)',
          overflow: 'hidden',
          minHeight: 'clamp(520px, 65vh, 680px)',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: '5%', right: '-5%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.13) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: '-20%', left: '-8%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 340px', minWidth: 0, position: 'relative', zIndex: 2 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 16px', borderRadius: '40px', marginBottom: '24px',
                  background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.30)',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38BDF8', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                    Wir sind für dich da
                  </span>
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900,
                  lineHeight: 1.12, letterSpacing: '-0.03em',
                  color: '#FFFFFF', margin: '0 0 20px',
                  textShadow: '0 2px 16px rgba(0,0,0,0.25)',
                }}>
                  Kontakt zu{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #38BDF8 0%, #22D3EE 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    ApeAround
                  </span>
                </h1>

                <p style={{
                  fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#CBD5E1',
                  lineHeight: 1.7, margin: '0 0 36px', maxWidth: '520px',
                }}>
                  Du hast Fragen, Feedback oder möchtest mit ApeAround in Kontakt treten?
                  Schreib uns einfach — wir melden uns so schnell wie möglich zurück.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a href="#nachricht" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 26px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 700,
                    boxShadow: '0 6px 24px rgba(14,165,233,0.40)',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    Nachricht schreiben
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </a>
                  <a href="/partner-werden" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 26px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)',
                    color: '#E2E8F0', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 600,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    Partner werden
                  </a>
                </div>
              </div>

              <div style={{
                flex: '0 1 340px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', minHeight: '260px',
                position: 'relative', zIndex: 2,
              }}>
                <ContactHeroImage />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Kontaktarten ─────────────────────────────────────────── */}
        <section style={{ padding: '80px 0 60px', background: '#F8FAFC' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.02em',
              }}>
                Womit können wir dir helfen?
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', color: '#64748B', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
                Wähle unten das Anliegen aus — oder nutze das Formular direkt.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '18px',
            }}>
              {CONTACT_CARDS.map(({ icon, title, text, accent, link }) => {
                const rgb = accent === '#0EA5E9' ? '14,165,233'
                  : accent === '#06B6D4' ? '6,182,212'
                  : accent === '#8B5CF6' ? '139,92,246' : '245,158,11';
                return (
                  <div key={title} style={{
                    background: '#FFFFFF', borderRadius: '18px',
                    border: '1px solid #E2E8F0', padding: '26px 22px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: `rgba(${rgb}, 0.10)`, color: accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '16px',
                    }}>
                      {icon}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '15px', fontWeight: 700, color: '#0F172A',
                      margin: '0 0 8px',
                    }}>{title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>{text}</p>
                    {link && (
                      <a href={link.href} style={{
                        display: 'inline-block', marginTop: '12px',
                        fontSize: '13px', fontWeight: 600, color: accent,
                        textDecoration: 'none',
                      }}>
                        {link.label}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ── Kontaktformular ──────────────────────────────────────── */}
        <section id="nachricht" style={{ padding: '80px 0', background: '#FFFFFF' }}>
          <Container size="sm">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '40px', marginBottom: '16px',
                background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.20)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9' }}>
                  Kostenlos & unverbindlich
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.02em',
              }}>
                Schreib uns
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', color: '#64748B', maxWidth: '460px', margin: '0 auto', lineHeight: 1.65 }}>
                Wir lesen jede Nachricht und antworten so schnell wie möglich.
              </p>
            </div>

            <div style={{
              background: '#FFFFFF', borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(24px, 4vw, 40px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            }}>
              <ContactForm />
            </div>
          </Container>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 0 100px', background: '#F8FAFC' }}>
          <Container size="sm">
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.02em',
              }}>
                Häufige Fragen
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FAQ_ITEMS.map(({ q, a }) => (
                <div key={q} style={{
                  padding: '20px 22px', borderRadius: '14px',
                  border: '1.5px solid #E2E8F0', background: '#FFFFFF',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px',
                  }}>{q}</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>{a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
