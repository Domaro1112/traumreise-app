import {
  Plane, PenLine, Cpu, MapPin, Hotel,
  ExternalLink, Info, CheckCircle, Brain,
  Sparkles, ArrowRight, HelpCircle, Shield,
  X, Check, Users, Search,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import FaqAccordion from './FaqAccordion';
import HowItWorksImage from './HowItWorksImage';

export const metadata = {
  title: 'So funktioniert ApeAround | KI-Reiseplanung einfach erklärt',
  description:
    'Erfahre, wie ApeAround aus deinen Wünschen ein persönliches Reiseprofil erstellt und passende Reiseideen, Hotels und Anbieter vorschlägt.',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Bucht ApeAround die Reise direkt?',
      acceptedAnswer: { '@type': 'Answer', text: 'Nein. ApeAround hilft dir bei der Inspiration und Vorauswahl. Die Buchung erfolgt direkt beim jeweiligen Anbieter.' },
    },
    {
      '@type': 'Question',
      name: 'Sind die Hotelpreise live?',
      acceptedAnswer: { '@type': 'Answer', text: 'Preise und Verfügbarkeiten werden beim Anbieter geprüft. ApeAround leitet dich zur passenden Suche weiter.' },
    },
    {
      '@type': 'Question',
      name: 'Kostet ApeAround etwas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Die Nutzung der Reiseplanung ist kostenlos. Einige ausgehende Links können Affiliate-Links sein. Für dich entstehen keine Mehrkosten.' },
    },
    {
      '@type': 'Question',
      name: 'Warum bekomme ich mehrere Reisevorschläge?',
      acceptedAnswer: { '@type': 'Answer', text: 'Weil Urlaub selten nur eine richtige Antwort hat. ApeAround zeigt dir mehrere passende Richtungen, damit du vergleichen kannst.' },
    },
    {
      '@type': 'Question',
      name: 'Kann ich die Vorschläge direkt buchen?',
      acceptedAnswer: { '@type': 'Answer', text: 'Du kannst passende Angebote bei externen Partnern vergleichen und dort buchen.' },
    },
  ],
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'So findet ApeAround deine Traumreise',
  description:
    'ApeAround erstellt aus deinen Angaben ein persönliches Reiseprofil und schlägt passende Reiseziele mit Hotels und Anbietern vor.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Fragen beantworten',
      text: 'Beantworte wenige einfache Fragen zu Stimmung, Reisedauer, Budget und Interessen.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Reiseprofil entsteht',
      text: 'Die KI erstellt aus deinen Antworten ein persönliches Reiseprofil.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Vorschläge erhalten',
      text: 'Du erhältst mehrere passende Reisevorschläge mit Gründen, Highlights, Hotels und Anbietermöglichkeiten.',
    },
  ],
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const EYEBROW_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 16px',
  borderRadius: '20px',
  background: '#EFF6FF',
  border: '1px solid #BFDBFE',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#0284C7',
  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
  marginBottom: '16px',
};

const SECTION_H2 = {
  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
  fontSize: 'clamp(26px, 3.5vw, 40px)',
  fontWeight: 700,
  color: '#0F172A',
  margin: 0,
  lineHeight: 1.2,
};

export default function SoFunktionierts() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, howToJsonLd]) }}
      />
      <Header />
      <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>

        {/* ────────────────────────────────────────────────────────────────
            A. HERO
        ──────────────────────────────────────────────────────────────── */}
        <section style={{
          paddingTop: 'clamp(110px, 14vw, 150px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
          background: 'linear-gradient(160deg, #F0F9FF 0%, #ECFEFF 40%, #F8FAFF 100%)',
          overflow: 'hidden',
        }}>
          <Container>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
              gap: 'clamp(40px, 6vw, 80px)',
              alignItems: 'center',
            }}>
              {/* Text */}
              <div>
                <div style={{
                  ...EYEBROW_STYLE,
                  background: 'rgba(14,165,233,0.10)',
                  border: '1px solid rgba(14,165,233,0.22)',
                }}>
                  <Sparkles size={12} strokeWidth={2} />
                  KI-Reiseplanung
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(28px, 4.5vw, 52px)',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '20px',
                }}>
                  So findet ApeAround{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    deine passende Traumreise
                  </span>
                </h1>

                <p style={{
                  fontSize: 'clamp(15px, 1.9vw, 18px)',
                  color: '#475569',
                  lineHeight: 1.75,
                  marginBottom: '36px',
                  maxWidth: '520px',
                }}>
                  Unser KI-Reiseplaner verbindet deine Wünsche, dein Reisegefühl und passende Reiseideen zu einem persönlichen Vorschlag — schnell, einfach und inspirierend.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Button href="/#reiseplaner" size="lg">
                    <Plane size={17} strokeWidth={2} />
                    Traumreise starten
                  </Button>
                  <Button href="#auswertung" variant="ghost" size="lg">
                    Wie die Auswertung funktioniert
                    <ArrowRight size={15} strokeWidth={2} />
                  </Button>
                </div>
              </div>

              {/* Hero Image */}
              <HowItWorksImage
                src="/images/how-it-works/reisemonkey-ki-reiseplanung.png"
                alt="ApeAround KI-Reiseplanung – Dein persönliches Reiseprofil entsteht"
                loading="eager"
                style={{ maxWidth: '500px', width: '100%', margin: '0 auto', aspectRatio: '4/3' }}
              />
            </div>
          </Container>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            B. 3-SCHRITTE
        ──────────────────────────────────────────────────────────────── */}
        <section style={{
          background: '#FFFFFF',
          paddingTop: 'clamp(64px, 8vw, 96px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
        }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={EYEBROW_STYLE}>Wie es funktioniert</div>
              <h2 style={{ ...SECTION_H2, marginBottom: '16px' }}>
                In 3 Schritten zu deiner Reiseidee
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                color: '#64748B',
                lineHeight: 1.75,
                maxWidth: '560px',
                margin: '0 auto',
              }}>
                Kein stundenlanges Suchen, kein Formular-Chaos. Du erzählst uns, was du dir wünschst — wir zeigen dir, wohin es gehen könnte.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
            }}>
              {[
                {
                  n: '1',
                  img: '/images/how-it-works/step-1-fragen.png',
                  imgAlt: 'Schritt 1: Reisewünsche eingeben',
                  title: 'Du erzählst uns, wonach sich dein Urlaub anfühlen soll',
                  text: 'Statt dich durch hunderte Angebote zu klicken, beantwortest du wenige einfache Fragen zu Stimmung, Reisedauer, Budget und Interessen.',
                },
                {
                  n: '2',
                  img: '/images/how-it-works/step-2-analyse.png',
                  imgAlt: 'Schritt 2: KI-Analyse erstellt Reiseprofil',
                  title: 'ApeAround erstellt daraus dein persönliches Reiseprofil',
                  text: 'Die KI erkennt Muster in deinen Antworten und ordnet sie einem persönlichen Reisetyp zu — zum Beispiel Erholung, Abenteuer, Kultur, Familie, Romantik oder Natur.',
                },
                {
                  n: '3',
                  img: '/images/how-it-works/step-3-ergebnis.png',
                  imgAlt: 'Schritt 3: Persönliche Reisevorschläge erhalten',
                  title: 'Du bekommst passende Reisevorschläge',
                  text: 'Du erhältst mehrere Vorschläge mit Gründen, Highlights, passenden Unterkunftsideen und direkten Vergleichsmöglichkeiten bei Reiseanbietern.',
                },
              ].map(({ n, Icon, img, imgAlt, title, text }) => (
                <div key={n} style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '24px',
                  padding: '32px 28px',
                  boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s',
                }}>
                  {/* Step indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#fff',
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      boxShadow: '0 4px 16px rgba(14,165,233,0.35)',
                      flexShrink: 0,
                    }}>{n}</div>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={20} strokeWidth={1.5} color="#0EA5E9" />
                    </div>
                  </div>

                  {/* Step image */}
                  <HowItWorksImage
                    src={img}
                    alt={imgAlt}
                    variant="step"
                  />

                  {/* Text */}
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: 'clamp(16px, 2vw, 19px)',
                      fontWeight: 700,
                      color: '#0F172A',
                      marginBottom: '10px',
                      lineHeight: 1.3,
                    }}>{title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.75, margin: 0 }}>
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            C. SYSTEM-ERKLÄRUNG
        ──────────────────────────────────────────────────────────────── */}
        <section
          id="system"
          style={{
            background: 'linear-gradient(160deg, #F0F9FF 0%, #F8FAFF 100%)',
            paddingTop: 'clamp(64px, 8vw, 96px)',
            paddingBottom: 'clamp(64px, 8vw, 96px)',
            scrollMarginTop: '100px',
          }}
        >
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={EYEBROW_STYLE}>Hinter den Kulissen</div>
              <h2 style={{ ...SECTION_H2, marginBottom: '16px' }}>
                Das System hinter ApeAround
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                color: '#64748B',
                lineHeight: 1.75,
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                ApeAround kombiniert deine Angaben nicht zu einer starren Pauschalreise, sondern zu einer persönlichen Orientierung. Die KI bewertet, welche Reiseziele, Unterkunftsarten und Reiseideen besonders gut zu deinem Profil passen.
              </p>
            </div>

            {/* Flow steps */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '48px',
              alignItems: 'stretch',
            }}>
              {[
                { n: '1', Icon: PenLine,     label: 'Deine Antworten',        color: '#0EA5E9', bg: '#EFF6FF',  border: '#BFDBFE' },
                { n: '2', Icon: Users,        label: 'Persönliches Reiseprofil', color: '#0284C7', bg: '#F0F9FF',  border: '#BAE6FD' },
                { n: '3', Icon: Cpu,          label: 'KI-Analyse',             color: '#06B6D4', bg: '#ECFEFF',  border: '#A5F3FC' },
                { n: '4', Icon: MapPin,       label: 'Top-Reisevorschläge',    color: '#0EA5E9', bg: '#EFF6FF',  border: '#BFDBFE' },
                { n: '5', Icon: Hotel,        label: 'Hotels & Anbieter',      color: '#0369A1', bg: '#F0F9FF',  border: '#BAE6FD' },
                { n: '6', Icon: CheckCircle,  label: 'Entscheidung treffen',   color: '#059669', bg: '#F0FDF4',  border: '#BBF7D0' },
              ].map(({ n, Icon, label, color, bg, border }) => (
                <div key={n} style={{
                  background: '#FFFFFF',
                  border: `1.5px solid ${border}`,
                  borderRadius: '20px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(15,23,42,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: `${color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    color,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>{n}</div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={22} strokeWidth={1.5} color={color} />
                  </div>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    lineHeight: 1.4,
                    margin: 0,
                  }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Transparency note */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #BFDBFE',
              borderRadius: '16px',
              padding: '20px 24px',
              maxWidth: '740px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Info size={18} strokeWidth={1.5} color="#0284C7" />
              </div>
              <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: '#0F172A' }}>Wichtig:</strong>{' '}
                ApeAround hilft dir bei der Orientierung. Die konkrete Buchung erfolgt beim jeweiligen Anbieter. Verfügbarkeiten und Preise werden dort geprüft.
              </p>
            </div>
          </Container>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            D. AUSWERTUNGSBEREICH
        ──────────────────────────────────────────────────────────────── */}
        <section
          id="auswertung"
          style={{
            background: '#FFFFFF',
            paddingTop: 'clamp(64px, 8vw, 96px)',
            paddingBottom: 'clamp(64px, 8vw, 96px)',
            scrollMarginTop: '100px',
          }}
        >
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={EYEBROW_STYLE}>Dein Ergebnis</div>
              <h2 style={{ ...SECTION_H2, marginBottom: '16px' }}>
                Was du in deiner Auswertung bekommst
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                color: '#64748B',
                lineHeight: 1.75,
                maxWidth: '520px',
                margin: '0 auto',
              }}>
                Deine Auswertung ist keine Pauschalantwort, sondern ein persönlicher Überblick — mit mehreren Optionen zum Vergleichen.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}>
              {[
                {
                  Icon: MapPin,
                  title: 'Top-Reiseziele',
                  text: 'Du bekommst mehrere passende Vorschläge statt nur einer pauschalen Antwort.',
                  color: '#0EA5E9',
                  bg: '#EFF6FF',
                  border: '#BFDBFE',
                },
                {
                  Icon: HelpCircle,
                  title: 'Warum diese Reise passt',
                  text: 'ApeAround erklärt, warum ein Ziel zu deinen Antworten passt.',
                  color: '#0284C7',
                  bg: '#F0F9FF',
                  border: '#BAE6FD',
                },
                {
                  Icon: Sparkles,
                  title: 'Highlights & Reisegefühl',
                  text: 'Du erkennst sofort, ob die Reise eher nach Erholung, Abenteuer, Kultur, Natur oder Familie klingt.',
                  color: '#06B6D4',
                  bg: '#ECFEFF',
                  border: '#A5F3FC',
                },
                {
                  Icon: Hotel,
                  title: 'Hotels & Anbieter',
                  text: 'Du kannst passende Hotels oder Angebote bei verschiedenen Partnern vergleichen.',
                  color: '#0369A1',
                  bg: '#F0F9FF',
                  border: '#BAE6FD',
                },
                {
                  Icon: ExternalLink,
                  title: 'Direkte Weiterleitung',
                  text: 'Wenn du dich für einen Anbieter entscheidest, wirst du zur passenden Suche weitergeleitet.',
                  color: '#059669',
                  bg: '#F0FDF4',
                  border: '#BBF7D0',
                },
              ].map(({ Icon, title, text, color, bg, border }) => (
                <div key={title} style={{
                  background: '#FFFFFF',
                  border: `1.5px solid ${border}`,
                  borderRadius: '20px',
                  padding: '28px 24px',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={22} strokeWidth={1.5} color={color} />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: 'clamp(15px, 1.8vw, 17px)',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                  }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.75, margin: 0 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            E. AFFILIATE-TRANSPARENZ
        ──────────────────────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF7ED 100%)',
          paddingTop: 'clamp(48px, 6vw, 72px)',
          paddingBottom: 'clamp(48px, 6vw, 72px)',
          borderTop: '1px solid #FED7AA',
          borderBottom: '1px solid #FED7AA',
        }}>
          <Container>
            <div style={{
              maxWidth: '760px',
              margin: '0 auto',
              display: 'flex',
              gap: '28px',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '1.5px solid #FED7AA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(249,115,22,0.12)',
              }}>
                <Shield size={24} strokeWidth={1.5} color="#F97316" />
              </div>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '12px',
                  marginTop: 0,
                }}>
                  Wie ApeAround kostenlos bleiben kann
                </h2>
                <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, margin: 0 }}>
                  Einige Links auf ApeAround können sogenannte Affiliate-Links sein. Wenn du über einen solchen Link zu einem Anbieter wechselst und dort buchst, kann ApeAround eine Provision erhalten.{' '}
                  <strong style={{ color: '#0F172A' }}>Für dich bleibt der Preis gleich</strong>{' '}
                  — du zahlst beim Anbieter genauso viel wie ohne diesen Link.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            F. WARUM APEAROUND ANDERS IST
        ──────────────────────────────────────────────────────────────── */}
        <section style={{
          background: '#FFFFFF',
          paddingTop: 'clamp(64px, 8vw, 96px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
        }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={EYEBROW_STYLE}>Der Unterschied</div>
              <h2 style={SECTION_H2}>Warum ApeAround anders ist</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '24px',
              maxWidth: '840px',
              margin: '0 auto',
            }}>
              {/* Klassische Suche */}
              <div style={{
                background: '#F8FAFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '24px',
                padding: '32px 28px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Search size={18} strokeWidth={1.5} color="#64748B" />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#475569',
                    margin: 0,
                  }}>Klassische Reisesuche</h3>
                </div>
                {[
                  'Du musst Ziel, Hotel und Zeitraum oft schon kennen',
                  'Viele Filter, viele Tabs',
                  'Hunderte Angebote ohne persönliche Einordnung',
                  'Du entscheidest ohne Orientierung',
                  'Keine Empfehlung zu deinem Reisestil',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      <X size={10} strokeWidth={2.5} color="#94A3B8" />
                    </div>
                    <span style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* ApeAround */}
              <div style={{
                background: 'linear-gradient(160deg, #EFF6FF 0%, #ECFEFF 100%)',
                border: '2px solid #BFDBFE',
                borderRadius: '24px',
                padding: '32px 28px',
                boxShadow: '0 8px 40px rgba(14,165,233,0.10)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(14,165,233,0.30)',
                  }}>
                    <Sparkles size={18} strokeWidth={1.5} color="#FFFFFF" />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                  }}>ApeAround</h3>
                </div>
                {[
                  'Startet bei deinem Reisewunsch, nicht bei Suchfeldern',
                  'Erkennt dein Reisegefühl und deinen Reisetyp',
                  'Macht persönliche Vorschläge mit Begründung',
                  'Erklärt, warum ein Ziel zu dir passt',
                  'Führt dich danach zu passenden Anbietern',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(14,165,233,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      <Check size={10} strokeWidth={2.5} color="#0EA5E9" />
                    </div>
                    <span style={{ fontSize: '14px', color: '#0F172A', lineHeight: 1.65 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            G. FAQ
        ──────────────────────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(160deg, #F0F9FF 0%, #F8FAFF 100%)',
          paddingTop: 'clamp(64px, 8vw, 96px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
        }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={EYEBROW_STYLE}>Häufige Fragen</div>
              <h2 style={SECTION_H2}>Deine Fragen — unsere Antworten</h2>
            </div>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <FaqAccordion />
            </div>
          </Container>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            H. ABSCHLUSS-CTA
        ──────────────────────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 50%, #06B6D4 100%)',
          paddingTop: 'clamp(64px, 8vw, 96px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
          textAlign: 'center',
        }}>
          <Container>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(24px, 3.5vw, 38px)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '16px',
                lineHeight: 1.2,
              }}>
                Bereit für deine persönliche Reiseidee?
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.75,
                marginBottom: '36px',
              }}>
                Beantworte ein paar Fragen und lass ApeAround passende Reiseideen für dich finden. Je aussagekräftiger, desto besser deine Vorschläge.
              </p>
              <Button
                href="/#reiseplaner"
                size="lg"
                style={{
                  background: '#FFFFFF',
                  color: '#0284C7',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
                  fontWeight: 700,
                }}
              >
                <Plane size={17} strokeWidth={2} />
                Jetzt Traumurlaub finden
              </Button>
              <p style={{
                marginTop: '18px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.50)',
              }}>
                Kostenlos · Keine Anmeldung · Sofortige Ergebnisse
              </p>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
