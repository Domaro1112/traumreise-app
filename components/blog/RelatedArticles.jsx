'use client';

import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { blogArticles } from '@/data/blogArticles';

const CATEGORY_COLORS = {
  Spartipps:           { bg: '#FFF7ED', color: '#C2410C' },
  Geheimtipps:         { bg: '#F0FDF4', color: '#15803D' },
  Städtereisen:        { bg: '#F5F3FF', color: '#6D28D9' },
  'Natur & Abenteuer': { bg: '#ECFEFF', color: '#0E7490' },
  Familienurlaub:      { bg: '#FFF1F2', color: '#BE123C' },
  'KI-Reiseplanung':   { bg: '#EFF6FF', color: '#1D4ED8' },
};

export default function RelatedArticles({ relatedSlugs, currentSlug }) {
  if (!relatedSlugs?.length) return null;

  const related = relatedSlugs
    .map((slug) => blogArticles.find((a) => a.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section
      style={{
        marginTop: '64px',
        paddingTop: '40px',
        borderTop: '2px solid #F1F5F9',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '28px',
        }}
      >
        <BookOpen size={20} strokeWidth={2} color="#0EA5E9" />
        <h2
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
          }}
        >
          Verwandte Reise-Guides
        </h2>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {related.map((article) => {
          const catStyle = CATEGORY_COLORS[article.category] ?? { bg: '#F8FAFF', color: '#475569' };
          return (
            <Link
              key={article.slug}
              href={`/reiseblog/${article.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <article
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,165,233,0.16)';
                  e.currentTarget.style.borderColor = '#BAE6FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.05)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Image */}
                <div style={{ height: '160px', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.45s ease',
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Category */}
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: catStyle.bg,
                      color: catStyle.color,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.35,
                      marginBottom: '10px',
                      flex: 1,
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Meta + CTA */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: '#94A3B8',
                      }}
                    >
                      <Clock size={12} strokeWidth={2} />
                      {article.readingTime}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0EA5E9',
                      }}
                    >
                      Lesen
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
