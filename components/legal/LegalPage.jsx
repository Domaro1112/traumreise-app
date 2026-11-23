import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

// Einheitliches Layout für Impressum, Datenschutz, Nutzungsbedingungen und
// Affiliate-Hinweis.
//
// sections: [{ heading, intro?, blocks: [string | { list: string[] } | { sub: string }] }]

const HEADING_FONT = 'var(--font-heading, "Poppins", system-ui, sans-serif)';

function Block({ block }) {
  if (typeof block === 'string') {
    return <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, margin: '0 0 14px', whiteSpace: 'pre-line' }}>{block}</p>;
  }
  if (block.sub) {
    return <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '22px 0 8px', fontFamily: HEADING_FONT }}>{block.sub}</h3>;
  }
  if (block.list) {
    return (
      <ul style={{ margin: '0 0 14px', paddingLeft: '20px', color: '#475569', fontSize: '15px', lineHeight: 1.8 }}>
        {block.list.map((item, i) => <li key={i} style={{ marginBottom: '4px' }}>{item}</li>)}
      </ul>
    );
  }
  return null;
}

export default function LegalPage({ title, intro, updated, sections }) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', background: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ paddingTop: '72px', paddingBottom: '100px' }}>
          <Container size="sm">
            <h1 style={{ fontFamily: HEADING_FONT, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            {updated && <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 28px' }}>Stand: {updated}</p>}
            {intro && <p style={{ fontSize: '16px', color: '#334155', lineHeight: 1.8, margin: '0 0 36px' }}>{intro}</p>}

            <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: 'clamp(22px, 4vw, 40px)' }}>
              {sections.map((s, i) => (
                <section key={i} style={{ marginBottom: i === sections.length - 1 ? 0 : '34px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px', fontFamily: HEADING_FONT }}>
                    {s.heading}
                  </h2>
                  {(s.blocks ?? []).map((b, j) => <Block key={j} block={b} />)}
                </section>
              ))}
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
