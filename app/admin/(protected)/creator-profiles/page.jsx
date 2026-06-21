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
      .select('id, slug, display_name, creator_type, status, created_at, published_at, short_bio, application_id, submitted_at')
      .order('created_at', { ascending: false });

    // submitted-Profile zuerst, dann nach created_at absteigend
    profiles = (data ?? []).sort((a, b) => {
      if (a.status === 'submitted' && b.status !== 'submitted') return -1;
      if (a.status !== 'submitted' && b.status === 'submitted') return 1;
      return 0; // Reihenfolge aus DB-Query beibehalten
    });
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

      {/* Banner für eingereichte Profile */}
      {counts.submitted > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(6,182,212,0.06) 100%)',
          border: '1.5px solid rgba(14,165,233,0.30)',
          borderRadius: '14px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: '20px' }}>📋</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0EA5E9' }}>
              {counts.submitted === 1
                ? '1 Creator-Profil wartet auf Prüfung'
                : `${counts.submitted} Creator-Profile warten auf Prüfung`}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>
              Eingereichte Profile sind unten hervorgehoben und oben in der Liste zu finden.
            </p>
          </div>
          <a
            href="#submitted-profiles"
            style={{
              padding: '8px 18px', borderRadius: '10px',
              background: '#0EA5E9', color: '#FFFFFF',
              fontSize: '13px', fontWeight: 700, textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            Jetzt prüfen →
          </a>
        </div>
      )}

      <CreatorProfilesListClient initialProfiles={profiles} />
    </div>
  );
}
