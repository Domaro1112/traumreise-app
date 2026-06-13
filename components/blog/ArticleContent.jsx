import { Lightbulb } from 'lucide-react';
import Link from 'next/link';

// Must match the toId() in blog-content-utils.js so TOC anchors align
function toId(str) {
  return String(str)
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Replicates the deduplication logic of generateTocFromSections so that
// every <section id="…"> matches the corresponding TOC entry href.
function computeSectionIds(sections) {
  const seen = new Map();
  return sections.map((section, i) => {
    const label =
      section.heading ?? section.title ?? section.subtitle ?? section.label ?? '';
    let baseId = section.id
      ? toId(section.id)
      : label
      ? toId(label)
      : `section-${i + 1}`;
    if (!baseId) baseId = `section-${i + 1}`;

    let id = baseId;
    if (seen.has(baseId)) {
      const n = seen.get(baseId) + 1;
      seen.set(baseId, n);
      id = `${baseId}-${n}`;
    } else {
      seen.set(baseId, 1);
    }
    return id;
  });
}

export default function ArticleContent({ sections, internalLinks }) {
  if (!sections?.length) return null;

  const sectionIds = computeSectionIds(sections);

  return (
    <article className="article-prose">
      {sections.map((section, sectionIndex) => {
        const sectionId = sectionIds[sectionIndex];
        const heading =
          section.heading ?? section.title ?? section.subtitle ?? section.label ?? '';
        const body = section.content ?? section.body ?? '';
        const highlights = Array.isArray(section.highlights) ? section.highlights : [];

        return (
          <section key={sectionId} id={sectionId} style={{ marginBottom: '48px' }}>
            {heading ? (
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
                {heading}
              </h2>
            ) : null}

            {/* Paragraphs (split on blank lines) */}
            {body
              .split('\n\n')
              .filter(Boolean)
              .map((para, i) => (
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

            {/* Highlights bullet list */}
            {highlights.length > 0 && (
              <ul
                style={{
                  margin: '8px 0 16px',
                  paddingLeft: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7 }}
                  >
                    {typeof h === 'string' ? h : (h?.text ?? '')}
                  </li>
                ))}
              </ul>
            )}

            {/* Tip callout */}
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
