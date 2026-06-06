import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import NewsletterSection from '@/components/landing/NewsletterSection';
import ArticleJsonLd from '@/components/blog/ArticleJsonLd';
import ArticleHero from '@/components/blog/ArticleHero';
import ArticleKeyTakeaways from '@/components/blog/ArticleKeyTakeaways';
import ArticleContent from '@/components/blog/ArticleContent';
import ArticleFAQ from '@/components/blog/ArticleFAQ';
import ArticleDestinationFacts from '@/components/blog/ArticleDestinationFacts';
import ArticleSidebar from '@/components/blog/ArticleSidebar';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { blogArticles } from '@/data/blogArticles';
import Link from 'next/link';
import { ArrowLeft, Plane, ArrowRight } from 'lucide-react';

/* ── Static params ─────────────────────────────────────────────────────────── */
export async function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

/* ── Metadata per article ──────────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    keywords: [...article.tags, article.destination, article.country, 'Reiseguide', 'Traumreise'],
    authors: [{ name: article.author }],
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      type: 'article',
      url: `https://traumreise.de/reiseblog/${slug}`,
      publishedTime: article.date,
      modifiedTime: article.lastUpdated,
      authors: [article.author],
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 800,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.seoDescription,
      images: [article.imageUrl],
    },
    alternates: {
      canonical: `https://traumreise.de/reiseblog/${slug}`,
    },
  };
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) notFound();

  return (
    <>
      <ArticleJsonLd article={article} />
      <Header />

      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>
        {/* Hero (breadcrumb + image + excerpt) */}
        <ArticleHero article={article} />

        {/* ── Main article body ─────────────────────────────────────────────────── */}
        <section style={{ paddingTop: '56px', paddingBottom: '80px' }}>
          <Container>
            {/* Key Takeaways – full width above 2-col layout */}
            <ArticleKeyTakeaways
              takeaways={article.keyTakeaways}
              destination={article.destination}
            />

            {/* 2-column: content + sidebar */}
            <div className="article-layout">
              {/* ── Content column ─────────────────────────────────────────────── */}
              <div>
                <ArticleContent
                  sections={article.contentSections}
                  internalLinks={article.internalLinks}
                />
                <ArticleDestinationFacts
                  facts={article.destinationFacts}
                  airportInfo={article.airportInfo}
                  destination={article.destination}
                />
                <ArticleFAQ faq={article.faq} destination={article.destination} />
                <RelatedArticles
                  relatedSlugs={article.relatedArticles}
                  currentSlug={article.slug}
                />
              </div>

              {/* ── Sidebar ────────────────────────────────────────────────────── */}
              <div className="article-sidebar-desktop">
                <ArticleSidebar
                  tableOfContents={article.tableOfContents}
                  destination={article.destination}
                />
              </div>
            </div>

            {/* ── Back to blog ───────────────────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginTop: '64px',
                paddingTop: '32px',
                borderTop: '1px solid #F1F5F9',
              }}
            >
              <Link
                href="/reiseblog"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#64748B',
                  textDecoration: 'none',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                }}
              >
                <ArrowLeft size={15} strokeWidth={2.5} />
                Zurück zum Blog
              </Link>

              <Link
                href="/finder"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  boxShadow: '0 4px 16px rgba(14,165,233,0.30)',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}
              >
                <Plane size={15} strokeWidth={2.5} />
                Traumreise nach {article.destination} planen
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Full-width KI CTA banner ──────────────────────────────────────────── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0C1A3A 0%, #0B3D6B 40%, #0EA5E9 100%)',
            padding: 'clamp(48px, 6vw, 72px) 0',
          }}
        >
          <Container>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 18px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#BAE6FD',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}
              >
                KI-Reisefinder
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(24px, 3.5vw, 38px)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                Jetzt deine Reise nach{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #67E8F9 0%, #A5F3FC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {article.destination}
                </span>{' '}
                personalisieren
              </h2>

              <p
                style={{
                  fontSize: 'clamp(14px, 1.8vw, 17px)',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.65,
                  marginBottom: '32px',
                }}
              >
                Unsere KI erstellt dir in 2 Minuten einen persönlichen Reiseplan – mit
                Unterkunftsempfehlungen, Aktivitäten und direkten Buchungslinks. 100 % kostenlos.
              </p>

              <Link
                href={`/finder?text=Ich möchte nach ${article.destination} reisen`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  color: '#0284C7',
                  fontSize: '16px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
                }}
              >
                <Plane size={18} strokeWidth={2.5} />
                {article.destination} mit KI planen
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>

              <p
                style={{
                  marginTop: '14px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.50)',
                }}
              >
                Kostenlos · Keine Anmeldung · Personalisiert
              </p>
            </div>
          </Container>
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
