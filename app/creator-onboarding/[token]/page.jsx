import { createServerClient } from '@/lib/supabase/server';
import CreatorOnboardingForm from '@/components/creator/CreatorOnboardingForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Creator-Onboarding | ApeAround',
};

async function loadProfile(token) {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_profiles')
      .select('id, slug, display_name, short_bio, bio, creator_type, topics, destinations, travel_styles, social_links, website_url, gallery_images, featured_tips, cta_label, cta_url, profile_image_url, hero_image_url, status, onboarding_token_expires_at, onboarding_completed_at, submitted_at')
      .eq('onboarding_token', token)
      .single();
    return data;
  } catch {
    return null;
  }
}

function isExpired(profile) {
  if (!profile?.onboarding_token_expires_at) return true;
  return new Date(profile.onboarding_token_expires_at) < new Date();
}

export default async function CreatorOnboardingPage({ params }) {
  const { token } = await params;

  const profile = token?.length >= 32 ? await loadProfile(token) : null;

  if (!profile || isExpired(profile) || profile.status === 'archived') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0FDF4 100%)', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '480px', textAlign: 'center', background: '#FFFFFF', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔗</div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
            Link ungültig oder abgelaufen
          </h1>
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.65, margin: '0 0 28px' }}>
            Dieser Einrichtungslink ist ungültig oder abgelaufen. Bitte kontaktiere uns, damit wir dir einen neuen Link zusenden können.
          </p>
          <a
            href="mailto:hallo@apearound.de"
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}
          >
            Kontakt aufnehmen
          </a>
        </div>
      </div>
    );
  }

  return <CreatorOnboardingForm initialProfile={profile} token={token} />;
}
