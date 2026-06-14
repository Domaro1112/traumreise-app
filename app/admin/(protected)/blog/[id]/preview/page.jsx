import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogAdmin } from '@/repositories/blog-cms';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Vorschau – Admin`, robots: 'noindex' };
}

export default async function BlogPreviewPage({ params }) {
  const { id } = await params;
  let article = null;
  try {
    article = await getBlogAdmin(id);
  } catch {
    notFound();
  }
  if (!article) notFound();

  const isPublished = article.status === 'published';
  const contentSections = Array.isArray(article.content_sections) ? article.content_sections : [];
  const faq = Array.isArray(article.faq) ? article.faq : [];
  const keyTakeaways = Array.isArray(article.key_takeaways) ? article.key_takeaways : [];

  const STATUS_LABEL = { published: 'Veröffentlicht', draft: 'Entwurf', archived: 'Archiviert' };
  const bannerBg = isPublished ? '#0F172A' : article.status === 'archived' ? '#475569' : '#7C3AED';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Admin banner */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: bannerBg,
        color: '#FFFFFF',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap',
        fontSize: '13px', fontWeight: 600,
      }}>
        <span style={{ opacity: 0.9 }}>
          Admin-Vorschau · {STATUS_LABEL[article.status] ?? article.status} · {article.title}
        </span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
          {isPublished && article.slug && (
            <a
              href={`/reiseblog/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#7DD3FC', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}
            >
              Öffentliche URL ↗
            </a>
          )}
          <Link
            href={`/admin/blog/${id}`}
            style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '12px' }}
          >
            ← Bearbeiten
          </Link>
          <Link
            href="/admin/blog"
            style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '12px' }}
          >
            Liste
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Category & meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {article.category && (
            <span style={{
              padding: '4px 12px', borderRadius: '6px',
              background: '#EFF6FF', color: '#1D4ED8',
              fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px',
            }}>
              {article.category}
            </span>
          )}
          {article.reading_time && (
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>{article.reading_time}</span>
          )}
          {article.date && (
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>
              {new Date(article.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 42px)',
          fontWeight: 800, color: '#0F172A',
          lineHeight: 1.15, letterSpacing: '-0.02em',
          marginBottom: '20px', marginTop: 0,
        }}>
          {article.title || 'Ohne Titel'}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p style={{
            fontSize: '18px', color: '#475569', lineHeight: 1.7,
            marginBottom: '36px',
            borderLeft: '4px solid #0EA5E9', paddingLeft: '20px',
          }}>
            {article.excerpt}
          </p>
        )}

        {/* Author */}
        {article.author && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontWeight: 800, fontSize: '16px', flexShrink: 0,
            }}>
              {article.author[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>{article.author}</div>
              {article.author_bio && (
                <div style={{ color: '#64748B', fontSize: '12px' }}>{article.author_bio}</div>
              )}
            </div>
          </div>
        )}

        {/* Hero image */}
        {(article.hero_image_url || article.cover_image_url) && (
          <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,23,42,0.12)' }}>
            <img
              src={article.hero_image_url || article.cover_image_url}
              alt={article.title ?? ''}
              style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Key Takeaways */}
        {keyTakeaways.length > 0 && (
          <div style={{
            background: '#F0F9FF', border: '1.5px solid #BAE6FD',
            borderRadius: '16px', padding: '24px', marginBottom: '40px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Das Wichtigste in Kürze
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {keyTakeaways.map((t, i) => (
                <li key={i} style={{ color: '#0369A1', fontSize: '15px', lineHeight: 1.6 }}>
                  {typeof t === 'string' ? t : t.text ?? JSON.stringify(t)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content sections */}
        {contentSections.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            {contentSections.map((section, i) => (
              <div key={i} style={{ marginBottom: '36px' }}>
                {section.title && (
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '14px', marginTop: 0 }}>
                    {section.title}
                  </h2>
                )}
                {section.body && (
                  <div style={{ color: '#334155', lineHeight: 1.8, fontSize: '16px' }}>
                    {String(section.body).split('\n').map((para, j) =>
                      para.trim()
                        ? <p key={j} style={{ marginBottom: '16px', marginTop: 0 }}>{para}</p>
                        : null
                    )}
                  </div>
                )}
                {section.image_url && (
                  <img
                    src={section.image_url}
                    alt={section.title ?? ''}
                    style={{ width: '100%', borderRadius: '12px', marginTop: '16px', objectFit: 'cover', maxHeight: '380px', display: 'block' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* No content placeholder */}
        {contentSections.length === 0 && keyTakeaways.length === 0 && (
          <div style={{
            padding: '48px 32px', textAlign: 'center',
            background: '#F1F5F9', borderRadius: '16px', marginBottom: '40px',
            color: '#94A3B8', fontSize: '14px',
          }}>
            Noch kein Inhalt vorhanden. Artikel im Editor bearbeiten.
          </div>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '24px', marginTop: 0 }}>
              Häufige Fragen
            </h2>
            {faq.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', marginTop: 0 }}>
                  {item.question}
                </h3>
                <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SEO preview */}
        {(article.seo_title || article.seo_description) && (
          <div style={{
            background: '#FFFFFF', border: '1.5px solid #E2E8F0',
            borderRadius: '12px', padding: '20px', marginBottom: '40px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '12px', marginTop: 0, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              SEO-Vorschau (Google SERP)
            </p>
            <div style={{ fontSize: '18px', color: '#1A0DAB', marginBottom: '3px', fontWeight: 400 }}>
              {article.seo_title || article.title}
            </div>
            <div style={{ fontSize: '13px', color: '#006621', marginBottom: '3px' }}>
              traumreise.app › reiseblog › {article.slug}
            </div>
            <div style={{ fontSize: '13px', color: '#545454', lineHeight: 1.5 }}>
              {article.seo_description || article.excerpt}
            </div>
          </div>
        )}

        {/* Tags */}
        {Array.isArray(article.tags) && article.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {article.tags.map(tag => (
              <span key={tag} style={{
                padding: '4px 12px', borderRadius: '20px',
                background: '#F1F5F9', color: '#475569',
                fontSize: '12px', fontWeight: 600,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom actions */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '32px', borderTop: '1.5px solid #E2E8F0', flexWrap: 'wrap' }}>
          <Link
            href={`/admin/blog/${id}`}
            style={{
              padding: '12px 24px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '14px',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(14,165,233,0.30)',
            }}
          >
            Artikel bearbeiten
          </Link>
          {isPublished && article.slug && (
            <a
              href={`/reiseblog/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 24px', borderRadius: '10px',
                border: '1.5px solid #A7F3D0', background: '#ECFDF5',
                color: '#059669', textDecoration: 'none', fontWeight: 700, fontSize: '14px',
              }}
            >
              Öffentliche URL öffnen ↗
            </a>
          )}
          <Link
            href="/admin/blog"
            style={{
              padding: '12px 24px', borderRadius: '10px',
              border: '1.5px solid #E2E8F0', background: '#FFFFFF',
              color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '14px',
            }}
          >
            Zurück zur Liste
          </Link>
        </div>
      </div>
    </div>
  );
}
