import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';

// Farbe je Karte (Linie oben, Link-Farbe, Ersatz-Verlauf ohne Bild)
const TIP_ACCENTS = [
  { color: '#0EA5E9', fallback: 'linear-gradient(135deg,#BAE6FD,#7DD3FC)' },
  { color: '#F97316', fallback: 'linear-gradient(135deg,#FED7AA,#FDBA74)' },
  { color: '#16A34A', fallback: 'linear-gradient(135deg,#BBF7D0,#86EFAC)' },
  { color: '#7C3AED', fallback: 'linear-gradient(135deg,#DDD6FE,#C4B5FD)' },
];

export default function CommunityTips({ tips }) {
  return (
    <section
      style={{
        background: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <SectionTitle
          label="Insider-Wissen"
          title="Smarter reisen mit"
          titleHighlight="diesen Tipps"
          subtitle="Bewährte Strategien – günstiger, besser und mit mehr Spaß reisen."
        />

        <div className="community-tips">
          {tips.map((tip, i) => {
            const accent = TIP_ACCENTS[i % TIP_ACCENTS.length];

            return (
              <Link
                key={i}
                href={tip.link}
                className="community-tip-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {/* Bild (Farbverlauf als Ersatz, solange kein Bild vorhanden ist) */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <div
                    className="community-tip-img"
                    style={{
                      aspectRatio: '16 / 10',
                      backgroundImage: tip.image ? `url('${tip.image}'), ${accent.fallback}` : accent.fallback,
                      backgroundSize: 'cover, cover',
                      backgroundPosition: 'center, center',
                    }}
                  />
                  <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '3px', background: accent.color }} />
                </div>

                <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#0F172A',
                      margin: '0 0 10px',
                      lineHeight: 1.3,
                    }}
                  >
                    {tip.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748B',
                      lineHeight: 1.7,
                      margin: '0 0 18px',
                      flex: 1,
                    }}
                  >
                    {tip.tip}
                  </p>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: accent.color,
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}
                  >
                    {tip.linkLabel} <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
