import Container from '@/components/layout/Container';

const LINKS = [
  {
    href: '/reiseziele',
    label: 'Reiseziele entdecken',
    text: 'Inspiration für dein nächstes Ziel – mit Beschreibungen, Reisetipps und Empfehlungen.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    href: '/reiseblog',
    label: 'Reiseblog lesen',
    text: 'Berichte, Routen und Erfahrungen anderer Reisender – für Ideen und Einblicke.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: '/motorradurlaub/planen',
    label: 'Motorradurlaub planen',
    text: 'Bald verfügbar: der ApeAround-Planungsbereich speziell für Motorradreisende.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17l4-8 4 4 4-6 4 10" /><path d="M21 17H3" />
      </svg>
    ),
    comingSoon: true,
  },
];

export default function MotorcycleInternalLinks() {
  return (
    <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '64px' }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Weitere Bereiche auf ApeAround
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {LINKS.map(({ href, label, text, icon, comingSoon }) => {
          const Tag = comingSoon ? 'div' : 'a';
          const linkProps = comingSoon
            ? {}
            : { href, style: { textDecoration: 'none' } };
          return (
            <Tag
              key={href}
              {...linkProps}
              style={{
                display: 'block',
                padding: '24px 22px',
                borderRadius: '16px',
                background: '#F8FAFF',
                border: '1px solid #E2E8F0',
                textDecoration: 'none',
                opacity: comingSoon ? 0.65 : 1,
                cursor: comingSoon ? 'default' : 'pointer',
                ...(comingSoon ? {} : { textDecoration: 'none' }),
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '12px',
                background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0EA5E9',
                marginBottom: '16px',
              }}>
                {icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0F172A',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}>
                  {label}
                </p>
                {comingSoon && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                    borderRadius: '20px', background: '#EFF6FF',
                    color: '#0EA5E9', border: '1px solid #BFDBFE',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    Bald
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
                {text}
              </p>
            </Tag>
          );
        })}
        </div>
      </Container>
    </section>
  );
}
