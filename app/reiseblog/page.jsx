import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import NewsletterSection from '@/components/landing/NewsletterSection';
import BlogPageClient from '@/components/blog/BlogPageClient';
import CommunityTips from '@/components/blog/CommunityTips';
import {
  blogArticles,
  blogCategories,
  communityTips,
  popularDestinations,
} from '@/data/blogArticles';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Reiseblog – Guides, Geheimtipps & Inspiration | Traumreise',
  description:
    'Entdecke handverlesene Reise-Guides, Budget-Tipps und Insider-Wissen für deine nächste Traumreise. Kostenlose Reiseführer für Bali, Santorini, Tokio und mehr.',
  keywords: [
    'Reiseblog',
    'Reise-Guides',
    'Reisetipps',
    'Reiseinspiration',
    'Geheimtipps',
    'Budget-Reisen',
    'Urlaubsplanung',
  ],
  openGraph: {
    title: 'Reiseblog – Guides, Geheimtipps & Inspiration | Traumreise',
    description:
      'Handverlesene Reise-Guides, Budget-Hacks und Geheimtipps – kostenlos und immer aktuell.',
    type: 'website',
    url: 'https://traumreise.de/reiseblog',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Traumreise Reiseblog',
      },
    ],
  },
  alternates: {
    canonical: 'https://traumreise.de/reiseblog',
  },
};

export default function Reiseblog() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': 'https://traumreise.de/reiseblog#blog',
        name: 'Traumreise Reiseblog',
        description:
          'Handverlesene Reise-Guides, Budget-Hacks und Insider-Tipps von unserem Experten-Team.',
        url: 'https://traumreise.de/reiseblog',
        inLanguage: 'de-DE',
        publisher: {
          '@type': 'Organization',
          name: 'Traumreise',
          url: 'https://traumreise.de',
        },
        blogPost: blogArticles.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.title,
          description: a.excerpt,
          url: `https://traumreise.de/reiseblog/${a.slug}`,
          datePublished: a.date,
          author: { '@type': 'Person', name: a.author },
          keywords: a.tags.join(', '),
          image: a.imageUrl,
          articleSection: a.category,
          about: {
            '@type': 'Place',
            name: a.destination,
            containedInPlace: { '@type': 'Country', name: a.country },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://traumreise.de' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Reiseblog',
            item: 'https://traumreise.de/reiseblog',
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Aktuelle Reise-Guides',
        description: 'Handverlesene Reiseführer und Insider-Tipps von Traumreise',
        itemListElement: blogArticles.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://traumreise.de/reiseblog/${a.slug}`,
          name: a.title,
        })),
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>
        {/* Hero + Category Filter + Featured + Blog Grid (client-interactive) */}
        <BlogPageClient articles={blogArticles} categories={blogCategories} />

        {/* ── Beliebte Reiseziele ─────────────────────────────────────────────── */}
        <section
          style={{
            background: 'linear-gradient(180deg, #F8FAFF 0%, #EFF6FF 100%)',
            paddingTop: '80px',
            paddingBottom: '80px',
          }}
        >
          <Container>
            <SectionTitle
              label="Beliebte Reiseziele"
              title="Entdecke die"
              titleHighlight="schönsten Orte"
              subtitle="Von asiatischen Metropolen bis zu europäischen Geheimtipps – unsere Guides zeigen dir die Welt."
            />

            <div className="blog-destinations">
              {popularDestinations.map((dest) => (
                <Link
                  key={dest.name}
                  href={`/reiseblog/${dest.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    className="blog-destination-card"
                    style={{
                      position: 'relative',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      aspectRatio: '3 / 4',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(15,23,42,0.10)',
                    }}
                  >
                    <img
                      src={dest.imageUrl}
                      alt={`${dest.name}, ${dest.country}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        transition: 'transform 0.45s ease',
                      }}
                    />
                    {/* Gradient overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to bottom, transparent 35%, rgba(15,23,42,0.75) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Text */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '16px 14px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          lineHeight: 1.2,
                        }}
                      >
                        {dest.name}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.75)',
                          fontWeight: 500,
                          marginTop: '3px',
                        }}
                      >
                        <MapPin size={11} strokeWidth={2.5} />
                        {dest.country}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA to /inspiration */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link
                href="/inspiration"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  border: '1.5px solid #BAE6FD',
                  background: '#FFFFFF',
                  color: '#0284C7',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                Mehr Reiseziele entdecken
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Community Insider-Tipps ─────────────────────────────────────────── */}
        <CommunityTips tips={communityTips} />

        {/* ── KI-Finder CTA ──────────────────────────────────────────────────── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0C1A3A 0%, #0B3D6B 40%, #0EA5E9 100%)',
            paddingTop: '80px',
            paddingBottom: '80px',
          }}
        >
          <Container>
            <div style={{ textAlign: 'center' }}>
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
                  marginBottom: '24px',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}
              >
                Deine Reiseplanung
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(26px, 4vw, 44px)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                  letterSpacing: '-0.02em',
                }}
              >
                Bereit für deine{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #67E8F9 0%, #A5F3FC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Traumreise?
                </span>
              </h2>
              <p
                style={{
                  fontSize: 'clamp(15px, 2vw, 18px)',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.65,
                  maxWidth: '520px',
                  margin: '0 auto 40px',
                }}
              >
                Lass unsere Analyse in 2 Minuten das perfekte Reiseziel für dich finden – 100 %
                kostenlos und personalisiert auf deinen Stil.
              </p>
              <Link
                href="/finder"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '18px 36px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
                  color: '#0284C7',
                  fontSize: '16px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
                  letterSpacing: '-0.01em',
                }}
              >
                Analyse starten
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <p
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.50)',
                }}
              >
                Kostenlos · Keine Anmeldung · Sofortiges Ergebnis
              </p>
            </div>
          </Container>
        </section>

        {/* ── Newsletter ─────────────────────────────────────────────────────── */}
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
