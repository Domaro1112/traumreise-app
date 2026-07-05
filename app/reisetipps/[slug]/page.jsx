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
      .eq('slug', slug).eq('status', 'published').eq('type', 'tip').single();
    if (!data) return { title: 'Reisetipp | ApeAround' };
    const creator = data.creator_profiles?.display_name ?? 'ApeAround';
    return {
      title: `${data.title} | ApeAround Reisetipp`,
      description: data.excerpt || `Reisetipp von ${creator} auf ApeAround.`,
      alternates: { canonical: `/reisetipps/${slug}` },
      openGraph: { title: data.title, description: data.excerpt, type: 'article' },
    };
  } catch {
    return { title: 'Reisetipp | ApeAround' };
  }
}

export default async function ReisetippDetailPage({ params }) {
  const { slug } = await params;
  let tip = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_submissions')
      .select(`*, creator_profiles!creator_profile_id(id, display_name, slug, profile_image_url, creator_type)`)
      .eq('slug', slug).eq('status', 'published').eq('type', 'tip').single();
    tip = data;
  } catch {}
  if (!tip) notFound();

  const creator = tip.creator_profiles;
  const images  = Array.isArray(tip.images) ? tip.images.filter(Boolean) : [];
  const tags    = Array.isArray(tip.tags)   ? tip.tags.filter(Boolean) : [];
  const tipText = tip.tip_data?.text ?? tip.content ?? '';
  const tipUrl  = tip.tip_data?.url ?? null;

  const pageUrl = `${SITE_URL}/reisetipps/${tip.slug}`;
  const tipJsonLd = [
    buildBreadcrumbJsonLd([
      { name: 'Startseite', url: SITE_URL },
      { name: 'Reisetipps', url: `${SITE_URL}/reisetipps` },
      { name: tip.title,    url: pageUrl },
    ]),
    buildArticleJsonLd({
      title:      tip.title,
      description: tip.excerpt,
      url:        pageUrl,
      image:      images[0],
      authorName: creator?.display_name,
      keywords:   tags,
    }),
  ];

  return (
    <>
      <JsonLd data={tipJsonLd} />
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
              <span>Reisetipps</span>
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{ padding: '3px 12px', borderRadius: '20px', background: 'rgba(14,165,233,0.25)', color: '#BAE6FD', fontSize: '12px', fontWeight: 600 }}>💡 Reisetipp</span>
              {tip.destination && <span style={{ padding: '3px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>📍 {tip.destination}</span>}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {tip.title}
            </h1>
            {tip.excerpt && (
              <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, margin: 0 }}>
                {tip.excerpt}
              </p>
            )}
            {creator && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                {creator.profile_image_url && (
                  <img src={creator.profile_image_url} alt={creator.display_name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }} />
                )}
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
                  von{' '}
                  <Link href={`/creator/${creator.slug}`} style={{ color: '#7DD3FC', textDecoration: 'none', fontWeight: 600 }}>
                    {creator.display_name}
                  </Link>
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Tipp-Inhalt */}
        <section style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(36px, 6vw, 56px) clamp(20px, 5vw, 40px)' }}>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {tags.map(t => (
                <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', background: '#EFF6FF', color: '#0EA5E9', fontSize: '12px', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          )}

          {tipText && (
            <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.04), rgba(6,182,212,0.03))', border: '1.5px solid rgba(14,165,233,0.15)', borderRadius: '16px', padding: '24px 28px', marginBottom: '28px' }}>
              <p style={{ margin: 0, fontSize: '16px', color: '#1E293B', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{tipText}</p>
            </div>
          )}

          {tipUrl && (
            <a href={tipUrl} target="_blank" rel="nofollow noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 22px', borderRadius: '12px', background: '#0EA5E9', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
              Mehr erfahren →
            </a>
          )}
        </section>

        {/* Images */}
        {images.length > 0 && (
          <section style={{ background: '#F8FAFC', padding: 'clamp(28px, 5vw, 44px) 0' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 25vw, 220px), 1fr))', gap: '10px' }}>
                {images.slice(0, 6).map((src, i) => (
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
                <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tipp von</p>
                <p style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{creator.display_name}</p>
                {creator.creator_type && <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{creator.creator_type}</p>}
              </div>
              <Link href={`/creator/${creator.slug}`} style={{ padding: '9px 18px', borderRadius: '10px', background: '#0EA5E9', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
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
