import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { createServerClient } from '@/lib/supabase/server';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_profiles')
      .select('display_name, short_bio, bio, status')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (!data) return { title: 'Creator | ApeAround' };
    const raw = data.short_bio || data.bio || '';
    const desc = raw.length > 155 ? raw.slice(0, 152) + '…' : raw;
    return {
      title: `${data.display_name} | ApeAround Creator`,
      description: desc || `Reise im Stil von ${data.display_name} – auf ApeAround.`,
      alternates: { canonical: `/creator/${slug}` },
      openGraph: {
        title: `${data.display_name} | ApeAround Creator`,
        description: desc,
        type: 'profile',
      },
    };
  } catch {
    return { title: 'Creator | ApeAround' };
  }
}

function jsonLd(profile) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: profile.display_name,
    url: `/creator/${profile.slug}`,
    description: profile.short_bio || profile.bio || undefined,
    mainEntity: {
      '@type': 'Person',
      name: profile.display_name,
      url: profile.website_url || undefined,
      description: profile.short_bio || profile.bio || undefined,
    },
  };
  const sameAs = Object.values(profile.social_links ?? {}).filter(Boolean);
  if (sameAs.length) ld.mainEntity.sameAs = sameAs;
  return JSON.stringify(ld);
}

const SOCIAL_LABELS = {
  instagram: 'Instagram',
  tiktok:    'TikTok',
  youtube:   'YouTube',
  facebook:  'Facebook',
  twitter:   'X / Twitter',
  pinterest: 'Pinterest',
};

export default async function CreatorProfilePage({ params }) {
  const { slug } = await params;

  let profile = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    profile = data;
  } catch {}

  if (!profile) notFound();

  const tips  = Array.isArray(profile.featured_tips)  ? profile.featured_tips  : [];
  const imgs  = Array.isArray(profile.gallery_images)  ? profile.gallery_images.filter(Boolean) : [];
  const socialEntries = Object.entries(profile.social_links ?? {}).filter(([, v]) => v);

  const heroStyle = profile.hero_image_url
    ? { backgroundImage: `url(${profile.hero_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0EA5E9 100%)' };

  const ctaLabel = profile.cta_label || `Reise im Stil von ${profile.display_name} planen`;
  const ctaUrl   = profile.cta_url   || `/?creator=${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(profile) }}
      />
      <Header />

      <main style={{ minHeight: '100vh', background: '#FFFFFF' }}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section
          aria-label="Creator-Profil-Hero"
          style={{ ...heroStyle, position: 'relative', paddingTop: '80px' }}
        >
          {/* Gradient overlay if hero image present */}
          {profile.hero_image_url && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.7) 100%)' }} />
          )}

          <div style={{
            position: 'relative', zIndex: 1,
            maxWidth: '780px', margin: '0 auto',
            padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px) 0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            {/* Avatar */}
            {profile.profile_image_url && (
              <div style={{
                width: 'clamp(80px, 16vw, 112px)',
                height: 'clamp(80px, 16vw, 112px)',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.9)',
                overflow: 'hidden',
                marginBottom: '16px',
                flexShrink: 0,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}>
                <img
                  src={profile.profile_image_url}
                  alt={profile.display_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Name */}
            <h1 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(26px, 5vw, 44px)',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}>
              {profile.display_name}
            </h1>

            {/* Creator-Typ */}
            {profile.creator_type && (
              <span style={{
                display: 'inline-block',
                padding: '4px 14px', borderRadius: '20px',
                background: 'rgba(14,165,233,0.25)', color: '#BAE6FD',
                fontSize: '13px', fontWeight: 600, marginBottom: '14px',
                border: '1px solid rgba(14,165,233,0.4)',
              }}>
                {profile.creator_type}
              </span>
            )}

            {/* Kurzbeschreibung */}
            {profile.short_bio && (
              <p style={{
                fontSize: 'clamp(15px, 2vw, 17px)',
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.7, margin: '0 0 20px',
                maxWidth: '520px',
              }}>
                {profile.short_bio}
              </p>
            )}

            {/* Themen-Chips */}
            {profile.topics?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
                {profile.topics.map(t => (
                  <span key={t} style={{
                    padding: '5px 14px', borderRadius: '20px',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF', fontSize: '12px', fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <Link
              href={ctaUrl}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
                textDecoration: 'none', marginBottom: '48px',
                boxShadow: '0 4px 20px rgba(14,165,233,0.4)',
                transition: 'filter 0.15s ease',
              }}
            >
              {ctaLabel} →
            </Link>
          </div>
        </section>

        {/* ── Über den Creator ──────────────────────────────────────────── */}
        {(profile.bio || profile.destinations?.length > 0 || profile.travel_styles?.length > 0) && (
          <section style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(40px, 6vw, 60px) clamp(20px, 5vw, 40px)' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#0F172A',
              margin: '0 0 20px', letterSpacing: '-0.02em',
            }}>
              Über {profile.display_name}
            </h2>

            {profile.bio && (
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.75, margin: '0 0 28px', whiteSpace: 'pre-wrap' }}>
                {profile.bio}
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {profile.destinations?.length > 0 && (
                <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
                    Lieblingsziele
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {profile.destinations.map(d => (
                      <span key={d} style={{ padding: '3px 10px', borderRadius: '20px', background: '#EFF6FF', color: '#0EA5E9', fontSize: '13px', fontWeight: 500 }}>{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.travel_styles?.length > 0 && (
                <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
                    Reiseart
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {profile.travel_styles.map(s => (
                      <span key={s} style={{ padding: '3px 10px', borderRadius: '20px', background: '#F0FDF4', color: '#059669', fontSize: '13px', fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Galerie ───────────────────────────────────────────────────── */}
        {imgs.length > 0 && (
          <section style={{ background: '#F8FAFC', padding: 'clamp(32px, 5vw, 56px) 0' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#0F172A',
                margin: '0 0 20px', letterSpacing: '-0.02em',
              }}>
                Eindrücke
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 25vw, 220px), 1fr))',
                gap: '10px',
              }}>
                {imgs.slice(0, 9).map((src, i) => (
                  <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Reisetipps ────────────────────────────────────────────────── */}
        {tips.length > 0 && (
          <section style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(40px, 6vw, 60px) clamp(20px, 5vw, 40px)' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 800, color: '#0F172A',
              margin: '0 0 20px', letterSpacing: '-0.02em',
            }}>
              Reisetipps
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tips.map((tip, i) => (
                <div key={i} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: tip.text ? '10px' : 0 }}>
                    <div>
                      {tip.destination && (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                          {tip.destination}
                        </span>
                      )}
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {tip.title}
                      </h3>
                    </div>
                    {tip.url && (
                      <a
                        href={tip.url}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        style={{
                          flexShrink: 0, padding: '6px 14px', borderRadius: '10px',
                          background: '#EFF6FF', color: '#0EA5E9',
                          fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Mehr →
                      </a>
                    )}
                  </div>
                  {tip.text && (
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, margin: 0 }}>{tip.text}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Social / Website ──────────────────────────────────────────── */}
        {(socialEntries.length > 0 || profile.website_url) && (
          <section style={{ background: '#F8FAFC', padding: 'clamp(32px, 5vw, 48px) 0' }}>
            <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)', textAlign: 'center' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 800, color: '#0F172A',
                margin: '0 0 18px', letterSpacing: '-0.02em',
              }}>
                Online finden
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    style={socialLinkStyle}
                  >
                    Website
                  </a>
                )}
                {socialEntries.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={String(url)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    style={socialLinkStyle}
                  >
                    {SOCIAL_LABELS[platform] ?? platform}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── ApeAround CTA ─────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
          padding: 'clamp(48px, 7vw, 72px) clamp(20px, 5vw, 40px)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 800, color: '#FFFFFF',
              margin: '0 0 12px', letterSpacing: '-0.02em',
            }}>
              Lass dir eine passende Reise vorschlagen
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: '0 0 28px' }}>
              {profile.display_name} teilt echte Reisetipps auf ApeAround. Finde jetzt deinen persönlichen Reisestil.
            </p>
            <Link
              href={`/?creator=${slug}`}
              style={{
                display: 'inline-block', padding: '14px 32px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
              }}
            >
              Traumreise finden →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

const socialLinkStyle = {
  display: 'inline-flex', alignItems: 'center',
  padding: '9px 20px', borderRadius: '12px',
  background: '#FFFFFF', color: '#0F172A',
  fontSize: '14px', fontWeight: 600,
  textDecoration: 'none',
  border: '1.5px solid #E2E8F0',
};
