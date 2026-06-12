import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin, Clock, Calendar, Globe, Lightbulb, Star, Plane, ArrowRight, Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import DestinationAffiliateSection from '@/components/destinations/DestinationAffiliateSection';
import DestinationFAQ from '@/components/destinations/DestinationFAQ';
import { SEO_DESTINATIONS, getDestinationBySlug } from '@/data/destinations-seo';
import { getDestinationBySlugPublic, listPublishedSlugs } from '@/repositories/destinations-cms';

const BASE_URL = 'https://www.reisemonkey.de';

// ── Resolve: Supabase-first, static fallback ─────────────────────────────────
async function resolveDestination(slug) {
  const dbDest = await getDestinationBySlugPublic(slug);
  if (dbDest) return dbDest;
  return getDestinationBySlug(slug);
}

// ── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const staticSlugs = SEO_DESTINATIONS.map(d => ({ slug: d.slug }));
  try {
    const dbSlugs = await listPublishedSlugs();
    for (const slug of dbSlugs) {
      if (!staticSlugs.find(s => s.slug === slug)) staticSlugs.push({ slug });
    }
  } catch { /* Supabase not available at build time – use static only */ }
  return staticSlugs;
}

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dest = await resolveDestination(slug);
  if (!dest) return {};

  const title = dest.seoTitle ?? `${dest.name} Urlaub – Tipps, beste Reisezeit & Angebote | Reisemonkey`;
  const description = dest.seoDescription ?? `Entdecke ${dest.name}: beste Reisezeit, Highlights, Hotels, Flüge, Mietwagen und Aktivitäten für deinen Urlaub in ${dest.country}.`;
  const canonical = dest.canonicalUrl ?? `${BASE_URL}/reiseziele/${dest.slug}`;
  const ogImage = dest.openGraphImage ?? dest.heroImage;

  return {
    title,
    description,
    keywords: [dest.name, dest.country, dest.region, 'Urlaub', 'Reiseziel', 'Tipps', 'Hotels', 'Flüge', 'Reisemonkey'].filter(Boolean),
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 800, alt: `${dest.name} Urlaub` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical,
    },
  };
}

// ── JSON-LD builder ───────────────────────────────────────────────────────────
function buildJsonLd(dest) {
  const url = `${BASE_URL}/reiseziele/${dest.slug}`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Reiseziele', item: `${BASE_URL}/reiseziele` },
      { '@type': 'ListItem', position: 3, name: dest.name, item: url },
    ],
  };

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: `${dest.name} Urlaub – Tipps, beste Reisezeit & Angebote`,
    description: dest.shortDescription,
    inLanguage: 'de-DE',
    isPartOf: { '@type': 'WebSite', '@id': BASE_URL, name: 'Reisemonkey', url: BASE_URL },
    breadcrumb: { '@id': url + '#breadcrumb' },
  };

  const touristDestination = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    '@id': url + '#destination',
    name: dest.name,
    description: dest.shortDescription || dest.aiSummary,
    url,
    image: dest.heroImage ? [dest.heroImage] : undefined,
    touristType: dest.travelType?.length
      ? dest.travelType.map(t => ({ '@type': 'Audience', audienceType: t }))
      : undefined,
    includesAttraction: dest.highlights?.length
      ? dest.highlights.map(h => ({ '@type': 'TouristAttraction', name: h }))
      : undefined,
  };

  const schemas = [breadcrumb, webpage, touristDestination];

  if (dest.faq?.length > 0) {
    const faqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: dest.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    };
    schemas.push(faqPage);
  }

  return schemas;
}

// ── Subcomponents (server) ────────────────────────────────────────────────────

function QuickFactRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '11px 0', borderBottom: '1px solid #F1F5F9' }}>
      <Icon size={14} strokeWidth={2} color="#0EA5E9" style={{ marginTop: '2px', flexShrink: 0 }} />
      <span style={{ fontSize: '13px', color: '#94A3B8', minWidth: '120px', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 700, color: '#0EA5E9', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        fontSize: 'clamp(20px, 2.5vw, 28px)',
        fontWeight: 800,
        color: '#0F172A',
        margin: '0 0 16px',
        letterSpacing: '-0.02em',
      }}
    >
      {children}
    </h2>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function DestinationPage({ params }) {
  const { slug } = await params;
  const dest = await resolveDestination(slug);
  if (!dest) notFound();

  const schemas = buildJsonLd(dest);

  const similarDests = dest.similarDestinations
    ?.map(s => SEO_DESTINATIONS.find(d => d.slug === s))
    .filter(Boolean) ?? [];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Header />
      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>

        {/* ── HERO ── */}
        <section
          style={{
            backgroundImage: `url('${dest.heroImage}'), ${dest.heroGradient}`,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            minHeight: 'clamp(440px, 45vw, 600px)',
            paddingTop: 'clamp(48px, 7vw, 88px)',
            paddingBottom: 'clamp(48px, 6vw, 80px)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(10,20,40,0.50)', pointerEvents: 'none' }} />
          <Container style={{ position: 'relative', zIndex: 1, width: '100%' }}>

            {/* Breadcrumb */}
            <nav aria-label="Brotkrumennavigation" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[
                { label: 'Startseite', href: '/' },
                { label: 'Reiseziele', href: '/reiseziele' },
                { label: dest.name, href: null },
              ].map((crumb, i, arr) => (
                <span key={crumb.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {crumb.href
                    ? <Link href={crumb.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 500 }}>{crumb.label}</Link>
                    : <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.90)', fontWeight: 600 }}>{crumb.label}</span>
                  }
                  {i < arr.length - 1 && <ChevronRight size={12} strokeWidth={2} color="rgba(255,255,255,0.40)" />}
                </span>
              ))}
            </nav>

            <h1
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(32px, 5.5vw, 68px)',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '0 0 10px',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {dest.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <MapPin size={14} strokeWidth={2} color="rgba(255,255,255,0.80)" />
              <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {dest.country}{dest.region ? ` · ${dest.region}` : ''}
              </span>
            </div>

            <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(255,255,255,0.78)', maxWidth: '580px', lineHeight: 1.65, marginBottom: '28px' }}>
              {dest.shortDescription}
            </p>

            {/* Hero CTAs */}
            {!dest.isPlaceholder && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[
                  { label: 'Hotels ansehen', href: '#angebote' },
                  { label: 'Flüge suchen', href: '#angebote' },
                  { label: 'Mit KI planen', href: `/finder?text=Ich möchte nach ${dest.name} reisen` },
                ].map(cta => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      background: cta.label === 'Mit KI planen'
                        ? 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)'
                        : 'rgba(255,255,255,0.15)',
                      border: cta.label === 'Mit KI planen' ? 'none' : '1.5px solid rgba(255,255,255,0.35)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    {cta.label}
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </a>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ── CONTENT ── */}
        <section style={{ paddingTop: '56px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '48px', alignItems: 'start' }}
              className="destination-layout">

              {/* ── Main column ── */}
              <div>

                {/* Placeholder notice */}
                {dest.isPlaceholder && (
                  <div style={{
                    background: '#FFF7ED',
                    border: '1.5px solid #FED7AA',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '40px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}>
                    <Info size={18} strokeWidth={2} color="#F97316" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div>
                      <p style={{ fontWeight: 700, color: '#9A3412', margin: '0 0 5px', fontSize: '15px' }}>
                        Seite in Vorbereitung
                      </p>
                      <p style={{ color: '#C2410C', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                        Wir arbeiten gerade am vollständigen Reiseführer für {dest.name}. Buchungsangebote findest du bereits jetzt über die Links unten.
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Summary (LLMO) */}
                {dest.aiSummary && (
                  <div
                    itemScope
                    itemType="https://schema.org/Article"
                    style={{
                      background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                      border: '1.5px solid #BAE6FD',
                      borderRadius: '20px',
                      padding: '24px 28px',
                      marginBottom: '40px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={13} strokeWidth={2.5} color="#FFFFFF" />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284C7', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        Reisemonkey Zusammenfassung
                      </span>
                    </div>
                    <p itemProp="description" style={{ fontSize: '15px', color: '#0F172A', lineHeight: 1.8, margin: '0 0 16px' }}>
                      {dest.aiSummary}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      {dest.bestTravelTime && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} strokeWidth={2} color="#0EA5E9" />
                          <span style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600 }}>
                            <strong>Beste Zeit:</strong> {dest.bestTravelTime}
                          </span>
                        </div>
                      )}
                      {dest.idealDuration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={12} strokeWidth={2} color="#0EA5E9" />
                          <span style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600 }}>
                            <strong>Dauer:</strong> {dest.idealDuration}
                          </span>
                        </div>
                      )}
                      {dest.travelType?.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Globe size={12} strokeWidth={2} color="#0EA5E9" />
                          <span style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600 }}>
                            {dest.travelType.join(' · ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Long description */}
                {dest.longDescription && (
                  <div style={{ marginBottom: '40px' }}>
                    <SectionLabel>Über das Reiseziel</SectionLabel>
                    <SectionHeading>Warum {dest.name}?</SectionHeading>
                    <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.85, margin: 0 }}>
                      {dest.longDescription}
                    </p>
                  </div>
                )}

                {/* Highlights */}
                {dest.highlights?.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <SectionLabel>Must-See</SectionLabel>
                    <SectionHeading>Highlights</SectionHeading>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                      {dest.highlights.map((h, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            background: '#F8FAFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '14px',
                            padding: '14px 16px',
                          }}
                        >
                          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>{i + 1}</span>
                          </div>
                          <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: 500, lineHeight: 1.4 }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best travel time */}
                {dest.bestTravelTime && dest.longDescription && (
                  <div style={{ marginBottom: '40px' }}>
                    <SectionLabel>Planung</SectionLabel>
                    <SectionHeading>Beste Reisezeit</SectionHeading>
                    <div style={{ background: '#F0FDF4', border: '1.5px solid #A7F3D0', borderRadius: '16px', padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Calendar size={15} strokeWidth={2} color="#059669" />
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#065F46' }}>{dest.bestTravelTime}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#064E3B', lineHeight: 1.7, margin: 0 }}>
                        {dest.name === 'Mallorca' && 'Mai bis Oktober bieten die besten Bedingungen. Schulterzeit April/Oktober ist ideal für Wanderer und Radfahrer, Juli/August am touristischsten.'}
                        {dest.name === 'Bali' && 'Die Trockenzeit April bis Oktober ist optimal. Die Regenzeit November–März bringt tropische Regengüsse, macht die Insel aber deutlich günstiger.'}
                        {dest.name === 'Kreta' && 'Mai, Juni und September sind optimal: angenehme Temperaturen, wenige Touristen. Juli und August sind heiß und voll, aber ideal für Strandurlaub.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Insider tips */}
                {dest.insiderTips?.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <SectionLabel>Insider-Wissen</SectionLabel>
                    <SectionHeading>Tipps & Tricks</SectionHeading>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {dest.insiderTips.map((tip, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                            padding: '14px 16px',
                            background: '#FFFBEB',
                            border: '1px solid #FDE68A',
                            borderRadius: '14px',
                          }}
                        >
                          <Lightbulb size={15} strokeWidth={2} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, margin: 0 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar destinations */}
                {similarDests.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <SectionLabel>Ähnliche Ziele</SectionLabel>
                    <SectionHeading>Das könnte dir auch gefallen</SectionHeading>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {similarDests.map(s => (
                        <Link
                          key={s.slug}
                          href={`/reiseziele/${s.slug}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 18px',
                            borderRadius: '12px',
                            background: '#F8FAFF',
                            border: '1.5px solid #E2E8F0',
                            color: '#334155',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        >
                          <MapPin size={12} strokeWidth={2} color="#94A3B8" />
                          {s.name}
                          <ArrowRight size={12} strokeWidth={2.5} color="#94A3B8" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Affiliate section (client) */}
                <div id="angebote">
                  <SectionLabel>Buchung</SectionLabel>
                  <DestinationAffiliateSection destination={dest} />
                </div>

                {/* FAQ (client accordion) */}
                <DestinationFAQ faq={dest.faq} destinationName={dest.name} />

              </div>

              {/* ── Sidebar ── */}
              <aside style={{ position: 'sticky', top: '90px' }}>

                {/* Quick Facts */}
                {dest.quickFacts && Object.keys(dest.quickFacts).length > 0 && (
                  <div
                    style={{
                      background: '#F8FAFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '20px',
                      padding: '22px 24px',
                      marginBottom: '20px',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                      Quick Facts
                    </h3>
                    <div>
                      {dest.quickFacts.currency    && <QuickFactRow icon={Globe}    label="Währung"       value={dest.quickFacts.currency}    />}
                      {dest.quickFacts.language    && <QuickFactRow icon={Globe}    label="Sprache"       value={dest.quickFacts.language}    />}
                      {dest.quickFacts.flightTime  && <QuickFactRow icon={Plane}    label="Flugzeit"      value={dest.quickFacts.flightTime}  />}
                      {dest.quickFacts.timezone    && <QuickFactRow icon={Clock}    label="Zeitzone"      value={dest.quickFacts.timezone}    />}
                      {dest.quickFacts.visaRequired && <QuickFactRow icon={Globe}   label="Visum"         value={dest.quickFacts.visaRequired} />}
                      {dest.quickFacts.bestMonths  && <QuickFactRow icon={Calendar} label="Beste Monate"  value={dest.quickFacts.bestMonths}  />}
                      {dest.quickFacts.avgTempSummer && <QuickFactRow icon={Globe}  label="Ø Temp. Sommer" value={dest.quickFacts.avgTempSummer} />}
                    </div>
                  </div>
                )}

                {/* Finder CTA */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #0C1A3A 0%, #0B3D6B 40%, #0EA5E9 100%)',
                    borderRadius: '20px',
                    padding: '22px 22px',
                    textAlign: 'center',
                  }}
                >
                  <Plane size={24} strokeWidth={1.5} color="#BAE6FD" style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                    {dest.name} personalisiert planen
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.70)', lineHeight: 1.6, marginBottom: '16px' }}>
                    Unsere KI erstellt dir einen persönlichen Reiseplan – kostenlos.
                  </p>
                  <Link
                    href={`/finder?text=Ich möchte nach ${dest.name} reisen`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '11px 20px',
                      borderRadius: '12px',
                      background: '#FFFFFF',
                      color: '#0284C7',
                      fontSize: '13px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    <Plane size={13} strokeWidth={2.5} />
                    Mit KI planen
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </Link>
                </div>
              </aside>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
