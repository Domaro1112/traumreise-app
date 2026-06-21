import { createServerClient } from '@/lib/supabase/server';
import CreatorProfilesListClient from '@/components/admin/CreatorProfiles/CreatorProfilesListClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Creator-Profile | ApeAround Admin' };

export default async function AdminCreatorProfilesPage() {
  let profiles = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_profiles')
      .select('id, slug, display_name, creator_type, status, created_at, published_at, short_bio, application_id')
      .order('created_at', { ascending: false });
    profiles = data ?? [];
  } catch {}

  const counts = {
    all:       profiles.length,
    draft:     profiles.filter(p => p.status === 'draft').length,
    submitted: profiles.filter(p => p.status === 'submitted').length,
    published: profiles.filter(p => p.status === 'published').length,
    archived:  profiles.filter(p => p.status === 'archived').length,
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A',
              margin: '0 0 6px', letterSpacing: '-0.02em',
            }}>
              Creator-Profile
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
              Öffentliche Creator-Profile verwalten und veröffentlichen.
            </p>
          </div>
        </div>

        {/* Zähler */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
          {[
            { label: 'Gesamt',           count: counts.all,       color: '#0F172A', bg: '#F1F5F9'                   },
            { label: 'Entwurf',          count: counts.draft,     color: '#D97706', bg: 'rgba(245,158,11,0.10)'     },
            { label: 'Eingereicht',      count: counts.submitted, color: '#0EA5E9', bg: 'rgba(14,165,233,0.10)'     },
            { label: 'Veröffentlicht',   count: counts.published, color: '#059669', bg: 'rgba(5,150,105,0.10)'      },
            { label: 'Archiviert',       count: counts.archived,  color: '#64748B', bg: 'rgba(100,116,139,0.10)'   },
          ].map(({ label, count, color, bg }) => (
            <div key={label} style={{ padding: '6px 14px', borderRadius: '20px', background: bg, color, fontSize: '13px', fontWeight: 600 }}>
              {label}: {count}
            </div>
          ))}
        </div>
      </div>

      <CreatorProfilesListClient initialProfiles={profiles} />
    </div>
  );
}
