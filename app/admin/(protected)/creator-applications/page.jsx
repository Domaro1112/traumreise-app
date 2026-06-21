import { createServerClient } from '@/lib/supabase/server';
import CreatorApplicationsClient from '@/components/admin/CreatorApplications/CreatorApplicationsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Creator-Bewerbungen | ApeAround Admin',
};

export default async function AdminCreatorApplicationsPage() {
  let applications = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('creator_applications')
      .select('*')
      .order('created_at', { ascending: false });
    applications = data ?? [];
  } catch {}

  const counts = {
    new:      applications.filter(a => a.status === 'new').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A',
          margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Creator-Bewerbungen
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>
          Eingegangene Bewerbungen über <code style={{ fontSize: '12px' }}>/creator-werden</code>.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Neu',        count: counts.new,      color: '#0EA5E9', bg: 'rgba(14,165,233,0.10)'  },
            { label: 'Geprüft',    count: counts.reviewed, color: '#F59E0B', bg: 'rgba(245,158,11,0.10)'  },
            { label: 'Angenommen', count: counts.accepted, color: '#059669', bg: 'rgba(5,150,105,0.10)'   },
            { label: 'Abgelehnt',  count: counts.rejected, color: '#EF4444', bg: 'rgba(239,68,68,0.10)'   },
          ].map(({ label, count, color, bg }) => (
            <div key={label} style={{
              padding: '6px 14px', borderRadius: '20px',
              background: bg, color, fontSize: '13px', fontWeight: 600,
            }}>
              {label}: {count}
            </div>
          ))}
          <div style={{
            padding: '6px 14px', borderRadius: '20px',
            background: '#F1F5F9', color: '#374151', fontSize: '13px', fontWeight: 600,
          }}>
            Gesamt: {applications.length}
          </div>
        </div>
      </div>

      <CreatorApplicationsClient initialData={applications} />
    </div>
  );
}
