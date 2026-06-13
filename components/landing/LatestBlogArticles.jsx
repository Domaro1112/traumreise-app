import Link from 'next/link';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import { listPublishedBlogArticles } from '@/repositories/blog-cms';
import { Clock, CalendarDays, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS = {
  Spartipps:           { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Geheimtipps:         { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Städtereisen:        { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  'Natur & Abenteuer': { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
  Familienurlaub:      { bg: '#FFF1F2', border: '#FECDD3', color: '#BE123C' },
  'KI-Reiseplanung':   { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
};
const CAT_DEFAULT = { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };

export default async function LatestBlogArticles() {
  const articles = await listPublishedBlogArticles({ limit: 3 });
  if (!articles.length) return null;

  return (
    <section style={{ background: '#F8FAFF', paddingTop: '96px', paddingBottom: '96px' }}>
      <Container>
        <SectionTitle
          label="Reiseblog"
          title="Neue Reiseguides"
          titleHighlight="im Blog"
          subtitle="Frische Insider-Tipps, ehrliche Guides und Inspiration für deine nächste Reise."
        />

        <div className="home-blog-grid">
          {articles.map((article) => {
            const cat = CATEGORY_COLORS[article.category] ?? CAT_DEFAULT;
            return (
              <Link
                key={article.id}
                href={`/reiseblog/${article.slug}`}
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
              >
                <article className="home-blog-card">
                  {/* Image */}
                  <div style={{ height: '190px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        loading="lazy"
                        className="home-blog-card-img"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' }} />
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.06), transparent 40%, rgba(0,0,0,0.18))',
                    }} />
                    {article.category && (
                      <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        padding: '4px 10px', borderRadius: '20px',
                        background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color,
                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      }}>
                        {article.category}
                      </span>
                    )}
                    {article.readingTime && (
                      <span style={{
                        position: 'absolute', bottom: '10px', right: '10px',
                        display: 'flex', alignItems: 'center', gap: '3px',
                        padding: '3px 9px', borderRadius: '20px',
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
                        fontSize: '10px', fontWeight: 600, color: '#475569',
                      }}>
                        <Clock size={10} strokeWidth={2.5} /> {article.readingTime}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {article.date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94A3B8', marginBottom: '8px' }}>
                        <CalendarDays size={11} strokeWidth={2} /> {article.date}
                      </div>
                    )}
                    <h3 style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '15px', fontWeight: 700, color: '#0F172A',
                      lineHeight: 1.35, marginBottom: '8px', flex: 1,
                    }}>
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p style={{
                        fontSize: '12.5px', color: '#64748B', lineHeight: 1.6, marginBottom: '14px',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {article.excerpt}
                      </p>
                    )}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>
                      Artikel lesen <ArrowRight size={11} strokeWidth={2.5} />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            href="/reiseblog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '14px',
              border: '1.5px solid #BAE6FD', background: '#FFFFFF', color: '#0284C7',
              fontSize: '15px', fontWeight: 700,
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              textDecoration: 'none',
            }}
          >
            Alle Guides entdecken <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
