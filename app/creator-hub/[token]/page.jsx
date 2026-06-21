import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CreatorHub from '@/components/creator/CreatorHub';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function CreatorHubPage({ params }) {
  const { token } = await params;

  if (!token || token.length < 32) notFound();

  let profile = null;
  let submissions = [];

  try {
    const supabase = createServerClient();

    const { data: profileData } = await supabase
      .from('creator_profiles')
      .select('id, display_name, slug, creator_type, profile_image_url, status, onboarding_token_expires_at')
      .eq('onboarding_token', token)
      .single();

    if (!profileData) notFound();
    if (profileData.status === 'archived') notFound();

    const expires = profileData.onboarding_token_expires_at;
    if (!expires || new Date(expires) < new Date()) {
      return (
        <>
          <Header />
          <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', maxWidth: '440px' }}>
              <p style={{ fontSize: '40px', marginBottom: '16px' }}>⏰</p>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
                Dein Link ist abgelaufen
              </h1>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7 }}>
                Bitte wende dich an ApeAround, um einen neuen Zugangslink zu erhalten.
              </p>
            </div>
          </main>
          <Footer />
        </>
      );
    }

    profile = profileData;

    const { data: subData } = await supabase
      .from('creator_submissions')
      .select('id, type, title, slug, excerpt, destination, country, category, tags, images, content, route_data, tip_data, status, rejection_reason, submitted_at, published_at, created_at, updated_at')
      .eq('creator_profile_id', profile.id)
      .order('created_at', { ascending: false });

    submissions = subData ?? [];
  } catch {
    notFound();
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <CreatorHub
          profile={profile}
          initialSubmissions={submissions}
          token={token}
        />
      </main>
      <Footer />
    </>
  );
}
