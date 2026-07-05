import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { createServerClient } from '@/lib/supabase/server';
import JsonLd from '@/components/seo/JsonLd';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonLd';
import { SITE_URL } from '@/lib/site-config';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_submissions')
      .select('title, excerpt, destination, creator_profiles!creator_profile_id(display_name)')
      .eq('slug', slug).eq('status', 'published').eq('type', 'route').single();
    if (!data) return { title: 'Reiseroute | ApeAround' };
    const creator = data.creator_profiles?.display_name ?? 'ApeAround';
    return {
      title: `${data.title} | ApeAround Reiseroute`,
      description: data.excerpt || `Reiseroute von ${creator} auf ApeAround.`,
      alternates: { canonical: `/reiserouten/${slug}` },
      openGraph: { title: data.title, description: data.excerpt, type: 'article' },
    };
  } catch {
    return { title: 'Reiseroute | ApeAround' };
  }
}

export default async function ReiserouteDetailPage({ params }) {
  const { slug } = await params;
  let route = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_submissions')
      .select(`*, creator_profiles!creator_profile_id(id, display_name, slug, profile_image_url, creator_type)`)
      .eq('slug', slug).eq('status', 'published').eq('type', 'route').single();
    route = data;
  } catch {}
  if (!route) notFound();

  const creator   = route.creator_profiles;
  const images    = Array.isArray(route.images) ? route.images.filter(Boolean) : [];
  const tags      = Array.isArray(route.tags) ? route.tags.filter(Boolean) : [];
  const routeData = route.route_data ?? {};
  const stops     = Array.isArray(routeData.stops) ? routeData.stops : [];

  const pageUrl = `${SITE_URL}/reiserouten/${route.slug}`;
  const routeJsonLd = [
    buildBreadcrumbJsonLd([
      { name: 'Startseite',  url: SITE_URL },
      { name: 'Reiserouten', url: `${SITE_URL}/reiserouten` },
      { name: route.title,   url: pageUrl },
    ]),
    buildArticleJsonLd({
      title:       route.title,
      description: route.excerpt,
      url:         pageUrl,
      image:       images[0],
      authorName:  creator?.display_name,
      keywords:    tags,
    }),
  ];

  return (
    <>
      <JsonLd data={routeJsonLd} />
      <Header />
      <main style={{ minHeight: '100vh', background: '#FFFFFF' }}>

        {/* Hero */}
        <section style={{
          background: images[0]
            ? `linear-gradient(to bottom, rgba(15,23,42,0.6), rgba(15,23,42,0.75)), url(${images[0]}) center/cover`
            : 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
          padding: 'clamp(72px, 12vw, 100px) clamp(20px, 5vw, 40px) clamp(40px, 7vw, 60px)',
        }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>ApeAround</Link>
              {' / '}
              <span>Reiserouten</span>
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{ padding: '3px 12px', borderRadius: '20px', background: 'rgba(5,150,105,0.25)', color: '#6EE7B7', fontSize: '12px', fontWeight: 600 }}>🗺️ Reiseroute</span>
              {route.destination && <span style={{ padding: '3px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>📍 {route.destination}</span>}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {route.title}
            </h1>
            {route.excerpt && (
              <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, margin: '0 0 16px' }}>
                {route.excerpt}
              </p>
            )}
            {/* Route meta */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {routeData.start && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>🚩 {routeData.start}</span>}
              {routeData.end && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>🏁 {routeData.end}</span>}
              {routeData.duration && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>⏱ {routeData.duration}</span>}
              {routeData.travel_type && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>🚗 {routeData.travel_type}</span>}
            </div>
            {creator && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                {creator.profile_image_url && (
                  <img src={creator.profile_image_url} alt={creator.display_name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }} />
                )}
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
                  von{' '}
                  <Link href={`/creator/${creator.slug}`} style={{ color: '#6EE7B7', textDecoration: 'none', fontWeight: 600 }}>
                    {creator.display_name}
                  </Link>
                </span>
              </div>
            )}
          </div>
        </section>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(36px, 6vw, 56px) clamp(20px, 5vw, 40px)' }}>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {tags.map(t => (
                <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', fontSize: '12px', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          )}

          {/* Route overview */}
          {(routeData.start || routeData.end || routeData.duration || routeData.travel_type) && (
            <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '20px 24px', marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              {routeData.start && (
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Start</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>🚩 {routeData.start}</p>
                </div>
              )}
              {routeData.end && (
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ziel</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>🏁 {routeData.end}</p>
                </div>
              )}
              {routeData.duration && (
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dauer</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>⏱ {routeData.duration}</p>
                </div>
              )}
              {routeData.travel_type && (
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reiseart</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>🚗 {routeData.travel_type}</p>
                </div>
              )}
            </div>
          )}

          {/* Stops */}
          {stops.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                Stationen ({stops.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stops.map((stop, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {/* Number */}
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0, marginTop: '2px' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      {stop.image && (
                        <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/7', marginBottom: '12px' }}>
                          <img src={stop.image} alt={stop.title ?? ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      {stop.title && <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{stop.title}</h3>}
                      {stop.place && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#94A3B8' }}>📍 {stop.place}</p>}
                      {stop.description && <p style={{ margin: 0, fontSize: '15px', color: '#374151', lineHeight: 1.7 }}>{stop.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          {route.content && (
            <div style={{ marginTop: '32px', paddingTop: '28px', borderTop: '1px solid #F1F5F9', fontSize: '16px', color: '#1E293B', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
              {route.content}
            </div>
          )}
        </div>

        {/* Images */}
        {images.length > 1 && (
          <section style={{ background: '#F8FAFC', padding: 'clamp(28px, 5vw, 44px) 0' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 25vw, 220px), 1fr))', gap: '10px' }}>
                {images.slice(0, 9).map((src, i) => (
                  <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Creator box */}
        {creator && (
          <section style={{ maxWidth: '780px', margin: '0 auto', padding: '24px clamp(20px, 5vw, 40px) clamp(40px, 6vw, 56px)' }}>
            <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {creator.profile_image_url && (
                <img src={creator.profile_image_url} alt={creator.display_name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: '160px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Route von</p>
                <p style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{creator.display_name}</p>
                {creator.creator_type && <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{creator.creator_type}</p>}
              </div>
              <Link href={`/creator/${creator.slug}`} style={{ padding: '9px 18px', borderRadius: '10px', background: '#059669', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
                Profil ansehen →
              </Link>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)', padding: 'clamp(44px, 7vw, 64px) clamp(20px, 5vw, 40px)', textAlign: 'center' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
              Lass dir eine passende Reise vorschlagen
            </h2>
            <Link href="/" style={{ display: 'inline-block', padding: '13px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', color: '#FFFFFF', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
              Traumreise finden →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
