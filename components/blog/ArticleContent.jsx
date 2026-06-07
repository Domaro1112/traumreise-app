import { Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function ArticleContent({ sections, internalLinks }) {
  if (!sections?.length) return null;

  return (
    <article className="article-prose">
      {sections.map((section, sectionIndex) => {
        const sectionId = section.id || `section-${sectionIndex + 1}`;
        return (
        <section key={sectionId} id={sectionId} style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(20px, 2.5vw, 26px)',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #EFF6FF',
            }}
          >
            {section.heading}
          </h2>

          {/* Render multi-paragraph content */}
          {section.content.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: '16px',
                color: '#334155',
                lineHeight: 1.85,
                marginBottom: '16px',
              }}
            >
              {para}
            </p>
          ))}

          {/* Optional tip callout */}
          {section.tip && (
            <div
              style={{
                display: 'flex',
                gap: '14px',
                padding: '18px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF7ED 100%)',
                border: '1px solid #FDE68A',
                marginTop: '20px',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                <Lightbulb size={20} strokeWidth={2} color="#F59E0B" />
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: '#92400E',
                  lineHeight: 1.7,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {section.tip}
              </p>
            </div>
          )}
        </section>
        );
      })}

      {/* ── Interne Links ──────────────────────────────────────────────────────── */}
      {internalLinks?.length > 0 && (
        <div
          id="interne-links"
          style={{
            marginTop: '48px',
            padding: '24px 28px',
            borderRadius: '16px',
            background: '#F8FAFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#94A3B8',
              marginBottom: '14px',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}
          >
            Weiterführende Links
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  color: '#0EA5E9',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                →{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  {link.text}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
